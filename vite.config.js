import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compileArticles from './src/.build/parseArticle.js'
import { generateSsgRoutes } from './src/.build/ssg.js'
import { generateRss } from './src/.build/rss.js'
import generateSitemap from 'vite-ssg-sitemap'

// katex 公式产物里的 MathML 标签，告知 Vue 模板编译器按原生元素处理
const mathmlTags = ['math', 'semantics', 'mrow', 'mfrac', 'msqrt', 'msub', 'msup', 'msubsup', 'munder', 'mover', 'munderover', 'mi', 'mo', 'mn', 'mtext', 'mspace', 'mstyle', 'annotation']

// giscus 的 web component，由浏览器 customElements 接管，Vue 按原生元素渲染
const customTags = [...mathmlTags, 'giscus-widget']

// 站点常量：sitemap / RSS 共用，换域名只改这一处
const SITE_URL = 'https://blog.cnkrru.top'
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
