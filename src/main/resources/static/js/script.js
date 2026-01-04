function initFloatingBackground() {
  const floatingBg = document.querySelector('.floating-bg');
  if (!floatingBg) return;
  floatingBg.innerHTML='';
  for (let i=0;i<3;i++){ const d=document.createElement('div'); floatingBg.appendChild(d);} }

function setupLoginForm(){
  const form=document.getElementById('loginForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd=new FormData(form);
    const msg=document.getElementById('messageArea');
    try{
      const res=await fetch('/api/login',{method:'POST',body:fd});
      const data=await res.json();
      msg.style.display='block'; msg.textContent=data.message; msg.className='message '+(res.ok?'success':'error');
      if(res.ok){ setTimeout(()=>{ window.location.href='/'; },800); }
    }catch(err){ msg.style.display='block'; msg.className='message error'; msg.textContent='登录请求失败'; }
  });
}

function setupRefreshButton(){ const b=document.getElementById('refreshBtn'); if(!b) return; b.addEventListener('click',e=>{e.preventDefault(); location.reload();}); }

function formatFileSize(bytes){ if(bytes===0) return '0 Bytes'; const k=1024; const sizes=['Bytes','KB','MB','GB','TB']; const i=Math.floor(Math.log(bytes)/Math.log(k)); return (bytes/Math.pow(k,i)).toFixed(2)+' '+sizes[i]; }

function loadUserStatus(){ 
    const el=document.getElementById('sidebarUser'); 
    if(!el) return; 
    fetch('/api/user/status').then(r=>r.json()).then(d=>{ 
        el.innerHTML = d.logged_in ? 
            `<div style="display:flex; align-items:center; gap:10px; width:100%; justify-content:space-between;">
                <span style="overflow:hidden; text-overflow:ellipsis;"><i class="fas fa-user-circle"></i> ${d.username}</span>
                <i class="fas fa-sign-out-alt" id="logoutBtn" style="cursor:pointer; color:var(--error-color);" title="退出"></i>
             </div>` : 
            `<a href="/login" class="btn small">登录</a>`; 
        const lb=document.getElementById('logoutBtn'); 
        if(lb){ lb.onclick=async ()=>{ await fetch('/api/logout',{method:'POST'}); location.reload(); }; } 
    }).catch(()=>{ el.innerHTML='<p>获取用户状态失败</p>'; }); 
}

function loadStorageUsage() {
    fetch('/api/storage/usage')
        .then(r => r.json())
        .then(data => {
            const text = document.getElementById('storageText');
            const fill = document.getElementById('storageFill');
            if(text && fill) {
                const percent = (data.used / data.total) * 100;
                text.textContent = `${formatFileSize(data.used)} / ${formatFileSize(data.total)}`;
                fill.style.width = `${Math.min(percent, 100)}%`;
                if(percent > 90) fill.style.backgroundColor = '#d9534f';
                else if(percent > 70) fill.style.backgroundColor = '#f0ad4e';
                else fill.style.backgroundColor = 'var(--primary-color)';
            }
        });
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

// Global State
let currentPath = '';
let uploadQueue = [];
let isUploading = false;
let contextMenuTarget = null;
let selectedFileItem = null;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', function(){ 
    // Auth Redirect Logic
    const path = window.location.pathname;
    if (path === '/login' || path === '/login.html') {
        fetch('/api/user/status').then(r=>r.json()).then(d=>{ if(d.logged_in) window.location.href='/'; });
    } else if (path === '/' || path === '/list' || path === '/list.html') {
        fetch('/api/user/status').then(r=>r.json()).then(d=>{ if(!d.logged_in) window.location.href='/login'; });
    }

    initFloatingBackground(); 
    setupLoginForm(); 
    setupRefreshButton(); 
    loadUserStatus(); 
    setupShareModal(); 
    
    if(document.getElementById('file-grid-view')){ 
        loadFileList(); 
        loadStorageUsage();
        setupContextMenu();
        setupFAB();
        setupUploadQueue();
    } 
});

