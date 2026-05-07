import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>('light')
  const isAutoSwitch = ref<boolean>(true)
  const hasUserPreference = ref<boolean>(false)

  const isDark = computed<boolean>(() => currentTheme.value === 'dark')
  const isLight = computed<boolean>(() => currentTheme.value === 'light')

  const setTheme = (theme: 'light' | 'dark'): void => {
    currentTheme.value = theme
    hasUserPreference.value = true
    if (theme === 'dark') {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    document.documentElement.setAttribute('data-theme', theme)
    savePreference()
  }

  const toggleTheme = (): void => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    hasUserPreference.value = true
    if (currentTheme.value === 'dark') {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    document.documentElement.setAttribute('data-theme', currentTheme.value)
    savePreference()
  }

  const setAutoSwitch = (enabled: boolean): void => {
    isAutoSwitch.value = enabled
    savePreference()
  }

  const initTheme = (): void => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme-preference')
    if (saved) {
      const { theme, auto } = JSON.parse(saved)
      currentTheme.value = theme as 'light' | 'dark'
      isAutoSwitch.value = auto !== false
      hasUserPreference.value = true
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark' : 'light'
    }
    if (currentTheme.value === 'dark') {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  const savePreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('theme-preference', JSON.stringify({
        theme: currentTheme.value,
        auto: isAutoSwitch.value
      }))
    } catch (e) {
      console.warn('[themeStore] 保存主题偏好失败:', e)
    }
  }

  const resetToDefault = (): void => {
    currentTheme.value = 'light'
    isAutoSwitch.value = true
    hasUserPreference.value = false
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('theme-preference')
    }
    document.documentElement.setAttribute('data-theme', 'light')
  }

  return {
    currentTheme,
    isAutoSwitch,
    hasUserPreference,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
    setAutoSwitch,
    initTheme,
    savePreference,
    resetToDefault
  }
})
