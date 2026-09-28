import './assets/css/init.css'
import './assets/css/common.css'

import './assets/css/theme/color.css'
import './assets/css/theme/_ink.css'
import './assets/css/theme/_sakura.css'
import './assets/css/theme/_purple.css'
import './assets/css/theme/_cyan.css'
import './assets/css/theme/_blue.css'
import './assets/css/theme/bg.css'

import './assets/css/layout/var.css'
import './assets/css/layout/immersive.css'
import './assets/css/layout/card.css'
import './assets/css/layout/default.css'

// toast 弹窗（JS 动态创建节点，样式必须全局生效，不能 scoped）
import './assets/css/toast.css'

// katex 公式的排版 CSS（md 编译产物里的 .katex 结构依赖它）
import 'katex/dist/katex.min.css'

import { ViteSSG } from 'vite-ssg'
import { routes } from './router'
import App from './App.vue'
import { post } from './composables/pmain/post'

export const createApp = ViteSSG(
    App,
    {
        routes,
    },
    ({ app, router }) => {
        // 浏览器端专属逻辑：giscus 包 import 时自动 customElements.define('giscus-widget')，模板按原生元素渲染；滚动回调也依赖客户端路由
        if (!import.meta.env.SSR) {
            import('giscus')
            // 粒子要限定在首页，改由 _Index.vue 内 i_ParticleEffect.vue 挂载，不再全局启动
            router.afterEach(() => {
                post().scrollToTop()   // [AI迁移] 由已删 content.js 的 scroll_to_top 迁入 post.js
            })
        }
    }
)