// --- File List Logic ---

function loadFileList(path=''){
  const gridView = document.getElementById('file-grid-view');
  const emptyState = document.getElementById('empty-state');
  if(!gridView) return;
  
  gridView.innerHTML = '<p style="text-align:center; width:100%;">加载中...</p>';
  emptyState.style.display = 'none';

  fetch(`/api/files?path=${encodeURIComponent(path)}`).then(r=>r.json()).then(data=>{
    if(data.error){ 
        gridView.innerHTML=`<p class="error">错误: ${data.error}</p>`; 
        return; 
    }
    
    currentPath = data.currentPath ?? data.current_path ?? '';
    renderBreadcrumb(currentPath);
    
    const items = (data.items||[]).map(item=>{
      const isDir = (item.isDirectory !== undefined ? item.isDirectory : (item.directory !== undefined ? item.directory : false));
      return {
        name: item.name,
        path: item.path,
        isDirectory: !!isDir,
        size: item.size,
        modified: item.modifiedTime || item.modified_time
      };
    });

    if(items.length === 0) {
        gridView.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        renderFileGrid(items);
    }

  }).catch(err=>{ gridView.innerHTML=`<p class="error">加载失败: ${err.message}</p>`; });
}

function renderBreadcrumb(path) {
    const container = document.getElementById('breadcrumb');
    if(!container) return;
    
    let html = `<div class="breadcrumb-item" onclick="loadFileList('')"><i class="fas fa-home"></i></div>`;
    
    if(path) {
        const parts = path.split('/');
        let current = '';
        parts.forEach((part, index) => {
            current += (index === 0 ? '' : '/') + part;
            html += `<span class="breadcrumb-separator">/</span>`;
            if(index === parts.length - 1) {
                html += `<div class="breadcrumb-item active">${part}</div>`;
            } else {
                html += `<div class="breadcrumb-item" onclick="loadFileList('${current}')">${part}</div>`;
            }
        });
    }
    container.innerHTML = html;
}

function renderFileGrid(items) {
    const gridView = document.getElementById('file-grid-view');
    gridView.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.dataset.path = item.path;
        card.dataset.name = item.name;
        card.dataset.isDirectory = item.isDirectory;
        
        // Icon selection
        let iconClass = 'fa-file';
        let typeClass = 'file';
        if(item.isDirectory) {
            iconClass = 'fa-folder';
            typeClass = 'folder';
        } else {
            const ext = item.name.split('.').pop().toLowerCase();
            if(['jpg','jpeg','png','gif','webp'].includes(ext)) { iconClass = 'fa-file-image'; typeClass = 'image'; }
            else if(['mp4','webm','ogg','mov'].includes(ext)) { iconClass = 'fa-file-video'; typeClass = 'video'; }
            else if(['mp3','wav'].includes(ext)) { iconClass = 'fa-file-audio'; typeClass = 'audio'; }
            else if(['pdf'].includes(ext)) { iconClass = 'fa-file-pdf'; typeClass = 'pdf'; }
            else if(['zip','rar','7z','tar','gz'].includes(ext)) { iconClass = 'fa-file-archive'; typeClass = 'archive'; }
            else if(['html','css','js','java','py','c','cpp'].includes(ext)) { iconClass = 'fa-file-code'; typeClass = 'code'; }
        }
        
        card.innerHTML = `
            <div class="file-card-icon ${typeClass}"><i class="fas ${iconClass}"></i></div>
            <div class="file-card-name" title="${item.name}">${item.name}</div>
        `;
        
        // Click event
        card.addEventListener('click', (e) => {
            if(item.isDirectory) {
                loadFileList(item.path);
            } else {
                selectFile(item, card);
            }
        });
        
        // Context Menu Events
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            selectFile(item, card); // Also select on right click
            showContextMenu(e.pageX, e.pageY, item);
        });
        
        // Long press for mobile
        let pressTimer;
        card.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                e.preventDefault();
                const touch = e.touches[0];
                selectFile(item, card);
                showContextMenu(touch.pageX, touch.pageY, item);
            }, 600);
        });
        card.addEventListener('touchend', () => clearTimeout(pressTimer));
        card.addEventListener('touchmove', () => clearTimeout(pressTimer));
        
        gridView.appendChild(card);
    });
}

