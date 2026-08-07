<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useThemeStore } from '../../stores'

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
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moon-sun" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M12 9v4l3 3"/></svg>
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

<!-- 颜色样式 -->
<style scoped>
/* 按钮颜色由 Header.vue 统一管理 */
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
