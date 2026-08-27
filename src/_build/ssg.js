// ssg.js
// vite-ssg 配置统一入口：组装 ssgOptions
// 路由清单读取 + onFinished 回调（seo.js）收敛于此
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'node:url'
import { existsSync, readFileSync } from 'fs'
import { onSsgFinished } from './seo'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..', '..')

// 获取 SSG 预渲染路由清单：优先读 routes.json，读不到用兜底
function getIncludedRoutes() {
  try {
    const routesConfigPath = resolve(rootDir, 'public/config/routes.json')
    if (existsSync(routesConfigPath)) {
      const routesConfig = JSON.parse(readFileSync(routesConfigPath, 'utf8'))
      return routesConfig.routes
    }
  } catch (error) {
    console.error('读取路由配置失败:', error)
  }
  // 兜底路由
  return [
    '/',
    '/home',
    '/about',
    '/archives',
    '/links',
    '/links/apply',
    '/projects',
    '/project',
    '/settings',
    '/tag',
    '/post'
  ]
}

export function createSsgOptions() {
  return {
    script: 'async',
    formatting: 'minify',
    includedRoutes: () => getIncludedRoutes(),
    onFinished() {
      onSsgFinished(rootDir)
    }
  }
}