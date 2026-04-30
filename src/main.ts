import { createApp as createVueApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import { createAppRouter } from './router/index.js'

import './assets/css/color.css'
import './assets/css/breakpoint.css'

import { pinia } from './stores/index.js'

import { SpeedInsights } from '@vercel/speed-insights/vue'
import { Analytics } from '@vercel/analytics/vue'

interface AppReturn {
  app: ReturnType<typeof createVueApp>
  router: ReturnType<typeof createAppRouter>
  head: ReturnType<typeof createHead>
}

export function createApp(): AppReturn {
  const vueApp = createVueApp(App)
  const head = createHead()
  const router = createAppRouter()

  vueApp.use(head)

  vueApp.use(router)
  vueApp.use(pinia)

  vueApp.component('SpeedInsights', SpeedInsights)
  vueApp.component('Analytics', Analytics)

  return { app: vueApp, router, head }
}

interface OptimizationModule {
  initOptimizationSystem: () => void
}

if (!import.meta.env.SSR) {
  const { app } = createApp()

  import('./utils/optimization-init.js')
    .then((module: OptimizationModule) => {
      module.initOptimizationSystem()
      console.log('优化系统已初始化')
    })
    .catch((err: unknown) => {
      console.warn('优化系统初始化失败:', err)
    })

  app.mount('#app')
}