function selectFile(item, cardElement) {
    // Remove selected class from all cards
    document.querySelectorAll('.file-card').forEach(c => c.classList.remove('selected'));
    // Add to current
    if(cardElement) cardElement.classList.add('selected');
    
    selectedFileItem = item;
    showFileDetails(item);
}

function showFileDetails(item) {
    const detailsPanel = document.getElementById('sidebarDetails');
    if(!detailsPanel) return;
    
    const empty = detailsPanel.querySelector('.empty-details');
    const content = detailsPanel.querySelector('.file-details-content');
    
    if(item.isDirectory) {
        // For now, maybe just show folder info or keep empty?
        // Let's show basic info
        empty.style.display = 'none';
        content.style.display = 'block';
        
        document.getElementById('detailIcon').innerHTML = '<i class="fas fa-folder" style="color:#f0ad4e"></i>';
        document.getElementById('detailName').textContent = item.name;
        document.getElementById('detailType').textContent = '文件夹';
        document.getElementById('detailSize').textContent = '-';
        document.getElementById('detailModified').textContent = new Date(item.modified * 1000).toLocaleString();
        
        // Hide download button for folders
        document.getElementById('btnDownload').style.display = 'none';
    } else {
        empty.style.display = 'none';
        content.style.display = 'block';
        
        // Icon
        const ext = item.name.split('.').pop().toLowerCase();
        let iconClass = 'fa-file';
        let color = '#4a4e69';
        if(['jpg','jpeg','png','gif','webp'].includes(ext)) { iconClass = 'fa-file-image'; color='#5cb85c'; }
        else if(['mp4','webm','ogg','mov'].includes(ext)) { iconClass = 'fa-file-video'; color='#d9534f'; }
        else if(['mp3','wav'].includes(ext)) { iconClass = 'fa-file-audio'; color='#5bc0de'; }
        else if(['pdf'].includes(ext)) { iconClass = 'fa-file-pdf'; color='#d9534f'; }
        else if(['zip','rar','7z','tar','gz'].includes(ext)) { iconClass = 'fa-file-archive'; color='#f0ad4e'; }
        
        document.getElementById('detailIcon').innerHTML = `<i class="fas ${iconClass}" style="color:${color}"></i>`;
        document.getElementById('detailName').textContent = item.name;
        document.getElementById('detailType').textContent = ext.toUpperCase() + ' 文件';
        document.getElementById('detailSize').textContent = formatFileSize(item.size);
        document.getElementById('detailModified').textContent = new Date(item.modified * 1000).toLocaleString();
        
        document.getElementById('btnDownload').style.display = 'inline-block';
    }
    
    // Bind buttons
    const btnDownload = document.getElementById('btnDownload');
    const btnShare = document.getElementById('btnShare');
    const btnRename = document.getElementById('btnRename');
    const btnDelete = document.getElementById('btnDelete');
    
    // Clone nodes to remove old event listeners or just reassign onclick
    btnDownload.onclick = () => window.open(`/storage/${item.path}`, '_blank');
    btnShare.onclick = () => openShareModal(item.path);
    btnRename.onclick = () => renameFile(item.path, item.name);
    btnDelete.onclick = () => deleteFile(item.path);
}

// --- Context Menu ---

function setupContextMenu() {
    const menu = document.getElementById('context-menu');
    
    // Hide menu on click elsewhere
    document.addEventListener('click', (e) => {
        if(!menu.contains(e.target)) menu.style.display = 'none';
    });
    
    // Menu actions
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if(contextMenuTarget) {
                handleMenuAction(action, contextMenuTarget);
            }
            menu.style.display = 'none';
        });
    });
}

