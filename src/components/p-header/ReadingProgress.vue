<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const progress = ref(0)
let targetElement: HTMLElement | null = null
let observer: ResizeObserver | null = null
let cachedContentCard: HTMLElement | null = null

const findContentCard = (): HTMLElement | null => {
  if (cachedContentCard?.isConnected) {
    return cachedContentCard
  }
  cachedContentCard = document.querySelector('.center-card-content')
  return cachedContentCard
}

const handleScroll = (): void => {
  if (targetElement) {
    const scrollTop = targetElement.scrollTop
    const scrollHeight = targetElement.scrollHeight
    const clientHeight = targetElement.clientHeight
    const maxScroll = scrollHeight - clientHeight
    progress.value = maxScroll > 0 ? Math.min((scrollTop / maxScroll) * 100, 100) : 0
  } else {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    progress.value = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0
  }
}

const bindScroll = (el: HTMLElement | null): void => {
  if (targetElement) {
    targetElement.removeEventListener('scroll', handleScroll)
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }

  targetElement = el

  if (targetElement) {
    targetElement.addEventListener('scroll', handleScroll, { passive: true })
    observer = new ResizeObserver(() => handleScroll())
    observer.observe(targetElement)
  }
  handleScroll()
}

const refreshTarget = (): void => {
  cachedContentCard = null
  const el = findContentCard()
  bindScroll(el)
}

const handleRouteChange = (): void => {
  setTimeout(refreshTarget, 100)
}

let removeRouteGuard: (() => void) | null = null

onMounted(() => {
  refreshTarget()
  window.addEventListener('resize', handleScroll)
  removeRouteGuard = router.afterEach(handleRouteChange)
})

onUnmounted(() => {
  if (targetElement) {
    targetElement.removeEventListener('scroll', handleScroll)
  }
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('resize', handleScroll)
  if (removeRouteGuard) {
    removeRouteGuard()
  }
})
</script>

<template>
  <div class="reading-progress-container">
    <div
      class="reading-progress-bar"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>

<style scoped>
.reading-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 1001;
}

.reading-progress-bar {
  height: 100%;
  transition: width 0.15s ease;
  border-radius: 0 3px 3px 0;
}
</style>

<style scoped>
.reading-progress-container {
  background-color: var(--common-color-1);
  opacity: 0.25;
}

.reading-progress-bar {
  background: var(--common-gradient);
  box-shadow: 0 0 6px var(--common-color-1);
}
</style>

<style scoped>
</style>
