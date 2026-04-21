import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const isDark = ref(false)
  const themeMode = ref('auto') // auto, manual
  
  // 计算属性
  const currentTheme = computed(() => isDark.value ? 'dark' : 'light')
  
  // 方法
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
    themeMode.value = 'manual'
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('themeMode', 'manual')
    }
  }
  
  const setTheme = (dark) => {
    isDark.value = dark
    applyTheme()
  }
  
  const applyTheme = () => {
    if (typeof document !== 'undefined') {
      const body = document.body
      if (isDark.value) {
        body.classList.add('dark-theme')
      } else {
        body.classList.remove('dark-theme')
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', currentTheme.value)
      }
      
      // 触发Giscus主题更新
      if (typeof updateGiscusTheme === 'function') {
        updateGiscusTheme()
      }
    }
  }
  
  const isNightTime = () => {
    const hour = new Date().getHours()
    return hour >= 13
  }
  
  const checkAutoTheme = () => {
    if (themeMode.value !== 'auto') return
    const isDarkTime = isNightTime()
    setTheme(isDarkTime)
  }
  
  const initTheme = () => {
    if (typeof document === 'undefined' || typeof localStorage === 'undefined') return
    
    const savedTheme = localStorage.getItem('theme')
    const savedMode = localStorage.getItem('themeMode')
    
    if (savedMode) {
      themeMode.value = savedMode
    }
    
    if (themeMode.value === 'manual' && savedTheme) {
      setTheme(savedTheme === 'dark')
    } else {
      checkAutoTheme()
    }
    
    // 启动自动主题定时器
    startAutoThemeTimer()
  }
  
  let autoThemeTimer = null
  const startAutoThemeTimer = () => {
    if (typeof window === 'undefined') return
    
    if (autoThemeTimer) clearInterval(autoThemeTimer)
    
    autoThemeTimer = setInterval(() => {
      checkAutoTheme()
    }, 60000) // 每分钟检查一次
  }
  
  const cleanup = () => {
    if (autoThemeTimer) {
      clearInterval(autoThemeTimer)
      autoThemeTimer = null
    }
  }
  
  return {
    isDark,
    themeMode,
    currentTheme,
    toggleTheme,
    setTheme,
    initTheme,
    cleanup
  }
})