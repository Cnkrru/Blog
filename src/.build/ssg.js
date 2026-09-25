// src/.build/ssg.js — 为 vite-ssg 生成动态路由清单（/post/:id 的具体化路径列表）
// 数据来源是 public/config/post.json（compile-articles 阶段生成的纯元数据），
// 保证与文章组件渲染同一份元数据，避免重复扫描 md / 重复解析 frontmatter。
// 构建期不落盘任何 json，vite.config.js 的 ssgOptions.includedRoutes 直接 await 本模块取用。
// —— AI 编写 2026-09，代码未人工审阅 ——
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '../..')
const POSTS_FILE = path.join(ROOT, 'public/config/post.json')

// 依据 vite.config.js 的 router/index.js 同步维护；文章详情路由是唯一的动态路由，需要展开
export function generateSsgRoutes() {
    if (!fs.existsSync(POSTS_FILE)) {
        // 未编译时兜底：直接扫 docs，避免脚本单独运行时因产物缺失而失败
        return scanSource()
    }
    const articles = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'))
    return buildRoutes(articles)
}

// 兜底：compile 产物缺失时，退化为扫描 md 文件名生成 /post/<id>
function scanSource() {
    const SRC_DIR = path.join(ROOT, 'docs')
    if (!fs.existsSync(SRC_DIR)) return []
    const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.md'))
    const articles = {}
    for (const f of files) {
        const id = f.replace(/\.md$/, '')
        articles[id] = { title: id, date: '' }
    }
    return buildRoutes(articles)
}

// 把文章元数据映射为路由清单（SSG 只需 path；id/title/date 供未来按需扩展）
function buildRoutes(articles) {
    return Object.keys(articles).map((id) => {
        const a = articles[id] || {}
        return {
            id,
            title: a.title || id,
            // vite-ssg 用 path 作为渲染页路径与 output 文件名
            path: `/post/${id}`,
        }
    })
}

// 直接 node src/.build/ssg.js --print 时打印路由清单（不落盘），方便手动检查；作为模块被 vite.config import 时只导出函数
const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename
if (isMain) {
    const print = process.argv.includes('--print')
    try {
        const list = generateSsgRoutes()
        if (print) console.log(JSON.stringify(list, null, 2))
        console.log(`[ssg] 路由清单 ${list.length} 条`)
    }
    catch (e) {
        console.error('[ssg] 失败:', e)
        process.exit(1)
    }
}