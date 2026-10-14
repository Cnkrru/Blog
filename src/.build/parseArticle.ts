// 编译期脚本：docs/*.md → .cache/*.vue（正文 SFC）+ public/config/post.json（元数据）
// 并把 post.json 原样复制为 .cache/post.json（可 import 同源副本，供 SSR 取 SEO 元数据），由 vite buildStart 调用
// 写作组件已插件化（src/.build/plugins/），围栏拦截与行内规则由 registry.ts 统一调度，
// 新增组件 = 加一个插件文件 + 在 registry 登记一行，本脚本不再改动
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import type { Highlighter } from 'shiki'
import { createHighlighter, createCssVariablesTheme } from 'shiki'
import { anchor } from '@mdit/plugin-anchor'
import { tasklist } from '@mdit/plugin-tasklist'
import { katex } from '@mdit/plugin-katex'
import { componentPlugin } from '@mdit-vue/plugin-component'
import { slugify } from '@mdit-vue/shared'
import {
  componentFenceLangs,
  renderComponentFence,
  setupComponentPlugins,
} from './plugins/registry.ts'
import { toolbar, splitRow } from './plugins/base.ts'

// 文章元数据：frontmatter 展开 + 编译期算好的派生字段
type ArticleMeta = {
  title: string
  date: string
  updated: string
  tags: string[]
  wordCount: number
  readingTime: number
}

const ARTICLE_DIR = 'docs'

const highlightTheme = createCssVariablesTheme()

// 脚本文件路径 → 项目根路径 → 各产物路径
const scriptPath = fileURLToPath(import.meta.url)
const dirPath = path.dirname(scriptPath)
const rootPath = path.resolve(dirPath, '../..')
const articlePath = path.join(rootPath, ARTICLE_DIR)
const vuePath = path.join(rootPath, '.cache')
const jsonPath = path.join(rootPath, 'public/config/post.json')
const postMetaPath = path.join(vuePath, 'post.json')

// 语法高亮器，configLanguage 初始化，fence 规则闭包使用
let highlighter: Highlighter | null = null

// 当前正在渲染的文章 id：插件上下文里透传出去，供需要『同页唯一』的组件
// （tabs/code-group/compare 这类分节面板）识别换页后归零页内组号
let currentPageKey = ''

/*
 * id: pluginFiles
 * fn: 递归收集 plugins/ 下所有 .ts（含子目录）：签名与 SFC 增量复用判定共用
 * 只扫顶层会让 registry.ts 引出的子目录插件改动被漏掉，一旦漏掉签名不变就短路复用旧产物
 */
const pluginFiles = (): string[] => {
  const out: string[] = []
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) walk(full)
      else if (e.name.endsWith('.ts')) out.push(full)
    }
  }
  try {
    walk(path.join(dirPath, 'plugins'))
  } catch {
    return []
  }
  return out
}

// plugins/ 下最新 mtime：SFC 复用判定用它兜底（插件改动后旧产物必须重渲染）
const pluginLatestMtime = (): number =>
  pluginFiles().reduce((max, f) => Math.max(max, fs.statSync(f).mtimeMs), 0)

/*
 * id: compileSignature
 * fn: 输入签名。一次 build 会跑"客户端+服务端"两次 vite build，且每次构建都重新 import 本模块
 * —— 内存态无法跨构建存活，改用 `.cache/.compile-sig` 磁盘 sidecar：签名一致则短路复用缓存
 *
 * 签名必须掺入本脚本自身的 mtime/size 与 plugins/ 下所有插件文件：
 * 元数据提取逻辑或组件外壳改动后，docs/ 一个字没变，签名却必须变化，
 * 否则缓存短路会让新逻辑要手动清 .cache 才生效
 */
const compileSignature = (files: string[]): string => {
  const self = fs.statSync(scriptPath)
  const selfTag = `__self__:${self.mtimeMs}:${self.size}`
  const pluginTags = (() => {
    const list = pluginFiles()
    if (list.length === 0) return ['__plugins__:missing']
    // tag 用相对路径而非文件名：子目录同名文件不会互相覆盖
    return list.map((f) => {
      const s = fs.statSync(f)
      return `__plugin_${path.relative(dirPath, f)}__:${s.mtimeMs}:${s.size}`
    })
  })()
  return [
    selfTag,
    ...pluginTags,
    ...files.map((f) => {
      const s = fs.statSync(path.join(articlePath, f))
      return `${f}:${s.mtimeMs}:${s.size}`
    }),
  ]
    .sort()
    .join('|')
}

