<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Center from './components/Center.vue'
import Footer from './components/Footer.vue'
import BaiduAnalytics from './components/functions/header/BaiduAnalytics.vue'
import GoogleAnalytics from './components/functions/header/GoogleAnalytics.vue'
import Live2dWidget from './components/functions/center/Live2dWidget.vue'
import Notification from './components/functions/center/Notification.vue'
import PerformanceMonitor from './components/functions/center/PerformanceMonitor.vue'
import MouseTrail from './components/functions/center/MouseTrail.vue'
import ConsoleEasterEgg from './components/functions/center/ConsoleEasterEgg.vue'

const route = useRoute()
const isIndexPage = computed(() => route.path === '/')
const isSerialToolPage = computed(() => route.path === '/tool/1')
const isCodeRunnerToolPage = computed(() => route.path === '/tool/2')
const isTerminalPage = computed(() => route.path === '/terminal')

const isDarkMode = ref(false)
const isBrowser = typeof window !== 'undefined'

const checkTheme = () => {
  if (isBrowser) {
    const hasDarkClass = document.body.classList.contains('dark-theme')
    isDarkMode.value = hasDarkClass
    console.log('主题检测:', hasDarkClass ? '暗色' : '亮色')
    return hasDarkClass
  }
  return false
}

let observer = null

const performanceMonitor = ref(null)

onMounted(() => {
  nextTick(() => {
    console.log('App mounted, checking theme...')
    checkTheme()
    
    if (isBrowser && performanceMonitor.value) {
      window.performanceMonitor = performanceMonitor.value
      console.log('性能监控已启用')
    }
    
    if (isBrowser && typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            console.log('主题变化:', mutation.target.className)
            checkTheme()
          }
        })
      })
      
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      })
      console.log('主题观察者已启动')
    }
  })
})
</script>

<template>
  <div id="app">
    <BaiduAnalytics />
    <GoogleAnalytics />
    <SpeedInsights />
    <Analytics />
    <Notification />
    <ConsoleEasterEgg />
    <MouseTrail />
    <PerformanceMonitor ref="performanceMonitor" />
    <template v-if="!isIndexPage && !isSerialToolPage && !isCodeRunnerToolPage && !isTerminalPage">
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