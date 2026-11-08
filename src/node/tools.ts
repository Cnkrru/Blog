/*
 * 编译期工具函数 + 全局状态
 * - 纯函数：围栏归一、字数、签名等，输入决定输出
 * - 状态：currentPageKey / highlighter，模块级 getter/setter，避免参数层层传递
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import type { Highlighter } from 'shiki'
import { CACHE_PATH, PLUGINS_DIR, ARTICLE_PATH } from './paths.ts'

/* ====================<模块级状态>==================== */

let _highlighter: Highlighter | null = null
let _pageKey = ''

export const getHighlighter = (): Highlighter => {
  if (!_highlighter) throw new Error('highlighter 尚未初始化，调用顺序有误')
  return _highlighter
}
export const setHighlighter = (h: Highlighter | null): void => {
  _highlighter = h
}

export const getPageKey = (): string => _pageKey
export const setPageKey = (key: string): void => {
  _pageKey = key
}

/* ====================<围栏语言处理>==================== */

// 围栏语言名归一：取首个词、去掉 `ts{1}` 这类行内属性后缀、统一小写
export const fenceLang = (info: string): string => {
  const first = info.split(/\s+/)[0] || 'text'
  return (first.replace(/\{.*$/, '') || 'text').toLowerCase()
}

// 语言名消毒：只保留字母数字下划线连字符，防止注入类名/属性
export const safeLang = (lang: string): string => String(lang).replace(/[^\w-]/g, '')

// 同一语言只告警一次：一页多个同语言块失败时不刷屏
const warnedLang = new Set<string>()
export const warnFallback = (lang: string, err: unknown): void => {
  if (warnedLang.has(lang)) return
  warnedLang.add(lang)
  const msg = err instanceof Error ? err.message : String(err)
  console.warn(`[WARN]:shiki 无法高亮「${lang}」，已降级为纯文本：${msg}`)
}

/* ====================<统计工具>==================== */

// 统计 md 原文的总字数：代码块同样计入，剔除围栏/图片/链接语法；中文按字符、英文按单词
export const countWords = (content: string): number => {
  const pure = content
    .replace(/^\s*(?:`{3,}|~{3,})[^\n]*$/gm, ' ')
    .replace(/`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  const cn = (pure.match(/[\u4e00-\u9fff]/g) || []).length
  const en = (pure.match(/[a-zA-Z0-9]+(?:['-][a-zA-Z0-9]+)*/g) || []).length
  return cn + en
}

/* ====================<插件文件扫描>==================== */

// 递归收集 plugins/ 下所有 .ts，签名与 SFC 增量复用判定共用
export const pluginFiles = (): string[] => {
  const out: string[] = []
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) walk(full)
      else if (e.name.endsWith('.ts')) out.push(full)
    }
  }
  try {
    walk(PLUGINS_DIR)
  } catch {
    return []
  }
  return out
}

// plugins/ 下最新 mtime：SFC 复用判定兜底
export const pluginLatestMtime = (): number =>
  pluginFiles().reduce((max, f) => Math.max(max, fs.statSync(f).mtimeMs), 0)

/* ====================<shiki 版本读取>==================== */

const requireFromHere = createRequire(import.meta.url)
export const shikiVersion = (): string => {
  try {
    return String(requireFromHere('shiki/package.json').version)
  } catch {
    return 'unknown'
  }
}

/* ====================<编译签名>==================== */

// 输入签名：两次 vite build 乃至无改动重跑都靠磁盘 sidecar 短路复用缓存
export const compileSignature = (files: string[]): string => {
  const scriptPath = fileURLToPath(import.meta.url)
  const self = fs.statSync(scriptPath)
  const selfTag = `__self__:${self.mtimeMs}:${self.size}`
  const shikiTag = `__shiki__:${shikiVersion()}`
  const pluginTags = (() => {
    const list = pluginFiles()
    if (list.length === 0) return ['__plugins__:missing']
    const dirPath = path.dirname(scriptPath)
    return list.map((f) => {
      const s = fs.statSync(f)
      return `__plugin_${path.relative(dirPath, f)}__:${s.mtimeMs}:${s.size}`
    })
  })()
  return [
    selfTag,
    shikiTag,
    ...pluginTags,
    ...files.map((f) => {
      const s = fs.statSync(path.join(ARTICLE_PATH, f))
      return `${f}:${s.mtimeMs}:${s.size}`
    }),
  ]
    .sort()
    .join('|')
}

/* ====================<SFC 新鲜度判定>==================== */

// SFC 产物是否可复用：不存在或旧于任一层依赖都重渲染
export const sfcIsFresh = (file: string, pluginMtime: number): boolean => {
  const sfcPath = path.join(CACHE_PATH, `${file.replace(/\.md$/, '')}.vue`)
  if (!fs.existsSync(sfcPath)) return false
  const m = fs.statSync(sfcPath).mtimeMs
  const scriptPath = fileURLToPath(import.meta.url)
  return (
    m >= fs.statSync(path.join(ARTICLE_PATH, file)).mtimeMs &&
    m >= fs.statSync(scriptPath).mtimeMs &&
    m >= pluginMtime
  )
}
