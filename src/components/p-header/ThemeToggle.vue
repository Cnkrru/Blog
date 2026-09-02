<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
import { computed, ref } from 'vue'
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
  <VButton
    class="button-style v-btn-primary theme-btn"
    title="切换主题"
    :class="{ animating: isAnimating }"
    :aria-label="isDarkTheme ? '切换到亮色主题' : '切换到暗色主题'"
    style="height:36px;min-width:36px"
    @click="toggleTheme"
  >
    <VIcon :src="isDarkTheme ? 'sun.svg' : 'moon.svg'" :size="24" />
    <span v-if="isAnimating" class="emoji-burst">✨</span>
  </VButton>
</template>

<!-- 布局样式 -->
<style scoped>
.theme-btn {
  position: relative;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

.theme-btn.animating {
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


