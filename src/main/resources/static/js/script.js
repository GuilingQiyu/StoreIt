function initFloatingBackground() {
  const floatingBg = document.querySelector('.floating-bg');
  if (!floatingBg) return;
  floatingBg.innerHTML='';
  for (let i=0;i<3;i++){ const d=document.createElement('div'); floatingBg.appendChild(d);} }

function showToast(message, type='info', ms=3500) {
  let box = document.getElementById('toast-container');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast-container';
    box.className = 'toast-container';
    document.body.appendChild(box);
  }
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = message;
  box.appendChild(el);
  setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 300); }, ms);
}


/* ---- In-app dialogs (replace prompt/confirm) ---- */
let _dialogResolver = null;
let _dialogMode = 'confirm';

function ensureAppDialog() {
  let modal = document.getElementById('appDialogModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'appDialogModal';
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'appDialogTitle');
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="appDialogTitle">提示</h2>
        <span class="close" id="appDialogClose" title="关闭" aria-label="关闭">&times;</span>
      </div>
      <div class="modal-body">
        <p id="appDialogMessage"></p>
        <div class="form-group" id="appDialogInputWrap" style="display:none;">
          <label for="appDialogInput" id="appDialogInputLabel">名称</label>
          <input type="text" id="appDialogInput" autocomplete="off">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn small" id="appDialogCancel">取消</button>
        <button type="button" class="btn small" id="appDialogConfirm">确定</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  wireAppDialog(modal);
  return modal;
}

function wireAppDialog(modal) {
  if (modal.dataset.wired === '1') return;
  modal.dataset.wired = '1';
  const close = () => finishAppDialog(null);
  const closeBtn = modal.querySelector('#appDialogClose');
  const cancelBtn = modal.querySelector('#appDialogCancel');
  const confirmBtn = modal.querySelector('#appDialogConfirm');
  const input = modal.querySelector('#appDialogInput');
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (cancelBtn) cancelBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    if (_dialogMode === 'prompt') {
      const val = (input && input.value != null) ? input.value.trim() : '';
      finishAppDialog(val);
    } else {
      finishAppDialog(true);
    }
  });
  if (input) input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirmBtn && confirmBtn.click();
    }
  });
}

function finishAppDialog(value) {
  const modal = document.getElementById('appDialogModal');
  if (modal) closeModalEl(modal);
  const r = _dialogResolver;
  _dialogResolver = null;
  if (r) r(value);
}

function showAppConfirm({ title = '确认', message = '', confirmText = '确定', cancelText = '取消', danger = false } = {}) {
  const modal = ensureAppDialog();
  wireAppDialog(modal);
  _dialogMode = 'confirm';
  modal.querySelector('#appDialogTitle').textContent = title;
  modal.querySelector('#appDialogMessage').textContent = message;
  modal.querySelector('#appDialogInputWrap').style.display = 'none';
  const cancelBtn = modal.querySelector('#appDialogCancel');
  const confirmBtn = modal.querySelector('#appDialogConfirm');
  cancelBtn.textContent = cancelText;
  confirmBtn.textContent = confirmText;
  confirmBtn.classList.toggle('modal-danger-confirm', !!danger);
  confirmBtn.classList.toggle('delete-btn', !!danger);
  return new Promise((resolve) => {
    _dialogResolver = (v) => resolve(!!v);
    openModalEl(modal);
    setTimeout(() => confirmBtn.focus(), 30);
  });
}

function showAppPrompt({ title = '输入', message = '', defaultValue = '', placeholder = '', confirmText = '确定', cancelText = '取消', label = '名称' } = {}) {
  const modal = ensureAppDialog();
  wireAppDialog(modal);
  _dialogMode = 'prompt';
  modal.querySelector('#appDialogTitle').textContent = title;
  modal.querySelector('#appDialogMessage').textContent = message;
  const wrap = modal.querySelector('#appDialogInputWrap');
  const input = modal.querySelector('#appDialogInput');
  const labelEl = modal.querySelector('#appDialogInputLabel');
  wrap.style.display = 'block';
  if (labelEl) labelEl.textContent = label;
  input.value = defaultValue || '';
  input.placeholder = placeholder || '';
  const cancelBtn = modal.querySelector('#appDialogCancel');
  const confirmBtn = modal.querySelector('#appDialogConfirm');
  cancelBtn.textContent = cancelText;
  confirmBtn.textContent = confirmText;
  confirmBtn.classList.remove('modal-danger-confirm', 'delete-btn');
  return new Promise((resolve) => {
    _dialogResolver = (v) => resolve(v);
    openModalEl(modal);
    setTimeout(() => { input.focus(); input.select(); }, 30);
  });
}

function openModalEl(modal) {
  if (!modal) return;
  modal.classList.add('is-open');
  modal.style.display = 'flex';
  document.body.classList.add('modal-open');
  const panel = document.getElementById('upload-queue-panel');
  if (panel && !panel.classList.contains('collapsed')) {
    panel.dataset.wasExpanded = '1';
    panel.classList.add('collapsed');
  }
}

