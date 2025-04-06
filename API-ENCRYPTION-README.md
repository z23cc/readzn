# API 数据加密功能说明

本项目实现了API数据加密功能，可以保护敏感信息不被未授权访问。加密功能通过环境变量配置，可以灵活开启或关闭。

## 功能特点

- 支持对指定API端点的请求/响应数据进行加密
- 使用AES-256-CBC算法进行加密，安全性高
- 通过环境变量配置，便于在不同环境中灵活使用
- 自动处理加密/解密过程，对应用代码影响最小

## 配置说明

### 1. 环境变量配置

在项目根目录创建`.env.local`文件（或在部署环境中设置环境变量），参考`.env.example`文件添加以下配置：

```
# API加密配置
# 是否启用API加密 (true/false)
API_ENCRYPTION_ENABLED=true

# 加密算法 (推荐: aes-256-cbc)
API_ENCRYPTION_ALGORITHM=aes-256-cbc

# 加密密钥 (必须是32字节长度的字符串)
API_ENCRYPTION_SECRET_KEY=your_secret_key_must_be_32_bytes_long

# 初始化向量 (必须是16字节长度的字符串)
API_ENCRYPTION_IV=your_iv_must_be_16_bytes_long
```

### 2. 生成安全的密钥和IV

为了安全起见，建议使用随机生成的密钥和IV。可以使用以下命令生成：

```bash
# 生成32字节密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 生成16字节IV
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 3. 配置需要加密的API端点

在`blog.config.js`文件中，可以配置需要加密的API端点：

```javascript
apiEncryption: {
  enabled: process.env.API_ENCRYPTION_ENABLED === 'true',
  algorithm: process.env.API_ENCRYPTION_ALGORITHM || 'aes-256-cbc',
  secretKey: process.env.API_ENCRYPTION_SECRET_KEY || 'default-secret-key-please-change-in-env', // 密钥长度会自动调整为32字节
  iv: process.env.API_ENCRYPTION_IV || 'default-iv-16byte', // IV长度会自动调整为16字节
  endpoints: ['https://readzn.com/api', 'https://xiayibendushenme.com/api'] // 需要加密的API端点
}

注意：
- 对于AES-256-CBC加密，密钥会自动调整为32字节（256位）长度
- 初始化向量(IV)会自动调整为16字节长度
- 如果提供的密钥或IV长度不足，系统会自动用'0'填充；如果超出，则会截断
```

可以根据需要添加或修改`endpoints`数组中的API端点。

## 工作原理

1. 当发送API请求时，系统会检查请求的URL是否在配置的加密端点列表中
2. 如果需要加密，服务器会对响应数据进行加密，并在响应中添加`encrypted: true`标记
3. 客户端接收到响应后，检测到加密标记，会自动使用配置的密钥和IV进行解密
4. 解密后的数据会传递给应用程序使用

## 注意事项

- 密钥和IV必须妥善保管，泄露可能导致加密失效
- 在生产环境中，建议使用环境变量或密钥管理服务存储密钥，而不是硬编码在代码中
- 启用加密会略微增加API请求的处理时间和资源消耗
- 如果更改了加密算法、密钥或IV，确保所有客户端和服务器都同步更新
