import { resolve } from 'path'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import type { Post } from './types'
import { siteConfig } from './config'

// 生成 sitemap.xml
export function generateSitemap(posts: Post[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.domain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteConfig.domain}/home</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteConfig.domain}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteConfig.domain}/archives</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteConfig.domain}/links</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteConfig.domain}/projects</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteConfig.domain}/timeline</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts.map(post => `
  <url>
    <loc>${siteConfig.domain}/post/${post.id}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  `).join('')}
</urlset>`
}

// 生成 rss.xml
export function generateRss(posts: Post[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Cnkrru's Blog</title>
    <link>${siteConfig.domain}/</link>
    <description>个人技术博客，分享前端开发、技术学习和生活点滴</description>
    <atom:link href="${siteConfig.domain}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <language>zh-CN</language>

    ${posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${siteConfig.domain}/post/${post.id}</link>
      <description>${post.description}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${siteConfig.domain}/post/${post.id}</guid>
    </item>
    `).join('')}
  </channel>
</rss>`
}

// SSG 构建完成后回调：将 sitemap.xml 和 rss.xml 写入 dist 和 public 目录
export function onSsgFinished(rootDir: string) {
  const searchJsonPath = resolve(rootDir, 'public/config/search.json')
  const posts: Post[] = JSON.parse(readFileSync(searchJsonPath, 'utf8'))

  const sitemap = generateSitemap(posts)
  const rss = generateRss(posts)

  const distDir = resolve(rootDir, 'dist')
  const publicDir = resolve(rootDir, 'public')

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
    // 构建后写入，静默失败
  }

  try {
    writeFileSync(rssPath, rss, 'utf8')
    writeFileSync(rssPublicPath, rss, 'utf8')
  } catch (error) {
    // 构建后写入，静默失败
  }
}