function closeModalEl(modal) {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.style.display = 'none';
  const anyOpen = document.querySelector('.modal.is-open');
  if (!anyOpen) {
    document.body.classList.remove('modal-open');
    const panel = document.getElementById('upload-queue-panel');
    if (panel && panel.dataset.wasExpanded === '1') {
      // keep collapsed after modal; user can expand
      delete panel.dataset.wasExpanded;
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const dialog = document.getElementById('appDialogModal');
  if (dialog && dialog.classList.contains('is-open')) {
    e.preventDefault();
    finishAppDialog(null);
    return;
  }
  const share = document.getElementById('shareModal');
  if (share && share.classList.contains('is-open')) {
    e.preventDefault();
    closeModalEl(share);
    return;
  }
  const preview = document.getElementById('previewModal');
  if (preview && (preview.classList.contains('is-open') || preview.style.display === 'block' || preview.style.display === 'flex')) {
    e.preventDefault();
    closeModalEl(preview);
  }
});

function setupLoginForm(){
  const form=document.getElementById('loginForm');
  if(!form) return;
  const btn = document.getElementById('loginSubmitBtn') || form.querySelector('button[type="submit"]');
  const msg=document.getElementById('messageArea');
  const setBusy = (busy) => {
    if(!btn) return;
    btn.disabled = !!busy;
    btn.classList.toggle('loading', !!busy);
    btn.textContent = busy ? '登录中…' : '登录';
  };
  const showLoginError = (text) => {
    if(msg){
      msg.style.display='block';
      msg.className='message error';
      msg.textContent=text;
    }
    showToast(text, 'error', 4500);
  };
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd=new FormData(form);
    if(msg){ msg.style.display='none'; msg.textContent=''; msg.className='message'; }
    setBusy(true);
    try{
      const res=await fetch('/api/login',{method:'POST',body:fd});
      let data={};
      try { data = await res.json(); } catch(_) { data = {}; }
      const message = data.message || (res.ok ? '登录成功' : '登录失败，无效的用户名或密码');
      if(msg){
        msg.style.display='block';
        msg.textContent=message;
        msg.className='message '+(res.ok?'success':'error');
      }
      if(res.ok){
        showToast(message, 'success', 2000);
        const must = data.data && data.data.must_change_password;
        setTimeout(()=>{ window.location.href = must ? '/change-password' : '/'; },800);
      } else {
        showToast(message, 'error', 4500);
        setBusy(false);
        const pw = document.getElementById('password');
        if(pw){ pw.focus(); pw.select(); }
      }
    }catch(err){
      showLoginError('登录请求失败，请检查网络后重试');
      setBusy(false);
    }
  });
}

function setupChangePasswordForm(){
  const form=document.getElementById('changePasswordForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd=new FormData(form);
    const msg=document.getElementById('messageArea');
    const np=fd.get('newPassword'); const cp=fd.get('confirmPassword');
    if(np !== cp){ msg.style.display='block'; msg.className='message error'; msg.textContent='两次输入的新密码不一致'; return; }
    const body=new FormData();
    body.append('currentPassword', fd.get('currentPassword'));
    body.append('newPassword', np);
    try{
      const res=await fetch('/api/change-password',{method:'POST',body});
      const data=await res.json();
      msg.style.display='block'; msg.textContent=data.message; msg.className='message '+(res.ok?'success':'error');
      if(res.ok) setTimeout(()=>{ window.location.href='/'; },1000);
    }catch(err){ msg.style.display='block'; msg.className='message error'; msg.textContent='请求失败'; }
  });
}

function setupRefreshButton(){ const b=document.getElementById('refreshBtn'); if(!b) return; b.addEventListener('click',e=>{e.preventDefault(); location.reload();}); }

function formatFileSize(bytes){ if(bytes===0) return '0 Bytes'; if(!bytes && bytes!==0) return '-'; const k=1024; const sizes=['Bytes','KB','MB','GB','TB']; const i=Math.floor(Math.log(bytes)/Math.log(k)); return (bytes/Math.pow(k,i)).toFixed(2)+' '+sizes[i]; }

const PREVIEW_IMAGE_EXTS = ['jpg','jpeg','png','gif','webp','bmp','svg'];
const PREVIEW_VIDEO_EXTS = ['mp4','webm','ogg','ogv','mov'];
const PREVIEW_TEXT_EXTS = ['txt','log','md','csv','ini','conf','yml','yaml','json','xml','html','htm','css','js','java','py','c','cpp','h','go','rs','sh','sql'];

function getFileExt(name){ return (name.includes('.') ? name.split('.').pop() : '').toLowerCase(); }
function isPreviewable(name){
    const ext = getFileExt(name);
    return PREVIEW_IMAGE_EXTS.includes(ext) || PREVIEW_VIDEO_EXTS.includes(ext) || PREVIEW_TEXT_EXTS.includes(ext);
}

let currentUserRole = '';

