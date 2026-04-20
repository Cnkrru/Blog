<template>
  <main class="hero-content">
    <div class="hero-text">
      <p class="hero-subtitle">
        <span class="typing-text">HELLO WORLD</span>
      </p>
      <h1 class="hero-title">
        <span class="typing-text">{{ typingText }}</span>
        <span class="cursor-blink">|</span>
      </h1>
    </div>

    <div class="hero-buttons">
      <button class="btn btn-primary" @click="navigateTo('/home')">
        <span class="btn-text">开始</span>
        <span class="btn-glow"></span>
      </button>
    </div>

    <div class="right-aligned-content">
      <div class="main-content">
          <div class="left-card">
            <div class="clock-container">
              <RealTimeClock :size="'small'" />
            </div>
            <div class="heatmap-container">
              <Heatmap />
            </div>
          </div>
          <div class="right-card">
            <VisitorMap />
          </div>
        </div>
    </div>

  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Heatmap from './Heatmap.vue'
import RealTimeClock from './RealTimeClock.vue'
import VisitorMap from './VisitorMap.vue'

const router = useRouter()

// 优化的打字效果组合式函数
function useTyping(options = {}) {
  const {
    text = 'Welcome to Cnkrru\'s Blog',
    typingSpeed = 150,
    deletingSpeed = 80,
    pauseTime = 2000,
    loop = true,
    randomSpeed = true
  } = options

  const typingText = ref('')
  const typingIndex = ref(0)
  const isDeleting = ref(false)
  const isPaused = ref(false)
  const currentText = ref(text)
  
  let animationFrameId = null
  let lastTime = 0
  let pauseStartTime = 0
  let isPausing = false

  const getRandomSpeed = (baseSpeed) => {
    if (!randomSpeed) return baseSpeed
    return baseSpeed * (0.8 + Math.random() * 0.4) // 随机速度波动 20%
  }

  const typeEffect = (timestamp) => {
    if (isPaused.value) {
      animationFrameId = requestAnimationFrame(typeEffect)
      return
    }

    if (!lastTime) lastTime = timestamp
    const elapsed = timestamp - lastTime

    if (isPausing) {
      if (elapsed >= pauseTime) {
        isPausing = false
        isDeleting.value = true
        lastTime = timestamp
      }
    } else if (!isDeleting.value) {
      const currentSpeed = getRandomSpeed(typingSpeed)
      if (elapsed >= currentSpeed) {
        if (typingIndex.value < currentText.value.length) {
          typingText.value += currentText.value.charAt(typingIndex.value)
          typingIndex.value++
          lastTime = timestamp
        } else if (loop) {
          isPausing = true
          pauseStartTime = timestamp
          lastTime = timestamp
        }
      }
    } else {
      const currentSpeed = getRandomSpeed(deletingSpeed)
      if (elapsed >= currentSpeed) {
        if (typingIndex.value > 0) {
          typingText.value = currentText.value.substring(0, typingIndex.value - 1)
          typingIndex.value--
          lastTime = timestamp
        } else if (loop) {
          isDeleting.value = false
          lastTime = timestamp
        }
      }
    }

    animationFrameId = requestAnimationFrame(typeEffect)
  }

  const start = () => {
    isPaused.value = false
    if (!animationFrameId) {
      lastTime = 0
      animationFrameId = requestAnimationFrame(typeEffect)
    }
  }

  const pause = () => {
    isPaused.value = true
  }

  const reset = () => {
    pause()
    typingText.value = ''
    typingIndex.value = 0
    isDeleting.value = false
    isPausing = false
    lastTime = 0
  }

  const updateText = (newText) => {
    currentText.value = newText
    reset()
    start()
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  })

  watch(() => text, (newText) => {
    updateText(newText)
  })

  return {
    typingText,
    isPaused,
    start,
    pause,
    reset,
    updateText
  }
}

// 使用优化后的打字效果
const { typingText } = useTyping({
  text: 'Welcome to Cnkrru\'s Blog',
  typingSpeed: 150,
  deletingSpeed: 80,
  pauseTime: 2000,
  loop: true,
  randomSpeed: true
})

const checkTimeAndSetTheme = () => {
  if (typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
    const themeMode = localStorage.getItem('themeMode')
    if (themeMode === 'manual') return

    const body = document.body
    const hour = new Date().getHours()
    const isNight = hour < 13

    if (isNight) {
      body.classList.add('dark-theme')
    } else {
      body.classList.remove('dark-theme')
    }
  }
}

const navigateTo = (path) => {
  router.push(path)
}

onMounted(() => {
  checkTimeAndSetTheme()

  const intervalId = setInterval(checkTimeAndSetTheme, 60000)

  onUnmounted(() => {
    clearInterval(intervalId)
  })
})
</script>

<style scoped>
.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 6rem 2rem;
  text-align: center;
}

.hero-text {
  margin-bottom: 3rem;
}

.hero-subtitle {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.glow-text {
  background: var(--hero-gradient-text);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.typing-text {
  background: var(--hero-gradient-text);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

.cursor-blink {
  display: inline-block;
  color: var(--hero-accent-primary);
}

.hero-description {
  font-size: 1.25rem;
  color: var(--hero-text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  position: relative;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  background: transparent;
}

.btn-primary {
  background: var(--hero-gradient-text);
  background-size: 400% 400%;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  animation: gradient-shift 3s ease infinite;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.6);
}

.btn-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.btn-primary:hover .btn-glow {
  width: 300px;
  height: 300px;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-secondary {
  border: 2px solid rgba(102, 126, 234, 0.5);
  color: var(--hero-accent-primary);
  background: rgba(102, 126, 234, 0.05);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(102, 126, 234, 0.15);
  border-color: var(--hero-accent-primary);
  transform: translateY(-2px);
}

.right-aligned-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.main-content {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  align-items: flex-start;
}

.left-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-height: 650px;
}

.right-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 654px;
}

.clock-container {
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.heatmap-container {
  height: 100%;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .hero-buttons {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
  }

  .main-content {
    flex-direction: column;
    align-items: center;
  }

  .left-card {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .right-card {
    width: 100%;
  }
}
</style>