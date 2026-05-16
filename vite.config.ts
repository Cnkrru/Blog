import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { resolve, dirname } from 'path'
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface Config {
  domain: string
}

interface RoutesConfig {
  routes: string[]
}

const config: Config = {
  domain: process.env.VITE_DOMAIN || 'https://cnkrru.top'
}

type Plugin = Parameters<typeof defineConfig>[0]['plugins'][number]

function manualChunks(id: string): string | undefined {
  if (id.includes('node_modules')) {
    if (id.includes('vue') || id.includes('router') || id.includes('pinia')) {
      return 'vendor'
    }
    if (id.includes('vue-i18n')) {
      return 'i18n'
    }
    if (id.includes('echarts')) {
      return 'charts'
    }
  }
  if (id.includes('components/tools')) {
    return 'tools'
  }
  return undefined
}

const copyJsFilesPlugin: Plugin = {
  name: 'copy-js-files',
  buildEnd() {
    const srcDir = resolve(__dirname, 'src/assets/js')
    const destDir = resolve(__dirname, 'dist/assets/js')

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true })
    }

    const files = ['sakuraPlus.js', 'snowy.js']
    files.forEach(file => {
      const srcFile = resolve(srcDir, file)
      const destFile = resolve(destDir, file)
      if (existsSync(srcFile)) {
        try {
          copyFileSync(srcFile, destFile)
        } catch (error) {
        }
      }
    })
  }
}

const copyVercelConfigPlugin: Plugin = {
  name: 'copy-vercel-config',
  buildEnd() {
    const srcFile = resolve(__dirname, 'vercel.json')
    const destFile = resolve(__dirname, 'dist/vercel.json')

    try {
      copyFileSync(srcFile, destFile)
      console.log('✅ vercel.json 已复制到 dist 目录')
    } catch (error) {
      console.warn('❌ 复制 vercel.json 失败:', error)
    }
  }
}

const generateOgImagesPlugin: Plugin = {
  name: 'generate-og-images',
  writeBundle() {
    const searchJsonPath = resolve(__dirname, 'public/config/search.json')
    let posts: Post[] = []
    try {
      posts = JSON.parse(readFileSync(searchJsonPath, 'utf8'))
    } catch (e) {
      return
    }

    const ogDirDist = resolve(__dirname, 'dist', 'og')
    const ogDirPublic = resolve(__dirname, 'public', 'og')
    try {
      if (!existsSync(ogDirDist)) mkdirSync(ogDirDist, { recursive: true })
      if (!existsSync(ogDirPublic)) mkdirSync(ogDirPublic, { recursive: true })

      // 默认封面
      const defaultSvg = generateDefaultOgSvg()
      writeFileSync(resolve(ogDirDist, 'default.svg'), defaultSvg, 'utf8')
      writeFileSync(resolve(ogDirPublic, 'default.svg'), defaultSvg, 'utf8')

      // 文章封面
      for (const post of posts) {
        const svg = generateOgSvg(post.title, post.date, post.tags || [])
        writeFileSync(resolve(ogDirDist, `post-${post.id}.svg`), svg, 'utf8')
        writeFileSync(resolve(ogDirPublic, `post-${post.id}.svg`), svg, 'utf8')
      }

      console.log(`✅ 已生成 ${posts.length} 张文章 OG 封面 + 默认封面`)
    } catch (error) {
      console.warn('❌ OG 封面生成失败:', error)
    }
  }
}

function getIncludedRoutes(): string[] {
  try {
    const routesConfigPath = resolve(__dirname, 'public/config/routes.json')
    if (existsSync(routesConfigPath)) {
      const routesConfig: RoutesConfig = JSON.parse(readFileSync(routesConfigPath, 'utf8'))
      return routesConfig.routes
    }
  } catch (error) {
    console.error('读取路由配置失败:', error)
  }
  return [
    '/',
    '/home',
    '/about',
    '/archives',
    '/links',
    '/tools',
    '/projects',
    '/timeline',
    '/post'
  ]
}

const includedRoutes = getIncludedRoutes()

interface Post {
  id: string
  title: string
  description: string
  date: string
  tags?: string[]
}

