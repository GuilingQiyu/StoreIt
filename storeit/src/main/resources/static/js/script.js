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
    let html=`<h2>当前路径: ${data.current_path || '/'} </h2>`;
    if(data.current_path){ const parent=data.current_path.split('/').slice(0,-1).join('/'); html+=`<p><a href="#" class="btn" onclick="loadFileList('${parent}');return false;">返回上级目录</a></p>`; }
    html+='<div class="file-grid">';
    data.items.forEach(item=>{
      const icon=item.isDirectory?'📁':'📄'; const size=item.isDirectory?'-':formatFileSize(item.size); const date=new Date(item.modified_time*1000).toLocaleString();
      if(item.isDirectory){
        html+=`<div class="file-item directory"><div class="file-icon">${icon}</div><a href="#" onclick="loadFileList('${item.path}');return false;">${item.name}</a><div class="file-size">${size}</div><div class="file-date">${date}</div><div></div></div>`;
      } else {
        html+=`<div class="file-item file"><div class="file-icon">${icon}</div><a href="/storage/${item.path}" target="_blank">${item.name}</a><div class="file-size">${size}</div><div class="file-date">${date}</div><div class="share-form"><button class="btn small" data-path="${item.path}">生成分享</button></div></div>`;
      }
    });
    html+='</div>';
    html+=`<div class="upload-section"><h3>上传文件</h3><form id="uploadForm" enctype="multipart/form-data"><input type="hidden" name="directory" value="${data.current_path||''}"><input type="file" name="file" required><button type="submit" class="btn">上传</button></form><div id="uploadStatus"></div></div>`;
    container.innerHTML=html;
    setupUploadForm();
    setupShareButtons();
  }).catch(err=>{ container.innerHTML=`<p class="error">加载失败: ${err.message}</p>`; });
}

function setupUploadForm(){ const form=document.getElementById('uploadForm'); if(!form) return; form.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(form); const st=document.getElementById('uploadStatus'); st.innerHTML='上传中...'; fetch('/api/upload',{method:'POST',body:fd}).then(r=>r.json()).then(d=>{ if(d.error){ st.innerHTML=`<p class="error">上传失败: ${d.error}</p>`; } else { st.innerHTML=`<p class="success">文件 ${d.file.name} 上传成功!</p>`; loadFileList(fd.get('directory')); } }).catch(err=>{ st.innerHTML=`<p class="error">上传错误: ${err.message}</p>`; }); }); }

function setupShareButtons(){ document.querySelectorAll('.share-form button').forEach(btn=>{ btn.onclick= async ()=>{ const path=btn.getAttribute('data-path'); const body={filePath:path, expireDays:30, maxDownloads:null}; const res=await fetch('/api/share',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)}); const data=await res.json(); let node=btn.parentElement.querySelector('.share-result'); if(!node){ node=document.createElement('div'); node.className='share-result'; btn.parentElement.appendChild(node); } if(res.ok && data.success){ const url=location.origin+data.data.url; node.innerHTML=`分享链接: <a href="${data.data.url}" target="_blank">${url}</a>`; } else { node.innerHTML=`<span class="error">生成失败: ${(data.message||'错误')}</span>`; } }; }); }

document.addEventListener('DOMContentLoaded', function(){ initFloatingBackground(); setupLoginForm(); setupRefreshButton(); loadUserStatus(); if(document.getElementById('fileList')){ loadFileList(); } });