function loadUserStatus(){
    const el=document.getElementById('sidebarUser');
    fetch('/api/user/status').then(r=>r.json()).then(d=>{
        currentUserRole = d.role || '';
        if(el){
            el.innerHTML = d.logged_in ?
                `<div style="display:flex; align-items:center; gap:10px; width:100%; justify-content:space-between;">
                    <span style="overflow:hidden; text-overflow:ellipsis;"><i class="fas fa-user-circle"></i> ${escapeHtml(d.username)}${d.role==='ADMIN'?' <span class="role-badge">ADMIN</span>':''}</span>
                    <i class="fas fa-sign-out-alt" id="logoutBtn" style="cursor:pointer; color:var(--error-color);" title="退出"></i>
                 </div>` :
                `<a href="/login" class="btn small">登录</a>`;
            const lb=document.getElementById('logoutBtn');
            if(lb){ lb.addEventListener('click', async ()=>{ await fetch('/api/logout',{method:'POST'}); location.href='/login'; }); }
        }
        const navAdmin = document.getElementById('navAdmin');
        if(navAdmin) navAdmin.style.display = (d.role === 'ADMIN') ? '' : 'none';
        const adminSharesWrap = document.getElementById('adminSharesToggleWrap');
        if(adminSharesWrap) adminSharesWrap.style.display = (d.role === 'ADMIN') ? '' : 'none';
        if (location.pathname === '/admin' || location.pathname === '/admin.html') {
            if(!d.logged_in) location.href='/login';
            else if(d.must_change_password) location.href='/change-password';
            else if(d.role !== 'ADMIN'){ showToast('需要管理员权限','error'); setTimeout(()=>location.href='/',800); }
        }
    }).catch(()=>{ if(el) el.innerHTML='<p>获取用户状态失败</p>'; });
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

let currentPath = '';
let uploadQueue = [];
let isUploading = false;
let contextMenuTarget = null;
let selectedFileItem = null;
let currentView = 'files';

document.addEventListener('DOMContentLoaded', function(){
    const path = window.location.pathname;
    if (path === '/login' || path === '/login.html') {
        fetch('/api/user/status').then(r=>r.json()).then(d=>{
            if(d.logged_in) window.location.href = d.must_change_password ? '/change-password' : '/';
        });
    } else if (path === '/change-password' || path === '/change-password.html') {
        fetch('/api/user/status').then(r=>r.json()).then(d=>{
            if(!d.logged_in) window.location.href='/login';
            else if(!d.must_change_password) window.location.href='/';
        });
    } else if (path === '/' || path === '/list' || path === '/list.html') {
        fetch('/api/user/status').then(r=>r.json()).then(d=>{
            if(!d.logged_in) window.location.href='/login';
            else if(d.must_change_password) window.location.href='/change-password';
        });
    }

    initFloatingBackground();
    setupLoginForm();
    setupChangePasswordForm();
    setupRefreshButton();
    loadUserStatus();
    setupShareModal();
    setupNavigation();
    setupListPageChrome();
    setupAdminPage();

    if(document.getElementById('file-grid-view')){
        loadFileList();
        loadStorageUsage();
        setupContextMenu();
        setupFAB();
        setupUploadQueue();
    }
});

function setupListPageChrome() {
    const mobile = document.getElementById('mobileMenuToggle');
    if(mobile) mobile.addEventListener('click', toggleSidebar);
    const queueHeader = document.getElementById('queueHeader');
    if(queueHeader) queueHeader.addEventListener('click', (e) => {
        if(e.target.closest('#clearUploadsBtn')) return;
        toggleQueuePanel();
    });
    const clearBtn = document.getElementById('clearUploadsBtn');
    if(clearBtn) clearBtn.addEventListener('click', (e) => { e.stopPropagation(); clearCompletedUploads(e); });
    const refreshShares = document.getElementById('refreshSharesBtn');
    if(refreshShares) refreshShares.addEventListener('click', () => loadSharesList());
    const adminToggle = document.getElementById('adminSharesToggle');
    if(adminToggle) adminToggle.addEventListener('change', () => loadSharesList());
    const goUp = document.getElementById('btnGoUp');
    if(goUp) goUp.addEventListener('click', () => {
        if(!currentPath) return;
        const parent = currentPath.includes('/') ? currentPath.substring(0, currentPath.lastIndexOf('/')) : '';
        loadFileList(parent);
    });
    const quickUpload = document.getElementById('btnQuickUpload');
    if(quickUpload) quickUpload.addEventListener('click', () => triggerUpload('file'));
    const quickFolder = document.getElementById('btnQuickFolder');
    if(quickFolder) quickFolder.addEventListener('click', () => createNewFolderUI());
    // ensure dialog exists on list page
    if(document.getElementById('appDialogModal')) wireAppDialog(document.getElementById('appDialogModal'));
}

function setupNavigation() {
    const menu = document.getElementById('sidebarMenu');
    if(!menu) return;
    menu.querySelectorAll('[data-nav]').forEach(item => {
        item.addEventListener('click', () => {
            const nav = item.dataset.nav;
            menu.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            if(nav === 'files') showFilesView();
            else if(nav === 'shares') showSharesView();
            else if(nav === 'admin') window.location.href = '/admin';
            else if(nav === 'about') window.location.href = '/about';
        });
    });
}

function showFilesView() {
    currentView = 'files';
    const filesPane = document.getElementById('filesPane');
    const sharesPane = document.getElementById('sharesPane');
    const title = document.getElementById('mainTitle');
    if(filesPane) filesPane.style.display = '';
    if(sharesPane) sharesPane.style.display = 'none';
    if(title) title.textContent = '文件列表';
    const fab = document.querySelector('.fab-container');
    if(fab) fab.style.display = '';
}

function showSharesView() {
    currentView = 'shares';
    const filesPane = document.getElementById('filesPane');
    const sharesPane = document.getElementById('sharesPane');
    const title = document.getElementById('mainTitle');
    if(filesPane) filesPane.style.display = 'none';
    if(sharesPane) sharesPane.style.display = '';
    if(title) title.textContent = '我的分享';
    const fab = document.querySelector('.fab-container');
    if(fab) fab.style.display = 'none';
    loadSharesList();
}

function formatExpiry(expiry) {
    if(expiry == null) return '永久';
    const t = Number(expiry) * 1000;
    const d = new Date(t);
    const expired = Date.now() > t;
    return d.toLocaleString() + (expired ? '（已过期）' : '');
}

async function loadSharesList() {
    const listEl = document.getElementById('shares-list');
    const emptyEl = document.getElementById('shares-empty');
    if(!listEl) return;
    listEl.innerHTML = '<p style="text-align:center;color:#888;">加载中...</p>';
    if(emptyEl) emptyEl.style.display = 'none';
    const adminAll = document.getElementById('adminSharesToggle');
    const useAdmin = adminAll && adminAll.checked && currentUserRole === 'ADMIN';
    try {
        const res = await fetch(useAdmin ? '/api/admin/shares' : '/api/shares');
        const data = await res.json();
        if(!res.ok || data.success === false) {
            listEl.innerHTML = `<p class="error">${escapeHtml(data.message || '加载失败')}</p>`;
            return;
        }
        const shares = data.data || [];
        if(shares.length === 0) {
            listEl.innerHTML = '';
            if(emptyEl) emptyEl.style.display = 'block';
            return;
        }
        listEl.innerHTML = '';
        shares.forEach(s => {
            const card = document.createElement('div');
            card.className = 'share-card' + (s.active ? '' : ' inactive');
            const rem = s.remainingDownloads == null ? '不限' : String(s.remainingDownloads);
            const max = s.maxDownloads == null || s.maxDownloads <= 0 ? '不限' : String(s.maxDownloads);
            const url = location.origin + s.url;
            card.innerHTML = `
              <div class="share-card-main">
                <div class="share-path" title="${escapeHtml(s.filePath)}"><i class="fas fa-file"></i> ${escapeHtml(s.filePath)}</div>
                <div class="share-meta">
                  <span><i class="fas fa-clock"></i> ${escapeHtml(formatExpiry(s.expiry))}</span>
                  <span><i class="fas fa-download"></i> ${s.downloads||0} / ${max}（剩余 ${rem}）</span>
                  <span class="share-status ${s.active?'ok':'bad'}">${s.active?'有效':'失效'}</span>
                </div>
                <div class="share-url-row">
                  <input type="text" readonly value="${escapeHtml(url)}" class="share-url-input">
                  <button type="button" class="btn small copy-share-btn">复制</button>
                  <button type="button" class="btn small delete-btn revoke-share-btn">撤销</button>
                </div>
              </div>`;
            card.querySelector('.share-url-input').addEventListener('click', function(){ this.select(); });
            card.querySelector('.copy-share-btn').addEventListener('click', async () => {
                try { await navigator.clipboard.writeText(url); showToast('已复制链接','success'); }
                catch { showToast('复制失败，请手动选择','error'); }
            });
            card.querySelector('.revoke-share-btn').addEventListener('click', () => revokeShare(s.id));
            listEl.appendChild(card);
        });
    } catch(err) {
        listEl.innerHTML = `<p class="error">网络错误: ${escapeHtml(err.message)}</p>`;
        showToast('加载分享失败','error');
    }
}

async function revokeShare(id) {
    const ok = await showAppConfirm({
        title: '撤销分享',
        message: '确定撤销该分享链接？撤销后链接将立即失效。',
        confirmText: '撤销',
        cancelText: '取消',
        danger: true
    });
    if(!ok) return;
    try {
        const res = await fetch('/api/shares/' + id, { method: 'DELETE' });
        const data = await res.json();
        if(res.ok && data.success !== false) {
            showToast('已撤销分享','success');
            loadSharesList();
        } else {
            showToast(data.message || '撤销失败','error');
        }
    } catch(err) {
        showToast('网络错误','error');
    }
}

function loadFileList(path=''){
  const gridView = document.getElementById('file-grid-view');
  const emptyState = document.getElementById('empty-state');
  if(!gridView) return;

  gridView.innerHTML = '<p style="text-align:center; width:100%;">加载中...</p>';
  if(emptyState) emptyState.style.display = 'none';

  fetch(`/api/files?path=${encodeURIComponent(path)}`).then(r=>r.json()).then(data=>{
    if(data.error){
        gridView.innerHTML=`<p class="error">错误: ${escapeHtml(data.error)}</p>`;
        showToast(data.error,'error');
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
        if(emptyState) emptyState.style.display = 'block';
    } else {
        if(emptyState) emptyState.style.display = 'none';
        renderFileGrid(items);
    }

  }).catch(err=>{
      gridView.innerHTML=`<p class="error">加载失败: ${escapeHtml(err.message)}</p>`;
      showToast('文件列表加载失败','error');
  });
}

function renderBreadcrumb(path) {
    const container = document.getElementById('breadcrumb');
    if(!container) return;
    container.innerHTML = '';
    const home = document.createElement('div');
    home.className = 'breadcrumb-item';
    home.innerHTML = '<i class="fas fa-home"></i>';
    home.title = '根目录';
    home.addEventListener('click', () => loadFileList(''));
    container.appendChild(home);

    if(path) {
        const parts = path.split('/');
        let current = '';
        parts.forEach((part, index) => {
            current += (index === 0 ? '' : '/') + part;
            const sep = document.createElement('span');
            sep.className = 'breadcrumb-separator';
            sep.textContent = '/';
            container.appendChild(sep);
            const crumb = document.createElement('div');
            crumb.className = 'breadcrumb-item' + (index === parts.length - 1 ? ' active' : '');
            crumb.textContent = part;
            if(index !== parts.length - 1) {
                const target = current;
                crumb.addEventListener('click', () => loadFileList(target));
            }
            container.appendChild(crumb);
        });
    }
    const goUp = document.getElementById('btnGoUp');
    if(goUp) {
        if(path) goUp.removeAttribute('hidden');
        else goUp.setAttribute('hidden', '');
    }
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
            <div class="file-card-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
        `;

        card.addEventListener('click', () => {
            if(item.isDirectory) loadFileList(item.path);
            else selectFile(item, card);
        });
        card.addEventListener('dblclick', () => {
            if(item.isDirectory) loadFileList(item.path);
            else if(isPreviewable(item.name)) previewFile(item.path, item.name);
        });
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            selectFile(item, card);
            showContextMenu(e.pageX, e.pageY, item);
        });
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
    document.querySelectorAll('.file-card').forEach(c => c.classList.remove('selected'));
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
        empty.style.display = 'none';
        content.style.display = 'block';
        document.getElementById('detailIcon').innerHTML = '<i class="fas fa-folder" style="color:#f0ad4e"></i>';
        document.getElementById('detailName').textContent = item.name;
        document.getElementById('detailType').textContent = '文件夹';
        document.getElementById('detailSize').textContent = '-';
        document.getElementById('detailModified').textContent = item.modified ? new Date(item.modified * 1000).toLocaleString() : '-';
        document.getElementById('btnDownload').style.display = 'none';
    } else {
        empty.style.display = 'none';
        content.style.display = 'block';
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
        document.getElementById('detailModified').textContent = item.modified ? new Date(item.modified * 1000).toLocaleString() : '-';
        document.getElementById('btnDownload').style.display = 'inline-block';
    }

    const btnPreview = document.getElementById('btnPreview');
    const btnDownload = document.getElementById('btnDownload');
    const btnShare = document.getElementById('btnShare');
    const btnRename = document.getElementById('btnRename');
    const btnDelete = document.getElementById('btnDelete');

    if(btnPreview) {
        if(!item.isDirectory && isPreviewable(item.name)) {
            btnPreview.style.display = 'inline-block';
            btnPreview.onclick = () => previewFile(item.path, item.name);
        } else {
            btnPreview.style.display = 'none';
        }
    }
    btnDownload.onclick = () => window.open(`/storage/${item.path}`, '_blank');
    btnShare.onclick = () => openShareModal(item.path);
    btnRename.onclick = () => renameFile(item.path, item.name);
    btnDelete.onclick = () => deleteFile(item.path);
}

function setupContextMenu() {
    const menu = document.getElementById('context-menu');
    if(!menu) return;
    document.addEventListener('click', (e) => {
        if(!menu.contains(e.target)) menu.style.display = 'none';
    });
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if(contextMenuTarget) handleMenuAction(action, contextMenuTarget);
            menu.style.display = 'none';
        });
    });
}

function showContextMenu(x, y, item) {
    const menu = document.getElementById('context-menu');
    contextMenuTarget = item;
    menu.style.display = 'block';
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
            if(item.isDirectory) showToast('暂不支持文件夹下载','info');
            else window.open(`/storage/${item.path}`, '_blank');
            break;
        case 'share':
            openShareModal(item.path);
            break;
        case 'details':
            showToast(`${item.name} · ${formatFileSize(item.size)}`,'info');
            break;
        case 'rename':
            renameFile(item.path, item.name);
            break;
        case 'delete':
            deleteFile(item.path);
            break;
    }
}

function setupFAB() {
    const fabMain = document.getElementById('fabMain');
    const fabContainer = document.querySelector('.fab-container');
    if(!fabMain || !fabContainer) return;
    const setFabOpen = (open) => {
        fabContainer.classList.toggle('active', open);
        fabMain.classList.toggle('active', open);
        fabMain.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    fabMain.addEventListener('click', () => {
        setFabOpen(!fabContainer.classList.contains('active'));
    });
    document.addEventListener('click', (e) => {
        if(!fabContainer.contains(e.target)) setFabOpen(false);
    });
    fabContainer.querySelectorAll('[data-fab]').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.dataset.fab;
            if(t === 'file' || t === 'folder') triggerUpload(t);
            else if(t === 'mkdir') createNewFolderUI();
        });
    });
}

function triggerUpload(type) {
    if(type === 'file') document.getElementById('fileInput').click();
    else if(type === 'folder') document.getElementById('folderInput').click();
    document.querySelector('.fab-container').classList.remove('active');
    document.getElementById('fabMain').classList.remove('active');
}

function createNewFolderUI() {
    createNewFolder(currentPath);
    document.querySelector('.fab-container').classList.remove('active');
    document.getElementById('fabMain').classList.remove('active');
}

function setupUploadQueue() {
    const fileInput = document.getElementById('fileInput');
    const folderInput = document.getElementById('folderInput');
    if(!fileInput || !folderInput) return;
    const handleSelect = (e) => {
        const files = Array.from(e.target.files);
        if(files.length > 0) {
            addToUploadQueue(files);
            e.target.value = '';
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
    panel.classList.remove('hidden-empty');

    files.forEach(file => {
        const id = Date.now() + Math.random().toString(36).substr(2, 9);
        const item = { id, file, path: currentPath, status: 'pending', progress: 0, error: null };
        uploadQueue.push(item);
        const el = document.createElement('div');
        el.className = 'queue-item';
        el.id = `queue-item-${id}`;
        el.innerHTML = `
            <div class="queue-item-icon"><i class="fas fa-file"></i></div>
            <div class="queue-item-info">
                <div class="queue-item-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</div>
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

function parseUploadError(xhr) {
    let msg = '上传失败';
    try {
        const d = JSON.parse(xhr.responseText || '{}');
        if(d.error) msg = d.error;
        else if(d.message) msg = d.message;
        if(d.code === 'QUOTA_EXCEEDED' || xhr.status === 413) {
            msg = d.error || '存储配额不足，无法上传';
        }
    } catch(_) {
        if(xhr.status === 413) msg = '存储配额不足或文件过大（413）';
        else if(xhr.status === 401) msg = '未登录或会话已过期';
        else if(xhr.status === 403) msg = '无权限上传';
        else if(xhr.status === 0) msg = '网络错误';
        else msg = 'HTTP ' + xhr.status;
    }
    return msg;
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
            next.progress = percent;
        }
    };
    xhr.onload = () => {
        isUploading = false;
        if (xhr.status === 200) {
            let d = {};
            try { d = JSON.parse(xhr.responseText); } catch(_) {}
            if(d.error || d.success === false) {
                next.status = 'error';
                next.error = d.error || d.message || '失败';
                statusText.textContent = '失败: ' + next.error;
                statusText.style.color = 'var(--error-color)';
                fill.style.background = 'var(--error-color)';
                showToast(next.error, 'error');
            } else {
                next.status = 'success';
                statusText.textContent = '完成';
                statusText.style.color = 'var(--success-color)';
                fill.style.width = '100%';
                if(el) el.classList.add('done-fade');
                if(currentPath === next.path) loadFileList(currentPath);
                loadStorageUsage();
                scheduleUploadQueueCleanup();
            }
        } else {
            next.status = 'error';
            next.error = parseUploadError(xhr);
            statusText.textContent = '失败: ' + next.error;
            statusText.style.color = 'var(--error-color)';
            fill.style.background = 'var(--error-color)';
            showToast(next.error, 'error', 5000);
        }
        updateQueueSummary();
        processUploadQueue();
    };
    xhr.onerror = () => {
        isUploading = false;
        next.status = 'error';
        next.error = '网络错误，请检查连接后重试';
        statusText.textContent = next.error;
        statusText.style.color = 'var(--error-color)';
        fill.style.background = 'var(--error-color)';
        showToast(next.error, 'error');
        updateQueueSummary();
        processUploadQueue();
    };
    xhr.ontimeout = () => {
        isUploading = false;
        next.status = 'error';
        next.error = '上传超时';
        statusText.textContent = next.error;
        statusText.style.color = 'var(--error-color)';
        showToast(next.error, 'error');
        updateQueueSummary();
        processUploadQueue();
    };
    xhr.send(fd);
}

