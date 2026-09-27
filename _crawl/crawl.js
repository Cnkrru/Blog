// 简易站点镜像：抓 blog.cnkrru.top 站内资源到 _crawl/<path>，用于核对部署路径
import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname) // _crawl
const HOST = 'blog.cnkrru.top'
const ROOT = `https://${HOST}/`

const queue = [ROOT]
const done = new Set()
const MAX = 500
let count = 0

function toAbs(base, ref) {
  try { return new URL(ref, base).href } catch { return null }
}

function hostOf(u) { try { return new URL(u).hostname } catch { return null } }

// 只收站内 host（blog.cnkrru.top / cnkrru.top），跳过外站脚本/字体/评论等
function isSite(u) {
  const h = hostOf(u)
  return h === HOST || h === 'cnkrru.top'
}

function linksIn(html, base) {
  const out = new Set()
  const re = /(?:href|src|content)\s*=\s*["']([^"']+)["']/gi
  let m
  while ((m = re.exec(html))) {
    const url = m[1]
    if (!url || url.startsWith('#') || /^(mailto|tel|javascript|data|about):/i.test(url)) continue
    const abs = toAbs(base, url)
    if (abs && isSite(abs)) out.add(abs)
  }
  return out
}

function fetch(u) {
  return new Promise((resolve) => {
    const req = https.get(u, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0', Accept: '*/*' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume()
        const loc = toAbs(u, res.headers.location)
        return resolve({ redirect: loc })
      }
      const type = (res.headers['content-type'] || '').split(';')[0]
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, type, body: Buffer.concat(chunks) }))
    })
    req.on('timeout', () => { req.destroy(); resolve({ status: 0 }) })
    req.on('error', () => resolve({ status: 0 }))
  })
}

async function save(u) {
  const parsed = new URL(u)
  let rel = decodeURI(parsed.pathname)
  if (rel === '/' || rel.endsWith('/')) rel += 'index.html'
  if (!path.extname(rel)) rel += '.html'
  const file = path.join(OUT, rel)
  const r = await fetch(u)
  if (!r.body) return r
  if (r.status === 0) return r // 超时/错误
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, r.body)
  count++
  const note = r.type && r.type.includes('html') ? 'HTML' : r.type || 'BIN'
  console.log(`[${count}] ${note.padEnd(10)} ${u}`)
  // 是 HTML 就再发现站内链接
  if (note === 'HTML' || r.type.includes('html')) {
    for (const l of linksIn(r.body.toString('utf8'), u)) {
      if (done.has(l) || queue.includes(l)) continue
      queue.push(l)
    }
  }
  return r
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  while (queue.length && done.size < MAX) {
    const u = queue.shift()
    const key = new URL(u).pathname // 按 path 去重，同一资源只存一份
    if (done.has(key)) continue
    done.add(key)
    const r = await save(u)
    if (r && r.redirect && isSite(r.redirect) && !done.has(new URL(r.redirect).pathname)) {
      queue.push(r.redirect)
    }
  }
  console.log(`\n完成：抓取 ${done.size} 个路径，保存 ${count} 个文件到 ${OUT}`)
}

main()