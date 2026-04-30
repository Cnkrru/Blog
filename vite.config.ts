import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'

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
    '/post'
  ]
}

const includedRoutes = getIncludedRoutes()

interface Post {
  id: string
  title: string
  description: string
  date: string
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
    copyVercelConfigPlugin
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
