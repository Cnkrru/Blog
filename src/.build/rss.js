// src/.build/rss.js — 构建期生成 RSS/Atom 订阅源（vite.config.js 的 ssgOptions.onFinished 阶段调用）
// 数据来源 public/config/post.json（compile-articles 阶段产物），与 SSG 路由同源
// 站点域名/标题由调用方传入，保证 vite.config.js 是唯一配置来源（换域名只改一处）
// —— AI 编写 2026-09，代码未人工审阅 ——
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Feed } from 'feed'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')

export function generateRss({ siteUrl, siteTitle }) {
  const postsFile = path.join(ROOT, 'public/config/post.json')
  let posts = {}
  try {
    posts = JSON.parse(readFileSync(postsFile, 'utf8'))
  }
  catch {
    console.warn('[rss] post.json 不存在，跳过 RSS 生成')
    return
  }

  const id = siteUrl.replace(/^https?:\/\//, '')

  // post.json 是 { id: 元数据 } 结构，转成数组并按 date 倒序（新的在前）
  const list = Object.entries(posts)
    .map(([key, meta]) => ({ id: key, ...meta }))
    .filter((p) => p.title && pickDate(p)) // 过滤掉 title 缺失 / 日期完全无效的文章
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))

  const feed = new Feed({
    title: `${siteTitle} - 博客`,
    id,
    link: siteUrl,
    description: '个人技术博客：Vue 3 / Markdown 现代前端与技术记录',
    language: 'zh-CN',
    copyright: `© ${new Date().getFullYear()} ${siteTitle}`,
    updated: list.length ? pickDate(list[0]) : new Date(),
    author: { name: siteTitle, link: siteUrl },
    favicon: `${siteUrl}/favicon.svg`,
    generator: 'Cnkrru Blog SSG',
    feedLinks: {
      rss: `${siteUrl}/feed.xml`,
      atom: `${siteUrl}/atom.xml`,
    },
  })

  for (const p of list) {
    feed.addItem({
      title: p.title,
      id: `${siteUrl}/post/${p.id}`,
      link: `${siteUrl}/post/${p.id}`,
      description: p.description || '',
      date: pickDate(p),
      category: p.category ? [{ name: p.category }] : [],
    })
  }

  const dist = path.join(ROOT, 'dist')
  mkdirSync(dist, { recursive: true })
  writeFileSync(path.join(dist, 'feed.xml'), feed.rss2(), 'utf8')
  writeFileSync(path.join(dist, 'atom.xml'), feed.atom1(), 'utf8')
  console.log(`[rss] 生成 feed.xml + atom.xml，共 ${list.length} 篇`)
}

// 取 updated 优先、date 兜底的第一个可解析日期；字段缺失或误写成说明文字时返回 null
function pickDate(p) {
  for (const d of [p.updated, p.date]) {
    if (d) {
      const t = Date.parse(d)
      if (!Number.isNaN(t)) return new Date(t)
    }
  }
  return null
}
