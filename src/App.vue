<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from './stores/index.js'
import './style.css'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Center from './components/Center.vue'
import Footer from './components/Footer.vue'
import WebAnalytics from './components/api/WebAnalytics.vue'
import Live2dWidget from './components/media/Live2dWidget.vue'
import NotificationRender from './components/content/NotificationRender.vue'
import MouseTrail from './components/api/MouseTrail.vue'
import ConsoleEasterEgg from './components/media/ConsoleEasterEgg.vue'

const route = useRoute()
const isIndexPage = computed(() => route.path === '/')
const isTerminalPage = computed(() => route.path === '/terminal')

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDark)

onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
})
</script>

<template>
  <div id="app">
    <WebAnalytics />
    <SpeedInsights />
    <Analytics />
    <NotificationRender />
    <ConsoleEasterEgg />
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
<!-- 布局样式 -->
<style scoped>
.mid-flex {
    max-width: 1400px;
    max-height: 650px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    gap: 20px;
}
</style>

<!-- 颜色样式 -->
<style scoped>
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>