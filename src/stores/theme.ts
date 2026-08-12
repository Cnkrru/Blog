import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import bgVideoDefault from '../assets/imgs/bg.mp4'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>('dark')
  const currentStyle = ref<'ink' | 'sakura' | 'purple' | 'cyan'>('ink')
  const currentLayout = ref<'card' | 'compact' | 'minimal'>('card')
  const glassAlpha = ref<number>(0.78)
  const isAutoSwitch = ref<boolean>(false)
  const hasUserPreference = ref<boolean>(false)
  const bgType = ref<'image' | 'video'>('image')
  const bgVideoUrl = ref<string>(bgVideoDefault)

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

  const applyBgDom = (): void => {
    document.documentElement.setAttribute('data-bg-type', bgType.value)
    if (bgVideoUrl.value) {
      document.documentElement.style.setProperty('--bg-video-url', `url(${bgVideoUrl.value})`)
    }
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

  const setStyle = (style: 'ink' | 'sakura' | 'purple' | 'cyan'): void => {
    currentStyle.value = style
    applyStyleDom()
    savePreference()
  }

  const setLayout = (layout: 'card' | 'compact' | 'minimal'): void => {
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

  const setBgType = (type: 'image' | 'video'): void => {
    bgType.value = type
    if (type === 'video' && !bgVideoUrl.value) {
      bgVideoUrl.value = bgVideoDefault
    }
    applyBgDom()
    savePreference()
  }

  const setBgVideoUrl = (url: string): void => {
    bgVideoUrl.value = url
    if (url) {
      document.documentElement.style.setProperty('--bg-video-url', `url(${url})`)
    } else {
      document.documentElement.style.removeProperty('--bg-video-url')
    }
    savePreference()
  }

  const initTheme = (): void => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme-preference')
    if (saved) {
      const { theme, style, layout, glass, auto, bgType: savedBg, bgVideoUrl: savedVideo } = JSON.parse(saved)
      currentTheme.value = (theme as 'light' | 'dark') ?? 'dark'
      currentStyle.value = (style as 'ink' | 'sakura' | 'purple' | 'cyan') ?? 'ink'
      currentLayout.value = (layout as 'card' | 'compact' | 'minimal') ?? 'card'
      glassAlpha.value = typeof glass === 'number' ? glass : (['sakura', 'purple', 'cyan'].includes(currentStyle.value) ? 0.55 : 0.78)
      isAutoSwitch.value = auto !== false
      bgType.value = (savedBg as 'image' | 'video') ?? 'image'
      bgVideoUrl.value = (savedVideo as string) || bgVideoDefault
      hasUserPreference.value = true
    } else {
      currentTheme.value = 'dark'
      currentStyle.value = 'ink'
      currentLayout.value = 'card'
      glassAlpha.value = 0.78
      bgType.value = 'image'
      bgVideoUrl.value = bgVideoDefault
    }
    applyThemeDom()
    applyStyleDom()
    applyLayoutDom()
    applyGlassDom()
    applyBgDom()
  }

  const savePreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('theme-preference', JSON.stringify({
        theme: currentTheme.value,
        style: currentStyle.value,
        layout: currentLayout.value,
        glass: glassAlpha.value,
        auto: isAutoSwitch.value,
        bgType: bgType.value,
        bgVideoUrl: bgVideoUrl.value
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
    bgType.value = 'image'
    bgVideoUrl.value = bgVideoDefault
    hasUserPreference.value = false
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('theme-preference')
    }
    document.documentElement.setAttribute('data-theme', 'light')
    document.documentElement.setAttribute('data-style', 'ink')
    document.documentElement.setAttribute('data-layout', 'card')
    document.documentElement.style.setProperty('--glass-alpha', '0.78')
    document.documentElement.setAttribute('data-bg-type', 'image')
    document.documentElement.style.removeProperty('--bg-video-url')
  }

  return {
    currentTheme,
    currentStyle,
    currentLayout,
    glassAlpha,
    isAutoSwitch,
    hasUserPreference,
    bgType,
    bgVideoUrl,
    isDark,
    isLight,
    setTheme,
    toggleTheme,
    setStyle,
    setLayout,
    setGlassAlpha,
    setGlassAlphaLive,
    setAutoSwitch,
    setBgType,
    setBgVideoUrl,
    initTheme,
    savePreference,
    resetToDefault
  }
})
