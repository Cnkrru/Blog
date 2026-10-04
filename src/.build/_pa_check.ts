// 编译期脚本：docs/*.md → .cache/*.vue（正文 SFC）+ public/config/post.json（元数据）
// 并把 post.json 原样复制为 .cache/post.json（可 import 同源副本，供 SSR 取 SEO 元数据），由 vite buildStart 调用
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
import { container } from '@mdit/plugin-container'

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

/*
 * id: compileSignature
 * fn: 输入签名。一次 build 会跑"客户端+服务端"两次 vite build，且每次构建都重新 import 本模块
 * —— 内存态无法跨构建存活，改用 `.cache/.compile-sig` 磁盘 sidecar：签名一致则短路复用缓存
 */
const compileSignature = (files: string[]): string =>
  files
    .map((f) => {
      const s = fs.statSync(path.join(articlePath, f))
      return `${f}:${s.mtimeMs}:${s.size}`
    })
    .sort()
    .join('|')

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
 * id: mermaidShell
 * fn: mermaid代码块外壳，渲染前是源码文本，由运行时mermaid.run替换为图
 */
const mermaidShell = (code: string): string => `
<div class="language-mermaid" v-pre>
    <div class="code-toolbar">
        <span class="lang lang-mermaid">
            <span class="lang-dot"></span>
            <span class="lang-text">mermaid</span>
        </span>
    </div>
    <pre data-lang="mermaid"><code>${code}</code></pre>
</div>
`

/*
 * ====================<提示块外壳模板>====================
 * id: admonitionShellOpen / admonitionShellClose
 * fn: 提示块外壳，编译期把 `:::tip/info/warn/error` 容器内容拼进
 * 标题栏(图标+文字) + 内容区结构，样式由 content.css 按等级配色
 * 语法：`:::type 可选标题` 内容 `:::`（标题省略时用默认文案）
 */
const ADMONITION_META: Record<string, { icon: string; label: string }> = Object.freeze({
  tip: { icon: 'asterisk', label: '提示' },
  info: { icon: 'info', label: '信息' },
  warn: { icon: 'alert', label: '警告' },
  error: { icon: 'close', label: '错误' },
})

const ADMONITION_ICON: Record<string, string> = Object.freeze({
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  alert:
    '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
  close: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  asterisk: '<path d="M12 4v16"/><path d="M5 8l5.8 3.7 3.6-2.2"/><path d="m11 20 1-6 6-1"/>',
})

const admonitionShellOpen = (type: string, title: string): string => {
  const meta = ADMONITION_META[type] || ADMONITION_META.info
  const t = title || meta.label
  return (
    `
<!-- == admonition ` +
    type +
    ` == -->
<div class="admonition admonition-` +
    type +
    `">
    <div class="admonition-head">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
    ADMONITION_ICON[meta.icon] +
    `</svg>
        <span class="admonition-title">` +
    t +
    `</span>
    </div>
    <div class="admonition-body">`
  )
}

const admonitionShellClose = (): string => `</div></div>`

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
 * fn: 遍历md，扫描代码块，每遇到一种语言，集合追加这门，mermaid排除，按需加载
 */
const configLanguage = async (files: string[]) => {
  const langSet = new Set<string>(['text'])
  // 语言集合追加
  for (const file of files) {
    const _ = fs.readFileSync(path.join(articlePath, file), 'utf-8')
    for (const i of _.matchAll(/^```([\w+-]+)/gm)) {
      const lang = (i[1] ?? '').toLowerCase()
      if (lang !== 'mermaid') {
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
 * fn: 编译期拦截代码块，将指定代码块转义产物注入自定义HTML模块
 */
const configFence = (md: InstanceType<typeof MarkdownIt>) => {
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]!
    const info = md.utils.unescapeAll(token.info).trim()
    const lang = info.split(/\s+/)[0] || 'text'
    const safe = safeLang(lang)

    if (lang === 'mermaid') {
      return mermaidShell(md.utils.escapeHtml(token.content))
    }

    // highlighter 由 manager 的 needRender 分支先经 configLanguage 初始化，此处必有值
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
 * id: configContainer
 * fn: 编译期拦截提示块容器（`:::tip/info/warn/error` 包裹内容）
 * @mdit/plugin-container 用 openRenderer/closeRenderer 分两段：
 * open 出锚点+头部+body开标签，中间内容由 markdown-it 正常渲染，close 收尾
 */
const configContainer = (md: InstanceType<typeof MarkdownIt>) => {
  ;['tip', 'info', 'warn', 'error'].forEach((type) => {
    md.use(container, {
      name: type,
      openRenderer(tokens, idx, options, _env, _self) {
        const token = tokens[idx]!
        // 标题：`:::info 标题` 取"标题"，缺省为空串（fallback 到默认文案）
        const raw = token.info.trim().slice(type.length).trim()
        const title = raw === '' ? '' : raw
        return admonitionShellOpen(type, title)
      },
      closeRenderer() {
        return admonitionShellClose()
      },
    })
  })
}

/*
 * id: mdParser
 * fn: 解析md，将md的内容和元数据分别写入对应文件
 */
const mdParser = (files: string[]) => {
  const md = initMd()
  configFence(md)
  configContainer(md)

  const articles: Record<string, ArticleMeta> = {}

  for (const file of files) {
    const id = file.replace(/\.md$/, '') // 把文章名取出来
    const _ = fs.readFileSync(path.join(articlePath, file), 'utf8') // 读取文章内容
    const content = matter(_).content // 用库解析出文章内容
    const frontmatter = matter(_).data // 用库解析出文章元数据

    // mtime增量：SFC产物存在且不比源文件旧 → 跳过katex重渲染与重写，直接复用
    const sfcPath = path.join(vuePath, `${id}.vue`)
    const sfcFresh =
      fs.existsSync(sfcPath) &&
      fs.statSync(sfcPath).mtimeMs >= fs.statSync(path.join(articlePath, file)).mtimeMs

    if (!sfcFresh) {
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
  const needRender = files.some((f) => {
    const sfcPath = path.join(vuePath, `${f.replace(/\.md$/, '')}.vue`)
    return (
      !fs.existsSync(sfcPath) ||
      fs.statSync(sfcPath).mtimeMs < fs.statSync(path.join(articlePath, f)).mtimeMs
    )
  })
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
