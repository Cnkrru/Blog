import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import compileArticles from './src/.build/parseArticle.js'
import { generateSsgRoutes } from './src/.build/ssg.js'
import { generateRss } from './src/.build/rss.js'
import generateSitemap from 'vite-ssg-sitemap'

// katex 公式产物里的 MathML 标签，告知 Vue 模板编译器按原生元素处理
const mathmlTags = ['math', 'semantics', 'mrow', 'mfrac', 'msqrt', 'msub', 'msup', 'msubsup', 'munder', 'mover', 'munderover', 'mi', 'mo', 'mn', 'mtext', 'mspace', 'mstyle', 'annotation']

// giscus 的 web component，由浏览器 customElements 接管，Vue 按原生元素渲染
const customTags = [...mathmlTags, 'giscus-widget']

// 站点常量：sitemap / RSS 共用，换域名只改这一处
const SITE_URL = 'https://www.cnkrru.top'
const SITE_TITLE = 'Cnkrru'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => customTags.includes(tag),
        },
      },
    }), 
    {
      name: 'compile-articles',
      async buildStart() {
        await compileArticles()
      },
    },
    VitePWA({
      registerType: 'autoUpdate', // 新版本静默接管，无需手动刷新提示
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Cnkrru - 博客',
        short_name: 'Cnkrru',
        description: '个人技术博客：Vue 3 / Markdown 现代前端与技术记录',
        lang: 'zh-CN',
        theme_color: '#FAF3E3',
        background_color: '#FAF3E3',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,webp,woff2}'],
        cleanupOutdatedCaches: true,
      },
      integration: {
        // vite-ssg 的 jsdom mock 会把全局 document 注入到 Regenerate 阶段，
        // 导致 workbox 打包 SW 时 plugin-terser 走浏览器分支，用 document.baseURI
        // 拼出 http scheme 的 URL 使 fileURLToPath 崩溃；渲染已完成，清掉该全局即可
        async beforeBuildServiceWorker() {
          if (typeof document !== 'undefined') {
            delete globalThis.document
          }
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@data': fileURLToPath(new URL('./.cache/compile', import.meta.url)),
    },
  },
  server: {
    // [AI编写] 监听所有网卡：手机/平板同 Wi-Fi 可用局域网 IP 直接访问预览
    host: true,
    // giscus iframe 跨域 fetch public/ 下的评论主题CSS，dev server 必须带 CORS 头
    cors: true,
    watch: {
      // 编译缓存目录不进 watcher，避免产物写入/更新触发 reload 循环
      ignored: ['**/.cache/**'],
    },
  },
  ssgOptions: {
    // mock 缺失的浏览器全局（window/localStorage 等），供 SSR 渲染时被 store 安全访问
    mock: true,
    // 展开 /post/:id 动态路由：先过滤掉含 ":" 或 "*" 的动态/兜底路由，再把文章清单映射为 path 追加
    includedRoutes: async (paths) => {
      const staticPaths = paths.filter((p) => !p.includes(':') && !p.includes('*'))
      const articleRoutes = await generateSsgRoutes()
      const articlePaths = articleRoutes.map((r) => r.path)
      return Array.from(new Set([...staticPaths, ...articlePaths]))
    },
    // 构建完成后：生成 sitemap/robots + RSS feed
    onFinished() {
      generateSitemap({
        hostname: SITE_URL,
        readable: true,
      })
      generateRss({ siteUrl: SITE_URL, siteTitle: SITE_TITLE })
    },
  },
})
