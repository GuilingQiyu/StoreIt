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

// 预览支持的扩展名
const PREVIEW_IMAGE_EXTS = ['jpg','jpeg','png','gif','webp','bmp'];
const PREVIEW_VIDEO_EXTS = ['mp4','webm','ogg','ogv','mov'];
const PREVIEW_TEXT_EXTS = ['txt','log','md','csv','ini','conf','yml','yaml','json','xml','html','htm','svg','css','js','java','py','c','cpp','h','go','rs','sh','sql'];

function getFileExt(name){ return (name.includes('.') ? name.split('.').pop() : '').toLowerCase(); }

function isPreviewable(name){
    const ext = getFileExt(name);
    return PREVIEW_IMAGE_EXTS.includes(ext) || PREVIEW_VIDEO_EXTS.includes(ext) || PREVIEW_TEXT_EXTS.includes(ext);
}

function loadUserStatus(){ 
    const el=document.getElementById('sidebarUser'); 
    if(!el) return; 
    fetch('/api/user/status').then(r=>r.json()).then(d=>{ 
        currentUsername = d.username || '';
        currentRole = d.role || '';
        const adminMenu = document.getElementById('adminMenu');
        if (adminMenu) adminMenu.style.display = (currentRole || '').toUpperCase() === 'ADMIN' ? 'block' : 'none';
        el.innerHTML = d.logged_in ? 
            `<div style="display:flex; align-items:center; gap:10px; width:100%; justify-content:space-between;">
                <span style="overflow:hidden; text-overflow:ellipsis;"><i class="fas fa-user-circle"></i> ${escapeHtml(d.username)}</span>
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
            if(!text || !fill) return;
            const total = data.total || 0;
            const used = data.used || 0;
            const percent = total > 0 ? (used / total) * 100 : 0;
            // 普通用户不限额时只展示已用 + “无限制”；管理员/有配额时展示 已用/总量
            if(data.unlimited && data.scope === 'user') {
                text.textContent = `${formatFileSize(used)} / 无限制`;
            } else {
                text.textContent = `${formatFileSize(used)} / ${formatFileSize(total)}`;
            }
            fill.style.width = `${Math.min(percent, 100)}%`;
            if(percent > 90) fill.style.backgroundColor = '#d9534f';
            else if(percent > 70) fill.style.backgroundColor = '#f0ad4e';
            else fill.style.backgroundColor = 'var(--primary-color)';
        })
        .catch(() => {});
}

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
}

// Global State
let currentUsername = '';
let currentRole = '';
let currentPath = '';
let viewMode = 'files';
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
    setupSharesPanel();
    setupAdminPanel(); 
    
    if(document.getElementById('file-grid-view')){ 
        loadFileList(); 
        loadStorageUsage();
        setupContextMenu();
        setupFAB();
        setupUploadQueue();
        setupSearch();
    } 
});

function setActiveMenu(id) {
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(el => el.classList.remove('active'));
    const item = document.getElementById(id);
    if (item) item.classList.add('active');
}

function setPageTitle(title) {
    const el = document.getElementById('pageTitle') || document.querySelector('.header-row h1');
    if (el) el.textContent = title;
}

function setupSearch() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    if (!form || !input) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        loadSearch(input.value.trim());
    });
}

// --- File List Logic ---

function loadFileList(path=''){
  viewMode = 'files';
  setActiveMenu('menuFiles');
  setPageTitle('文件列表');
  const gridView = document.getElementById('file-grid-view');
  const emptyState = document.getElementById('empty-state');
  if(!gridView) return;
  gridView.classList.remove('panel-mode');
  
  gridView.innerHTML = '<p style="text-align:center; width:100%;">加载中...</p>';
  emptyState.style.display = 'none';

  fetch(`/api/files?path=${encodeURIComponent(path)}`).then(r=>r.json()).then(data=>{
    if(data.error){ 
        gridView.innerHTML=`<p class="error">错误: ${data.error}</p>`; 
        return; 
    }
    
    currentPath = data.currentPath ?? data.current_path ?? '';
    renderBreadcrumb(currentPath);
    showItems(data.items || []);
  }).catch(err=>{ gridView.innerHTML=`<p class="error">加载失败: ${err.message}</p>`; });
}

function loadRecent() {
    viewMode = 'recent';
    setActiveMenu('menuRecent');
    setPageTitle('最近访问');
    loadCollection('/api/files/recent', '最近访问');
}

function loadFavorites() {
    viewMode = 'favorites';
    setActiveMenu('menuFavorites');
    setPageTitle('收藏夹');
    loadCollection('/api/favorites', '收藏夹');
}

function loadSearch(query) {
    viewMode = 'search';
    setActiveMenu('menuFiles');
    setPageTitle('搜索结果');
    loadCollection('/api/files/search?q=' + encodeURIComponent(query || ''), '搜索：' + (query || ''));
}

function loadCollection(url, label) {
    const gridView = document.getElementById('file-grid-view');
    const emptyState = document.getElementById('empty-state');
    if (!gridView) return;
    gridView.classList.remove('panel-mode');
    gridView.innerHTML = '<p style="text-align:center; width:100%;">加载中...</p>';
    if (emptyState) emptyState.style.display = 'none';
    fetch(url).then(r => r.json()).then(data => {
        if (data.error) {
            gridView.innerHTML = `<p class="error">错误: ${escapeHtml(data.error)}</p>`;
            return;
        }
        renderSpecialBreadcrumb(label);
        showItems(data.items || []);
    }).catch(err => { gridView.innerHTML = `<p class="error">加载失败: ${escapeHtml(err.message)}</p>`; });
}

function loadAbout() {
    viewMode = 'about';
    setActiveMenu('menuAbout');
    setPageTitle('关于');
    const gridView = document.getElementById('file-grid-view');
    const emptyState = document.getElementById('empty-state');
    if (!gridView) return;
    if (emptyState) emptyState.style.display = 'none';
    gridView.classList.add('panel-mode');
    renderSpecialBreadcrumb('关于');
    gridView.innerHTML = `
        <div class="panel-card about-card" style="max-width:680px; margin:30px auto; text-align:center;">
            <h1 style="color:var(--primary-color); font-size:2rem; margin-bottom:0.8rem;">关于 储之</h1>
            <p style="font-size:1.1rem; color:var(--text-color); margin:1.2rem 0; line-height:1.6;">
                储之是一个基于 Spring Boot 构建的简单文件服务器。
            </p>
            <div class="status" style="margin:1.5rem 0;">
                <div class="status-dot"></div>
                <span style="font-size:0.95rem; color:#4CAF50; font-weight:500;">服务器运行中</span>
            </div>
            <div style="margin:1.8rem 0;">
                <a href="https://github.com/GuilingQiyu/StoreIt" target="_blank" class="btn" style="display:inline-flex; align-items:center; gap:8px;">
                    <i class="fab fa-github"></i> GitHub
                </a>
            </div>
            <footer style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid rgba(0,0,0,0.06); font-size:0.9rem; color:var(--secondary-color);">
                <p style="margin:6px 0;">© 2025–2026 归灵祈昱</p>
                <p style="margin:6px 0;">本程序以 <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank">GNU AGPL-3.0 或更高版本</a>授权。源码：<a href="https://github.com/GuilingQiyu/StoreIt" target="_blank">github.com/GuilingQiyu/StoreIt</a></p>
            </footer>
        </div>
    `;
}

function loadShares() {
    viewMode = 'shares';
    setActiveMenu('menuShares');
    setPageTitle('我的分享');
    const gridView = document.getElementById('file-grid-view');
    const emptyState = document.getElementById('empty-state');
    if (!gridView) return;
    if (emptyState) emptyState.style.display = 'none';
    gridView.classList.add('panel-mode');
    renderSpecialBreadcrumb('我的分享');
    gridView.innerHTML = `
        <div class="panel-card" style="max-width:960px; margin:20px auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:12px;">
                <h2 style="color:var(--primary-color); font-size:1.4rem; margin:0; display:flex; align-items:center; gap:8px;">
                    <i class="fas fa-share-alt"></i> 我的分享
                </h2>
                <button class="btn small" onclick="loadMyShares()" title="刷新分享列表">
                    <i class="fas fa-sync-alt"></i> 刷新
                </button>
            </div>
            <div id="sharesList"><p style="text-align:center; color:var(--secondary-color); padding:20px;">加载中...</p></div>
        </div>
    `;
    loadMyShares();
}

function loadAdmin() {
    viewMode = 'admin';
    setActiveMenu('menuAdmin');
    setPageTitle('用户管理');
    const gridView = document.getElementById('file-grid-view');
    const emptyState = document.getElementById('empty-state');
    if (!gridView) return;
    if (emptyState) emptyState.style.display = 'none';
    gridView.classList.add('panel-mode');
    renderSpecialBreadcrumb('用户管理');
    gridView.innerHTML = `
        <div class="panel-card" style="max-width:960px; margin:20px auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:12px;">
                <h2 style="color:var(--primary-color); font-size:1.4rem; margin:0; display:flex; align-items:center; gap:8px;">
                    <i class="fas fa-users-cog"></i> 用户管理
                </h2>
                <button class="btn small" onclick="loadAdminUsers()" title="刷新用户列表">
                    <i class="fas fa-sync-alt"></i> 刷新
                </button>
            </div>
            <div style="background:rgba(255,255,255,0.7); border:1px solid rgba(0,0,0,0.08); border-radius:10px; padding:20px; margin-bottom:25px;">
                <h3 style="color:var(--primary-color); font-size:1.1rem; margin-bottom:15px; display:flex; align-items:center; gap:8px;">
                    <i class="fas fa-user-plus"></i> 新增用户
                </h3>
                <form id="createUserForm" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:15px; align-items:end;">
                    <div class="form-group" style="margin-bottom:0;">
                        <label for="newUsername" style="font-size:0.9rem; margin-bottom:5px;">用户名</label>
                        <input type="text" id="newUsername" required maxlength="64" placeholder="字母、数字、点、下划线、短横线" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #ccc;">
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label for="newPassword" style="font-size:0.9rem; margin-bottom:5px;">初始口令</label>
                        <input type="password" id="newPassword" required minlength="8" placeholder="至少 8 位" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #ccc;">
                    </div>
                    <div class="form-group" style="margin-bottom:0;">
                        <label for="newQuota" style="font-size:0.9rem; margin-bottom:5px;">配额 (字节，0表示不限)</label>
                        <input type="number" id="newQuota" min="0" value="0" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #ccc;">
                    </div>
                    <div>
                        <button type="submit" class="btn" style="margin:0; white-space:nowrap; height:38px;">
                            <i class="fas fa-check"></i> 开户
                        </button>
                    </div>
                </form>
                <p id="createUserStatus" style="margin-top:10px; margin-bottom:0; font-size:0.9rem;"></p>
            </div>
            <div>
                <h3 style="color:var(--primary-color); font-size:1.1rem; margin-bottom:15px; display:flex; align-items:center; gap:8px;">
                    <i class="fas fa-users"></i> 用户列表
                </h3>
                <div id="adminUserList" style="overflow-x:auto;">
                    <p style="text-align:center; color:var(--secondary-color); padding:20px;">加载中...</p>
                </div>
            </div>
        </div>
    `;
    setupAdminForm();
    loadAdminUsers();
}


function showItems(rawItems) {
    const gridView = document.getElementById('file-grid-view');
    const emptyState = document.getElementById('empty-state');
    if (gridView) gridView.classList.remove('panel-mode');
    const items = rawItems.map(item => {
        const isDir = (item.isDirectory !== undefined ? item.isDirectory : (item.directory !== undefined ? item.directory : false));
        return {
            name: item.name,
            path: item.path,
            isDirectory: !!isDir,
            size: item.size,
            modified: item.modifiedTime || item.modified_time
        };
    });
    if (items.length === 0) {
        gridView.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        renderFileGrid(items);
    }
}

function renderSpecialBreadcrumb(label) {
    const container = document.getElementById('breadcrumb');
    if (!container) return;
    container.innerHTML = `<div class="breadcrumb-item" onclick="loadFileList('')"><i class="fas fa-home"></i></div><span class="breadcrumb-separator">/</span><div class="breadcrumb-item active">${escapeHtml(label)}</div>`;
}

function reloadCurrentView() {
    if (viewMode === 'recent') loadRecent();
    else if (viewMode === 'favorites') loadFavorites();
    else if (viewMode === 'search') loadSearch((document.getElementById('searchInput') || {}).value || '');
    else if (viewMode === 'about') loadAbout();
    else if (viewMode === 'shares') loadShares();
    else if (viewMode === 'admin') loadAdmin();
    else loadFileList(currentPath);
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

        // Double click: 文件夹进入；可预览文件直接预览
        card.addEventListener('dblclick', (e) => {
            if(item.isDirectory) {
                loadFileList(item.path);
            } else if(isPreviewable(item.name)) {
                previewFile(item.path, item.name);
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
    const btnPreview = document.getElementById('btnPreview');
    const btnDownload = document.getElementById('btnDownload');
    const btnShare = document.getElementById('btnShare');
    const btnRename = document.getElementById('btnRename');
    const btnFavorite = document.getElementById('btnFavorite');
    const btnDelete = document.getElementById('btnDelete');

    // 仅对可预览的文件显示预览按钮
    if(btnPreview) {
        if(!item.isDirectory && isPreviewable(item.name)) {
            btnPreview.style.display = 'inline-block';
            btnPreview.onclick = () => previewFile(item.path, item.name);
        } else {
            btnPreview.style.display = 'none';
        }
    }
    // Clone nodes to remove old event listeners or just reassign onclick
    btnDownload.onclick = () => window.open(`/storage/${item.path}`, '_blank');
    btnShare.onclick = () => openShareModal(item.path);
    btnRename.onclick = () => renameFile(item.path, item.name);
    if (btnFavorite) btnFavorite.onclick = () => favoritePath(item.path, true);
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
        case 'preview':
            if(item.isDirectory) loadFileList(item.path);
            else if(isPreviewable(item.name)) previewFile(item.path, item.name);
            else window.open(`/storage/${item.path}`, '_blank');
            break;
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
        case 'move':
            moveFile(item);
            break;
        case 'favorite':
            favoritePath(item.path, true);
            break;
        case 'unfavorite':
            favoritePath(item.path, false);
            break;
        case 'delete':
            deleteFile(item.path);
            break;
    }
}

function favoritePath(path, add) {
    const request = add
        ? fetch('/api/favorites', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ path }) })
        : fetch('/api/favorites?path=' + encodeURIComponent(path), { method: 'DELETE' });
    request.then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok && data.message) alert(data.message);
        if (viewMode === 'favorites') loadFavorites();
    }).catch(() => alert(add ? '收藏失败' : '取消收藏失败'));
}

function moveFile(item) {
    const destination = prompt('移动到目录，留空表示根目录', currentPath || '');
    if (destination === null) return;
    fetch('/api/file/move', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ path: item.path, destination: destination.trim() })
    }).then(r => r.json()).then(data => {
        if (data.error) alert(data.error);
        else reloadCurrentView();
    }).catch(() => alert('移动失败'));
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

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const CHUNK_THRESHOLD = 50 * 1024 * 1024; // 50MB — files above this use chunked upload

function processUploadQueue() {
    if(isUploading) return;
    
    const next = uploadQueue.find(i => i.status === 'pending');
    if(!next) return;
    
    isUploading = true;
    next.status = 'uploading';
    
    if (next.file.size > CHUNK_THRESHOLD) {
        processChunkedUpload(next);
    } else {
        processSimpleUpload(next);
    }
}

function processSimpleUpload(next) {
    const el = document.getElementById(`queue-item-${next.id}`);
    const statusText = el.querySelector('.queue-item-status span:first-child');
    const fill = el.querySelector('.queue-progress-fill');
    
    statusText.textContent = '上传中...';
    
    const fd = new FormData();
    fd.append('file', next.file);
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
                if(currentPath === next.path) loadFileList(currentPath);
            }
        } else {
            next.status = 'error';
            let msg = 'HTTP错误';
            try {
                const d = JSON.parse(xhr.responseText);
                if (d && d.error) msg = d.error;
            } catch (e) { /* 非 JSON 错误页保持通用文案 */ }
            statusText.textContent = '失败: ' + msg;
            statusText.style.color = 'var(--error-color)';
            fill.style.background = 'var(--error-color)';
        }
        updateQueueSummary();
        processUploadQueue();
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

async function processChunkedUpload(next) {
    const el = document.getElementById(`queue-item-${next.id}`);
    const statusText = el.querySelector('.queue-item-status span:first-child');
    const fill = el.querySelector('.queue-progress-fill');
    
    statusText.textContent = '初始化...';

    let targetDir = next.path;
    if(next.file.webkitRelativePath) {
        const rel = next.file.webkitRelativePath;
        const folderPart = rel.substring(0, rel.lastIndexOf('/'));
        if(folderPart) targetDir = (targetDir ? targetDir + '/' : '') + folderPart;
    }

    try {
        // Step 1: Check for existing upload session (resume support)
        let uploadId = next.uploadId || null;
        let totalChunks, uploadedChunks = [];

        if (uploadId) {
            // Resume: query server for already-uploaded chunks
            const statusRes = await fetch(`/api/upload/status?uploadId=${encodeURIComponent(uploadId)}`);
            if (statusRes.ok) {
                const statusData = await statusRes.json();
                totalChunks = statusData.totalChunks;
                uploadedChunks = statusData.uploadedChunks || [];
            } else {
                uploadId = null; // Session expired, start fresh
            }
        }

        if (!uploadId) {
            // Step 1b: Initialize new upload session
            const initRes = await fetch('/api/upload/init', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    fileName: next.file.name,
                    fileSize: next.file.size,
                    directory: targetDir
                })
            });
            if (!initRes.ok) {
                const err = await initRes.json().catch(() => ({}));
                throw new Error(err.error || '初始化上传失败');
            }
            const initData = await initRes.json();
            uploadId = initData.uploadId;
            totalChunks = initData.totalChunks;
            uploadedChunks = [];
            next.uploadId = uploadId; // Save for resume
        }

        // Step 2: Upload chunks
        let completedChunks = uploadedChunks.length;
        for (let i = 0; i < totalChunks; i++) {
            if (uploadedChunks.includes(i)) continue; // Skip already uploaded

            const start = i * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, next.file.size);
            const chunk = next.file.slice(start, end);

            const fd = new FormData();
            fd.append('uploadId', uploadId);
            fd.append('chunkIndex', i);
            fd.append('chunk', chunk);

            const chunkRes = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/upload/chunk', true);
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const chunkProgress = (completedChunks + e.loaded / e.total) / totalChunks * 100;
                        fill.style.width = chunkProgress + '%';
                        statusText.textContent = Math.round(chunkProgress) + '%';
                    }
                };
                xhr.onload = () => resolve(xhr);
                xhr.onerror = () => reject(new Error('网络错误'));
                xhr.send(fd);
            });

            if (chunkRes.status !== 200) {
                const errData = JSON.parse(chunkRes.responseText || '{}');
                throw new Error(errData.error || '分片上传失败');
            }
            completedChunks++;
        }

        // Step 3: Complete upload
        statusText.textContent = '合并中...';
        fill.style.width = '99%';
        const completeRes = await fetch('/api/upload/complete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ uploadId: uploadId })
        });
        if (!completeRes.ok) {
            const err = await completeRes.json().catch(() => ({}));
            throw new Error(err.error || '合并文件失败');
        }

        next.status = 'success';
        statusText.textContent = '完成';
        statusText.style.color = 'var(--success-color)';
        fill.style.width = '100%';
        if(currentPath === next.path) loadFileList(currentPath);
    } catch (err) {
        next.status = 'error';
        statusText.textContent = '失败: ' + err.message;
        statusText.style.color = 'var(--error-color)';
        fill.style.background = 'var(--error-color)';
    }

    isUploading = false;
    updateQueueSummary();
    processUploadQueue();
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
            if(d.success) reloadCurrentView();
            else alert("删除失败: " + d.error);
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
            if(d.success) reloadCurrentView();
            else alert("重命名失败: " + d.error);
        });
    }
}

function previewFile(path, name) {
    const ext = getFileExt(name);
    const src = `/api/preview?path=${encodeURIComponent(path)}`;

    if (PREVIEW_IMAGE_EXTS.includes(ext)) {
        openPreviewModal(`<img src="${src}" alt="${escapeHtml(name)}" style="max-width:100%; max-height:78vh; object-fit:contain;">`, name);
    } else if (PREVIEW_VIDEO_EXTS.includes(ext)) {
        openPreviewModal(`<video controls autoplay style="max-width:100%; max-height:78vh;"><source src="${src}">您的浏览器不支持视频播放。</video>`, name);
    } else if (PREVIEW_TEXT_EXTS.includes(ext)) {
        openPreviewModal('<p style="color:#666;">加载中...</p>', name);
        fetch(src).then(r => {
            if(!r.ok) throw new Error('无法加载');
            return r.text();
        }).then(txt => {
            // 截断超大文本，避免卡顿
            const MAX = 200000;
            let truncated = false;
            if(txt.length > MAX){ txt = txt.slice(0, MAX); truncated = true; }
            const note = truncated ? '<p style="color:#f0ad4e; text-align:left;">内容过大，仅显示前 200,000 字符。</p>' : '';
            const content = document.getElementById('previewContent');
            if(content){
                content.innerHTML = note;
                const pre = document.createElement('pre');
                pre.style.cssText = 'text-align:left; max-height:70vh; overflow:auto; white-space:pre-wrap; word-break:break-word; background:#f7f7f9; padding:12px; border-radius:8px; font-size:13px;';
                pre.textContent = txt; // 用 textContent 防 XSS
                content.appendChild(pre);
            }
        }).catch(err => {
            const content = document.getElementById('previewContent');
            if(content) content.innerHTML = `<p class="error">预览失败: ${escapeHtml(err.message)}</p>`;
        });
    } else {
        window.open(`/storage/${path}`, '_blank');
    }
}

function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
            
            const maxInput = document.getElementById('maxDownloads');
            const rawMax = maxInput ? maxInput.value.trim() : '';
            let maxDownloads = null;
            if (rawMax !== '') {
                maxDownloads = parseInt(rawMax, 10);
                if (!Number.isFinite(maxDownloads) || maxDownloads <= 0) {
                    alert('下载次数需为正整数，留空表示不限制');
                    return;
                }
            }
            const body = { 
                filePath: path, 
                expireHours: parseInt(expireHours), 
                maxDownloads: maxDownloads 
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

function setupSharesPanel() {
    // Shares are now rendered inline via loadShares(); no modal setup needed.
}

async function loadMyShares() {
    const box = document.getElementById('sharesList');
    if (!box) return;
    box.innerHTML = '<p style="text-align:center; color:var(--secondary-color); padding:20px;">加载中...</p>';
    try {
        const res = await fetch('/api/shares');
        const data = await res.json();
        box.innerHTML = '';
        const items = data.data || [];
        if (!items.length) {
            box.innerHTML = `
                <div style="text-align:center; padding:40px 20px; color:var(--secondary-color);">
                    <i class="fas fa-share-alt" style="font-size:3rem; opacity:0.3; margin-bottom:12px;"></i>
                    <p style="margin:0; font-size:1rem;">还没有分享链接</p>
                </div>
            `;
            return;
        }
        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'share-row';
            row.style.cssText = 'display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between; padding:12px; border-bottom:1px solid rgba(0,0,0,0.06); border-radius:8px; transition:background 0.2s;';
            row.onmouseenter = () => row.style.background = 'rgba(0,0,0,0.02)';
            row.onmouseleave = () => row.style.background = 'transparent';

            const fileInfo = document.createElement('div');
            fileInfo.style.cssText = 'flex:1; min-width:240px; display:flex; flex-direction:column; gap:6px;';
            const name = document.createElement('strong');
            name.textContent = item.filePath || '';
            name.style.wordBreak = 'break-all';
            fileInfo.appendChild(name);

            const inputGroup = document.createElement('div');
            inputGroup.style.cssText = 'display:flex; align-items:center; gap:8px; width:100%;';
            const link = document.createElement('input');
            link.readOnly = true;
            link.value = location.origin + item.url;
            link.style.cssText = 'flex:1; padding:6px 10px; border:1px solid rgba(0,0,0,0.15); border-radius:6px; font-size:0.85rem; background:#fafafa;';
            link.onclick = () => link.select();

            const copyBtn = document.createElement('button');
            copyBtn.className = 'btn small';
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> 复制';
            copyBtn.onclick = () => {
                const text = link.value;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
                        setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i> 复制', 1500);
                    }).catch(() => {
                        link.select();
                        document.execCommand('copy');
                        copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
                        setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i> 复制', 1500);
                    });
                } else {
                    link.select();
                    document.execCommand('copy');
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
                    setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i> 复制', 1500);
                }
            };
            inputGroup.append(link, copyBtn);
            fileInfo.appendChild(inputGroup);

            const meta = document.createElement('span');
            meta.style.cssText = 'color:var(--secondary-color); font-size:0.85rem; white-space:nowrap;';
            const limit = item.maxDownloads ? item.downloads + '/' + item.maxDownloads : (item.downloads || 0) + '/不限';
            const expiry = item.expiry ? new Date(item.expiry * 1000).toLocaleString() : '永久';
            meta.textContent = `${limit} 次 · 到期: ${expiry}`;

            const revoke = document.createElement('button');
            revoke.className = 'btn small delete-btn';
            revoke.innerHTML = '<i class="fas fa-trash-alt"></i> 撤销';
            revoke.onclick = async () => {
                if (!confirm(`确定要撤销文件 "${item.filePath}" 的分享链接吗？`)) return;
                const done = await fetch('/api/shares/' + item.id, { method: 'DELETE' });
                const body = await done.json();
                if (!done.ok) alert(body.message || '撤销失败');
                loadMyShares();
            };

            row.append(fileInfo, meta, revoke);
            box.appendChild(row);
        });
    } catch (err) {
        box.innerHTML = `<p class="error" style="text-align:center; padding:20px;">无法读取分享: ${escapeHtml(err.message)}</p>`;
    }
}

function setupAdminPanel() {
    // Admin panel is now rendered inline via loadAdmin(); no modal setup needed.
}

function setupAdminForm() {
    const form = document.getElementById('createUserForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const status = document.getElementById('createUserStatus');
        const quota = Number(document.getElementById('newQuota').value || 0);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: document.getElementById('newUsername').value.trim(),
                    password: document.getElementById('newPassword').value,
                    storageQuota: quota
                })
            });
            const data = await res.json();
            if (status) {
                status.textContent = data.message || (res.ok ? '已创建' : '失败');
                status.style.color = res.ok ? 'var(--success-color)' : 'var(--error-color)';
            }
            if (res.ok) {
                form.reset();
                document.getElementById('newQuota').value = '0';
                loadAdminUsers();
            }
        } catch (err) {
            if (status) {
                status.textContent = '请求失败: ' + err.message;
                status.style.color = 'var(--error-color)';
            }
        }
    };
}

async function loadAdminUsers() {
    const box = document.getElementById('adminUserList');
    if (!box) return;
    box.innerHTML = '<p style="text-align:center; color:var(--secondary-color); padding:20px;">加载中...</p>';
    try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        box.innerHTML = '';
        const users = data.data || [];
        if (!users.length) {
            box.innerHTML = '<p style="text-align:center; color:var(--secondary-color); padding:20px;">暂无用户</p>';
            return;
        }

        const table = document.createElement('table');
        table.style.cssText = 'width:100%; border-collapse:collapse; text-align:left; font-size:0.9rem;';
        table.innerHTML = `
            <thead>
                <tr style="border-bottom:2px solid rgba(0,0,0,0.08); color:var(--primary-color);">
                    <th style="padding:10px 8px;">用户名</th>
                    <th style="padding:10px 8px;">存储配额</th>
                    <th style="padding:10px 8px;">角色</th>
                    <th style="padding:10px 8px;">保存属性</th>
                    <th style="padding:10px 8px;">重置口令</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.style.cssText = 'border-bottom:1px solid rgba(0,0,0,0.06); transition:background 0.2s;';
            tr.onmouseenter = () => tr.style.background = 'rgba(0,0,0,0.02)';
            tr.onmouseleave = () => tr.style.background = 'transparent';

            // Username cell
            const tdName = document.createElement('td');
            tdName.style.padding = '12px 8px';
            tdName.innerHTML = `<strong><i class="fas fa-user" style="color:var(--secondary-color); margin-right:6px;"></i>${escapeHtml(user.username)}</strong>`;

            // Quota cell
            const tdQuota = document.createElement('td');
            tdQuota.style.padding = '12px 8px';
            const quotaInput = document.createElement('input');
            quotaInput.type = 'number';
            quotaInput.min = '0';
            quotaInput.value = user.storageQuota;
            quotaInput.style.cssText = 'width:110px; padding:4px 8px; border:1px solid #ccc; border-radius:4px;';
            const quotaHint = document.createElement('div');
            quotaHint.style.cssText = 'font-size:0.75rem; color:#888; margin-top:2px;';
            quotaHint.textContent = user.storageQuota === 0 ? '不限额' : formatFileSize(user.storageQuota);
            quotaInput.oninput = () => {
                const val = Number(quotaInput.value || 0);
                quotaHint.textContent = val === 0 ? '不限额' : formatFileSize(val);
            };
            tdQuota.append(quotaInput, quotaHint);

            // Role cell
            const tdRole = document.createElement('td');
            tdRole.style.padding = '12px 8px';
            const roleSelect = document.createElement('select');
            roleSelect.style.cssText = 'padding:4px 8px; border:1px solid #ccc; border-radius:4px;';
            ['USER', 'ADMIN'].forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                if ((user.role || '').toUpperCase() === value) option.selected = true;
                roleSelect.appendChild(option);
            });
            if (user.username === currentUsername) {
                roleSelect.disabled = true;
                roleSelect.title = '不可修改当前登录管理员角色';
            }
            tdRole.appendChild(roleSelect);

            // Save button cell
            const tdSave = document.createElement('td');
            tdSave.style.padding = '12px 8px';
            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn small';
            saveBtn.innerHTML = '<i class="fas fa-save"></i> 保存';
            saveBtn.onclick = async () => {
                try {
                    const done = await fetch('/api/admin/users/' + encodeURIComponent(user.username), {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ storageQuota: Number(quotaInput.value || 0), role: roleSelect.value })
                    });
                    const body = await done.json();
                    alert(body.message || (done.ok ? '已保存' : '失败'));
                    if (done.ok) loadAdminUsers();
                } catch (err) {
                    alert('保存失败: ' + err.message);
                }
            };
            tdSave.appendChild(saveBtn);

            // Reset password cell
            const tdPass = document.createElement('td');
            tdPass.style.padding = '12px 8px';
            const passGroup = document.createElement('div');
            passGroup.style.cssText = 'display:flex; gap:6px; align-items:center;';
            const passInput = document.createElement('input');
            passInput.type = 'password';
            passInput.placeholder = '新口令 (≥8位)';
            passInput.style.cssText = 'width:120px; padding:4px 8px; border:1px solid #ccc; border-radius:4px;';
            const resetBtn = document.createElement('button');
            resetBtn.className = 'btn small';
            resetBtn.innerHTML = '<i class="fas fa-key"></i> 重置';
            resetBtn.onclick = async () => {
                if ((passInput.value || '').length < 8) {
                    alert('口令至少 8 位');
                    return;
                }
                try {
                    const done = await fetch('/api/admin/users/' + encodeURIComponent(user.username) + '/password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: passInput.value })
                    });
                    const body = await done.json();
                    alert(body.message || (done.ok ? '已重置' : '失败'));
                    if (done.ok) passInput.value = '';
                } catch (err) {
                    alert('重置失败: ' + err.message);
                }
            };
            passGroup.append(passInput, resetBtn);
            tdPass.appendChild(passGroup);

            tr.append(tdName, tdQuota, tdRole, tdSave, tdPass);
            tbody.appendChild(tr);
        });

        box.appendChild(table);
    } catch (err) {
        box.innerHTML = `<p class="error" style="text-align:center; padding:20px;">无法读取用户: ${escapeHtml(err.message)}</p>`;
    }
}

