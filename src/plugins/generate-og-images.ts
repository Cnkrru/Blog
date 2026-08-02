// 插件id：生成函数-文章封面svg
// 插件fn：用于自动给文章生成svg封面图

// 构建node依赖包
import { resolve, dirname } from 'path'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import type { Post } from './types'

// 将文件url协议file://转为路径再获取文件路径
// import.meta.url表示一个文件的路径,file:///D:/code_projects/frontend/vite.config.ts，在不同环境（node/brower值不同）
const __dirname = dirname(fileURLToPath(import.meta.url))

// SVG OG 图片生成 — 纯字符串拼接，零依赖
function generateOgSvg(title: string, date: string, tags: string[]): string {
  const bg1 = '#1a1a2e'
  const bg2 = '#16213e'
  const bg3 = '#0f3460'
  const titleColor = '#ffffff'
  const tagColor = '#ff99bb'
  const tagBorder = '#ff99bb'
  const accent1 = '#ff6b9d'
  const accent2 = '#ff99bb'
  const circle1 = 'rgba(255,107,157,0.08)'
  const circle2 = 'rgba(196,77,255,0.06)'
  const circle3 = 'rgba(255,255,255,0.03)'
  const footerColor = 'rgba(255,255,255,0.5)'
  const dateColor = 'rgba(255,255,255,0.35)'
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const safeDate = date.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const tagChips = (tags || []).slice(0, 4).map((t: string) => {
    const st = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    return `<span style="display:inline-block;padding:6px 14px;border-radius:20px;border:1.5px solid ${tagBorder};color:${tagColor};font-size:14px;margin-right:8px;margin-bottom:8px;">${st}</span>`
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
    titleHtml += `<text x="60" y="${150 + lineCount * 50}" font-size="${fontSize}" font-weight="bold" fill="${titleColor}">${chunk}</text>`
    lineCount++
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1}"/>
      <stop offset="50%" style="stop-color:${bg2}"/>
      <stop offset="100%" style="stop-color:${bg3}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${accent1}"/>
      <stop offset="100%" style="stop-color:${accent2}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 装饰圆 -->
  <circle cx="1050" cy="100" r="200" fill="${circle1}"/>
  <circle cx="100" cy="550" r="150" fill="${circle2}"/>
  <circle cx="1150" cy="480" r="100" fill="${circle3}"/>

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
  <text x="60" y="570" font-size="20" fill="${footerColor}">Cnkrru's Blog</text>
  <text x="60" y="595" font-size="14" fill="${dateColor}">${safeDate}</text>
</svg>`
}

//封面图默认样式
function generateDefaultOgSvg(): string {
  const bg1 = '#1a1a2e'
  const bg3 = '#0f3460'
  const accent1 = '#ff6b9d'
  const accent2 = '#ff99bb'
  const circle1 = 'rgba(255,107,157,0.06)'
  const circle2 = 'rgba(196,77,255,0.05)'
  const titleColor = '#ffffff'
  const subtitleColor = 'rgba(255,255,255,0.6)'
  const footerColor = 'rgba(255,255,255,0.4)'
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1}"/>
      <stop offset="100%" style="stop-color:${bg3}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${accent1}"/>
      <stop offset="100%" style="stop-color:${accent2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="100" r="250" fill="${circle1}"/>
  <circle cx="150" cy="500" r="200" fill="${circle2}"/>
  <rect x="60" y="120" width="100" height="5" rx="3" fill="url(#accent)"/>
  <text x="60" y="220" font-size="56" font-weight="bold" fill="${titleColor}">Cnkrru's Blog</text>
  <text x="60" y="280" font-size="24" fill="${subtitleColor}">个人技术博客</text>
  <text x="60" y="310" font-size="24" fill="${subtitleColor}">分享前端开发、技术学习与生活点滴</text>
  <rect x="60" y="360" width="200" height="2" rx="1" fill="${subtitleColor}"/>
  <text x="60" y="570" font-size="20" fill="${footerColor}">cnkrru.top</text>
</svg>`
}

export default function generateOgImagesPlugin(): Plugin {
  return {
    name: 'generate-og-images',
    writeBundle() {
      // 根据search.json配合文章名post-<>生成post-<>.svg
      const searchJsonPath = resolve(__dirname, '../../../public/config/search.json')
      let posts: Post[] = []

      try {
        posts = JSON.parse(readFileSync(searchJsonPath, 'utf8'))
      } catch (e) {
        console.warn('[error]读取 search.json 失败:', e)
        return
      }

      // 封面图输出目录
      const ogDirDist = resolve(__dirname, '../../../dist', 'og')
      const ogDirPublic = resolve(__dirname, '../../../public', 'og')

      try {
        // 文件路径检查，没有则创建
        if (!existsSync(ogDirDist)) mkdirSync(ogDirDist, { recursive: true })
        if (!existsSync(ogDirPublic)) mkdirSync(ogDirPublic, { recursive: true })

        const defaultSvg = generateDefaultOgSvg()
        writeFileSync(resolve(ogDirDist, 'default.svg'), defaultSvg, 'utf8')
        writeFileSync(resolve(ogDirPublic, 'default.svg'), defaultSvg, 'utf8')

        // 获取文章名，日期，标签，用于封面图生成
        for (const post of posts) {
          const svg = generateOgSvg(post.title, post.date, post.tags || [])
          writeFileSync(resolve(ogDirDist, `post-${post.id}.svg`), svg, 'utf8')
          writeFileSync(resolve(ogDirPublic, `post-${post.id}.svg`), svg, 'utf8')
        }

        console.info(`[info]已生成 ${posts.length} 张文章 OG 封面 + 默认封面`)
      } catch (error) {
        console.warn('[warn]OG 封面生成失败:', error)
      }
    }
  }
}
