import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FileConflictStrategy, PendingUploadEntry, UploadTask, UploadStatus } from "@/types";
import { useFileStore } from "@/stores/useFileStore";
import { api } from "@/lib/api";
import { formatBytes, tr } from "@/lib/utils";

export const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
export const CHUNK_THRESHOLD = 50 * 1024 * 1024; // 50MB (files <= 50MB use simple single upload)
const CONCURRENCY = 3; // 3 parallel chunk uploads per large-file task
const MAX_ACTIVE_TASKS = 2; // At most 2 tasks running concurrently in global queue

// In-memory runtime state that cannot/should not be stored in localStorage
const fileMap = new Map<string, File>();
const activeChunkControllers = new Map<string, Map<number, AbortController>>();
const activeSimpleControllers = new Map<string, AbortController>();

export function generateFingerprint(file: File, directory: string): string {
  return `${file.name}_${file.size}_${file.lastModified}_${directory || "root"}`;
}

interface UploadState {
  tasks: UploadTask[];
  isDrawerOpen: boolean;
  concurrencyLimit: number;

  // Actions
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  addFile: (file: File, directory: string, conflictStrategy?: FileConflictStrategy) => Promise<string>;
  enqueueWithConflictCheck: (entries: PendingUploadEntry[], emptyDirs: string[], targetDir: string) => Promise<void>;
  pauseTask: (id: string) => void;
  resumeTask: (id: string) => Promise<void>;
  cancelTask: (id: string) => Promise<void>;
  rebindFileAndResume: (id: string, file: File) => Promise<void>;
  clearCompleted: () => void;
  retryTask: (id: string) => Promise<void>;
}

