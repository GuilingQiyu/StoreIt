import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UploadTask, UploadStatus } from "@/types";
import { api } from "@/lib/api";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const CONCURRENCY = 3; // 3 parallel chunk uploads per task

// In-memory runtime state that cannot/should not be stored in localStorage
const fileMap = new Map<string, File>();
const activeControllers = new Map<string, Map<number, AbortController>>();

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
  addFile: (file: File, directory: string) => Promise<string>;
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

      addFile: async (file: File, directory: string): Promise<string> => {
        const fingerprint = generateFingerprint(file, directory);
        const { tasks } = get();

        // 1. Check if an unfinished task with this fingerprint already exists
        const existing = tasks.find(
          (t) => t.fingerprint === fingerprint && t.status !== "completed"
        );

        if (existing) {
          // Re-bind file object and attempt resume
          fileMap.set(existing.id, file);
          set((state) => ({
            isDrawerOpen: true,
            tasks: state.tasks.map((t) =>
              t.id === existing.id
                ? { ...t, status: "initializing" as UploadStatus, errorMessage: undefined }
                : t
            ),
          }));
          get().resumeTask(existing.id);
          return existing.id;
        }

        // 2. Initialize a brand new upload task
        const tempId = "temp_" + Math.random().toString(36).substring(2, 9);
        const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE));

        const newTask: UploadTask = {
          id: tempId,
          fingerprint,
          name: file.name,
          size: file.size,
          directory,
          chunkSize: CHUNK_SIZE,
          totalChunks,
          uploadedChunks: [],
          status: "initializing",
          progress: 0,
          speed: 0,
          createdAt: Date.now(),
          lastUpdated: Date.now(),
        };

        set((state) => ({
          isDrawerOpen: true,
          tasks: [newTask, ...state.tasks],
        }));

        try {
          const initRes = await api.initChunkedUpload(file.name, file.size, directory);
          const realId = initRes.uploadId;
          fileMap.set(realId, file);

          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === tempId
                ? {
                    ...t,
                    id: realId,
                    totalChunks: initRes.totalChunks,
                    chunkSize: initRes.chunkSize,
                    status: "uploading",
                  }
                : t
            ),
          }));

          startParallelUpload(realId, file, get, set);
          return realId;
        } catch (err: any) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === tempId
                ? { ...t, status: "error", errorMessage: err.message || "初始化失败" }
                : t
            ),
          }));
          return tempId;
        }
      },

      pauseTask: (id: string) => {
        // Abort all in-flight controllers for this task
        const taskControllers = activeControllers.get(id);
        if (taskControllers) {
          taskControllers.forEach((ctrl) => ctrl.abort());
          taskControllers.clear();
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "paused", speed: 0 } : t
          ),
        }));
      },

      resumeTask: async (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        let file = fileMap.get(id);
        if (!file) {
          // If file is lost (e.g. after refresh), mark interrupted so user knows to re-pick
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: "interrupted",
                    errorMessage: "浏览器刷新导致文件句柄丢失，请点击重新绑定文件继续",
                  }
                : t
            ),
          }));
          return;
        }

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "uploading", errorMessage: undefined } : t
          ),
        }));

        // Fetch latest server status for resume
        try {
          const status = await api.getUploadStatus(id);
          const serverUploaded = status.uploadedChunks || [];

          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    uploadedChunks: serverUploaded,
                    progress: Math.floor((serverUploaded.length / t.totalChunks) * 100),
                  }
                : t
            ),
          }));

          startParallelUpload(id, file, get, set);
        } catch (err: any) {
          // If server session invalid, re-initialize
          try {
            const initRes = await api.initChunkedUpload(task.name, task.size, task.directory);
            const newId = initRes.uploadId;
            fileMap.delete(id);
            fileMap.set(newId, file);

            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      id: newId,
                      uploadedChunks: [],
                      progress: 0,
                      status: "uploading",
                      errorMessage: undefined,
                    }
                  : t
              ),
            }));

            startParallelUpload(newId, file, get, set);
          } catch (initErr: any) {
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, status: "error", errorMessage: initErr.message } : t
              ),
            }));
          }
        }
      },

      rebindFileAndResume: async (id: string, file: File) => {
        fileMap.set(id, file);
        await get().resumeTask(id);
      },

      cancelTask: async (id: string) => {
        // 1. Abort ongoing network requests
        const taskControllers = activeControllers.get(id);
        if (taskControllers) {
          taskControllers.forEach((ctrl) => ctrl.abort());
          taskControllers.clear();
        }
        activeControllers.delete(id);
        fileMap.delete(id);

        // 2. Notify backend to clean up chunks directory
        try {
          await api.cancelChunkedUpload(id);
        } catch {
          // Ignore network errors on cancel
        }

        // 3. Remove from state
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      retryTask: async (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        const file = fileMap.get(id);
        if (!file) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, status: "interrupted", errorMessage: "请重新选择文件重试" } : t
            ),
          }));
          return;
        }
        await get().resumeTask(id);
      },

      clearCompleted: () => {
        set((state) => ({
          tasks: state.tasks.filter(
            (t) => t.status !== "completed" && t.status !== "error"
          ),
        }));
      },
    }),
    {
      name: "storeit-upload-tasks",
      storage: createJSONStorage(() => localStorage),
      // Automatically mark active tasks as interrupted upon browser reload
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.tasks = state.tasks.map((t) => {
          if (t.status === "uploading" || t.status === "initializing" || t.status === "pending") {
            return {
              ...t,
              status: "interrupted",
              speed: 0,
              errorMessage: "页面刷新中断，请重新添加或选择文件继续续传",
            };
          }
          return t;
        });
      },
      partialize: (state) => ({
        tasks: state.tasks,
        isDrawerOpen: state.isDrawerOpen,
      }),
    }
  )
);

