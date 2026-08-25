/**
 * CSS 按需加载工具
 * 使用 Vite `?url` 导入获取 CSS 文件 URL，动态创建/移除 <link> 元素
 * 避免一次性加载所有主题和布局样式
 */

// 主题样式
import inkCss from '../assets/css/themes/ink.css?url'
import sakuraCss from '../assets/css/themes/sakura.css?url'
import purpleCss from '../assets/css/themes/purple.css?url'
import cyanCss from '../assets/css/themes/cyan.css?url'

// 布局样式
import cardCss from '../assets/css/layouts/card.css?url'
import compactCss from '../assets/css/layouts/compact.css?url'
import minimalCss from '../assets/css/layouts/minimal.css?url'

const themeMap = {
  ink: inkCss,
  sakura: sakuraCss,
  purple: purpleCss,
  cyan: cyanCss,
}

const layoutMap = {
  card: cardCss,
  compact: compactCss,
  minimal: minimalCss,
}

const loadedLinks = new Map()

function loadLink(id, href) {
  if (loadedLinks.has(id)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  link.dataset.cssId = id
  document.head.appendChild(link)
  loadedLinks.set(id, link)
}

function unloadLink(id) {
  const link = loadedLinks.get(id)
  if (link) {
    link.remove()
    loadedLinks.delete(id)
  }
}

export function applyThemeCss(style) {
  if (typeof document === 'undefined') return
  // 卸载所有主题样式
  Object.keys(themeMap).forEach(key => unloadLink(`theme-${key}`))
  // 加载当前主题
  const url = themeMap[style]
  if (url) loadLink(`theme-${style}`, url)
}

export function applyLayoutCss(layout) {
  if (typeof document === 'undefined') return
  // 卸载所有布局样式
  Object.keys(layoutMap).forEach(key => unloadLink(`layout-${key}`))
  // 加载当前布局
  const url = layoutMap[layout]
  if (url) loadLink(`layout-${layout}`, url)
}