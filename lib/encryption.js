/**
 * API数据加密解密工具
 * 使用Node.js内置的crypto模块实现AES-256-CBC加密算法
 */

const crypto = typeof window === 'undefined' ? require('crypto') : null;

/**
 * 调整密钥或IV长度
 * @param {string} str - 原始字符串
 * @param {number} length - 目标长度
 * @returns {Buffer} - 调整后的Buffer
 */
const adjustLength = (str, length) => {
  if (!str) return Buffer.alloc(length, '0');

  const buffer = Buffer.from(str);
  if (buffer.length === length) return buffer;

  if (buffer.length > length) {
    // 如果长度超出，截断
    return buffer.slice(0, length);
  } else {
    // 如果长度不足，填充'0'
    const newBuffer = Buffer.alloc(length, '0');
    buffer.copy(newBuffer);
    return newBuffer;
  }
};

/**
 * 服务端加密函数
 * @param {object|string} data - 要加密的数据
 * @param {object} config - 加密配置
 * @returns {object} - 加密后的数据
 */
exports.encrypt = (data, config) => {
  if (!crypto) {
    console.error('加密功能只能在服务端使用');
    return data;
  }

  try {
    // 将数据转换为JSON字符串
    const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);

    // 调整密钥和IV长度
    const key = adjustLength(config.secretKey, 32); // AES-256需要32字节密钥
    const iv = adjustLength(config.iv, 16); // CBC模式需要16字节IV

    // 创建加密器
    const cipher = crypto.createCipheriv(config.algorithm, key, iv);

    // 加密数据
    let encrypted = cipher.update(jsonStr, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // 返回加密后的数据和标记
    return {
      encrypted: true,
      data: encrypted,
      algorithm: config.algorithm
    };
  } catch (error) {
    console.error('加密失败:', error);
    return data; // 加密失败时返回原始数据
  }
};

/**
 * 客户端解密函数
 * @param {object} response - API响应
 * @param {object} config - 解密配置
 * @returns {object} - 解密后的数据
 */
exports.decrypt = (response, config) => {
  // 如果不是浏览器环境或未启用加密，直接返回
  if (typeof window === 'undefined' || !config?.enabled) {
    return response;
  }

  // 如果响应不是加密数据，直接返回
  if (!response || !response.encrypted || !response.data) {
    return response;
  }

  try {
    // 调整密钥和IV长度
    const key = adjustLength(config.secretKey, 32);
    const iv = adjustLength(config.iv, 16);

    // 创建解密器
    const decipher = crypto.createDecipheriv(config.algorithm, key, iv);

    // 解密数据
    let decrypted = decipher.update(response.data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    // 解析JSON
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('解密失败:', error);
    return response; // 解密失败时返回原始响应
  }
};

/**
 * 客户端解密函数 (浏览器环境)
 * 使用Web Crypto API实现
 */
if (typeof window !== 'undefined') {
  // 在浏览器环境中重写decrypt函数
  exports.decrypt = async (response, config) => {
    // 如果未启用加密或响应不是加密数据，直接返回
    if (!config?.enabled || !response || !response.encrypted || !response.data) {
      return response;
    }

    try {
      // 只支持AES-CBC加密
      if (config.algorithm !== 'aes-256-cbc') {
        throw new Error(`不支持的加密算法: ${config.algorithm}`);
      }

      // 准备密钥和IV
      const keyData = adjustLength(config.secretKey, 32);
      const iv = adjustLength(config.iv, 16);

      // 将Base64编码的数据转换为ArrayBuffer
      const encryptedData = Uint8Array.from(atob(response.data), c => c.charCodeAt(0));

      // 导入密钥
      const key = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-CBC', length: 256 },
        false,
        ['decrypt']
      );

      // 解密数据
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        key,
        encryptedData
      );

      // 将解密后的ArrayBuffer转换为字符串
      const decryptedText = new TextDecoder().decode(decryptedBuffer);

      // 解析JSON
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('客户端解密失败:', error);
      return response; // 解密失败时返回原始响应
    }
  };
}

/**
 * 检查URL是否需要加密
 * @param {string} url - 请求URL
 * @param {array} endpoints - 需要加密的端点列表
 * @returns {boolean} - 是否需要加密
 */
exports.shouldEncrypt = (url, endpoints) => {
  if (!url || !endpoints || !Array.isArray(endpoints)) {
    return false;
  }

  return endpoints.some(endpoint => url.startsWith(endpoint));
};
