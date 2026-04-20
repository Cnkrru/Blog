<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const progress = ref(0)
let targetElement = null
let observer = null

// 缓存元素查找结果
let cachedContentCard = null

const findContentCard = () => {
  // 使用缓存避免重复查询
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
    // 回退到窗口滚动
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
  // 初始查找contentCard元素
  updateTargetElement()
  
  // 监听路由变化，重新查找contentCard元素
  window.addEventListener('hashchange', updateTargetElement)
  window.addEventListener('popstate', updateTargetElement)
  
  // 优化：使用 ResizeObserver 替代 MutationObserver
  // 只观察目标元素本身的变化，而不是整个 document
  if (targetElement) {
    observer = new ResizeObserver(() => {
      handleScroll()
    })
    observer.observe(targetElement)
  } else {
    // 回退到窗口滚动时，使用窗口 resize 事件
    window.addEventListener('resize', handleScroll)
  }
  
  // 初始计算一次
  handleScroll()
})

onUnmounted(() => {
  if (targetElement) {
    targetElement.removeEventListener('scroll', handleScroll)
  }
  
  // 清理事件监听器
  window.removeEventListener('hashchange', updateTargetElement)
  window.removeEventListener('popstate', updateTargetElement)
  window.removeEventListener('resize', handleScroll)
  
  // 清理 ResizeObserver
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

<style scoped>
.reading-progress-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--border-color, #e0e0e0);
  z-index: 1001;
}

.reading-progress-bar {
  height: 100%;
  background-color: var(--primary, #ff6b9d);
  transition: width 0.2s ease;
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 8px var(--primary, #ff6b9d);
}
</style>