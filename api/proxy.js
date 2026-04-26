// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

/**
 * API proxy for lxmusic API to bypass CORS restrictions
 */
export default async function handler(req, res) {
  try {
    const { url, method = 'GET', headers = {} } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Missing url parameter' });
    }
    
    // Only allow requests to lxmusic API
    if (!url.startsWith('https://88.lxmusic.xn--fiqs8s')) {
      return res.status(403).json({ error: 'Forbidden: Only lxmusic API requests are allowed' });
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Key': 'lxmusic',
        ...headers
      },
      redirect: 'follow'
    });
    
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}