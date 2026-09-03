/*
* id：vue项目插件配置
* fn：启用vue与插件，并挂载VUE-APP
*/
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'

import { routes, scrollToTop } from './router/index'
import { pinia } from './stores/index'

// 开发环境下注销残留的 Service Worker，避免干扰 Vite 热更新
if (import.meta.env.DEV) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((r) => r.forEach((reg) => reg.unregister()))
  }
}

// 主题与布局样式已改为按需加载，由 theme store 的 cssLoader 负责

/*
* id: VUE项目初始化函数
* fn：启用vue与插件pinia；head 与 router 由 vite-ssg 内部创建并注入
*/
export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior() { scrollToTop() }
  },
  ({ app, isClient }) => {
    app.use(pinia)

    // 注册 Service Worker（PWA 离线缓存），仅生产环境
    if (isClient && !import.meta.env.DEV) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // 静默失败，不影响主流程
        })
      })
    }
  }
)