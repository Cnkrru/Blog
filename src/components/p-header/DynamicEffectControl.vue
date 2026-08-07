<template>
  <div
    class="button-style"
    @click="toggleEffect"
    :class="{ animating: isAnimating }"
    :title="isEffectEnabled ? '关闭动态效果' : '开启动态效果'"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024" fill="currentColor"><path d="M652.899 189.266c-16.036-7.058-34.761 0.22-41.82 16.258-7.059 16.038 0.221 34.761 16.258 41.819 104.649 46.06 172.27 149.682 172.27 263.991 0 77-29.986 149.392-84.434 203.839s-126.839 84.434-203.839 84.434-149.393-29.986-203.84-84.434c-54.448-54.447-84.433-126.839-84.433-203.839 0-114.963 68.159-218.821 173.642-264.591 16.075-6.975 23.451-25.659 16.477-41.733-6.975-16.075-25.662-23.452-41.734-16.477-128.688 55.837-211.839 182.544-211.839 322.8 0 47.469 9.304 93.535 27.653 136.917 17.717 41.887 43.073 79.499 75.365 111.791 32.292 32.291 69.903 57.647 111.791 75.364 43.383 18.35 89.449 27.653 136.918 27.653 47.468 0 93.535-9.304 136.917-27.653 41.888-17.717 79.499-43.073 111.791-75.364 32.291-32.292 57.647-69.904 75.364-111.791 18.35-43.383 27.653-89.448 27.653-136.917 0.001-139.458-82.493-265.877-210.16-322.067z"/><path d="M512 479.517c17.522 0 31.727-14.205 31.727-31.727V128.228c0-17.522-14.204-31.727-31.727-31.727s-31.727 14.205-31.727 31.727V447.79c0 17.522 14.205 31.727 31.727 31.727z"/></svg>
    <span v-if="isAnimating" class="emoji-burst">✨</span>
  </div>

  <Teleport to="body">
    <div
      v-if="isEffectEnabled && !isDarkMode"
      class="sakura-container"
    ></div>

    <div
      v-if="isEffectEnabled && isDarkMode"
      class="snow-container"
    >
      <div v-for="i in 30" :key="i" class="snowflake" :style="snowflakeStyles[i - 1]"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useDynamicEffectsStore } from '../../stores/index'

const dynamicEffectsStore = useDynamicEffectsStore()

const isEffectEnabled = ref(true)
const isDarkMode = ref(false)
const isAnimating = ref(false)
let scriptLoaded = false
let observer = null

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const checkTheme = () => {
  if (isBrowser) {
    isDarkMode.value = document.body.classList.contains('dark-theme')
  }
}

const toggleEffect = () => {
  isAnimating.value = true
  isEffectEnabled.value = !isEffectEnabled.value

  if (isBrowser) {
    localStorage.setItem('dynamicEffectEnabled', isEffectEnabled.value.toString())
  }

  if (isEffectEnabled.value) {
    initEffects()
  } else {
    destroyEffects()
  }

  setTimeout(() => { isAnimating.value = false }, 400)
}

const initEffects = () => {
  if (!isBrowser) return

  if (!isDarkMode.value) {
    initSakura()
  }
}

const destroyEffects = () => {
  if (!isBrowser) return

  destroySakura()
}

const initSakura = () => {
  if (!isBrowser) return

  if (!scriptLoaded) {
    const script = document.createElement('script')
    script.src = '/js/sakuraPlus.js'
    script.onload = () => {
      scriptLoaded = true
      setTimeout(() => {
        if (typeof startSakura !== 'undefined') {
          startSakura()
        }
      }, 100)
    }
    document.head.appendChild(script)
  } else {
    if (typeof staticx !== 'undefined') {
      staticx = false
    }
    if (typeof startSakura !== 'undefined') {
      startSakura()
    }
  }
}

const destroySakura = () => {
  if (!isBrowser) return

  if (typeof stopp !== 'undefined') {
    try {
      stopp()
    } catch (e) {}
  }

  const canvas = document.getElementById('canvas_sakura')
  if (canvas && canvas.parentNode) {
    try {
      canvas.parentNode.removeChild(canvas)
    } catch (e) {}
  }
}

// 基于索引的确定性伪随机，避免每次渲染雪花跳动
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const snowflakeStyles = Array.from({ length: 30 }, (_, i) => {
  const r1 = seededRandom(i * 7 + 1)
  const r2 = seededRandom(i * 7 + 2)
  const r3 = seededRandom(i * 7 + 3)
  const r4 = seededRandom(i * 7 + 4)
  const r5 = seededRandom(i * 7 + 5)
  const size = 5 + r5 * 12
  return {
    left: `${r1 * 100}%`,
    animationDelay: `${r2 * 5}s`,
    animationDuration: `${5 + r3 * 10}s`,
    opacity: 0.5 + r4 * 0.5,
    width: `${size}px`,
    height: `${size}px`,
  }
})

onMounted(() => {
  if (!isBrowser) return

  const savedSetting = localStorage.getItem('dynamicEffectEnabled')
  if (savedSetting !== null) {
    isEffectEnabled.value = savedSetting === 'true'
  }

  checkTheme()

  if (isEffectEnabled.value) {
    initEffects()
  }

  if (typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme()
          if (isEffectEnabled.value) {
            destroyEffects()
            initEffects()
          }
        }
      })
    })

    observer.observe(document.body, {
      attributes: true
    })
  }
})

onUnmounted(() => {
  if (!isBrowser) return

  if (observer) {
    observer.disconnect()
  }
  destroyEffects()
})

watch(isEffectEnabled, (newValue) => {
  if (newValue) {
    initEffects()
  } else {
    destroyEffects()
  }
})

watch(isDarkMode, () => {
  if (isEffectEnabled.value) {
    destroyEffects()
    initEffects()
  }
})
</script>

<!-- 布局样式 -->
<style scoped>
.sakura-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100001;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: snowfall linear infinite;
}

@keyframes snowfall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
</style>

<!-- 颜色样式 -->
<style scoped>
.snowflake {
  background-color: var(--common-color-1);
}
/* 按钮颜色由 Header.vue 统一管理 */
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
