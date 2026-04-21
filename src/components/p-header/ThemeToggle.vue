<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '../../stores'

const themeStore = useThemeStore()
const isDarkTheme = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
}

onMounted(() => {
  // 主题已在App.vue中初始化
})

onUnmounted(() => {
  // 清理工作已在themeStore中处理
})
</script>

<template>
  <div
    class="button-style theme-toggle-btn"
    @click="toggleTheme"
    :aria-label="isDarkTheme ? '切换到亮色主题' : '切换到暗色主题'"
    role="button"
    tabindex="0"
    @keydown.enter="toggleTheme"
    @keydown.space="toggleTheme"
  >
    <img src="../../assets/imgs/svg/theme-toggle.svg" alt="">
  </div>
</template>