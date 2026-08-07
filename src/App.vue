<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
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

const route = useRoute()
const router = useRouter()
const isIndexPage = computed(() => route.path === '/')
const isTerminalPage = computed(() => route.path === '/terminal')

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDark)

// 页面加载进度条
const progressWidth = ref('0%')
const progressVisible = ref(false)
let progressTimer: ReturnType<typeof setTimeout> | null = null

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

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div id="app">
    <!-- 页面加载进度条 -->
    <div v-if="progressVisible" class="page-progress-bar">
      <div class="page-progress-fill" :style="{ width: progressWidth }"></div>
    </div>
    <WebAnalytics />
    <SpeedInsights />
    <Analytics />
    <NotificationRender />
    <ConsoleEasterEgg />
    <ContextMenu />
    <MouseTrail />
    <template v-if="!isIndexPage && !isTerminalPage">
      <Header />
      <main class="mid-flex">
        <Sidebar />
        <Center>
          <router-view :key="route.fullPath" />
        </Center>
      </main>
      <Footer />
    </template>
    <template v-else>
      <router-view :key="route.fullPath" />
    </template>
  </div>
</template>

<!-- 页面加载进度条 -->
<style scoped>
.page-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 99999;
  pointer-events: none;
}

.page-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--common-color-1), var(--common-hover), #ff6b9d);
  transition: width 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: 0 0 12px var(--common-color-1), 0 0 4px var(--common-color-1);
  border-radius: 0 2px 2px 0;
}
</style>

<!-- 布局样式：.mid-flex 基础 flex 布局兜底（card 在 769-1024px 区间无 layout 文件覆盖，需此处兜底）。
     尺寸/间隙的最终值由 layouts/card.css（>=1025）与 layouts/compact.css（全宽度）以
     html[data-layout] 前缀覆盖，其选择器权重高于此处 scoped，故不会冲突。 -->
<style scoped>
.mid-flex {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    flex: 1;
}
</style>