export const useUploadStore = create<UploadState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isDrawerOpen: true,
      concurrencyLimit: CONCURRENCY,

      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      addFile: async (file: File, directory: string, conflictStrategy: FileConflictStrategy = "rename"): Promise<string> => {
        const fingerprint = generateFingerprint(file, directory);
        const { tasks } = get();

        const existing = tasks.find(
          (t) => t.fingerprint === fingerprint && t.status !== "completed"
        );

        if (existing) {
          fileMap.set(existing.id, file);

          const isActive =
            existing.status === "pending" ||
            existing.status === "uploading" ||
            existing.status === "initializing" ||
            existing.status === "merging";

          if (isActive) {
            set((state) => ({ isDrawerOpen: true }));
            return existing.id;
          }

          set((state) => ({
            isDrawerOpen: true,
            tasks: state.tasks.map((t) =>
              t.id === existing.id
                ? { ...t, status: "pending" as UploadStatus, errorMessage: undefined }
                : t
            ),
          }));
          scheduleNextUploads(get, set);
          return existing.id;
        }

        const tempId = "task_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
        const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

        const newTask: UploadTask = {
          id: tempId,
          fingerprint,
          name: file.name,
          size: file.size,
          directory,
          conflictStrategy,
          chunkSize: CHUNK_SIZE,
          totalChunks,
          uploadedChunks: [],
          status: "pending",
          progress: 0,
          speed: 0,
          createdAt: Date.now(),
          lastUpdated: Date.now(),
        };

        fileMap.set(tempId, file);

        set((state) => ({
          isDrawerOpen: true,
          tasks: [newTask, ...state.tasks],
        }));

        scheduleNextUploads(get, set);
        return tempId;
      },

      pauseTask: (id: string) => {
        const simpleCtrl = activeSimpleControllers.get(id);
        if (simpleCtrl) {
          simpleCtrl.abort();
          activeSimpleControllers.delete(id);
        }

        const chunkCtrls = activeChunkControllers.get(id);
        if (chunkCtrls) {
          chunkCtrls.forEach((ctrl) => ctrl.abort());
          chunkCtrls.clear();
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "paused", speed: 0 } : t
          ),
        }));

        scheduleNextUploads(get, set);
      },

      resumeTask: async (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const file = fileMap.get(id);
        if (!file) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: "interrupted",
                    errorMessage: tr(
                      "刷新后文件句柄已失效，请重新选择文件继续",
                      "File handle lost after reload, please re-select the file to resume"
                    ),
                  }
                : t
            ),
          }));
          return;
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "pending", errorMessage: undefined } : t
          ),
        }));

        scheduleNextUploads(get, set);
      },

      rebindFileAndResume: async (id: string, file: File) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        if (file.name !== task.name || file.size !== task.size) {
          const errMsg = tr(
            `所选文件不匹配！期望: ${task.name} (${formatBytes(task.size)})，实际: ${file.name} (${formatBytes(file.size)})`,
            `Selected file mismatch! Expected: ${task.name} (${formatBytes(task.size)}), got: ${file.name} (${formatBytes(file.size)})`
          );
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, errorMessage: errMsg } : t
            ),
          }));
          throw new Error(errMsg);
        }

        fileMap.set(id, file);
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: "pending", errorMessage: undefined }
              : t
          ),
        }));

        scheduleNextUploads(get, set);
      },

      cancelTask: async (id: string) => {
        const simpleCtrl = activeSimpleControllers.get(id);
        if (simpleCtrl) {
          simpleCtrl.abort();
          activeSimpleControllers.delete(id);
        }

        const chunkCtrls = activeChunkControllers.get(id);
        if (chunkCtrls) {
          chunkCtrls.forEach((ctrl) => ctrl.abort());
          chunkCtrls.clear();
        }
        activeChunkControllers.delete(id);
        fileMap.delete(id);

        try {
          if (!id.startsWith("task_")) {
            await api.cancelChunkedUpload(id);
          }
        } catch {}

        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));

        scheduleNextUploads(get, set);
      },

      retryTask: async (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const file = fileMap.get(id);
        if (!file) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: "interrupted",
                    errorMessage: tr("请重新选择文件重试", "Please re-select the file to retry"),
                  }
                : t
            ),
          }));
          return;
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "pending", errorMessage: undefined } : t
          ),
        }));

        scheduleNextUploads(get, set);
      },

      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter(
            (t) => t.status !== "completed" && t.status !== "error"
          ),
        }));
      },

      enqueueWithConflictCheck: async (
        entries: PendingUploadEntry[],
        emptyDirs: string[],
        targetDir: string
      ) => {
        let existingItems: { name: string; isDirectory: boolean }[] = [];
        try {
          const res = await api.getFiles(targetDir);
          existingItems = res.items;
        } catch {}

        const existingFolders = new Set(
          existingItems.filter((i) => i.isDirectory).map((i) => i.name)
        );
        const existingFiles = new Set(
          existingItems.filter((i) => !i.isDirectory).map((i) => i.name)
        );

        const topFolders = new Set<string>();
        const topFiles = new Set<string>();

        for (const e of entries) {
          if (e.subPath) {
            const top = e.subPath.split("/")[0];
            if (top) topFolders.add(top);
          } else {
            topFiles.add(e.file.name);
          }
        }
        for (const d of emptyDirs) {
          const top = d.split("/")[0];
          if (top) topFolders.add(top);
        }

        const conflictingFolders = Array.from(topFolders).filter((f) =>
          existingFolders.has(f)
        );
        const conflictingFiles = Array.from(topFiles).filter((f) =>
          existingFiles.has(f)
        );

        if (conflictingFolders.length > 0 || conflictingFiles.length > 0) {
          useFileStore.getState().setUploadConflict({
            targetDir,
            entries,
            emptyDirs,
            conflictingFolders,
            conflictingFiles,
          });
          return;
        }

        for (const emptySub of emptyDirs) {
          try {
            await api.createDirectory(targetDir, emptySub);
          } catch {}
        }
        for (const item of entries) {
          const dest = item.subPath
            ? targetDir
              ? `${targetDir}/${item.subPath}`
              : item.subPath
            : targetDir;
          await get().addFile(item.file, dest, "rename");
        }
      },
    }),
    {
      name: "storeit-upload-tasks",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.tasks = state.tasks.map((t) => {
          if (t.status === "uploading" || t.status === "initializing" || t.status === "pending" || t.status === "merging") {
            return {
              ...t,
              status: "interrupted",
              speed: 0,
              errorMessage: tr(
                "页面刷新中断，请重新添加或绑定原文件继续断点续传",
                "Interrupted by page reload, please re-add or rebind the file to resume"
              ),
            };
          }
          return t;
        });
      },
      partialize: (state) => ({
        tasks: state.tasks.map((t) => ({
          id: t.id,
          fingerprint: t.fingerprint,
          name: t.name,
          size: t.size,
          directory: t.directory,
          conflictStrategy: t.conflictStrategy,
          chunkSize: t.chunkSize,
          totalChunks: t.totalChunks,
          uploadedChunks: [],
          status: t.status === "completed" ? "completed" : "interrupted",
          progress: t.progress,
          speed: 0,
          errorMessage: t.errorMessage,
          createdAt: t.createdAt,
          lastUpdated: t.lastUpdated,
        })),
        isDrawerOpen: state.isDrawerOpen,
      }),
    }
  )
);

