from flask import Flask, send_from_directory, abort, request, Response, jsonify, session, redirect, url_for
import os
import ssl
import json
import getpass
import subprocess

app = Flask(__name__, static_folder='static', static_url_path='/static')

# 设置用于会话管理的密钥，实际应用中应使用强随机密钥
app.secret_key = os.urandom(24)

WHITELIST_FILE = 'ip_whitelist.json'

def load_whitelist():
    """从JSON文件加载IP白名单"""
    if os.path.exists(WHITELIST_FILE):
        try:
            with open(WHITELIST_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    return []

def save_to_whitelist(ip_address):
    """将IP地址添加到白名单并保存到JSON文件"""
    whitelist = load_whitelist()
    if ip_address not in whitelist:
        whitelist.append(ip_address)
        with open(WHITELIST_FILE, 'w') as f:
            json.dump(whitelist, f, indent=4)
        return True
    return False

def is_ip_whitelisted(ip_address):
    """检查给定IP地址是否在白名单中"""
    return ip_address in load_whitelist()

@app.route('/login', methods=['POST'])
def login():
    """
    处理用户登录，期望表单数据中包含'username'和'password'。
    如果凭据有效，将客户端IP添加到白名单。
    """
    username = request.form.get('username')
    password = request.form.get('password')
    client_ip = request.remote_addr

    if username in USERS and USERS[username] == password:
        save_to_whitelist(client_ip)
        session['logged_in_ip'] = client_ip
        session['username'] = username  # 添加用户名到会话
        return jsonify(success=True, message="登录成功！您的IP已被添加到白名单。"), 200
    else:
        return jsonify(success=False, message="登录失败，无效的用户名或密码"), 401

@app.route('/logout')
def logout():
    session.pop('logged_in_ip', None)
    session.pop('username', None)  # 清除会话中的用户名
    return redirect(url_for('serve_index'))

# 配置安全头
@app.after_request
def add_security_headers(response):
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

def is_safe_path(path):
    """检查请求路径是否安全，防止访问敏感文件"""
    requested_path = os.path.normpath(path)
    base_dir = os.path.abspath(os.getcwd())
    requested_full_path = os.path.abspath(os.path.join(base_dir, requested_path))
    if not requested_full_path.startswith(base_dir):
        return False
    if "cert.pem" in requested_full_path or "key.pem" in requested_full_path:
        return False
    return True

@app.route('/')
def serve_index():
    try:
        return app.send_static_file('index.html')
    except Exception as e:
        abort(404, f"首页文件未找到: {str(e)}")

@app.route('/login', methods=['GET'])
def serve_login_page():
    """提供login.html页面"""
    try:
        return app.send_static_file('login.html')
    except Exception as e:
        app.logger.error(f"Error serving login.html: {str(e)}")
        abort(404, "Login page not found.")

# 新增文件列表API
@app.route('/api/files', methods=['GET'])
def list_files():
    client_ip = request.remote_addr
    if not is_ip_whitelisted(client_ip):
        return jsonify({"error": "未授权访问"}), 403

    directory = request.args.get('path', '')
    # 安全检查
    if not is_safe_path(os.path.join('storage', directory)):
        return jsonify({"error": "无效的路径"}), 400

    full_path = os.path.join('storage', directory)
    
    # 确保目录存在
    if not os.path.exists(full_path):
        try:
            os.makedirs(full_path)
        except Exception as e:
            return jsonify({"error": f"无法创建目录: {str(e)}"}), 500
    
    try:
        files_and_dirs = []
        for item in os.listdir(full_path):
            item_path = os.path.join(full_path, item)
            is_dir = os.path.isdir(item_path)
            
            # 获取文件大小，对于目录则为0
            size = 0 if is_dir else os.path.getsize(item_path)
            
            # 获取修改时间
            mtime = os.path.getmtime(item_path)
            
            files_and_dirs.append({
                "name": item,
                "is_directory": is_dir,
                "size": size,
                "modified_time": mtime,
                "path": os.path.join(directory, item) if directory else item
            })
            
        # 先显示目录，再显示文件，每组内按名称排序
        files_and_dirs.sort(key=lambda x: (not x["is_directory"], x["name"].lower()))
        
        return jsonify({
            "current_path": directory,
            "items": files_and_dirs
        })
    except Exception as e:
        return jsonify({"error": f"读取目录失败: {str(e)}"}), 500

@app.route('/storage/<path:filepath>')
def serve_storage_file(filepath):
    client_ip = request.remote_addr
    if not is_ip_whitelisted(client_ip):
        abort(403, "访问控制: IP不在白名单，请先登录。")
    if not is_safe_path(os.path.join('storage', filepath)):
        abort(403, "拒绝访问：无权访问该路径")
    try:
        return send_from_directory('storage', filepath)
    except Exception as e:
        abort(404, f"文件未找到: {str(e)}")

# 文件上传API
@app.route('/api/upload', methods=['POST'])
def upload_file():
    client_ip = request.remote_addr
    if not is_ip_whitelisted(client_ip):
        return jsonify({"error": "未授权访问"}), 403
    
    # 获取目标目录
    directory = request.form.get('directory', '')
    if not is_safe_path(os.path.join('storage', directory)):
        return jsonify({"error": "无效的路径"}), 400
    
    target_dir = os.path.join('storage', directory)
    
    # 确保目录存在
    if not os.path.exists(target_dir):
        try:
            os.makedirs(target_dir)
        except Exception as e:
            return jsonify({"error": f"无法创建目录: {str(e)}"}), 500
    
    # 处理上传的文件
    if 'file' not in request.files:
        return jsonify({"error": "未找到文件"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "未选择文件"}), 400
    
    try:
        filename = os.path.basename(file.filename)
        # 确保文件名安全
        filename = filename.replace('..', '')
        file_path = os.path.join(target_dir, filename)
        file.save(file_path)
        return jsonify({
            "success": True,
            "message": "文件上传成功",
            "file": {
                "name": filename,
                "path": os.path.join(directory, filename) if directory else filename,
                "size": os.path.getsize(file_path)
            }
        })
    except Exception as e:
        return jsonify({"error": f"上传失败: {str(e)}"}), 500

@app.errorhandler(403)
def forbidden(e):
    try:
        return app.send_static_file('403.html'), 403
    except Exception:
        return "403 Forbidden", 403

@app.errorhandler(404)
def not_found(e):
    try:
        return app.send_static_file('404.html'), 404
    except Exception:
        return "404 Not Found", 404

# 获取用户状态API
@app.route('/api/user/status')
def user_status():
    client_ip = request.remote_addr
    is_logged_in = is_ip_whitelisted(client_ip)
    username = session.get('username', None)
    
    return jsonify({
        "logged_in": is_logged_in,
        "username": username if is_logged_in else None
    })

if __name__ == "__main__":
    # 确保存储目录存在
    os.makedirs("storage", exist_ok=True)

    # 加载config.json
    USERS = {}
    cert_path = ""
    key_path = ""
    ssl_enabled = True
    config_path = "./config.json"
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            config = json.load(f)
            USERS = config.get("users", {})
            cert_path = config.get("cert_path", "")
            key_path = config.get("key_path", "")
            ssl_enabled = config.get("ssl_enabled", True)
    else:
        # 配置文件不存在，创建一个默认的配置文件
        default_config = {
            "users": {
                "admin": "authorized_users"
            },
            "cert_path": os.path.abspath("./cert/cert.pem"),
            "key_path": os.path.abspath("./cert/key.pem"),
            "ssl_enabled": True
        }
        os.makedirs("./cert", exist_ok=True)
        with open(config_path, 'w') as f:
            json.dump(default_config, f, indent=4)
        print("未检测到配置文件，已创建")
        USERS = default_config["users"]
        cert_path = default_config["cert_path"]
        key_path = default_config["key_path"]
        ssl_enabled = default_config["ssl_enabled"]

    if ssl_enabled:
        # 检查证书文件是否存在
        if not (os.path.exists(cert_path) and os.path.exists(key_path)):
            print(f"未找到证书文件: \n  cert_path: {cert_path}\n  key_path: {key_path}")
            choice = input("是否生成自签名证书？[Y/n]: ").strip().lower()
            if choice in ("", "y", "yes"):
                os.makedirs(os.path.dirname(cert_path), exist_ok=True)
                subj = "/C=CN/ST=State/L=City/O=Org/OU=OrgUnit/CN=localhost"
                try:
                    subprocess.check_call([
                        "openssl", "req", "-x509", "-nodes", "-days", "365",
                        "-newkey", "rsa:2048",
                        "-keyout", key_path,
                        "-out", cert_path,
                        "-subj", subj
                    ])
                    print(f"已生成自签名证书: \n  cert_path: {cert_path}\n  key_path: {key_path}")
                except Exception as e:
                    print(f"生成自签名证书失败: {e}")
                    exit(1)
            else:
                print("请手动配置证书文件后重试。")
                exit(1)

        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(cert_path, key_path)
        print("在端口59898上启动HTTPS服务...")
        app.run(host='0.0.0.0', port=59898, ssl_context=context, debug=False)
    else:
        print("SSL已禁用，启动HTTP服务（不安全）...")
        app.run(host='0.0.0.0', port=59898, debug=False)