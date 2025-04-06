import axios from 'axios';
import { encrypt, shouldEncrypt } from '@/lib/encryption';
import BLOG from '@/blog.config';

export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只允许GET请求' });
  }

  try {
    const { url } = req.query;

    // 验证URL参数
    if (!url) {
      return res.status(400).json({ error: '缺少URL参数' });
    }

    // 解码URL
    const decodedUrl = decodeURIComponent(url);

    // 设置请求头，模拟浏览器行为
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Referer': 'https://www.google.com/'
    };

    // 发送代理请求
    const proxyRes = await axios({
      method: 'get',
      url: decodedUrl,
      headers: headers,
      responseType: 'arraybuffer' // 使用arraybuffer以支持二进制内容
    });

    // 获取响应内容类型
    const contentType = proxyRes.headers['content-type'] || 'text/html';

    // 设置响应头
    res.setHeader('Content-Type', contentType);

    // 检查是否需要加密响应
    const targetUrl = decodedUrl;
    const shouldEncryptResponse = BLOG.apiEncryption?.enabled &&
                                shouldEncrypt(targetUrl, BLOG.apiEncryption.endpoints);

    if (shouldEncryptResponse && contentType.includes('application/json')) {
      // 如果是JSON响应且需要加密
      try {
        // 将二进制数据转换为字符串
        const jsonData = JSON.parse(proxyRes.data.toString());

        // 加密数据
        const encryptedData = encrypt(jsonData, BLOG.apiEncryption);

        // 返回加密后的数据
        return res.status(proxyRes.status).json(encryptedData);
      } catch (error) {
        console.error('加密响应失败:', error);
        // 加密失败时返回原始数据
        return res.status(proxyRes.status).send(proxyRes.data);
      }
    } else {
      // 不需要加密，直接返回原始响应
      return res.status(proxyRes.status).send(proxyRes.data);
    }
  } catch (error) {
    console.error('代理请求错误:', error);
    return res.status(500).json({ error: '代理请求失败', message: error.message });
  }
}
