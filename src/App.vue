<script setup>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from './stores/index'
import './style.css'
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Center from './components/Center.vue'
import Footer from './components/Footer.vue'
import WebAnalytics from './components/api/WebAnalytics.vue'
import NotificationRender from './components/content/NotificationRender.vue'
import MouseTrail from './components/api/MouseTrail.vue'
import ConsoleEasterEgg from './components/media/ConsoleEasterEgg.vue'
import ContextMenu from './components/p-center/ContextMenu.vue'
import VideoBackground from './components/media/VideoBackground.vue'
import InstallPrompt from './components/p-footer/InstallPrompt.vue'

const route = useRoute()
const router = useRouter()
const isIndexPage = computed(() => route.path === '/')
const isTerminalPage = computed(() => route.path === '/terminal')

const themeStore = useThemeStore()

// 页面加载进度条
const progressWidth = ref('0%')
const progressVisible = ref(false)
let progressTimer = null

router.beforeEach((_to, _from, next) => {
  progressVisible.value = true
  progressWidth.value = '5%'
  next()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressWidth.value = '70%'
    })
  })
})

router.afterEach(() => {
  progressWidth.value = '100%'
  if (progressTimer) clearTimeout(progressTimer)
  progressTimer = setTimeout(() => {
    progressVisible.value = false
    progressWidth.value = '0%'
  }, 400)
})

router.onError(() => {
  progressVisible.value = false
})

// Ctrl+C 快捷键：从极简模式退出至无空隙模式
function onKeyDown(e) {
  if (e.ctrlKey && e.key === 'c' && themeStore.currentLayout === 'minimal') {
    e.preventDefault()
    themeStore.setLayout('compact')
  }
}

onMounted(() => {
  themeStore.initTheme()
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div id="app">
    <VideoBackground />
    <!-- 页面加载进度条 -->
    <div v-if="progressVisible" class="progress-bar">
      <div class="progress-fill" :style="{ width: progressWidth }"></div>
    </div>
    <WebAnalytics />
    <SpeedInsights />
    <Analytics />
    <NotificationRender />
    <ConsoleEasterEgg />
    <ContextMenu />
    <MouseTrail />
    <InstallPrompt />
    <template v-if="!isIndexPage && !isTerminalPage">
      <Header />
      <main class="mid-flex">
        <Sidebar />
        <router-view v-slot="{ Component: RouteComponent }">
          <Transition name="page-fade" mode="out-in">
            <Center :key="route.fullPath">
              <component :is="RouteComponent" />
            </Center>
          </Transition>
        </router-view>
      </main>
      <Footer />
    </template>
    <template v-else>
      <router-view v-slot="{ Component: RouteComponent }">
        <Transition name="page-fade" mode="out-in">
          <component :is="RouteComponent" :key="route.fullPath" />
        </Transition>
      </router-view>
    </template>
  </div>
</template>

<!-- 页面加载进度条 -->
<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 99999;
  pointer-events: none;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--common-color-1), var(--common-hover), #ff6b9d);
  transition: width 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: 0 0 12px var(--common-color-1), 0 0 4px var(--common-color-1);
  border-radius: 0 2px 2px 0;
}

/* 布局样式：.mid-flex 基础 flex 布局兜底（card 在 769-1024px 区间无 layout 文件覆盖，需此处兜底）。
     尺寸/间隙的最终值由 layouts/card.css（>=1025）与 layouts/compact.css（全宽度）以
     .layout-card 前缀覆盖，其选择器权重高于此处 scoped，故不会冲突。 */
.mid-flex {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    flex: 1;
}
</style>

<!-- 页面切换淡入淡出动画 — 非 scoped，因为 Transition 的 class 作用于页面组件根元素，不在 App.vue 的 scope 内 -->
<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>