// 语言名消毒：只保留字母数字下划线连字符，防止注入类名/属性
const safeLang = (lang: string): string => String(lang).replace(/[^\w-]/g, '')

/* ====================<代码块外壳模板>==================== */
/*
 * id: codeShell
 * fn: 普通代码块外壳，编译期把shiki高亮结果塞进顶栏+内容区结构
 * 顶栏对齐 blog-map：语言徽章(圆点+文本) + 内联 SVG 复制图标
 */
const codeShell = (lang: string, highlighted: string): string => `
<div class="language-${lang}" v-pre>
    <div class="code-toolbar">
        <span class="lang lang-${lang}">
            <span class="lang-dot"></span>
            <span class="lang-text">${lang}</span>
        </span>
        <button class="copy">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
    </div>
    ${highlighted}
</div>
`

/*
 * id: countWords
 * fn: 统计md原文的纯文本字数，剔除代码块/行内代码/图片链接语法，
 * 中文按字符计，英文按单词计，二者相加（阅读时长=字数/300 向上取整，最少1分钟）
 */
const countWords = (content: string): number => {
  const pure = content
    .replace(/```[\s\S]*?```/g, ' ') // 去代码块
    .replace(/`[^`]*`/g, ' ') // 去行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 去图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接保留文字
    .replace(/[#>*_~\-|]/g, ' ') // 去md符号
  const cn = (pure.match(/[\u4e00-\u9fff]/g) || []).length // 中文字符
  const en = (pure.match(/[a-zA-Z0-9]+(?:['-][a-zA-Z0-9]+)*/g) || []).length // 英文单词
  return cn + en
}

/*
 * id: articlePathChecker
 * fn: 检查文章文件夹是否存在，如果存在，检查里面有没有文件，返回files(读文件的产物)
 */
const articlePathChecker = () => {
  if (fs.existsSync(articlePath)) {
    console.log('[INFO]:文章文件夹存在')
    const files = fs.readdirSync(articlePath).filter((_) => _.endsWith('.md'))
    if (files.length === 0) {
      console.warn('[WARN]:文章目录下没有文件')
    }
    return files
  } else {
    console.error('[ERR]:文章文件夹不存在')
  }
}

/*
 * id: vuePathCleaner
 * fn: 只清除"已从docs删除文章"的过时产物；仍在用的SFC保留，供mtime增量复用
 */
const vuePathCleaner = (ids: Set<string>) => {
  for (const file of fs.readdirSync(vuePath)) {
    if (file.endsWith('.vue') && !ids.has(file.replace(/\.vue$/, ''))) {
      fs.rmSync(path.join(vuePath, file))
      console.log(`[INFO]:清除过时中间产物${file}`)
    }
  }
}

/*
 * id: vuePathChecker
 * fn: 检查.cache文件夹是否存在，如果没有则创建一个
 */
const vuePathChecker = (ids: Set<string>) => {
  try {
    if (fs.existsSync(vuePath)) {
      console.log('[INFO]:vue文件夹存在')
      vuePathCleaner(ids)
    } else {
      fs.mkdirSync(vuePath, { recursive: true })
      if (fs.existsSync(vuePath)) {
        console.log('[INFO]:原路径无vue文件夹,创建文件夹成功')
      } else {
        console.error('[ERR]:原路径无vue文件夹,创建文件夹失败')
      }
    }
  } catch (e) {
    console.error('[ERR]:vue文件夹操作失败', e)
  }
}

/*
 * id: jsonPathChecker
 * fn: 检查post.json是否存在，如果没有则创建一个
 */
const jsonPathChecker = () => {
  try {
    if (fs.existsSync(jsonPath)) {
      console.log('[INFO]:post.json存在')
    } else {
      fs.writeFileSync(jsonPath, '{}', 'utf8')
      if (fs.existsSync(jsonPath)) {
        console.log('[INFO]:原路径无post.json,创建文件成功')
      } else {
        console.error('[ERR]:原路径无post.json,创建文件失败')
      }
    }
  } catch (e) {
    console.error('[ERR]:post.json操作失败', e)
  }
}

/*
 * id: syncPostMeta
 * fn: public/ 下的静态资源不进 Vite 模块图，无法 import；把 post.json 原样复制到 .cache/，
 * 得到可 import 的同源副本，供 Post.vue 在 SSR/客户端同步取 SEO 元数据（单一数据源，不做二次加工）
 */
const syncPostMeta = () => {
  if (fs.existsSync(jsonPath)) {
    fs.copyFileSync(jsonPath, postMetaPath)
  }
}

/*
 * id: configLanguage
 * fn: 遍历md，扫描代码块，每遇到一种语言，集合追加这门，组件语言排除，按需加载
 */
const configLanguage = async (files: string[]) => {
  const langSet = new Set<string>(['text'])
  // 语言集合追加
  for (const file of files) {
    const _ = fs.readFileSync(path.join(articlePath, file), 'utf-8')
    // 兼容缩进围栏与「``` js」空格分隔：只认 ^``` 会漏掉缩进块和空格写法，语言进不了 shiki 白名单
    for (const i of _.matchAll(/^[ \t]*```[ \t]*([\w+-]+)/gm)) {
      const lang = (i[1] ?? '').toLowerCase()
      // 组件语言名都走 fence 拦截拼外壳，不是真语言，不进 shiki（注册表统一汇总，含 mermaid）
      if (!componentFenceLangs.has(lang)) {
        langSet.add(lang)
      }
    }
  }

  // shiki语法高亮配置
  highlighter = await createHighlighter({
    themes: [highlightTheme],
    langs: [...langSet],
  })
}

