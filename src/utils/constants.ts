/**
 * 全局常量定义
 * 统一管理 CDN 版本号、魔法数字等，便于集中维护和升级
 */

/** CDN 资源版本号 */
export const CDN_VERSIONS = {
  marked: '14.0.0',
  katex: '0.16.8',
  mermaid: '10.6.1',
  prismjs: '1.29.0'
} as const

/** 响应式断点 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
} as const