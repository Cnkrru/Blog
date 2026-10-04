import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import generateSitemap from 'vite-ssg-sitemap'
import compileArticles from './src/.build/parseArticle.ts'
import { generateRss } from './src/.build/rss.ts'
import { SITE_TITLE, SITE_URL } from './src/config/site.ts'
import 'vite-ssg'

// katex 公式产物里的 MathML 标签，告知 Vue 模板编译器按原生元素处理（不解析为组件）
const mathmlTags = [
  'math',
  'semantics',
  'mrow',
  'mfrac',
  'msqrt',
  'msub',
  'msup',
  'msubsup',
  'munder',
  'mover',
  'munderover',
  'mi',
  'mo',
  'mn',
  'mtext',
  'mspace',
  'mstyle',
  'annotation',
]
// giscus 的 web component，由浏览器 customElements 接管，Vue 按原生元素渲染
const customTags = [...mathmlTags, 'giscus-widget']

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
  ssgOptions: {
    includedRoutes(paths) {
      const cacheDir = fileURLToPath(new URL('./.cache', import.meta.url))
      const postIds = readdirSync(cacheDir)
        .filter((name) => /^post-.*\.vue$/.test(name))
        .map((name) => name.replace(/\.vue$/, ''))
      return [...paths.filter((path) => !path.includes(':')), ...postIds.map((id) => `/post/${id}`)]
    },
    // 构建完成后：生成 RSS/Atom 订阅源 + sitemap.xml/robots.txt
    onFinished() {
      generateRss({ siteUrl: SITE_URL, siteTitle: SITE_TITLE })

      // sitemap 分级：首页最高、文章次之（并用真实更新时间做 lastmod）、归档/工具页最低
      // 插件默认把全部页面写成 priority 1.0 + lastmod=构建时间，搜索引擎会忽略无区分度的权重
      const posts: Record<string, { date?: string; updated?: string }> = JSON.parse(
        readFileSync(resolve('public/config/post.json'), 'utf8'),
      )
      const priority: Record<string, number> = { '/': 1.0 }
      const changefreq: Record<string, string> = { '/': 'daily' }
      const lastmod: Record<string, Date> = {}
      for (const [id, meta] of Object.entries(posts)) {
        const route = `/post/${id}`
        priority[route] = 0.8
        changefreq[route] = 'weekly'
        const stamp = meta.updated || meta.date
        if (stamp) lastmod[route] = new Date(stamp)
      }
      for (const route of ['/postlist', '/category', '/tag', '/about', '/link', '/setting']) {
        priority[route] = 0.5
        changefreq[route] = 'monthly'
      }

      generateSitemap({
        hostname: SITE_URL,
        exclude: ['/notfound'],
        priority,
        changefreq,
        lastmod,
        readable: true,
      })
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // giscus iframe 跨域 fetch public/ 下的评论主题CSS，dev server 必须带 CORS 头
    cors: true,
    watch: {
      // 编译缓存目录不进 watcher，避免产物写入/更新触发 reload 循环
      ignored: ['**/.cache/**'],
    },
  },
})