/*
 * id: initMd
 * fn: 创建markdown-it实例，挂载插件
 */
const initMd = () => {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: false })
    .use(componentPlugin) // 支持原生HTML和vue组件
    .use(anchor, { slugify }) // 支持md'#'标签绑定id
    .use(tasklist) // 支持md的任务列表转HTML
    .use(katex) // 支持KATEX

  return md
}

/*
 * id: configFence
 * fn: 编译期拦截代码块：组件语言交给注册表里的组件插件拼外壳直出 HTML，
 * 未命中任何组件插件的走 shiki 编译期高亮（运行时无需再处理）
 */
const configFence = (md: InstanceType<typeof MarkdownIt>) => {
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]!
    const info = md.utils.unescapeAll(token.info).trim()
    // 统一小写：收集侧已 toLowerCase，这里不转会让 Cpp/Vue 这类写法命中 shiki 的 catch 静默回退纯文本
    const lang = (info.split(/\s+/)[0] || 'text').toLowerCase()
    const safe = safeLang(lang)

    // 组件插件：mermaid 与写作组件（timeline/steps/tabs/links/gallery 等，注册表统一调度）
    // highlight：code-group 等内嵌代码的组件用，编译期 shiki 高亮；未知语言回退纯文本
    // renderMarkdown：提示块这类『块内正文仍要正常渲染』的组件用，嵌套跑一遍本实例
    const componentHtml = renderComponentFence(
      {
        escapeHtml: md.utils.escapeHtml,
        toolbar,
        splitRow,
        renderMarkdown: (s: string): string => md.render(s),
        pageKey: currentPageKey,
        highlight: (code: string, codeLang: string): string => {
          try {
            return highlighter!.codeToHtml(code, { lang: codeLang, theme: highlightTheme })
          } catch {
            return highlighter!.codeToHtml(code, { lang: 'text', theme: highlightTheme })
          }
        },
      },
      lang,
      token.content,
      info,
    )
    if (componentHtml !== null) return componentHtml

    // highlighter 由 manager 的 configLanguage 初始化，此处必有值
    let highlighted: string
    try {
      highlighted = highlighter!.codeToHtml(token.content, { lang, theme: highlightTheme })
    } catch {
      highlighted = highlighter!.codeToHtml(token.content, { lang: 'text', theme: highlightTheme })
    }
    return codeShell(safe, highlighted)
  }
}

/*
 * id: sfcIsFresh
 * fn: SFC 产物是否可复用：不存在、或旧于源文档/本编译脚本/任一组件插件，都判为需重渲染。
 * 必须比对脚本与插件 mtime —— 渲染规则或组件外壳变更后，旧 SFC 是按旧逻辑生成的，mtime 再新也不能复用
 */
const sfcIsFresh = (file: string, pluginMtime: number): boolean => {
  const sfcPath = path.join(vuePath, `${file.replace(/\.md$/, '')}.vue`)
  if (!fs.existsSync(sfcPath)) return false
  const m = fs.statSync(sfcPath).mtimeMs
  return (
    m >= fs.statSync(path.join(articlePath, file)).mtimeMs &&
    m >= fs.statSync(scriptPath).mtimeMs &&
    m >= pluginMtime
  )
}

