/**
 * CSS 按需加载工具
 * 主题 / 布局样式通过 Vite `?raw` 动态 import 成纯字符串，运行时注入 <style>。
 * 不再用 <link> + `?url`：Vite 8 (rolldown) 的 dev server 会把 .css 请求返回成
 * JS 模块 (text/javascript)，<link> 会把它当 module script 加载并触发 MIME 报错。
 * `?raw` 内联字符串后无任何网络 CSS 请求，彻底绕开该兼容问题。
 */

// 主题样式（?raw 返回 { default: "css 文本" }）
const themeLoader = {
  ink: () => import('../assets/css/themes/ink.css?raw'),
  sakura: () => import('../assets/css/themes/sakura.css?raw'),
  purple: () => import('../assets/css/themes/purple.css?raw'),
  cyan: () => import('../assets/css/themes/cyan.css?raw'),
}

// 布局样式
const layoutLoader = {
  card: () => import('../assets/css/layouts/card.css?raw'),
  compact: () => import('../assets/css/layouts/compact.css?raw'),
  minimal: () => import('../assets/css/layouts/minimal.css?raw'),
}

const injected = new Map() // id -> <style> 元素

function injectStyle(id, css) {
  unloadStyle(id)
  const el = document.createElement('style')
  el.textContent = css
  el.dataset.cssId = id
  document.head.appendChild(el)
  injected.set(id, el)
}

function unloadStyle(id) {
  const el = injected.get(id)
  if (el) {
    el.remove()
    injected.delete(id)
  }
}

async function applyCss(kind, key, loaderMap) {
  if (typeof document === 'undefined') return
  // 卸载同一分类下的其它样式
  Object.keys(loaderMap).forEach((name) => {
    if (name !== key) unloadStyle(`${kind}-${name}`)
  })
  const loader = loaderMap[key]
  if (!loader) return
  const mod = await loader()
  injectStyle(`${kind}-${key}`, mod.default)
}

export function applyThemeCss(style) {
  return applyCss('theme', style, themeLoader)
}

export function applyLayoutCss(layout) {
  return applyCss('layout', layout, layoutLoader)
}