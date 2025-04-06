/**
 * 客户端加密工具
 * 使用Web Crypto API实现AES-CBC加密/解密
 */

/**
 * 调整密钥或IV长度
 * @param {string} str - 原始字符串
 * @param {number} length - 目标长度
 * @returns {Uint8Array} - 调整后的Uint8Array
 */
const adjustLength = (str, length) => {
  if (!str) return new Uint8Array(length).fill(48); // 填充'0'的ASCII码

  // 将字符串转换为Uint8Array
  const encoder = new TextEncoder();
  const buffer = encoder.encode(str);

  if (buffer.length === length) return buffer;

  if (buffer.length > length) {
    // 如果长度超出，截断
    return buffer.slice(0, length);
  } else {
    // 如果长度不足，填充'0'
    const newBuffer = new Uint8Array(length).fill(48); // 填充'0'的ASCII码
    newBuffer.set(buffer);
    return newBuffer;
  }
};

/**
 * 将Base64字符串转换为Uint8Array
 * @param {string} base64 - Base64编码的字符串
 * @returns {Uint8Array} - 解码后的Uint8Array
 */
const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * 将ArrayBuffer转换为Base64字符串
 * @param {ArrayBuffer} buffer - 要编码的ArrayBuffer
 * @returns {string} - Base64编码的字符串
 */
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * 客户端解密函数
 * @param {object} response - 加密的响应数据
 * @param {object} config - 加密配置
 * @returns {Promise<any>} - 解密后的数据
 */
export const decrypt = async (response, config) => {
  // 如果未启用加密或响应不是加密数据，直接返回
  if (!config?.enabled || !response || !response.encrypted || !response.data) {
    console.warn('未启用加密或响应不是加密数据，直接返回', config, response);
    return response;
  }

  try {
    // 只支持AES-CBC加密
    if (response.algorithm !== 'aes-256-cbc') {
      throw new Error(`不支持的加密算法: ${response.algorithm}`);
    }

    // 准备密钥和IV
    const keyData = adjustLength(config.secretKey, 32);
    const iv = adjustLength(config.iv, 16);

    // 将Base64编码的数据转换为ArrayBuffer
    const encryptedData = base64ToArrayBuffer(response.data);

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

/**
 * 检查URL是否需要加密
 * @param {string} url - 请求URL
 * @param {array} endpoints - 需要加密的端点列表
 * @returns {boolean} - 是否需要加密
 */
export const shouldEncrypt = (url, endpoints) => {
  if (!url || !endpoints || !Array.isArray(endpoints)) {
    return false;
  }

  return endpoints.some(endpoint => url.startsWith(endpoint));
};
