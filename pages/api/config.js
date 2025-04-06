import { clientConfig } from '@/lib/server/config'
import { encrypt, shouldEncrypt } from '@/lib/encryption'
import BLOG from '@/blog.config'

export default function handler (req, res) {
  if (req.method === 'GET') {
    // 创建一个不包含敏感信息的客户端配置
    const safeClientConfig = { ...clientConfig }

    // 确保客户端配置包含完整的加密信息
    if (safeClientConfig.apiEncryption) {
      // 包含完整的加密配置，包括secretKey和iv
      safeClientConfig.apiEncryption = {
        enabled: safeClientConfig.apiEncryption.enabled,
        algorithm: safeClientConfig.apiEncryption.algorithm,
        secretKey: safeClientConfig.apiEncryption.secretKey,
        iv: safeClientConfig.apiEncryption.iv,
        endpoints: safeClientConfig.apiEncryption.endpoints
      }
    }

    // 检查是否需要加密响应
    // 使用当前请求的URL而不是referer
    const host = req.headers.host || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const requestUrl = `${protocol}://${host}/api/config`;

    // 添加localhost到endpoints以支持本地开发环境
    const endpoints = [...(BLOG.apiEncryption?.endpoints || []), 'http://localhost:3000/api', 'https://localhost:3000/api'];

    const shouldEncryptResponse = BLOG.apiEncryption?.enabled &&
                                (shouldEncrypt(requestUrl, endpoints) || req.url.includes('/api/config'));

    if (shouldEncryptResponse) {
      // 加密响应数据
      const encryptedData = encrypt(safeClientConfig, BLOG.apiEncryption);
      res.status(200).json(encryptedData);
    } else {
      // 不加密直接返回
      res.status(200).json(safeClientConfig);
    }
  } else {
    res.status(204).end()
  }
}