function showContextMenu(x, y, item) {
    const menu = document.getElementById('context-menu');
    contextMenuTarget = item;
    
    menu.style.display = 'block';
    
    // Adjust position to stay in viewport
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mw = menu.offsetWidth;
    const mh = menu.offsetHeight;
    
    if(x + mw > w) x = w - mw - 10;
    if(y + mh > h) y = h - mh - 10;
    
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
}

function handleMenuAction(action, item) {
    switch(action) {
        case 'download':
            if(item.isDirectory) alert('暂不支持文件夹下载');
            else window.open(`/storage/${item.path}`, '_blank');
            break;
        case 'share':
            openShareModal(item.path);
            break;
        case 'details':
            alert(`名称: ${item.name}\n大小: ${formatFileSize(item.size)}\n修改时间: ${new Date(item.modified * 1000).toLocaleString()}`);
            break;
        case 'rename':
            renameFile(item.path, item.name);
            break;
        case 'delete':
            deleteFile(item.path);
            break;
        case 'copy':
        case 'move':
            alert('功能开发中...');
            break;
    }
}

// --- FAB & Upload ---

function setupFAB() {
    const fabMain = document.getElementById('fabMain');
    const fabContainer = document.querySelector('.fab-container');
    
    fabMain.addEventListener('click', () => {
        fabContainer.classList.toggle('active');
        fabMain.classList.toggle('active');
    });
    
    // Close FAB when clicking outside
    document.addEventListener('click', (e) => {
        if(!fabContainer.contains(e.target)) {
            fabContainer.classList.remove('active');
            fabMain.classList.remove('active');
        }
    });
}

function triggerUpload(type) {
    if(type === 'file') document.getElementById('fileInput').click();
    else if(type === 'folder') document.getElementById('folderInput').click();
    
    // Close FAB
    document.querySelector('.fab-container').classList.remove('active');
    document.getElementById('fabMain').classList.remove('active');
}

function createNewFolderUI() {
    createNewFolder(currentPath);
    // Close FAB
    document.querySelector('.fab-container').classList.remove('active');
    document.getElementById('fabMain').classList.remove('active');
}

function setupUploadQueue() {
    const fileInput = document.getElementById('fileInput');
    const folderInput = document.getElementById('folderInput');
    
    const handleSelect = (e) => {
        const files = Array.from(e.target.files);
        if(files.length > 0) {
            addToUploadQueue(files);
            e.target.value = ''; // Reset
        }
    };
    
    fileInput.addEventListener('change', handleSelect);
    folderInput.addEventListener('change', handleSelect);
}

function addToUploadQueue(files) {
    const panel = document.getElementById('upload-queue-panel');
    const list = document.getElementById('queue-list');
    const empty = list.querySelector('.queue-empty-state');
    
    if(empty) empty.style.display = 'none';
    panel.classList.remove('collapsed');
    
    files.forEach(file => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        const item = {
            id: id,
            file: file,
            path: currentPath, // Upload to current path when added
            status: 'pending', // pending, uploading, success, error
            progress: 0
        };
        uploadQueue.push(item);
        
        // Create UI
        const el = document.createElement('div');
        el.className = 'queue-item';
        el.id = `queue-item-${id}`;
        el.innerHTML = `
            <div class="queue-item-icon"><i class="fas fa-file"></i></div>
            <div class="queue-item-info">
                <div class="queue-item-name" title="${file.name}">${file.name}</div>
                <div class="queue-progress-bar"><div class="queue-progress-fill" style="width:0%"></div></div>
                <div class="queue-item-status">
                    <span>等待中...</span>
                    <span>${formatFileSize(file.size)}</span>
                </div>
            </div>
        `;
        list.appendChild(el);
    });
    
    processUploadQueue();
    updateQueueSummary();
}

