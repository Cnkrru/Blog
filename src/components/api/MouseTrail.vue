<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useMouseStore, useThemeStore } from '../../stores'

const trail = ref([])
let mouseX = 0
let mouseY = 0
let animationId = null
let lastUpdate = 0
const isBrowser = ref(false)
let charIdCounter = 0
let mouseMoveHandler = null

const mouseStore = useMouseStore()
const themeStore = useThemeStore()

const isDarkTheme = computed(() => themeStore.isDarkTheme)
const isEnabled = computed(() => mouseStore.enabled)
const trailLength = computed(() => mouseStore.trailLength)
const trailSpeed = computed(() => mouseStore.trailSpeed)
const trailSize = computed(() => mouseStore.trailSize)
const trailMode = computed(() => mouseStore.trailMode)
const trailColor = computed(() => mouseStore.trailColor)
const trailChars = computed(() => mouseStore.trailChars)

// 节流函数
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 获取颜色
const getColor = (index, total) => {
  if (trailMode.value === 'fixed') {
    return trailColor.value
  } else if (trailMode.value === 'gradient') {
    const colors = isDarkTheme.value 
      ? ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
      : ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
    const ratio = index / total
    const colorIndex = Math.floor(ratio * colors.length)
    return colors[Math.min(colorIndex, colors.length - 1)]
  } else {
    // 随机颜色
    const colors = isDarkTheme.value 
      ? ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
      : ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6']
    return colors[Math.floor(Math.random() * colors.length)]
  }
}

// 获取随机字符
const getRandomChar = () => {
  return trailChars.value.charAt(Math.floor(Math.random() * trailChars.value.length))
}

// 更新轨迹
const updateTrail = (timestamp) => {
  if (!isBrowser.value || !isEnabled.value) return
  if (timestamp - lastUpdate < trailSpeed.value) {
    animationId = requestAnimationFrame(updateTrail)
    return
  }
  lastUpdate = timestamp

  trail.value = trail.value.map((char) => {
    char.opacity -= 0.1
    char.size -= 0.5
    char.y -= 1
    if (char.opacity <= 0 || char.size <= 0) {
      return null
    }
    return char
  }).filter(Boolean)

  if (trail.value.length < trailLength.value) {
    trail.value.push({
      id: charIdCounter++,
      char: getRandomChar(),
      x: mouseX,
      y: mouseY,
      opacity: 1,
      size: trailSize.value,
      color: getColor(trail.value.length, trailLength.value)
    })
  }

  animationId = requestAnimationFrame(updateTrail)
}

// 处理鼠标移动
const handleMouseMove = (e) => {
  if (!isBrowser.value || !isEnabled.value) return
  mouseX = e.clientX
  mouseY = e.clientY
}

// 处理鼠标离开
const handleMouseLeave = () => {
  if (!isBrowser.value || !isEnabled.value) return
  trail.value = []
}

// 初始化鼠标移动处理器（带节流）
mouseMoveHandler = throttle(handleMouseMove, 10)

onMounted(() => {
  isBrowser.value = true
  document.addEventListener('mousemove', mouseMoveHandler)
  document.addEventListener('mouseleave', handleMouseLeave)
  animationId = requestAnimationFrame(updateTrail)
  
  // 监听主题变化
  mouseStore.setDarkTheme(isDarkTheme.value)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', mouseMoveHandler)
  document.removeEventListener('mouseleave', handleMouseLeave)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

// 监听主题变化
watch(() => isDarkTheme.value, (newValue) => {
  mouseStore.setDarkTheme(newValue)
  // 清空轨迹，以便使用新主题的颜色
  trail.value = []
})

// 监听启用状态变化
watch(() => isEnabled.value, (newValue) => {
  if (!newValue) {
    trail.value = []
  }
})
</script>

<template>
  <div v-if="isBrowser && isEnabled" class="mouse-trail">
    <span
      v-for="item in trail"
      :key="item.id"
      class="trail-char"
      :style="{
        left: `${item.x}px`,
        top: `${item.y}px`,
        opacity: item.opacity,
        fontSize: `${item.size}px`,
        color: item.color,
        textShadow: `0 0 10px ${item.color}`,
        transition: 'opacity 0.1s ease, transform 0.1s ease'
      }"
    >
      {{ item.char }}
    </span>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.mouse-trail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
  overflow: hidden;
}

.trail-char {
  position: absolute;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  transform: translate(-50%, -50%);
  will-change: transform, opacity, font-size;
  user-select: none;
}
</style>

<!-- 颜色样式 -->
<style scoped>
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
@media (prefers-color-scheme: dark) {
  .trail-char {
    text-shadow: 0 0 15px currentColor;
  }
}
</style>
