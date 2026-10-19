import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import generateSitemap from 'vite-ssg-sitemap'
import compileArticles from './src/.build/parseArticle.ts'
import { generateRss } from './src/.build/rss.ts'
import { SITE_TITLE, SITE_URL } from './src/config/site.ts'
import 'vite-ssg'

// katex 公式产物里的 MathML 标签，告知 Vue 模板编译器按原生元素处理（不解析为组件）
// AI修复：补全 KaTeX 实际会产出的标签（矩阵/对齐/cases 等），否则会被 Vue 当组件解析告警
const mathmlTags = [
  'math',
  'semantics',
  'annotation',
  'annotation-xml',
  'mrow',
  'mfrac',
  'msqrt',
  'mroot',
  'msub',
  'msup',
  'msubsup',
  'munder',
  'mover',
  'munderover',
  'mmultiscripts',
  'mprescripts',
  'none',
  'mi',
  'mo',
  'mn',
  'mtext',
  'ms',
  'mspace',
  'mstyle',
  'merror',
  'mpadded',
  'mphantom',
  'menclose',
  'mtable',
  'mtr',
  'mtd',
  'mlabeledtr',
]
// giscus 的 web component，由浏览器 customElements 接管，Vue 按原生元素渲染
const customTags = [...mathmlTags, 'giscus-widget']

// AI修复：md 源目录（dev 期 watcher 用它过滤变更），路径统一成 posix 风格再比较
const docsRoot = normalizePath(fileURLToPath(new URL('./docs', import.meta.url)))

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
      // AI修复：dev 期 docs 下的 md 变更后重编译并整页刷新
      //   原先编译只挂在 buildStart，只随 dev server 启动跑一次，改 md 必须重启才能生效；
      //   且 .cache 被 server.watch.ignored 排除，Vite 自身感知不到产物变化，故这里手动重编译 + 手动失效模块图
      configureServer(server) {
        // 串行化：连改时编译不并发写盘；正在跑就把这次变更挂起，跑完再补一次
        let compiling = false
        let pending = false
        const recompile = async () => {
          if (compiling) {
            pending = true
            return
          }
          compiling = true
          try {
            do {
              pending = false
              await compileArticles()
            } while (pending)
          } finally {
            compiling = false
          }
        }
        server.watcher.on('all', (event, file) => {
          const changed = normalizePath(file)
          if (!changed.startsWith(docsRoot) || !changed.endsWith('.md')) return
          if (event !== 'change' && event !== 'add' && event !== 'unlink') return
          void recompile()
            .then(() => {
              // .cache/*.vue 不在 watcher 内，不手动失效模块图的话，整页刷新会命中旧的 transform 缓存
              server.moduleGraph.invalidateAll()
              server.hot.send({ type: 'full-reload' })
            })
            // AI修复：编译校验失败(如 order 重复)只跳过本次刷新，
            //   不能让异常逃逸成 unhandled rejection 把 dev server 直接终止
            .catch(() => {
              console.warn('[WARN]:本次 md 变更编译失败，已跳过刷新；修好后重新保存即可')
            })
        })
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
