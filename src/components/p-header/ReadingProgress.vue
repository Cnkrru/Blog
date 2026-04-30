<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
let targetElement = null
let observer = null

let cachedContentCard = null

const findContentCard = () => {
  if (cachedContentCard) {
    return cachedContentCard
  }
  cachedContentCard = document.querySelector('.center-card-content')
  return cachedContentCard
}

const handleScroll = () => {
  if (targetElement) {
    const scrollTop = targetElement.scrollTop
    const scrollHeight = targetElement.scrollHeight
    const clientHeight = targetElement.clientHeight
    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100
    progress.value = Math.min(scrollPercent, 100)
  } else {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100
    progress.value = Math.min(scrollPercent, 100)
  }
}

const updateTargetElement = () => {
  const newElement = findContentCard()
  if (newElement !== targetElement) {
    if (targetElement) {
      targetElement.removeEventListener('scroll', handleScroll)
    }
    targetElement = newElement
    if (targetElement) {
      targetElement.addEventListener('scroll', handleScroll)
    }
    handleScroll()
  }
}

onMounted(() => {
  updateTargetElement()
  
  window.addEventListener('hashchange', updateTargetElement)
  window.addEventListener('popstate', updateTargetElement)
  
  if (targetElement) {
    observer = new ResizeObserver(() => {
      handleScroll()
    })
    observer.observe(targetElement)
  } else {
    window.addEventListener('resize', handleScroll)
  }
  
  handleScroll()
})

onUnmounted(() => {
  if (targetElement) {
    targetElement.removeEventListener('scroll', handleScroll)
  }
  
  window.removeEventListener('hashchange', updateTargetElement)
  window.removeEventListener('popstate', updateTargetElement)
  window.removeEventListener('resize', handleScroll)
  
  if (observer) {
    observer.disconnect()
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

<!-- 布局样式 -->
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
  transition: width 0.2s ease;
  border-radius: 0 3px 3px 0;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.reading-progress-container {
  background-color: var(--common-color-1);
}

.reading-progress-bar {
  background-color: var(--common-hover);
  box-shadow: 0 0 8px var(--common-shadow);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
