/**
 * 封装的fetch函数，支持API数据解密
 */

import { decrypt } from './crypto';
import BLOG from '../../blog.config.js';

/**
 * 获取客户端加密配置
 * 优先使用环境变量中的配置，如果不可用则使用blog.config.js中的默认配置
 * @returns {object} - 加密配置
 */
const getEncryptionConfig = () => {
  // 从环境变量或blog.config.js获取加密配置
  const config = {
    enabled: typeof window !== 'undefined' && window.ENV_API_ENCRYPTION_ENABLED === 'true' || BLOG.apiEncryption.enabled,
    algorithm: typeof window !== 'undefined' && window.ENV_API_ENCRYPTION_ALGORITHM || BLOG.apiEncryption.algorithm,
    secretKey: typeof window !== 'undefined' && window.ENV_API_ENCRYPTION_SECRET_KEY || BLOG.apiEncryption.secretKey,
    iv: typeof window !== 'undefined' && window.ENV_API_ENCRYPTION_IV || BLOG.apiEncryption.iv,
    endpoints: BLOG.apiEncryption.endpoints
  };

  return config;
};

/**
 * 封装的fetch函数，自动处理加密响应
 * @param {string} url - 请求URL
 * @param {object} options - fetch选项
 * @returns {Promise<any>} - 解密后的响应数据
 */
const secureFetch = async (url, options = {}) => {
  try {
    // 发送请求
    const response = await fetch(url, options);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析JSON响应
    const data = await response.json();

    // 如果响应包含encrypted标记，尝试解密
    if (data && data.encrypted === true) {
      // 获取加密配置并解密数据
      const encryptionConfig = getEncryptionConfig();
      return await decrypt(data, encryptionConfig);
    }

    // 返回原始数据
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export default secureFetch;
