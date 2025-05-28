// 背景动画元素
function initFloatingBackground() {
    const floatingBg = document.querySelector('.floating-bg');
    if (floatingBg) {
        // 确保浮动背景元素存在
        // 清除现有子元素
        floatingBg.innerHTML = '';
        
        // 创建新的浮动元素
        for (let i = 0; i < 3; i++) {
            const div = document.createElement('div');
            floatingBg.appendChild(div);
        }
    }
}

// 处理登录表单提交
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const messageArea = document.getElementById('messageArea');
            
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                messageArea.style.display = 'block';
                messageArea.textContent = result.message;
                
                if (response.ok && result.success) {
                    messageArea.className = 'message success';
                    // Redirect to home page after a short delay
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    messageArea.className = 'message error';
                }
            } catch (error) {
                messageArea.style.display = 'block';
                messageArea.className = 'message error';
                messageArea.textContent = '登录请求失败，请检查网络连接。';
                console.error('Login error:', error);
            }
        });
    }
}

// 刷新按钮功能
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function(e) {
            e.preventDefault();
            location.reload();
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initFloatingBackground();
    setupLoginForm();
    setupRefreshButton();
});

// 文件列表功能
function loadFileList(path = '') {
    const container = document.getElementById('fileList');
    if (!container) return;
    
    container.innerHTML = '<p>加载中...</p>';
    
    fetch(`/api/files?path=${encodeURIComponent(path)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                container.innerHTML = `<p class="error">错误: ${data.error}</p>`;
                return;
            }
            
            let html = `<h2>当前路径: ${data.current_path || '/'}</h2>`;
            
            // 添加返回上级目录链接
            if (data.current_path) {
                const parentPath = data.current_path.split('/').slice(0, -1).join('/');
                html += `<p><a href="#" class="btn" onclick="loadFileList('${parentPath}'); return false;">返回上级目录</a></p>`;
            }
            
            html += '<div class="file-grid">';
            
            // 显示目录和文件
            data.items.forEach(item => {
                const icon = item.is_directory ? '📁' : '📄';
                const size = item.is_directory ? '-' : formatFileSize(item.size);
                const date = new Date(item.modified_time * 1000).toLocaleString();
                
                if (item.is_directory) {
                    html += `
                        <div class="file-item directory">
                            <div class="file-icon">${icon}</div>
                            <a href="#" onclick="loadFileList('${item.path}'); return false;">${item.name}</a>
                            <div class="file-size">${size}</div>
                            <div class="file-date">${date}</div>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="file-item file">
                            <div class="file-icon">${icon}</div>
                            <a href="/storage/${item.path}" target="_blank">${item.name}</a>
                            <div class="file-size">${size}</div>
                            <div class="file-date">${date}</div>
                        </div>
                    `;
                }
            });
            
            html += '</div>';
            
            // 添加文件上传表单
            html += `
                <div class="upload-section">
                    <h3>上传文件</h3>
                    <form id="uploadForm" enctype="multipart/form-data">
                        <input type="hidden" name="directory" value="${data.current_path}">
                        <input type="file" name="file" required>
                        <button type="submit" class="btn">上传</button>
                    </form>
                    <div id="uploadStatus"></div>
                </div>
            `;
            
            container.innerHTML = html;
            
            // 设置上传表单处理
            setupUploadForm();
        })
        .catch(error => {
            container.innerHTML = `<p class="error">加载失败: ${error.message}</p>`;
        });
}

// 设置上传表单处理
function setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const statusDiv = document.getElementById('uploadStatus');
        
        statusDiv.innerHTML = '上传中...';
        
        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                statusDiv.innerHTML = `<p class="error">上传失败: ${data.error}</p>`;
            } else {
                statusDiv.innerHTML = `<p class="success">文件 ${data.file.name} 上传成功!</p>`;
                // 刷新文件列表
                loadFileList(formData.get('directory'));
            }
        })
        .catch(error => {
            statusDiv.innerHTML = `<p class="error">上传错误: ${error.message}</p>`;
        });
    });
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 加载用户状态
function loadUserStatus() {
    const userStatusDiv = document.getElementById('userStatus');
    if (!userStatusDiv) return;
    
    fetch('/api/user/status')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                userStatusDiv.innerHTML = `<p>当前用户: ${data.username} <a href="/logout" class="btn small">退出</a></p>`;
            } else {
                userStatusDiv.innerHTML = `<p>未登录 <a href="/login" class="btn small">登录</a></p>`;
            }
        })
        .catch(error => {
            userStatusDiv.innerHTML = '<p>获取用户状态失败</p>';
        });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 已有的初始化代码
    initFloatingBackground();
    setupLoginForm();
    setupRefreshButton();
    
    // 新增初始化代码
    loadUserStatus();
    
    // 如果在文件列表页面，加载文件列表
    if (document.getElementById('fileList')) {
        loadFileList();
    }
});