// SVG OG 图片生成 — 纯字符串拼接，零依赖
function generateOgSvg(title: string, date: string, tags: string[]): string {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const safeDate = date.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const tagChips = (tags || []).slice(0, 4).map((t: string) => {
    const st = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    return `<span style="display:inline-block;padding:6px 14px;border-radius:20px;border:1.5px solid #ff99bb;color:#ff99bb;font-size:14px;margin-right:8px;margin-bottom:8px;">${st}</span>`
  }).join('')

  // 标题换行：超过 18 字分行
  let titleHtml = ''
  let remaining = safeTitle
  const maxPerLine = 18
  let lineCount = 0
  while (remaining.length > 0 && lineCount < 3) {
    let chunk = remaining
    if (remaining.length > maxPerLine) {
      // 找一个合适的断点
      const cut = remaining.lastIndexOf('，', maxPerLine)
      if (cut === -1 || cut < 8) {
        chunk = remaining.slice(0, maxPerLine)
        remaining = remaining.slice(maxPerLine)
      } else {
        chunk = remaining.slice(0, cut + 1)
        remaining = remaining.slice(cut + 1)
      }
    } else {
      remaining = ''
    }
    const fontSize = lineCount === 0 ? 42 : 36
    titleHtml += `<text x="60" y="${150 + lineCount * 50}" font-size="${fontSize}" font-weight="bold" fill="#ffffff">${chunk}</text>`
    lineCount++
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="50%" style="stop-color:#16213e"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff6b9d"/>
      <stop offset="100%" style="stop-color:#c44dff"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 装饰圆 -->
  <circle cx="1050" cy="100" r="200" fill="rgba(255,107,157,0.08)"/>
  <circle cx="100" cy="550" r="150" fill="rgba(196,77,255,0.06)"/>
  <circle cx="1150" cy="480" r="100" fill="rgba(255,255,255,0.03)"/>

  <!-- 顶部横线 -->
  <rect x="60" y="80" width="80" height="4" rx="2" fill="url(#accent)"/>

  <!-- 标题 -->
  ${titleHtml}

  <!-- 标签 -->
  <foreignObject x="56" y="${150 + lineCount * 50 + 20}" width="1088" height="60">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;">
      ${tagChips}
    </div>
  </foreignObject>

  <!-- 底部信息 -->
  <text x="60" y="570" font-size="20" fill="rgba(255,255,255,0.5)">Cnkrru's Blog</text>
  <text x="60" y="595" font-size="14" fill="rgba(255,255,255,0.35)">${safeDate}</text>
</svg>`
}

function generateDefaultOgSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff6b9d"/>
      <stop offset="100%" style="stop-color:#c44dff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="100" r="250" fill="rgba(255,107,157,0.06)"/>
  <circle cx="150" cy="500" r="200" fill="rgba(196,77,255,0.05)"/>
  <rect x="60" y="120" width="100" height="5" rx="3" fill="url(#accent)"/>
  <text x="60" y="220" font-size="56" font-weight="bold" fill="#ffffff">Cnkrru's Blog</text>
  <text x="60" y="280" font-size="24" fill="rgba(255,255,255,0.6)">个人技术博客</text>
  <text x="60" y="310" font-size="24" fill="rgba(255,255,255,0.6)">分享前端开发、技术学习与生活点滴</text>
  <rect x="60" y="360" width="200" height="2" rx="1" fill="rgba(255,255,255,0.15)"/>
  <text x="60" y="570" font-size="20" fill="rgba(255,255,255,0.4)">cnkrru.top</text>
</svg>`
}

function generateSitemap(posts: Post[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${config.domain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${config.domain}/home</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${config.domain}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${config.domain}/archives</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${config.domain}/links</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${config.domain}/tools</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${config.domain}/projects</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${config.domain}/timeline</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${config.domain}/tool/1</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${config.domain}/tool/2</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${config.domain}/post/${post.id}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  `).join('')}
</urlset>`
}

function generateRss(posts: Post[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cnkrru's Blog</title>
    <link>${config.domain}/</link>
    <description>个人技术博客，分享前端开发、技术学习和生活点滴</description>
    <atom:link href="${config.domain}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>zh-CN</language>

    ${posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${config.domain}/post/${post.id}</link>
      <description>${post.description}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${config.domain}/post/${post.id}</guid>
    </item>
    `).join('')}
  </channel>
</rss>`
}

export default defineConfig({
  base: '/',
  server: {
    https: false
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    exclude: ['*.md']
  },
  build: {
    rollupOptions: {
      external: ['**/*.md'],
      output: {
        manualChunks
      }
    },
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    cssMinify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  plugins: [
    vue(),
    Pages({
      dirs: 'src/pages',
      extensions: ['vue'],
      importMode: 'sync',
      exclude: ['**/*.md']
    }),
    copyJsFilesPlugin,
    copyVercelConfigPlugin,
    generateOgImagesPlugin
  ],

  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes: () => {
      return includedRoutes
    },
    onFinished() {
      const searchJsonPath = resolve(__dirname, 'public/config/search.json')
      const posts: Post[] = JSON.parse(readFileSync(searchJsonPath, 'utf8'))

      const sitemap = generateSitemap(posts)
      const rss = generateRss(posts)

      const distDir = resolve(__dirname, 'dist')
      const publicDir = resolve(__dirname, 'public')

      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true })
      }

      const sitemapPath = resolve(distDir, 'sitemap.xml')
      const rssPath = resolve(distDir, 'rss.xml')
      const sitemapPublicPath = resolve(publicDir, 'sitemap.xml')
      const rssPublicPath = resolve(publicDir, 'rss.xml')

      try {
        writeFileSync(sitemapPath, sitemap, 'utf8')
        writeFileSync(sitemapPublicPath, sitemap, 'utf8')
      } catch (error) {
      }

      try {
        writeFileSync(rssPath, rss, 'utf8')
        writeFileSync(rssPublicPath, rss, 'utf8')
      } catch (error) {
      }

    }
  }
})
