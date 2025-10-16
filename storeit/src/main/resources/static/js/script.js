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
      if(res.ok){ setTimeout(()=>{ window.location.href='/list'; },800); }
    }catch(err){ msg.style.display='block'; msg.className='message error'; msg.textContent='登录请求失败'; }
  });
}

function setupRefreshButton(){ const b=document.getElementById('refreshBtn'); if(!b) return; b.addEventListener('click',e=>{e.preventDefault(); location.reload();}); }

function formatFileSize(bytes){ if(bytes===0) return '0 Bytes'; const k=1024; const sizes=['Bytes','KB','MB','GB','TB']; const i=Math.floor(Math.log(bytes)/Math.log(k)); return (bytes/Math.pow(k,i)).toFixed(2)+' '+sizes[i]; }

function loadUserStatus(){ const el=document.getElementById('userStatus'); if(!el) return; fetch('/api/user/status').then(r=>r.json()).then(d=>{ el.innerHTML = d.logged_in ? `<p>当前用户: ${d.username} <button id="logoutBtn" class="btn small">退出</button></p>` : `<p>未登录 <a href="/login" class="btn small">登录</a></p>`; const lb=document.getElementById('logoutBtn'); if(lb){ lb.onclick=async ()=>{ await fetch('/api/logout',{method:'POST'}); location.reload(); }; } }).catch(()=>{ el.innerHTML='<p>获取用户状态失败</p>'; }); }

function loadFileList(path=''){
  const container=document.getElementById('fileList'); if(!container) return; container.innerHTML='<p>加载中...</p>';
  fetch(`/api/files?path=${encodeURIComponent(path)}`).then(r=>r.json()).then(data=>{
    if(data.error){ container.innerHTML=`<p class="error">错误: ${data.error}</p>`; return; }
    const currentPath = data.currentPath ?? data.current_path ?? '';
    const items = (data.items||[]).map(item=>{
      const isDir = (item.isDirectory !== undefined ? item.isDirectory : (item.directory !== undefined ? item.directory : false));
      return {
        icon: isDir ? '📁' : '📄',
        name: item.name,
        path: item.path,
        isDirectory: !!isDir,
        size: isDir ? 0 : item.size,
        sizeText: isDir ? '-' : formatFileSize(item.size),
        modified: item.modifiedTime ? new Date(item.modifiedTime * 1000) : (item.modified_time ? new Date(item.modified_time * 1000) : null),
        modifiedText: (item.modifiedTime || item.modified_time) ? new Date((item.modifiedTime || item.modified_time) * 1000).toLocaleString() : '-'
      };
    });

    const headerHtml = `<h2>当前路径: ${currentPath || '/'} </h2>` +
      (currentPath? `<p><a href="#" class="btn" id="backBtn">返回上级目录</a></p>`: '');
    container.innerHTML = headerHtml + '<div id="grid"></div>' +
      `<div class="upload-section"><h3>上传文件</h3><form id="uploadForm" enctype="multipart/form-data"><input type="hidden" name="directory" value="${currentPath}"><input type="file" name="file" required><button type="submit" class="btn">上传</button></form><div id="uploadStatus"></div></div>`;

    if(currentPath){
      const parent=currentPath.split('/').slice(0,-1).join('/');
      const back=document.getElementById('backBtn'); if(back){ back.onclick=(e)=>{ e.preventDefault(); loadFileList(parent); } }
    }

    // Build table via Grid.js if available, else simple fallback
    const gridEl=document.getElementById('grid');
    if(window.gridjs){
      const gridData = items.map(row=>[
        row.icon,
        row.isDirectory
          ? gridjs.h('a', { href:'#', onclick:(e)=>{ e.preventDefault(); loadFileList(row.path); } }, row.name)
          : gridjs.h('a', { href:`/storage/${row.path}`, target:'_blank' }, row.name),
        row.sizeText,
        row.modifiedText,
        row.isDirectory ? '' : gridjs.h('div', { className:'share-form' }, gridjs.h('button', { className:'btn small share-btn', 'data-path': row.path }, '生成分享'))
      ]);
      const grid = new gridjs.Grid({
        columns: ['','名称','大小','修改时间','操作'],
        data: gridData,
        sort: true,
        pagination: { enabled: true, limit: 20 },
        language: { 'search': { 'placeholder': '搜索...' }, 'pagination': { 'previous': '上一页', 'next': '下一页', 'showing': '显示', 'results': ()=>'条' } }
      });
      grid.render(gridEl);
      // Grid.js 会在分页/排序时重渲染，使用全局事件委托处理按钮点击
    } else {
      // Fallback simple list
      gridEl.innerHTML = items.map(row=>`<div class="file-item ${row.isDirectory?'directory':'file'}">
        <div class="file-icon">${row.icon}</div>
        ${row.isDirectory? `<a href="#" onclick="loadFileList('${row.path}');return false;">${row.name}</a>` : `<a href="/storage/${row.path}" target="_blank">${row.name}</a>`}
        <div class="file-size">${row.sizeText}</div>
        <div class="file-date">${row.modifiedText}</div>
        <div class="share-form">${row.isDirectory?'':`<button class="btn small" data-path="${row.path}">生成分享</button>`}</div>
      </div>`).join('');
      // 使用全局事件委托，无需显式绑定
    }

    setupUploadForm();
  }).catch(err=>{ container.innerHTML=`<p class="error">加载失败: ${err.message}</p>`; });
}

// 使用事件委托处理分享按钮，兼容 Grid.js 的重渲染
function bindGlobalDelegates(){
  if(window._storeitDelegatesBound) return; window._storeitDelegatesBound = true;
  document.addEventListener('click', async (e)=>{
    const btn = e.target.closest('.share-btn');
    if(btn){
      e.preventDefault();
      const path = btn.getAttribute('data-path');
      const body = { filePath: path, expireDays: 30, maxDownloads: null };
      try{
        const res = await fetch('/api/share',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
        const data = await res.json();
        let holder = btn.closest('.share-form');
        if(!holder){ holder = btn.parentElement; }
        let node = holder.querySelector('.share-result');
        if(!node){ node = document.createElement('div'); node.className = 'share-result'; holder.appendChild(node); }
        if(res.ok && data.success){ const url = location.origin + data.data.url; node.innerHTML = `分享链接: <a href="${data.data.url}" target="_blank">${url}</a>`; }
        else{ node.innerHTML = `<span class="error">生成失败: ${(data.message||'错误')}</span>`; }
      }catch(err){ console.error('share failed', err); }
    }
  });
}

function setupUploadForm(){ const form=document.getElementById('uploadForm'); if(!form) return; form.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(form); const st=document.getElementById('uploadStatus'); st.innerHTML='上传中...'; fetch('/api/upload',{method:'POST',body:fd}).then(r=>r.json()).then(d=>{ if(d.error){ st.innerHTML=`<p class="error">上传失败: ${d.error}</p>`; } else { st.innerHTML=`<p class="success">文件 ${d.file.name} 上传成功!</p>`; loadFileList(fd.get('directory')); } }).catch(err=>{ st.innerHTML=`<p class="error">上传错误: ${err.message}</p>`; }); }); }

document.addEventListener('DOMContentLoaded', function(){ initFloatingBackground(); setupLoginForm(); setupRefreshButton(); loadUserStatus(); bindGlobalDelegates(); if(document.getElementById('fileList')){ loadFileList(); } });