function processUploadQueue() {
    if(isUploading) return;
    
    const next = uploadQueue.find(i => i.status === 'pending');
    if(!next) return;
    
    isUploading = true;
    next.status = 'uploading';
    
    const el = document.getElementById(`queue-item-${next.id}`);
    const statusText = el.querySelector('.queue-item-status span:first-child');
    const fill = el.querySelector('.queue-progress-fill');
    
    statusText.textContent = '上传中...';
    
    const fd = new FormData();
    fd.append('file', next.file);
    // If it's a folder upload, webkitRelativePath might be available, but our backend expects 'directory' param.
    // For simple file upload, use stored path.
    // For folder upload, we might need to parse relative path.
    let targetDir = next.path;
    if(next.file.webkitRelativePath) {
        const rel = next.file.webkitRelativePath;
        const folderPart = rel.substring(0, rel.lastIndexOf('/'));
        if(folderPart) targetDir = (targetDir ? targetDir + '/' : '') + folderPart;
    }
    fd.append('directory', targetDir);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload', true);
    
    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            fill.style.width = percent + '%';
            statusText.textContent = Math.round(percent) + '%';
        }
    };
    
    xhr.onload = () => {
        isUploading = false;
        if (xhr.status === 200) {
            const d = JSON.parse(xhr.responseText);
            if(d.error) {
                next.status = 'error';
                statusText.textContent = '失败: ' + d.error;
                statusText.style.color = 'var(--error-color)';
                fill.style.background = 'var(--error-color)';
            } else {
                next.status = 'success';
                statusText.textContent = '完成';
                statusText.style.color = 'var(--success-color)';
                fill.style.width = '100%';
                
                // Refresh list if we are in the same directory
                if(currentPath === next.path) loadFileList(currentPath);
            }
        } else {
            next.status = 'error';
            statusText.textContent = 'HTTP错误';
        }
        updateQueueSummary();
        processUploadQueue(); // Next
    };
    
    xhr.onerror = () => {
        isUploading = false;
        next.status = 'error';
        statusText.textContent = '网络错误';
        updateQueueSummary();
        processUploadQueue();
    };
    
    xhr.send(fd);
}

function updateQueueSummary() {
    const total = uploadQueue.length;
    const pending = uploadQueue.filter(i => i.status === 'pending' || i.status === 'uploading').length;
    const summary = document.getElementById('queue-summary');
    if(pending > 0) summary.textContent = `${pending} 个文件正在上传`;
    else summary.textContent = `上传完成`;
}

function toggleQueuePanel() {
    document.getElementById('upload-queue-panel').classList.toggle('collapsed');
}

function clearCompletedUploads(e) {
    e.stopPropagation();
    uploadQueue = uploadQueue.filter(i => i.status === 'pending' || i.status === 'uploading');
    const list = document.getElementById('queue-list');
    // Remove completed elements
    Array.from(list.children).forEach(child => {
        if(child.classList.contains('queue-empty-state')) return;
        const id = child.id.replace('queue-item-', '');
        const item = uploadQueue.find(i => i.id === id);
        if(!item) child.remove();
    });
    
    if(uploadQueue.length === 0) {
        document.querySelector('.queue-empty-state').style.display = 'block';
        document.getElementById('upload-queue-panel').classList.add('collapsed');
    }
    updateQueueSummary();
}

function createNewFolder(path) {
    const name = prompt("请输入文件夹名称:");
    if (name) {
        const newPath = path ? path + "/" + name : name;
        fetch('/api/folder/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({path: newPath})
        }).then(r=>r.json()).then(d=>{
            if(d.success) loadFileList(path);
            else alert("创建失败: " + d.error);
        });
    }
}

function deleteFile(path) {
    if(confirm("确定要删除吗?")) {
        fetch('/api/file/delete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({path: path})
        }).then(r=>r.json()).then(d=>{
            if(d.success) {
                const parent = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
                loadFileList(parent);
            } else alert("删除失败: " + d.error);
        });
    }
}

