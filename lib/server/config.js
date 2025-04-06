const fs = require('fs')
const { resolve } = require('path')
const path = require('path')

let config = {}
let clientConfig = {}

try {
  // 尝试直接导入 blog.config.js
  config = require('../../blog.config.js')

  // 创建客户端配置，注入环境变量中的加密配置
  clientConfig = JSON.parse(JSON.stringify(config))

  // 注入环境变量中的加密配置到客户端配置
  clientConfig.apiEncryption = {
    enabled: process.env.API_ENCRYPTION_ENABLED === 'true',
    algorithm: process.env.API_ENCRYPTION_ALGORITHM || 'aes-256-cbc',
    secretKey: process.env.API_ENCRYPTION_SECRET_KEY || 'default-secret-key-please-change-in-env',
    iv: process.env.API_ENCRYPTION_IV || 'default-iv-16byte',
    endpoints: config.apiEncryption.endpoints
  }
} catch (error) {
  // 如果直接导入失败，尝试使用 fs 读取
  try {
    const configPath = resolve(process.cwd(), 'blog.config.js')
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8')
      config = eval(`((module = { exports }) => { ${raw}; return module.exports })()`)
      clientConfig = config
    } else {
      console.error('无法找到 blog.config.js 文件')
      // 设置默认配置
      config = {
        title: '默认标题',
        author: '默认作者',
        // 其他必要的默认配置
        seo: { keywords: [] }
      }
      clientConfig = config
    }
  } catch (readError) {
    console.error('读取 blog.config.js 文件失败:', readError)
    // 设置默认配置
    config = {
      title: '默认标题',
      author: '默认作者',
      // 其他必要的默认配置
      seo: { keywords: [] }
    }
    clientConfig = config
  }
}

module.exports = {
  config,
  clientConfig
}
