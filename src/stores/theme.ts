import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>('dark')
  const currentStyle = ref<'ink' | 'sakura'>('ink')
  const currentLayout = ref<'card' | 'compact'>('card')
  const glassAlpha = ref<number>(0.78)
  const isAutoSwitch = ref<boolean>(false)
  const hasUserPreference = ref<boolean>(false)

  const isDark = computed<boolean>(() => currentTheme.value === 'dark')
  const isLight = computed<boolean>(() => currentTheme.value === 'light')

  const applyThemeDom = (): void => {
    if (currentTheme.value === 'dark') {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  const applyStyleDom = (): void => {
    document.documentElement.setAttribute('data-style', currentStyle.value)
  }

  const applyLayoutDom = (): void => {
    document.documentElement.setAttribute('data-layout', currentLayout.value)
  }

  const applyGlassDom = (): void => {
    document.documentElement.style.setProperty('--glass-alpha', String(glassAlpha.value))
  }

  const setTheme = (theme: 'light' | 'dark'): void => {
    currentTheme.value = theme
    hasUserPreference.value = true
    applyThemeDom()
    savePreference()
  }

  const toggleTheme = (): void => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    hasUserPreference.value = true
    applyThemeDom()
    savePreference()
  }

  const setStyle = (style: 'ink' | 'sakura'): void => {
    currentStyle.value = style
    applyStyleDom()
    savePreference()
  }

  const setLayout = (layout: 'card' | 'compact'): void => {
    currentLayout.value = layout
    applyLayoutDom()
    savePreference()
  }

  const setGlassAlpha = (alpha: number): void => {
    glassAlpha.value = alpha
    applyGlassDom()
    savePreference()
  }

  // 实时拖动时仅更新变量与内存，不写 localStorage（由调用方节流落盘）
  const setGlassAlphaLive = (alpha: number): void => {
    glassAlpha.value = alpha
    applyGlassDom()
  }

  const setAutoSwitch = (enabled: boolean): void => {
    isAutoSwitch.value = enabled
    savePreference()
  }

  const initTheme = (): void => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme-preference')
    if (saved) {
      const { theme, style, layout, glass, auto } = JSON.parse(saved)
      currentTheme.value = (theme as 'light' | 'dark') ?? 'dark'
      currentStyle.value = (style as 'ink' | 'sakura') ?? 'ink'
      currentLayout.value = (layout as 'card' | 'compact') ?? 'card'
      glassAlpha.value = typeof glass === 'number' ? glass : (currentStyle.value === 'sakura' ? 0.55 : 0.78)
      isAutoSwitch.value = auto !== false
      hasUserPreference.value = true
    } else {
      currentTheme.value = 'dark'
      currentStyle.value = 'ink'
      currentLayout.value = 'card'
      glassAlpha.value = 0.78
    }
    applyThemeDom()
    applyStyleDom()
    applyLayoutDom()
    applyGlassDom()
  }

  const savePreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('theme-preference', JSON.stringify({
        theme: currentTheme.value,
        style: currentStyle.value,
        layout: currentLayout.value,
        glass: glassAlpha.value,
        auto: isAutoSwitch.value
      }))
    } catch (e) {
      console.warn('[themeStore] 保存主题偏好失败:', e)
    }
  }

  const resetToDefault = (): void => {
    currentTheme.value = 'dark'
    currentStyle.value = 'ink'
    currentLayout.value = 'card'
    glassAlpha.value = 0.78
    isAutoSwitch.value = false
    hasUserPreference.value = false
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('theme-preference')
    }
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.setAttribute('data-style', 'ink')
    document.documentElement.setAttribute('data-layout', 'card')
    document.documentElement.style.setProperty('--glass-alpha', '0.78')
  }

  return {
    currentTheme,
    currentStyle,
    currentLayout,
    glassAlpha,
    isAutoSwitch,
    hasUserPreference,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
    setStyle,
    setLayout,
    setGlassAlpha,
    setGlassAlphaLive,
    setAutoSwitch,
    initTheme,
    savePreference,
    resetToDefault
  }
})
