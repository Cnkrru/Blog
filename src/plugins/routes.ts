// 构建node依赖包
import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import type { RoutesConfig } from './types'

// getIncludedRoutes函数用于获取SSG预渲染路由清单
export function getIncludedRoutes(rootDir: string): string[] {
  try {
    const routesConfigPath = resolve(rootDir, 'public/config/routes.json')
    if (existsSync(routesConfigPath)) {
      const routesConfig: RoutesConfig = JSON.parse(readFileSync(routesConfigPath, 'utf8'))
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
    '/tools',
    '/projects',
    '/timeline',
    '/post'
  ]
}