let _queueCleanupTimer = null;

function updateQueueSummary() {
    const pending = uploadQueue.filter(i => i.status === 'pending' || i.status === 'uploading').length;
    const errors = uploadQueue.filter(i => i.status === 'error').length;
    const done = uploadQueue.filter(i => i.status === 'success').length;
    const summary = document.getElementById('queue-summary');
    const panel = document.getElementById('upload-queue-panel');
    if(!summary) return;
    if(pending > 0) summary.textContent = `${pending} 个文件正在上传`;
    else if(errors > 0) summary.textContent = `完成（${errors} 失败）`;
    else if(done > 0) summary.textContent = `上传完成`;
    else summary.textContent = '';
    if(panel) {
        if(uploadQueue.length === 0) panel.classList.add('hidden-empty');
        else panel.classList.remove('hidden-empty');
    }
}

function toggleQueuePanel() {
    const panel = document.getElementById('upload-queue-panel');
    if(!panel) return;
    panel.classList.toggle('collapsed');
}

function scheduleUploadQueueCleanup() {
    if(_queueCleanupTimer) clearTimeout(_queueCleanupTimer);
    _queueCleanupTimer = setTimeout(() => {
        const busy = uploadQueue.some(i => i.status === 'pending' || i.status === 'uploading');
        if(busy) return;
        // remove successful items after short delay; keep errors until dismissed
        const list = document.getElementById('queue-list');
        const keep = [];
        uploadQueue.forEach(i => {
            if(i.status === 'success') {
                const el = document.getElementById(`queue-item-${i.id}`);
                if(el) el.remove();
            } else {
                keep.push(i);
            }
        });
        uploadQueue = keep;
        if(uploadQueue.length === 0) {
            if(list) {
                const empty = list.querySelector('.queue-empty-state');
                if(empty) empty.style.display = 'block';
            }
            const panel = document.getElementById('upload-queue-panel');
            if(panel) {
                panel.classList.add('collapsed');
                panel.classList.add('hidden-empty');
            }
        } else {
            // auto-collapse when only finished/errors remain
            const panel = document.getElementById('upload-queue-panel');
            if(panel) panel.classList.add('collapsed');
        }
        updateQueueSummary();
    }, 2800);
}

