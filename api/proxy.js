// Vercel API route for lxmusic proxy

/**
 * API proxy for lxmusic API to bypass CORS restrictions
 */
export default async function handler(req, res) {
  try {
    console.log('Proxy request received:', req.method, req.url);
    console.log('Request body:', req.body);
    
    const { url, method = 'GET', headers = {} } = req.body || {};
    
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
    
    try {
      const proxyResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Key': 'lxmusic',
          ...headers,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        redirect: 'follow'
      });
      
      console.log('Proxy response status:', proxyResponse.status);
      
      const data = await proxyResponse.json();
      
      console.log('Proxy response data:', data);
      
      res.status(proxyResponse.status).json(data);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      res.status(500).json({ error: 'Failed to fetch from lxmusic API', details: fetchError.message });
    }
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}