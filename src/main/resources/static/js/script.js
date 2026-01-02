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
      `<div class="toolbar">` +
      (currentPath? `<button class="btn" id="backBtn">返回上级目录</button> `: '') +
      `<button class="btn" onclick="createNewFolder('${currentPath}')">新建文件夹</button>` +
      `</div>`;
      
    container.innerHTML = headerHtml + '<div id="grid"></div>' +
      `<div class="upload-section"><h3>上传文件</h3><form id="uploadForm" enctype="multipart/form-data"><input type="hidden" name="directory" value="${currentPath}"><input type="file" name="file" required><button type="submit" class="btn">上传</button></form><div id="progressContainer" style="display:none; margin-top:10px;"><div id="progressBar" style="width:0%; height:20px; background-color:#4CAF50; text-align:center; color:white;">0%</div></div><div id="uploadStatus"></div></div>`;

    if(currentPath){
      const parent=currentPath.split('/').slice(0,-1).join('/');
      const back=document.getElementById('backBtn'); if(back){ back.onclick=(e)=>{ e.preventDefault(); loadFileList(parent); } }
    }

    const gridEl=document.getElementById('grid');
    if(window.gridjs){
      const gridData = items.map(row=>[
        row.icon,
        row.isDirectory
          ? gridjs.h('a', { href:'#', onclick:(e)=>{ e.preventDefault(); loadFileList(row.path); } }, row.name)
          : gridjs.h('a', { href:'#', onclick:(e)=>{ e.preventDefault(); previewFile(row.path, row.name); } }, row.name),
        row.sizeText,
        row.modifiedText,
        gridjs.h('div', { className:'action-buttons' }, [
            gridjs.h('button', { className:'btn small share-btn', 'data-path': row.path }, '分享'),
            gridjs.h('button', { className:'btn small rename-btn', onclick:()=>renameFile(row.path, row.name) }, '重命名'),
            gridjs.h('button', { className:'btn small delete-btn', onclick:()=>deleteFile(row.path) }, '删除')
        ])
      ]);
      const grid = new gridjs.Grid({
        columns: ['','名称','大小','修改时间', { name: '操作', width: '250px' }],
        data: gridData,
        sort: true,
        pagination: { enabled: true, limit: 20 },
        language: { 'search': { 'placeholder': '搜索...' }, 'pagination': { 'previous': '上一页', 'next': '下一页', 'showing': '显示', 'results': ()=>'条' } }
      });
      grid.render(gridEl);
    } else {
       gridEl.innerHTML = "GridJS not loaded";
    }

    setupUploadForm();
  }).catch(err=>{ container.innerHTML=`<p class="error">加载失败: ${err.message}</p>`; });
}

function createNewFolder(currentPath) {
    const name = prompt("请输入文件夹名称:");
    if (name) {
        const path = currentPath ? currentPath + "/" + name : name;
        fetch('/api/folder/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({path: path})
        }).then(r=>r.json()).then(d=>{
            if(d.success) loadFileList(currentPath);
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
                const currentPath = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
                loadFileList(currentPath);
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
                const currentPath = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
                loadFileList(currentPath);
            } else alert("重命名失败: " + d.error);
        });
    }
}

function previewFile(path, name) {
    const ext = name.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExts = ['mp4', 'webm', 'ogg'];
    
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

function setupUploadForm(){ 
    const form=document.getElementById('uploadForm'); 
    if(!form) return; 
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit',e=>{ 
        e.preventDefault(); 
        const fd=new FormData(newForm); 
        const st=document.getElementById('uploadStatus'); 
        const progContainer = document.getElementById('progressContainer');
        const progBar = document.getElementById('progressBar');
        
        st.innerHTML='上传中...'; 
        progContainer.style.display = 'block';
        progBar.style.width = '0%';
        progBar.textContent = '0%';
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);
        
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progBar.style.width = percentComplete + '%';
                progBar.textContent = Math.round(percentComplete) + '%';
            }
        };
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                const d = JSON.parse(xhr.responseText);
                if(d.error){ 
                    st.innerHTML=`<p class="error">上传失败: ${d.error}</p>`; 
                } else { 
                    st.innerHTML=`<p class="success">文件 ${d.file.name} 上传成功!</p>`; 
                    loadFileList(fd.get('directory')); 
                }
            } else {
                st.innerHTML=`<p class="error">上传错误: ${xhr.statusText}</p>`;
            }
            progContainer.style.display = 'none';
        };
        
        xhr.onerror = function() {
            st.innerHTML=`<p class="error">网络错误</p>`;
            progContainer.style.display = 'none';
        };
        
        xhr.send(fd);
    }); 
}

document.addEventListener('DOMContentLoaded', function(){ initFloatingBackground(); setupLoginForm(); setupRefreshButton(); loadUserStatus(); bindGlobalDelegates(); setupShareModal(); if(document.getElementById('fileList')){ loadFileList(); } });