function scheduleNextUploads(
  get: () => UploadState,
  set: (fn: (state: UploadState) => UploadState | Partial<UploadState>) => void
) {
  const { tasks } = get();
  const activeCount = tasks.filter(
    (t) => t.status === "uploading" || t.status === "initializing" || t.status === "merging"
  ).length;

  if (activeCount >= MAX_ACTIVE_TASKS) return;

  const nextTask = tasks.find((t) => t.status === "pending");
  if (!nextTask) return;

  const file = fileMap.get(nextTask.id);
  if (!file) {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === nextTask.id
          ? {
              ...t,
              status: "interrupted",
              errorMessage: tr("文件句柄丢失，请重新选择文件", "File handle lost, please re-select the file"),
            }
          : t
      ),
    }));
    return;
  }

  if (file.size <= CHUNK_THRESHOLD) {
    executeSimpleUpload(nextTask.id, file, get, set);
  } else {
    executeChunkedUpload(nextTask.id, file, get, set);
  }
}

async function executeSimpleUpload(
  taskId: string,
  file: File,
  get: () => UploadState,
  set: (fn: (state: UploadState) => UploadState | Partial<UploadState>) => void
) {
  const task = get().tasks.find((t) => t.id === taskId);
  if (!task) return;

  const controller = new AbortController();
  activeSimpleControllers.set(taskId, controller);

  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: "uploading", speed: 0, errorMessage: undefined }
        : t
    ),
  }));

  let lastBytes = 0;
  let lastTime = Date.now();

  try {
    await api.uploadSingleFile(
      file,
      task.directory,
      (percent) => {
        const now = Date.now();
        const currentBytes = (percent / 100) * file.size;
        const timeDelta = (now - lastTime) / 1000;
        let speed = 0;
        if (timeDelta > 0.4) {
          speed = Math.max(0, (currentBytes - lastBytes) / timeDelta);
          lastBytes = currentBytes;
          lastTime = now;
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  progress: percent,
                  speed: speed || t.speed,
                  lastUpdated: now,
                }
              : t
          ),
        }));
      },
      controller.signal,
      task.conflictStrategy || "rename"
    );

    activeSimpleControllers.delete(taskId);
    fileMap.delete(taskId);

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: "completed", progress: 100, speed: 0, lastUpdated: Date.now() }
          : t
      ),
    }));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("storeit:file-uploaded"));
    }
  } catch (err: any) {
    activeSimpleControllers.delete(taskId);
    if (controller.signal.aborted) return;

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "error",
              speed: 0,
              errorMessage: err.message || tr("上传失败", "Upload failed"),
            }
          : t
      ),
    }));
  } finally {
    scheduleNextUploads(get, set);
  }
}

