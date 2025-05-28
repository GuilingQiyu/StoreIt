# StoreIt|储之 文件服务应用

## 简介
这是一个基于 Flask 的基本简单文件存储和分享应用。它通过 IP 白名单机制来控制对存储文件的访问，并支持 HTTPS 以增强安全性。用户需要通过登录来将其 IP 地址添加到白名单，之后才能访问 `/storage/` 路径下的文件。

## 主要功能
*   **IP 白名单访问控制**: 只有经过认证的 IP 地址才能访问受保护的资源。白名单存储在 `ip_whitelist.json` 文件中。
*   **用户认证**: 通过 `/login` 路由进行用户名和密码认证。成功登录后，用户的 IP 地址会被添加到白名单。
*   **HTTPS 支持**:
    *   可通过 `config.json` 文件中的 `ssl_enabled` 选项启用或禁用 SSL/TLS。
    *   如果启用了 SSL 但未找到证书文件 (`cert.pem`, `key.pem`)，应用会提示用户自动生成自签名证书（需要 OpenSSL）。
*   **静态文件服务**:
    *   提供主页 (`index.html`)。
    *   提供登录页 (`login.html`)。
    *   提供 `/storage/` 目录下的文件，但需先通过 IP 白名单验证。
*   **安全路径检查**: 防止通过 `../` 等方式访问应用目录之外的文件或敏感文件（如证书文件）。
*   **安全 HTTP 头部**: 自动为响应添加常见的安全头部，如 `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`。
*   **配置文件管理 (`config.json`)**:
    *   用于存储用户凭据 (`users`)。
    *   配置 SSL 证书路径 (`cert_path`, `key_path`)。
    *   控制是否启用 SSL (`ssl_enabled`)。
    *   如果 `config.json` 不存在，应用启动时会自动创建一个包含默认设置的配置文件。
*   **自定义错误页面**: 为 403 (禁止访问) 和 404 (未找到) 错误提供用户友好的 HTML 页面 (`403.html`, `404.html`)。

## 配置文件 (`config.json`)
应用启动时会加载 `config.json`。如果文件不存在，将创建一个默认配置文件。

**默认配置示例**:
```json
{
    "users": {
        "admin": "authorized_users"
    },
    "cert_path": "/path/to/your/app/cert/cert.pem",
    "key_path": "/path/to/your/app/cert/key.pem",
    "ssl_enabled": true
}
```
*   `users`: 一个包含用户名和对应密码的对象。
*   `cert_path`: SSL 证书文件的绝对路径。
*   `key_path`: SSL 私钥文件的绝对路径。
*   `ssl_enabled`: 布尔值，`true` 表示启用 HTTPS，`false` 表示使用 HTTP。

## IP 白名单 (`ip_whitelist.json`)
此文件由应用自动创建和管理，用于存储允许访问 `/storage/` 目录的 IP 地址列表。
**示例**:
```json
[
    "192.168.1.100",
    "127.0.0.1"
]
```

## 运行应用
1.  **环境准备**:
    *   确保已安装 Python 3。
    *   安装 Flask: `pip install Flask`。
    *   如果需要自动生成 SSL 证书，请确保已安装 OpenSSL 命令行工具。
2.  **目录结构**:
    建议将应用组织如下：
    ```
    /StoreItApp
    ├── app.py                 # Python 应用脚本
    ├── config.json            # (可选) 配置文件，若不存在会自动生成
    ├── ip_whitelist.json      # (自动生成) IP 白名单
    ├── /cert                  # 存放 SSL 证书
    │   ├── cert.pem
    │   └── key.pem
    ├── /static                # 存放静态 HTML, CSS, JS 文件
    │   ├── index.html
    │   ├── login.html
    │   ├── 403.html
    │   ├── 404.html
    │   └── (其他静态资源)
    └── /storage               # 存放需要通过白名单访问的文件
        └── example_file.txt
    ```
3.  **启动服务**:
    *   在 `app.py` 所在的目录下运行命令: `python app.py`
    *   应用默认在 `0.0.0.0:59898` 上运行。
    *   如果 `ssl_enabled` 为 `true` (默认)：
        *   如果 `cert_path` 和 `key_path` 指向的证书文件存在，则启动 HTTPS 服务。
        *   如果证书文件不存在，应用会询问是否生成自签名证书。选择 "y" 将尝试使用 OpenSSL 生成证书到 `config.json` 中指定的路径（默认为 `./cert/` 目录下）。
    *   如果 `ssl_enabled` 为 `false`，则启动 HTTP 服务。

## 主要 API 路由
*   `GET /`: 显示主页 (`static/index.html`)。
*   `GET /login`: 显示登录页面 (`static/login.html`)。
*   `POST /login`:
    *   接收表单数据 `username` 和 `password`。
    *   验证凭据是否与 `config.json` 中的 `users` 匹配。
    *   如果验证成功，将请求来源的 IP 地址添加到 `ip_whitelist.json`，并在会话中记录 `logged_in_ip`。
    *   返回 JSON 响应，指示成功或失败。
*   `GET /logout`:
    *   从会话中移除 `logged_in_ip`。
    *   重定向到主页。
    *   注意：登出操作主要清除会话状态，IP 地址一旦加入白名单，除非手动编辑 `ip_whitelist.json` 或重启应用（如果白名单未持久化，但此应用中是持久化的），否则仍然有效。
*   `GET /storage/<path:filepath>`:
    *   检查请求来源的 IP 地址是否在 `ip_whitelist.json` 中。
    *   如果 IP 不在白名单，返回 403 禁止访问错误（并提示用户登录）。
    *   检查请求的文件路径是否安全（防止目录遍历和访问敏感文件）。
    *   如果路径不安全，返回 403 错误。
    *   如果 IP 在白名单且路径安全，则从 `storage` 目录发送请求的文件。
    *   如果文件未找到，返回 404 错误。

## 安全特性
*   **IP 白名单**: 作为主要的访问控制机制，限制对 `/storage/` 资源的访问。
*   **HTTPS**: 通过 SSL/TLS 加密客户端和服务器之间的通信，防止数据被窃听或篡改。
*   **安全路径检查**: `is_safe_path` 函数确保用户不能请求应用目录之外的文件或特定的敏感文件（如 SSL 证书）。
*   **安全 HTTP 头部**:
    *   `Strict-Transport-Security`: 强制客户端（如浏览器）仅使用 HTTPS 与服务器通信。
    *   `X-Content-Type-Options: nosniff`: 防止浏览器 MIME 类型嗅探。
    *   `X-Frame-Options: SAMEORIGIN`: 防止点击劫持，确保页面不能在来自其他域的 `<iframe>` 中显示。
    *   `X-XSS-Protection: 1; mode=block`: 启用浏览器的内置 XSS 过滤器。
*   **会话管理**: 使用 Flask 的 `session` 来初步跟踪用户的登录状态，但核心访问控制依赖于 IP 白名单。