function renameFile(path, oldName) {
    const newName = prompt("请输入新名称:", oldName);
    if (newName && newName !== oldName) {
        fetch('/api/file/rename', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({path: path, newName: newName})
        }).then(r=>r.json()).then(d=>{
            if(d.success) {
                const parent = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
                loadFileList(parent);
            } else alert("重命名失败: " + d.error);
        });
    }
}

function previewFile(path, name) {
    const ext = name.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExts = ['mp4', 'webm', 'ogg', 'mov'];
    
    if (imageExts.includes(ext)) {
        openPreviewModal(`<img src="/storage/${path}" style="max-width:100%; max-height:80vh;">`, name);
    } else if (videoExts.includes(ext)) {
        openPreviewModal(`<video controls style="max-width:100%; max-height:80vh;"><source src="/storage/${path}" type="video/${ext}">您的浏览器不支持视频播放。</video>`, name);
    } else {
        window.open(`/storage/${path}`, '_blank');
    }
}

function openPreviewModal(content, title) {
    let modal = document.getElementById('previewModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'previewModal';
        modal.className = 'modal';
        modal.innerHTML = `<div class="modal-content" style="width:80%; max-width:1000px; text-align:center;">
            <span class="close" onclick="document.getElementById('previewModal').style.display='none'">&times;</span>
            <h2 id="previewTitle"></h2>
            <div id="previewContent"></div>
        </div>`;
        document.body.appendChild(modal);
    }
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewContent').innerHTML = content;
    modal.style.display = 'block';
    
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
}

// Share Modal Logic
function openShareModal(path) {
    const modal = document.getElementById('shareModal');
    const nameSpan = document.getElementById('modalFileName');
    const pathInput = document.getElementById('modalFilePath');
    const resultDiv = document.getElementById('shareResult');
    
    if(!modal || !nameSpan || !pathInput) return;
    
    nameSpan.textContent = path.split('/').pop();
    pathInput.value = path;
    resultDiv.innerHTML = '';
    modal.style.display = "block";
}

function setupShareModal() {
    const modal = document.getElementById('shareModal');
    if(!modal) return;
    
    const closeBtn = modal.querySelector('.close');
    const expireSelect = document.getElementById('expireSelect');
    const customExpire = document.getElementById('customExpire');
    const createBtn = document.getElementById('createShareBtn');
    
    if(closeBtn) closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
    
    if(expireSelect) {
        expireSelect.onchange = () => {
            if(expireSelect.value === 'custom') {
                customExpire.style.display = 'block';
            } else {
                customExpire.style.display = 'none';
            }
        };
    }
    
    if(createBtn) {
        createBtn.onclick = async () => {
            const path = document.getElementById('modalFilePath').value;
            let expireHours = expireSelect.value;
            if(expireHours === 'custom') {
                expireHours = customExpire.value;
                if(!expireHours || expireHours <= 0) {
                    alert('请输入有效的小时数');
                    return;
                }
            }
            
            const body = { 
                filePath: path, 
                expireHours: parseInt(expireHours), 
                maxDownloads: null 
            };
            
            const resultDiv = document.getElementById('shareResult');
            resultDiv.innerHTML = '生成中...';
            
            try {
                const res = await fetch('/api/share', { 
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                
                if(res.ok && data.success) {
                    const url = location.origin + data.data.url;
                    resultDiv.innerHTML = `<p class="success">分享链接已生成:</p><input type="text" value="${url}" style="width:100%;padding:5px;" readonly onclick="this.select()"\>`;
                } else {
                    resultDiv.innerHTML = `<p class="error">生成失败: ${data.message || '未知错误'}</p>`;
                }
            } catch(err) {
                resultDiv.innerHTML = `<p class="error">请求失败: ${err.message}</p>`;
            }
        };
    }
}
