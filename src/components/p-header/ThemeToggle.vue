<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '../../stores'

const themeStore = useThemeStore()
const isDarkTheme = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
}

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

<!-- 布局样式 -->
<style scoped>
</style>

<!-- 颜色样式 -->
<style scoped>
/* 按钮颜色由 Header.vue 统一管理 */
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