/*
 * id: mdParser
 * fn: 解析md，将md的内容和元数据分别写入对应文件
 */
const mdParser = (files: string[]) => {
  const md = initMd()
  configFence(md)
  setupComponentPlugins(md) // 挂载需要自定义 markdown-it 规则的组件（kbd/badge/mark 行内规则）
  const pluginMtime = pluginLatestMtime() // 插件最新 mtime：SFC 复用判定共用

  const articles: Record<string, ArticleMeta> = {}

  for (const file of files) {
    const id = file.replace(/\.md$/, '') // 把文章名取出来
    const _ = fs.readFileSync(path.join(articlePath, file), 'utf8') // 读取文章内容
    const content = matter(_).content // 用库解析出文章内容
    const frontmatter = matter(_).data // 用库解析出文章元数据

    // mtime增量：SFC产物存在且不旧于源文档/本编译脚本/任一组件插件 → 跳过重渲染，直接复用
    const sfcPath = path.join(vuePath, `${id}.vue`)

    if (!sfcIsFresh(file, pluginMtime)) {
      currentPageKey = id // 换页：分节面板的页内组序号随页归零
      // 更新记录改运行期渲染（EditHistory组件读post.json的history），编译期不再追加到正文
      const rendered = md.render(content) // 先把文章内容转义为HTML
      const vue = `<template>${rendered}</template>` // 把文章内容拼接成vue的HTML块
      fs.writeFileSync(sfcPath, vue, 'utf8') // 把拼接好的块写入对应文件
    }

    // 构建期统计字数与阅读时长，展示组件运行时直接读，零计算
    const wordCount = countWords(content)
    const readingTime = Math.max(1, Math.ceil(wordCount / 300))

    // 把解析出的yaml元数据写入json
    articles[id] = {
      ...frontmatter,
      title: frontmatter.title || id,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString().slice(0, 10) : '',
      updated: frontmatter.updated ? new Date(frontmatter.updated).toISOString().slice(0, 10) : '',
      tags: frontmatter.tags || [],
      wordCount,
      readingTime,
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(articles, null, 4), 'utf8')
}

/*
 * id: manager
 * fn: 集中管理编译流程：路径检查 → 签名短路 → 缓存清理 → 语言配置 → 文章编译
 */
const manager = async () => {
  // 1. 检查文章文件夹，拿到md文件列表
  const files = articlePathChecker()
  if (!files || files.length === 0) {
    return
  }
  // 确保缓存目录存在：rebuild 首次构建需自建
  fs.mkdirSync(vuePath, { recursive: true })
  // 输入签名比对：两次 vite build 乃至无改动重跑都靠磁盘 sidecar 短路复用缓存
  const sig = compileSignature(files)
  const sigFile = path.join(vuePath, '.compile-sig')
  // 产物完整性：post.json 缺失时不短路，否则被删的产物永远不会被重建
  const postJsonExists = fs.existsSync(jsonPath)
  if (postJsonExists && fs.existsSync(sigFile) && fs.readFileSync(sigFile, 'utf8') === sig) {
    console.log('[INFO]:输入未变,短路复用.cache编译缓存')
    syncPostMeta() // .cache 被清时补建可 import 副本，保证 SSR 每次构建都读得到
    return
  }
  // 2. 检查缓存与元数据文件路径（清除已删除文章的过时产物）
  const ids = new Set(files.map((f) => f.replace(/\.md$/, '')))
  vuePathChecker(ids)
  jsonPathChecker()
  // 3. 仅当有文件需要重渲染时才扫描语言、初始化高亮器（全量未变时跳过createHighlighter）
  // 判定与 mdParser 的复用条件同源：脚本或插件改动也需要重建，否则高亮器没初始化就会被用到
  const pluginMtime = pluginLatestMtime()
  const needRender = files.some((f) => !sfcIsFresh(f, pluginMtime))
  if (needRender) {
    await configLanguage(files)
  }
  // 4. 配置markdown-it并编译文章
  mdParser(files)
  syncPostMeta() // 复制为可 import 的同源副本
  fs.writeFileSync(sigFile, sig, 'utf8') // 落盘签名，供下次构建短路
}

// 直接运行本文件时编译；作为模块被 vite.config 导入时由 buildStart 调用
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  manager()
}

export default () => manager()
