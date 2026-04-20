<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: '欢迎来到我的博客'
  },
  finalText: {
    type: String,
    default: '欢迎来到我的博客'
  }
})

const isAnimating = ref(false)
const showFinalText = ref(false)
const overlayRef = ref(null)
const backdropRef = ref(null)

const easeOutBounce = (t) => {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
  }
}

const animateCharFall = (element, targetY) => {
  const startY = -150
  const duration = 1000
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const currentY = startY + (targetY - startY) * easeOutBounce(progress)
    element.style.top = currentY + 'px'

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      setTimeout(() => {
        element.style.opacity = '0'
        element.style.transition = 'opacity 0.5s ease'
      }, 300)
    }
  }

  requestAnimationFrame(animate)
}

const triggerEasterEgg = () => {
  if (isAnimating.value) return

  isAnimating.value = true
  showFinalText.value = false

  const overlay = overlayRef.value
  const backdrop = backdropRef.value
  if (!overlay || !backdrop) return
  
  const existingChars = overlay.querySelectorAll('.falling-char')
  existingChars.forEach(char => char.remove())
  
  backdrop.style.display = 'block'
  overlay.style.display = 'flex'

  const chars = props.text.split('')
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const charWidth = 150
  const totalWidth = chars.length * charWidth
  const startX = (viewportWidth - totalWidth) / 2

  chars.forEach((char, index) => {
    const charElement = document.createElement('div')
    charElement.className = 'falling-char'
    charElement.textContent = char
    
    charElement.style.cssText = `
      position: absolute;
      font-size: 144px;
      font-weight: 800;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
      background-size: 400% 400%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-family: 'Courier New', Courier, monospace;
      animation: gradient-shift 3s ease infinite;
      left: ${startX + index * charWidth}px;
      top: -150px;
      opacity: 0;
    `
    overlay.appendChild(charElement)

    setTimeout(() => {
      charElement.style.opacity = '1'
      animateCharFall(charElement, viewportHeight / 2)
    }, index * 100 + 500)
  })

  setTimeout(() => {
    showFinalText.value = true
    setTimeout(() => {
      isAnimating.value = false
      setTimeout(() => {
        backdrop.style.display = 'none'
        overlay.style.display = 'none'
        showFinalText.value = false
      }, 2000)
    }, 1000)
  }, chars.length * 100 + 1500)
}

onMounted(() => {
  if (overlayRef.value) {
    overlayRef.value.style.display = 'none'
  }
  if (backdropRef.value) {
    backdropRef.value.style.display = 'none'
  }
})
</script>

<template>
  <div class="easter-egg-wrapper">
    <button
      class="easter-egg-trigger-btn"
      @click="triggerEasterEgg"
      :disabled="isAnimating"
    >
      {{ isAnimating ? '...' : '点击一下试试?' }}
    </button>
    
    <div ref="backdropRef" class="animation-backdrop"></div>
    <div ref="overlayRef" class="animation-overlay">
      <div v-if="showFinalText" class="final-text">
        {{ finalText }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.easter-egg-wrapper {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.easter-egg-trigger-btn {
  padding: 15px 40px;
  font-size: 16px;
  background-color: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  transition: all 0.3s ease;
}

.easter-egg-trigger-btn:hover:not(:disabled) {
  background-color: #ff8e8e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.easter-egg-trigger-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.animation-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9998;
  pointer-events: none;
}

.animation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.final-text {
  font-size: 144px;
  font-weight: 800;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 24px;
  text-align: center;
  font-family: 'Courier New', Courier, monospace;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