/**
 * Parallel Chunk Upload Engine
 * Implements concurrent worker pool (default 3 concurrent chunks),
 * progress tracking, dynamic upload speed calculation, and automatic completion.
 */
function startParallelUpload(
  taskId: string,
  file: File,
  get: () => UploadState,
  set: (fn: (state: UploadState) => UploadState | Partial<UploadState>) => void
) {
  let controllers = activeControllers.get(taskId);
  if (!controllers) {
    controllers = new Map();
    activeControllers.set(taskId, controllers);
  }

  const task = get().tasks.find((t) => t.id === taskId);
  if (!task) return;

  const totalChunks = task.totalChunks;
  const chunkSize = task.chunkSize;
  const uploadedSet = new Set(task.uploadedChunks);

  // Queue of chunks waiting to be uploaded
  const pendingChunks: number[] = [];
  for (let i = 0; i < totalChunks; i++) {
    if (!uploadedSet.has(i)) {
      pendingChunks.push(i);
    }
  }

  // If already all uploaded, trigger complete directly
  if (pendingChunks.length === 0) {
    triggerCompletion(taskId, get, set);
    return;
  }

  const concurrency = get().concurrencyLimit || CONCURRENCY;
  let activeWorkers = 0;
  let isAbortedOrDone = false;

  // Speed measurement
  let lastBytes = uploadedSet.size * chunkSize;
  let lastTime = Date.now();

  const speedInterval = setInterval(() => {
    const currentTask = get().tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status !== "uploading") {
      clearInterval(speedInterval);
      return;
    }
    const currentBytes = currentTask.uploadedChunks.length * chunkSize;
    const now = Date.now();
    const timeDelta = (now - lastTime) / 1000;
    if (timeDelta > 0.5) {
      const speed = Math.max(0, (currentBytes - lastBytes) / timeDelta);
      lastBytes = currentBytes;
      lastTime = now;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, speed } : t)),
      }));
    }
  }, 1000);

  // Worker loop
  const next = async () => {
    if (isAbortedOrDone) return;

    // Check if task is still in uploading state
    const currentTask = get().tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status !== "uploading") {
      isAbortedOrDone = true;
      clearInterval(speedInterval);
      return;
    }

    if (pendingChunks.length === 0) {
      if (activeWorkers === 0) {
        clearInterval(speedInterval);
        triggerCompletion(taskId, get, set);
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
      await api.uploadChunk(taskId, chunkIndex, chunkBlob, controller.signal);
      controllers.delete(chunkIndex);

      // Successfully uploaded this chunk
      set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const newUploaded = Array.from(new Set([...t.uploadedChunks, chunkIndex])).sort(
            (a, b) => a - b
          );
          const progress = Math.min(99, Math.floor((newUploaded.length / t.totalChunks) * 100));
          return {
            ...t,
            uploadedChunks: newUploaded,
            progress,
            lastUpdated: Date.now(),
          };
        }),
      }));
    } catch (err: any) {
      controllers.delete(chunkIndex);
      if (err.name === "AbortError" || controller.signal.aborted) {
        // Paused or cancelled by user, don't treat as error
        return;
      }
      // Re-queue chunk for retry up to 2 times or mark error
      console.error(`Chunk ${chunkIndex} failed:`, err);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: "error",
                errorMessage: `分片 ${chunkIndex + 1} 上传失败: ${err.message}`,
              }
            : t
        ),
      }));
      isAbortedOrDone = true;
      clearInterval(speedInterval);
      return;
    } finally {
      activeWorkers--;
    }

    // Schedule next chunk
    next();
  };

  // Launch initial concurrent workers
  for (let i = 0; i < concurrency; i++) {
    next();
  }
}

async function triggerCompletion(
  taskId: string,
  get: () => UploadState,
  set: (fn: (state: UploadState) => UploadState | Partial<UploadState>) => void
) {
  set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === taskId ? { ...t, status: "merging", progress: 99, speed: 0 } : t
    ),
  }));

  try {
    const res = await api.completeChunkedUpload(taskId);
    fileMap.delete(taskId);
    activeControllers.delete(taskId);

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "completed",
              progress: 100,
              speed: 0,
              lastUpdated: Date.now(),
            }
          : t
      ),
    }));

    // Trigger file list refresh if window is open
    window.dispatchEvent(new CustomEvent("storeit:file-uploaded"));
  } catch (err: any) {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "error",
              errorMessage: `合并分片失败: ${err.message}`,
            }
          : t
      ),
    }));
  }
}
