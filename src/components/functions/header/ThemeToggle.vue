<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isDarkTheme = ref(false)
let autoThemeTimer = null

const toggleTheme = () => {
  if (typeof document !== 'undefined') {
    const body = document.body

    body.classList.toggle('dark-theme')

    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light'
    localStorage.setItem('theme', currentTheme)
    localStorage.setItem('themeMode', 'manual')

    body.style.transition = 'all 0.3s ease'

    if (typeof updateGiscusTheme === 'function') {
        updateGiscusTheme()
    }

    isDarkTheme.value = body.classList.contains('dark-theme')
  }
}

const isNightTime = () => {
  const hour = new Date().getHours()
  return hour < 13
}

const applyTheme = (isDark) => {
  if (typeof document === 'undefined') return
  const body = document.body

  if (isDark) {
    body.classList.add('dark-theme')
  } else {
    body.classList.remove('dark-theme')
  }

  isDarkTheme.value = isDark

  if (typeof updateGiscusTheme === 'function') {
    updateGiscusTheme()
  }
}

const checkAutoTheme = () => {
  const themeMode = localStorage.getItem('themeMode')
  if (themeMode === 'manual') return false

  const isDark = isNightTime()
  applyTheme(isDark)
  return true
}

const startAutoThemeTimer = () => {
  if (autoThemeTimer) clearInterval(autoThemeTimer)

  checkAutoTheme()

  autoThemeTimer = setInterval(() => {
    const themeMode = localStorage.getItem('themeMode')
    if (themeMode !== 'manual') {
      checkAutoTheme()
    }
  }, 60000)
}

const initTheme = () => {
  if (typeof document === 'undefined') return

  const savedTheme = localStorage.getItem('theme')
  const themeMode = localStorage.getItem('themeMode')

  if (themeMode === 'manual' && savedTheme) {
    applyTheme(savedTheme === 'dark')
  } else {
    checkAutoTheme()
  }

  startAutoThemeTimer()
}

onMounted(() => {
  initTheme()
})

onUnmounted(() => {
  if (autoThemeTimer) {
    clearInterval(autoThemeTimer)
    autoThemeTimer = null
  }
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
    <img src="../../../assets/imgs/svg/theme-toggle.svg" alt="">
  </div>
</template>