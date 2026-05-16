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
import Live2dWidget from './components/media/Live2dWidget.vue'
import NotificationRender from './components/content/NotificationRender.vue'
import MouseTrail from './components/api/MouseTrail.vue'
import ConsoleEasterEgg from './components/media/ConsoleEasterEgg.vue'
import ContextMenu from './components/p-center/ContextMenu.vue'
import ScrollEasterEgg from './components/p-center/ScrollEasterEgg.vue'

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
    <ScrollEasterEgg />
    <MouseTrail />
    <template v-if="!isIndexPage && !isTerminalPage">
      <Live2dWidget />
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
  transition: width 0.25s ease;
  box-shadow: 0 0 10px var(--common-color-1);
}
</style>

<!-- 布局样式 -->
<style scoped>
.mid-flex {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    gap: 20px;
    flex: 1;
}

@media (max-width: 480px) {
    .mid-flex {
        gap: 0;
        padding: 0;
        flex: 1;
    }
}

@media (max-width: 768px) {
    .mid-flex {
        gap: 0;
        padding: 0;
    }
}
</style>

<!-- 颜色样式 -->
<style scoped>
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
