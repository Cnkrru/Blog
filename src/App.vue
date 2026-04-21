<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from './stores/index.js'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Center from './components/Center.vue'
import Footer from './components/Footer.vue'
import WebAnalytics from './components/api/WebAnalytics.vue'
import Live2dWidget from './components/media/Live2dWidget.vue'
import Notification from './components/content/Notification.vue'
import MouseTrail from './components/p-center/MouseTrail.vue'
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
    <Notification />
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