async function executeChunkedUpload(
  taskId: string,
  file: File,
  get: () => UploadState,
  set: (fn: (state: UploadState) => UploadState | Partial<UploadState>) => void
) {
  const task = get().tasks.find((t) => t.id === taskId);
  if (!task) return;

  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId ? { ...t, status: "initializing", errorMessage: undefined } : t
    ),
  }));

  let realUploadId = taskId;
  let serverUploadedChunks: number[] = [];
  let totalChunks = task.totalChunks;
  let chunkSize = task.chunkSize;

  try {
    if (taskId.startsWith("task_")) {
      const initRes = await api.initChunkedUpload(file.name, file.size, task.directory, task.conflictStrategy || "rename");
      realUploadId = initRes.uploadId;
      totalChunks = initRes.totalChunks;
      chunkSize = initRes.chunkSize;

      fileMap.delete(taskId);
      fileMap.set(realUploadId, file);

      const pausedDuringHandshake =
        get().tasks.find((t) => t.id === taskId)?.status === "paused";

      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                id: realUploadId,
                totalChunks,
                chunkSize,
                uploadedChunks: [],
                status: pausedDuringHandshake
                  ? ("paused" as UploadStatus)
                  : ("uploading" as UploadStatus),
              }
            : t
        ),
      }));
    } else {
      try {
        const statusRes = await api.getUploadStatus(taskId);
        serverUploadedChunks = statusRes.uploadedChunks || [];
        totalChunks = statusRes.totalChunks;
        chunkSize = statusRes.chunkSize;

        const pausedDuringHandshake =
          get().tasks.find((t) => t.id === taskId)?.status === "paused";

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  uploadedChunks: serverUploadedChunks,
                  totalChunks,
                  chunkSize,
                  progress: Math.min(99, Math.floor((serverUploadedChunks.length / totalChunks) * 100)),
                  status: pausedDuringHandshake
                    ? ("paused" as UploadStatus)
                    : ("uploading" as UploadStatus),
                }
              : t
          ),
        }));
      } catch (err: any) {
        if (err?.status !== 400) throw err;

        const initRes = await api.initChunkedUpload(file.name, file.size, task.directory, task.conflictStrategy || "rename");
        const previousId = taskId;
        realUploadId = initRes.uploadId;
        totalChunks = initRes.totalChunks;
        chunkSize = initRes.chunkSize;
        serverUploadedChunks = [];

        fileMap.delete(previousId);
        fileMap.set(realUploadId, file);
        activeChunkControllers.delete(previousId);

        const pausedDuringHandshake =
          get().tasks.find((t) => t.id === previousId)?.status === "paused";

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === previousId
              ? {
                  ...t,
                  id: realUploadId,
                  uploadedChunks: [],
                  progress: 0,
                  totalChunks,
                  chunkSize,
                  errorMessage: undefined,
                  status: pausedDuringHandshake
                    ? ("paused" as UploadStatus)
                    : ("uploading" as UploadStatus),
                }
              : t
          ),
        }));
      }
    }
  } catch (err: any) {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "error",
              errorMessage: tr(
                `初始化上传失败: ${err.message}`,
                `Failed to initialize upload: ${err.message}`
              ),
            }
          : t
      ),
    }));
    scheduleNextUploads(get, set);
    return;
  }

  if (!get().tasks.some((t) => t.id === realUploadId)) {
    try {
      await api.cancelChunkedUpload(realUploadId);
    } catch {}
    return;
  }

  if (get().tasks.find((t) => t.id === realUploadId)?.status !== "uploading") {
    return;
  }

  let controllers = activeChunkControllers.get(realUploadId);
  if (!controllers) {
    controllers = new Map();
    activeChunkControllers.set(realUploadId, controllers);
  }

  const inFlightBytes = new Map<number, number>();
  const chunkRetryCount = new Map<number, number>();
  const uploadedSet = new Set(serverUploadedChunks);

  const pendingChunks: number[] = [];
  for (let i = 0; i < totalChunks; i++) {
    if (!uploadedSet.has(i)) {
      pendingChunks.push(i);
    }
  }

  if (pendingChunks.length === 0) {
    await completeChunkedUploadSession(realUploadId, get, set);
    return;
  }

  const concurrency = get().concurrencyLimit || CONCURRENCY;
  let activeWorkers = 0;
  let isAbortedOrDone = false;

  let lastBytes = uploadedSet.size * chunkSize;
  let lastTime = Date.now();

  const progressInterval = setInterval(() => {
    const currentTask = get().tasks.find((t) => t.id === realUploadId);
    if (!currentTask || currentTask.status !== "uploading") {
      clearInterval(progressInterval);
      return;
    }

    let inFlightSum = 0;
    inFlightBytes.forEach((b) => (inFlightSum += b));
    const totalBytesLoaded = Math.min(
      file.size,
      currentTask.uploadedChunks.length * chunkSize + inFlightSum
    );

    const now = Date.now();
    const timeDelta = (now - lastTime) / 1000;
    let speed = currentTask.speed;
    if (timeDelta > 0.5) {
      speed = Math.max(0, (totalBytesLoaded - lastBytes) / timeDelta);
      lastBytes = totalBytesLoaded;
      lastTime = now;
    }

    const calculatedProgress = Math.min(
      99,
      Math.floor((totalBytesLoaded / file.size) * 100)
    );

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === realUploadId
          ? {
              ...t,
              progress: Math.max(t.progress, calculatedProgress),
              speed,
              lastUpdated: now,
            }
          : t
      ),
    }));
  }, 300);

  const next = async () => {
    if (isAbortedOrDone) return;

    const currentTask = get().tasks.find((t) => t.id === realUploadId);
    if (!currentTask || currentTask.status !== "uploading") {
      isAbortedOrDone = true;
      clearInterval(progressInterval);
      return;
    }

    if (pendingChunks.length === 0) {
      if (activeWorkers === 0) {
        clearInterval(progressInterval);
        await completeChunkedUploadSession(realUploadId, get, set);
      }
      return;
    }

    const chunkIndex = pendingChunks.shift()!;
    activeWorkers++;

    const start = chunkIndex * chunkSize;
    const end = Math.min(file.size, start + chunkSize);
    const chunkBlob = file.slice(start, end);

    const controller = new AbortController();
    controllers.set(chunkIndex, controller);

    try {
      await api.uploadChunk(
        realUploadId,
        chunkIndex,
        chunkBlob,
        controller.signal,
        (loaded) => {
          inFlightBytes.set(chunkIndex, loaded);
        }
      );
      controllers.delete(chunkIndex);
      inFlightBytes.delete(chunkIndex);

      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== realUploadId) return t;
          const newUploaded = Array.from(new Set([...t.uploadedChunks, chunkIndex])).sort(
            (a, b) => a - b
          );
          return {
            ...t,
            uploadedChunks: newUploaded,
            progress: Math.max(
              t.progress,
              Math.min(99, Math.floor((newUploaded.length / t.totalChunks) * 100))
            ),
            lastUpdated: Date.now(),
          };
        }),
      }));
    } catch (err: any) {
      controllers.delete(chunkIndex);
      inFlightBytes.delete(chunkIndex);

      if (err.name === "AbortError" || controller.signal.aborted) {
        return;
      }

      const retries = chunkRetryCount.get(chunkIndex) || 0;
      if (retries < 2) {
        chunkRetryCount.set(chunkIndex, retries + 1);
        pendingChunks.push(chunkIndex);
        setTimeout(() => next(), 500 * Math.pow(2, retries));
        return;
      } else {
        isAbortedOrDone = true;
        clearInterval(progressInterval);
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === realUploadId
              ? {
                  ...t,
                  status: "error",
                  speed: 0,
                  errorMessage: tr(
                    `分片 ${chunkIndex + 1} 上传失败: ${err.message}`,
                    `Chunk ${chunkIndex + 1} upload failed: ${err.message}`
                  ),
                }
              : t
          ),
        }));
        scheduleNextUploads(get, set);
        return;
      }
    } finally {
      activeWorkers--;
    }

    next();
  };

  for (let i = 0; i < concurrency; i++) {
    next();
  }
}

async function completeChunkedUploadSession(
  uploadId: string,
  get: () => UploadState,
  set: (fn: (state: UploadState) => UploadState | Partial<UploadState>) => void
) {
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === uploadId ? { ...t, status: "merging", progress: 99, speed: 0 } : t
    ),
  }));

  try {
    await api.completeChunkedUpload(uploadId);
    fileMap.delete(uploadId);
    activeChunkControllers.delete(uploadId);

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === uploadId
          ? { ...t, status: "completed", progress: 100, speed: 0, lastUpdated: Date.now() }
          : t
      ),
    }));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("storeit:file-uploaded"));
    }
  } catch (err: any) {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === uploadId
          ? {
              ...t,
              status: "error",
              speed: 0,
              errorMessage: tr(
                `合并分片失败: ${err.message}`,
                `Failed to merge chunks: ${err.message}`
              ),
            }
          : t
      ),
    }));
  } finally {
    scheduleNextUploads(get, set);
  }
}
