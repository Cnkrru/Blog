/*
* id：vue项目插件配置
* fn：启用vue与插件，并挂载VUE-APP
*/
import { createApp as createVueApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'

import { createAppRouter } from './router/index.ts'
import { pinia } from './stores/index'

// 主题与布局样式拆分（由 <html data-style> / <html data-layout> 激活）
import './assets/css/themes/ink.css'
import './assets/css/themes/sakura.css'
import './assets/css/layouts/card.css'
import './assets/css/layouts/compact.css'



// createApp 函数返回值类型
interface AppReturn {
  app: ReturnType<typeof createVueApp>
  router: ReturnType<typeof createAppRouter>
  head: ReturnType<typeof createHead>
}

interface OptimizationModule {
  initOptimizationSystem: () => void
}

/* 
* ID: VUE项目初始化函数
* fn：启用vue与插件pinia和vue-head
*/
export function createApp(): AppReturn {
  const vueApp = createVueApp(App)
  const head = createHead()
  const router = createAppRouter()

  vueApp.use(head)

  vueApp.use(router)
  vueApp.use(pinia)

  return { app: vueApp, router, head }
}



// 仅客户端：挂载应用，同时异步加载性能优化模块（不阻塞渲染）
if (!import.meta.env.SSR) {
  
  const { app } = createApp()

  import('./utils/optimization-init.js')
    .then((module: OptimizationModule) => {
      module.initOptimizationSystem()
      console.log('[info]优化系统已初始化')
    })
    .catch((err: unknown) => {
      console.warn('[error]优化系统初始化失败:', err)
    })

  // 挂载根目录app.vue 
  app.mount('#app')
}
