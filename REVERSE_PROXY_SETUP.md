# 反向代理配置指南

## 概述

本应用配置为支持反向代理模式，SSL终止在反向代理服务器上处理。

## 环境变量配置

### 必需的环境变量

```bash
# NextAuth配置
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-here

# 数据库配置
DATABASE_URL=postgresql://postgres:password@db:5432/oldpho
SHADOW_DATABASE_URL=postgresql://postgres:password@db:5432/oldpho_shadow

# API密钥
REPLICATE_API_KEY=your-replicate-api-key

# Google OAuth (可选)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 其他配置
POSTGRES_PASSWORD=your-database-password
```

## 反向代理配置示例

### Nginx配置

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL证书配置
    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;

    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 代理到应用
    location / {
        proxy_pass http://your-server-ip:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://your-server-ip:3001;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache配置

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com

    SSLEngine on
    SSLCertificateFile /path/to/your/cert.pem
    SSLCertificateKeyFile /path/to/your/key.pem

    ProxyPreserveHost On
    ProxyPass / http://your-server-ip:3001/
    ProxyPassReverse / http://your-server-ip:3001/

    # 安全头
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</VirtualHost>
```

## 部署步骤

1. **启动Docker容器**
   ```bash
   docker-compose up -d
   ```

2. **配置反向代理**
   - 在反向代理服务器上配置SSL证书
   - 设置代理规则指向 `your-server-ip:3001`

3. **更新环境变量**
   - 确保 `NEXTAUTH_URL` 设置为 `https://yourdomain.com`
   - 在Google Cloud Console中添加重定向URI: `https://yourdomain.com/api/auth/callback/google`

4. **测试访问**
   - 访问 `https://yourdomain.com` 确认SSL正常工作
   - 测试Google登录功能

## 注意事项

- 确保反向代理服务器能够访问Docker容器的3001端口
- 防火墙需要开放80和443端口
- SSL证书需要与域名匹配
- 确保所有环境变量正确配置 