function clearCompletedUploads(e) {
    if(e) e.stopPropagation();
    uploadQueue = uploadQueue.filter(i => i.status === 'pending' || i.status === 'uploading');
    const list = document.getElementById('queue-list');
    if(!list) return;
    Array.from(list.children).forEach(child => {
        if(child.classList.contains('queue-empty-state')) return;
        const id = child.id.replace('queue-item-', '');
        const item = uploadQueue.find(i => i.id === id);
        if(!item) child.remove();
    });
    if(uploadQueue.length === 0) {
        const empty = list.querySelector('.queue-empty-state');
        if(empty) empty.style.display = 'block';
        const panel = document.getElementById('upload-queue-panel');
        if(panel) {
            panel.classList.add('collapsed');
            panel.classList.add('hidden-empty');
        }
    }
    updateQueueSummary();
}

async function createNewFolder(path) {
    const name = await showAppPrompt({
        title: '新建文件夹',
        message: '请输入文件夹名称',
        label: '文件夹名称',
        placeholder: '新建文件夹',
        confirmText: '创建',
        cancelText: '取消'
    });
    if (name == null) return;
    if (!name) { showToast('请输入文件夹名称','error'); return; }
    const newPath = path ? path + "/" + name : name;
    try {
        const r = await fetch('/api/folder/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({path: newPath})
        });
        const d = await r.json().catch(()=>({}));
        if(r.status === 413 || d.code === 'QUOTA_EXCEEDED') {
            showToast(d.error || '配额不足','error');
        } else if(d.success) {
            loadFileList(path);
            showToast('文件夹已创建','success');
        } else {
            showToast(d.error || '创建失败','error');
        }
    } catch(err) {
        showToast('网络错误','error');
    }
}

