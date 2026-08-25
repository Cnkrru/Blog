<script setup>
import { computed, ref } from 'vue'
import { useThemeStore } from '../../stores'
import sunSvg from '@/assets/svg/sun.svg?raw'
import moonSvg from '@/assets/svg/moon.svg?raw'

const themeStore = useThemeStore()
const isDarkTheme = computed(() => themeStore.isDark)
const isAnimating = ref(false)

const toggleTheme = () => {
  isAnimating.value = true
  themeStore.toggleTheme()
  setTimeout(() => {
    isAnimating.value = false
  }, 400)
}
</script>

<template>
  <div
    class="button-style theme-toggle-btn"
    title="切换主题"
    @click="toggleTheme"
    :aria-label="isDarkTheme ? '切换到亮色主题' : '切换到暗色主题'"
    role="button"
    tabindex="0"
    @keydown.enter="toggleTheme"
    @keydown.space="toggleTheme"
    :class="{ animating: isAnimating }"
  >
    <span v-if="isDarkTheme" class="svg-icon" :style="{ width: '24px', height: '24px' }" v-html="sunSvg"></span>
    <span v-else class="svg-icon" :style="{ width: '24px', height: '24px' }" v-html="moonSvg"></span>
    <span v-if="isAnimating" class="emoji-burst">✨</span>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.theme-toggle-btn {
  position: relative;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

.theme-toggle-btn.animating {
  animation: spinBounce 0.4s ease;
}

@keyframes spinBounce {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.emoji-burst {
  position: absolute;
  font-size: 20px;
  animation: burst 0.4s ease;
  pointer-events: none;
}

@keyframes burst {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(0, -20px) scale(1.5);
  }
}
</style>


