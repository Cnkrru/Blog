<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const trailChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const maxTrailLength = 20
const trail = ref([])
let mouseX = 0
let mouseY = 0
let animationId = null
let lastUpdate = 0
const updateInterval = 40
const isBrowser = ref(false)
let charIdCounter = 0

const getGradientColor = (index, total) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
  const ratio = index / total
  const colorIndex = Math.floor(ratio * colors.length)
  return colors[Math.min(colorIndex, colors.length - 1)]
}

const getRandomChar = () => {
  return trailChars.charAt(Math.floor(Math.random() * trailChars.length))
}

const updateTrail = (timestamp) => {
  if (!isBrowser.value) return
  if (timestamp - lastUpdate < updateInterval) {
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

  if (trail.value.length < maxTrailLength) {
    trail.value.push({
      id: charIdCounter++,
      char: getRandomChar(),
      x: mouseX,
      y: mouseY,
      opacity: 1,
      size: 18,
      color: getGradientColor(trail.value.length, maxTrailLength)
    })
  }

  animationId = requestAnimationFrame(updateTrail)
}

const handleMouseMove = (e) => {
  if (!isBrowser.value) return
  mouseX = e.clientX
  mouseY = e.clientY
}

const handleMouseLeave = () => {
  if (!isBrowser.value) return
  trail.value = []
}

onMounted(() => {
  isBrowser.value = true
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  animationId = requestAnimationFrame(updateTrail)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<template>
  <div v-if="isBrowser" class="mouse-trail">
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
        textShadow: `0 0 10px ${item.color}`
      }"
    >
      {{ item.char }}
    </span>
  </div>
</template>

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
  transition: opacity 0.05s ease;
  will-change: transform, opacity;
}
</style>