async function deleteFile(path) {
    const name = path.includes('/') ? path.substring(path.lastIndexOf('/') + 1) : path;
    const ok = await showAppConfirm({
        title: '删除确认',
        message: `确定要删除「${name}」吗？此操作不可恢复。`,
        confirmText: '删除',
        cancelText: '取消',
        danger: true
    });
    if (!ok) return;
    try {
        const r = await fetch('/api/file/delete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({path: path})
        });
        const d = await r.json();
        if(d.success) {
            const parent = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
            loadFileList(parent);
            loadStorageUsage();
            showToast('已删除','success');
        } else showToast(d.error || '删除失败','error');
    } catch(err) {
        showToast('网络错误','error');
    }
}

async function renameFile(path, oldName) {
    const newName = await showAppPrompt({
        title: '重命名',
        message: '请输入新名称',
        label: '新名称',
        defaultValue: oldName || '',
        confirmText: '保存',
        cancelText: '取消'
    });
    if (newName == null) return;
    if (!newName) { showToast('名称不能为空','error'); return; }
    if (newName === oldName) return;
    try {
        const r = await fetch('/api/file/rename', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({path: path, newName: newName})
        });
        const d = await r.json();
        if(d.success) {
            const parent = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
            loadFileList(parent);
            showToast('已重命名','success');
        } else showToast(d.error || '重命名失败','error');
    } catch(err) {
        showToast('网络错误','error');
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
            const MAX = 200000;
            let truncated = false;
            if(txt.length > MAX){ txt = txt.slice(0, MAX); truncated = true; }
            const note = truncated ? '<p style="color:#f0ad4e; text-align:left;">内容过大，仅显示前 200,000 字符。</p>' : '';
            const content = document.getElementById('previewContent');
            if(content){
                content.innerHTML = note;
                const pre = document.createElement('pre');
                pre.style.cssText = 'text-align:left; max-height:70vh; overflow:auto; white-space:pre-wrap; word-break:break-word; background:#f7f7f9; padding:12px; border-radius:8px; font-size:13px;';
                pre.textContent = txt;
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
        modal.innerHTML = `<div class="modal-content modal-wide" style="text-align:center;">
            <div class="modal-header">
              <h2 id="previewTitle"></h2>
              <span class="close" data-close-modal="previewModal" title="关闭" aria-label="关闭">&times;</span>
            </div>
            <div class="modal-body" id="previewContent"></div>
        </div>`;
        document.body.appendChild(modal);
        modal.querySelector('[data-close-modal]').addEventListener('click', () => closeModalEl(modal));
        modal.addEventListener('click', (event) => { if (event.target === modal) closeModalEl(modal); });
    }
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewContent').innerHTML = content;
    openModalEl(modal);
}

