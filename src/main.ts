import '@/assets/css/common.css'
import '@/assets/css/toast.css'

import '@/assets/css/layout/var.css'
import '@/assets/css/layout/default.css'
import '@/assets/css/layout/card.css'
import '@/assets/css/layout/immersive.css'

import '@/assets/css/theme/color.css'
import '@/assets/css/theme/_sakura.css'
import '@/assets/css/theme/_purple.css'
import '@/assets/css/theme/_ink.css'
import '@/assets/css/theme/_cyan.css'
import '@/assets/css/theme/_blue.css'
import '@/assets/css/theme/bg.css'

import '@/assets/css/content.css'
import 'katex/dist/katex.min.css'

import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, setRouter } from './router'

// 第三参是 ViteSSG 的 app 创建回调：拿到内部 router 实例并持有，供模块级 ts 复用
export const createApp = ViteSSG(App, { routes }, ({ router }) => {
  setRouter(router)
})
