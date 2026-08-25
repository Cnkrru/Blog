/*
* id：vue项目插件配置
* fn：启用vue与插件，并挂载VUE-APP
*/
import { createApp as createVueApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'

import './assets/css/animations.css'

import { createAppRouter } from './router/index'
import { pinia } from './stores/index'

// 开发环境下注销残留的 Service Worker，避免干扰 Vite 热更新
if (import.meta.env.DEV) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((r) => r.forEach((reg) => reg.unregister()))
  }
}

// 主题与布局样式已改为按需加载，由 theme store 的 cssLoader 负责



/* 
* ID: VUE项目初始化函数
* fn：启用vue与插件pinia和vue-head
*/
export function createApp() {
  const vueApp = createVueApp(App)
  const head = createHead()
  const router = createAppRouter()

  vueApp.use(head)

  vueApp.use(router)
  vueApp.use(pinia)

  return { app: vueApp, router, head }
}



// 仅客户端：挂载应用
if (!import.meta.env.SSR) {
  const { app } = createApp()

  // 挂载根目录app.vue 
  app.mount('#app')

  // 注册 Service Worker（PWA 离线缓存）
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 静默失败，不影响主流程
      })
    })
  }
}