function openShareModal(path) {
    const modal = document.getElementById('shareModal');
    const nameSpan = document.getElementById('modalFileName');
    const pathInput = document.getElementById('modalFilePath');
    const resultDiv = document.getElementById('shareResult');
    const maxInput = document.getElementById('maxDownloadsInput');
    const footer = document.getElementById('shareModalFooter');
    if(!modal || !nameSpan || !pathInput) return;
    nameSpan.textContent = path.split('/').pop();
    pathInput.value = path;
    if(resultDiv) resultDiv.innerHTML = '';
    if(maxInput) maxInput.value = '';
    if(footer) {
        footer.querySelectorAll('.share-copy-btn').forEach(el => el.remove());
        const createBtn = document.getElementById('createShareBtn');
        if(createBtn) createBtn.style.display = '';
    }
    openModalEl(modal);
}

function setupShareModal() {
    const modal = document.getElementById('shareModal');
    if(!modal) return;
    const closeBtn = modal.querySelector('[data-close-modal], .close');
    const expireSelect = document.getElementById('expireSelect');
    const customExpire = document.getElementById('customExpire');
    const createBtn = document.getElementById('createShareBtn');
    if(closeBtn) closeBtn.addEventListener('click', () => closeModalEl(modal));
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModalEl(modal); });
    if(expireSelect) {
        expireSelect.addEventListener('change', () => {
            customExpire.style.display = expireSelect.value === 'custom' ? 'block' : 'none';
        });
    }
    if(createBtn) {
        createBtn.addEventListener('click', async () => {
            const path = document.getElementById('modalFilePath').value;
            let expireHours = expireSelect.value;
            if(expireHours === 'custom') {
                expireHours = customExpire.value;
                if(!expireHours || expireHours <= 0) {
                    showToast('请输入有效的小时数','error');
                    return;
                }
            }
            const maxRaw = document.getElementById('maxDownloadsInput');
            let maxDownloads = null;
            if(maxRaw && maxRaw.value !== '' && maxRaw.value != null) {
                maxDownloads = parseInt(maxRaw.value, 10);
                if(!maxDownloads || maxDownloads < 1) {
                    showToast('最大下载次数须为正整数','error');
                    return;
                }
            }
            const body = {
                filePath: path,
                expireHours: parseInt(expireHours, 10),
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
                    const url = location.origin + (data.data.url || ('/d/' + data.data.token));
                    resultDiv.innerHTML = '';
                    const p = document.createElement('p');
                    p.className = 'success';
                    p.textContent = '分享链接已生成：';
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = url;
                    input.readOnly = true;
                    input.style.cssText = 'width:100%;padding:5px;';
                    input.addEventListener('click', function(){ this.select(); });
                    resultDiv.appendChild(p);
                    resultDiv.appendChild(input);
                    const footer = document.getElementById('shareModalFooter');
                    if(footer) {
                        footer.querySelectorAll('.share-copy-btn').forEach(el => el.remove());
                        const copy = document.createElement('button');
                        copy.type = 'button';
                        copy.className = 'btn small share-copy-btn';
                        copy.textContent = '复制链接';
                        copy.addEventListener('click', async () => {
                            try { await navigator.clipboard.writeText(url); showToast('已复制','success'); }
                            catch { input.select(); showToast('请手动复制','info'); }
                        });
                        footer.appendChild(copy);
                    }
                    showToast('分享已创建','success');
                } else {
                    resultDiv.innerHTML = `<p class="error">生成失败: ${escapeHtml(data.message || '未知错误')}</p>`;
                    showToast(data.message || '生成失败','error');
                }
            } catch(err) {
                resultDiv.innerHTML = `<p class="error">请求失败: ${escapeHtml(err.message)}</p>`;
                showToast('网络错误','error');
            }
        });
    }
}

