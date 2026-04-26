// Vercel API route for lxmusic proxy
import https from 'node:https';
import { URL } from 'node:url';

/**
 * 使用原生 https 模块发起请求
 */
function fetchUrl(targetUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(targetUrl);

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Key': 'lxmusic',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * API proxy for lxmusic API
 */
export default async function handler(req, res) {
  try {
    const { url, method = 'GET' } = req.body || {};

    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    // Only allow requests to lxmusic API
    if (!url.startsWith('https://88.lxmusic.xn--fiqs8s')) {
      return res.status(403).json({ error: 'Forbidden: Only lxmusic API requests are allowed' });
    }

    const result = await fetchUrl(url, { method });

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}