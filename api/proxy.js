// Vercel API route for lxmusic proxy
const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * 使用原生 https 模块发起请求
 */
function fetchUrl(targetUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(targetUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Key': 'lxmusic',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers
      }
    };

    console.log('Fetching:', targetUrl);

    const req = protocol.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response data:', data.substring(0, 200));

        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

/**
 * API proxy for lxmusic API to bypass CORS restrictions
 */
module.exports = async function(req, res) {
  console.log('Proxy request received:', req.method, req.url);
  console.log('Request body:', req.body);

  try {
    const { url, method = 'GET' } = req.body || {};

    if (!url) {
      console.error('Missing url parameter');
      return res.status(400).json({ error: 'Missing url parameter' });
    }

    // Only allow requests to lxmusic API
    if (!url.startsWith('https://88.lxmusic.xn--fiqs8s')) {
      console.error('Forbidden URL:', url);
      return res.status(403).json({ error: 'Forbidden: Only lxmusic API requests are allowed' });
    }

    console.log('Proxying request to:', url);

    const result = await fetchUrl(url, { method });

    console.log('Proxy result:', result);

    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};