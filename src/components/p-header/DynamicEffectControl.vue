<template>
  <div
    class="button-style"
    @click="toggleEffect"
    :title="isEffectEnabled ? '关闭动态效果' : '开启动态效果'"
  >
    <img
      src="../../assets/imgs/svg/kaiguan.svg"
      alt="切换动态效果"
    />
  </div>

  <div
    v-if="isEffectEnabled && !isDarkMode"
    class="sakura-container"
  ></div>

  <div
    v-if="isEffectEnabled && isDarkMode"
    class="snow-container"
  >
    <div v-for="i in 30" :key="i" class="snowflake" :style="getSnowflakeStyle(i)"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useDynamicEffectsStore } from '../../stores/index.js'

const dynamicEffectsStore = useDynamicEffectsStore()

const isEffectEnabled = ref(true)
const isDarkMode = ref(false)
let scriptLoaded = false
let observer = null

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const checkTheme = () => {
  if (isBrowser) {
    isDarkMode.value = document.body.classList.contains('dark-theme')
  }
}

const toggleEffect = () => {
  isEffectEnabled.value = !isEffectEnabled.value

  if (isBrowser) {
    localStorage.setItem('dynamicEffectEnabled', isEffectEnabled.value.toString())
  }

  if (isEffectEnabled.value) {
    initEffects()
  } else {
    destroyEffects()
  }
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

const getSnowflakeStyle = (index) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${5 + Math.random() * 10}s`,
    opacity: 0.5 + Math.random() * 0.5,
    transform: `scale(${0.5 + Math.random() * 1})`
  }
}

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
