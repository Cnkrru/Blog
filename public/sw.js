// Service Worker — 缓存策略：静态资源优先缓存，页面网络优先
const CACHE_NAME = 'cnkrru-blog-v1'

// 需要预缓存的静态资源路径模式
const STATIC_PATTERNS = [
  /\.(js|css|woff2?|ttf|eot)$/,
  /\/assets\//,
  /\/og\//,
  /\/favicon\.svg$/,
  /\/manifest\.json$/
]

// 安装：预缓存当前页面
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// 是否匹配静态资源
function isStaticAsset(url) {
  return STATIC_PATTERNS.some((pattern) => pattern.test(url))
}

// 请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 跳过非 GET 请求和第三方请求
  if (request.method !== 'GET') return
  if (url.origin !== self.location.origin) return
  // 跳过 API 请求
  if (url.pathname.startsWith('/api/')) return

  // 静态资源：缓存优先
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone())
            return response
          })
          return cached || fetchPromise
        })
      })
    )
    return
  }

  // HTML 页面：网络优先，离线时回退缓存
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})