/* ---- Admin page ---- */
function setupAdminPage() {
    const form = document.getElementById('createUserForm');
    const tableWrap = document.getElementById('usersTableWrap');
    if(!form && !tableWrap) return;

    const logout = document.getElementById('adminLogoutBtn');
    if(logout) logout.addEventListener('click', async () => {
        await fetch('/api/logout', {method:'POST'});
        location.href='/login';
    });
    const refresh = document.getElementById('refreshUsersBtn');
    if(refresh) refresh.addEventListener('click', loadAdminUsers);

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const body = {
                username: document.getElementById('newUsername').value.trim(),
                password: document.getElementById('newPassword').value,
                role: document.getElementById('newRole').value,
                storageQuota: parseInt(document.getElementById('newQuota').value || '0', 10)
            };
            try {
                const res = await fetch('/api/admin/users', {
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                if(res.ok && data.success) {
                    showToast('用户已创建','success');
                    form.reset();
                    document.getElementById('newQuota').value = '0';
                    loadAdminUsers();
                } else {
                    showToast(data.message || '创建失败','error');
                }
            } catch(err) {
                showToast('网络错误','error');
            }
        });
    }
    loadAdminUsers();
}

async function loadAdminUsers() {
    const wrap = document.getElementById('usersTableWrap');
    if(!wrap) return;
    wrap.innerHTML = '<p>加载中...</p>';
    try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if(!res.ok || data.success === false) {
            wrap.innerHTML = `<p class="error">${escapeHtml(data.message || '加载失败')}</p>`;
            return;
        }
        const users = data.data || [];
        if(users.length === 0) {
            wrap.innerHTML = '<div class="empty-state-panel"><i class="fas fa-users"></i><p>暂无用户</p></div>';
            return;
        }
        const table = document.createElement('table');
        table.className = 'admin-table';
        table.innerHTML = `<thead><tr>
            <th>ID</th><th>用户名</th><th>角色</th><th>配额(字节)</th><th>状态</th><th>操作</th>
          </tr></thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${u.id}</td>
              <td>${escapeHtml(u.username)}</td>
              <td>${escapeHtml(u.role||'')}</td>
              <td><input type="number" class="quota-input" min="0" value="${u.storageQuota||0}" style="width:140px;"></td>
              <td>${u.enabled ? '<span class="share-status ok">启用</span>' : '<span class="share-status bad">禁用</span>'}</td>
              <td class="admin-actions"></td>`;
            const actions = tr.querySelector('.admin-actions');
            const saveQuota = document.createElement('button');
            saveQuota.className = 'btn small';
            saveQuota.textContent = '保存配额';
            saveQuota.addEventListener('click', async () => {
                const q = parseInt(tr.querySelector('.quota-input').value, 10);
                const r = await fetch('/api/admin/users/' + encodeURIComponent(u.username) + '/quota', {
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({storageQuota: q})
                });
                const d = await r.json();
                showToast(d.message || (r.ok?'已更新':'失败'), r.ok?'success':'error');
            });
            const toggle = document.createElement('button');
            toggle.className = 'btn small ' + (u.enabled ? 'delete-btn' : '');
            toggle.textContent = u.enabled ? '禁用' : '启用';
            toggle.addEventListener('click', async () => {
                if(u.enabled) {
                    const ok = await showAppConfirm({
                        title: '禁用账号',
                        message: `禁用后用户「${u.username}」将无法登录，确定？`,
                        confirmText: '禁用',
                        cancelText: '取消',
                        danger: true
                    });
                    if(!ok) return;
                }
                const r = await fetch('/api/admin/users/' + encodeURIComponent(u.username) + '/enabled', {
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({enabled: !u.enabled})
                });
                const d = await r.json();
                showToast(d.message || (r.ok?'已更新':'失败'), r.ok?'success':'error');
                if(r.ok) loadAdminUsers();
            });
            actions.appendChild(saveQuota);
            actions.appendChild(toggle);
            tbody.appendChild(tr);
        });
        wrap.innerHTML = '';
        wrap.appendChild(table);
    } catch(err) {
        wrap.innerHTML = `<p class="error">网络错误</p>`;
    }
}
