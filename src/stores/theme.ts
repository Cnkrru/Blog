import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { applyThemeCss, applyLayoutCss } from '../utils/cssLoader'
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
  const articleFontSize = ref<number>(16)

  // 系统主题监听相关
  let mediaQuery: MediaQueryList | null = null
  let mediaListener: ((e: MediaQueryListEvent) => void) | null = null

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
    applyThemeCss(currentStyle.value)
  }

  const applyLayoutDom = (): void => {
    document.documentElement.setAttribute('data-layout', currentLayout.value)
    applyLayoutCss(currentLayout.value)
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

  const applyFontSizeDom = (): void => {
    document.documentElement.style.setProperty('--article-font-size', `${articleFontSize.value}px`)
  }

  function startAutoSwitch(): void {
    stopAutoSwitch()
    if (typeof window === 'undefined') return
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaListener = (e: MediaQueryListEvent) => {
      if (isAutoSwitch.value) {
        currentTheme.value = e.matches ? 'dark' : 'light'
        applyThemeDom()
        savePreference()
      }
    }
    mediaQuery.addEventListener('change', mediaListener)
  }

  function stopAutoSwitch(): void {
    if (mediaQuery && mediaListener) {
      mediaQuery.removeEventListener('change', mediaListener)
      mediaListener = null
      mediaQuery = null
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
    if (enabled) {
      // 立即应用系统偏好
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        currentTheme.value = prefersDark ? 'dark' : 'light'
        applyThemeDom()
      }
      startAutoSwitch()
    } else {
      stopAutoSwitch()
    }
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

  const setArticleFontSize = (size: number): void => {
    articleFontSize.value = Math.max(14, Math.min(20, size))
    document.documentElement.style.setProperty('--article-font-size', `${articleFontSize.value}px`)
    savePreference()
  }

  const initTheme = (): void => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme-preference')
    if (saved) {
      const { theme, style, layout, glass, auto, bgType: savedBg, bgVideoUrl: savedVideo, fontSize } = JSON.parse(saved)
      currentTheme.value = (theme as 'light' | 'dark') ?? 'dark'
      currentStyle.value = (style as 'ink' | 'sakura' | 'purple' | 'cyan') ?? 'ink'
      currentLayout.value = (layout as 'card' | 'compact' | 'minimal') ?? 'card'
      glassAlpha.value = typeof glass === 'number' ? glass : (['sakura', 'purple', 'cyan'].includes(currentStyle.value) ? 0.55 : 0.78)
      isAutoSwitch.value = auto !== false
      bgType.value = (savedBg as 'image' | 'video') ?? 'image'
      bgVideoUrl.value = (savedVideo as string) || bgVideoDefault
      articleFontSize.value = typeof fontSize === 'number' ? Math.max(14, Math.min(20, fontSize)) : 16
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
    applyFontSizeDom()

    // 如果开启了自动跟随，应用系统偏好并开始监听
    if (isAutoSwitch.value) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark' : 'light'
      applyThemeDom()
      startAutoSwitch()
    }
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
        bgVideoUrl: bgVideoUrl.value,
        fontSize: articleFontSize.value
      }))
    } catch (e) {
      console.warn('[themeStore] 保存主题偏好失败:', e)
    }
  }

  const resetToDefault = (): void => {
    stopAutoSwitch()
    currentTheme.value = 'dark'
    currentStyle.value = 'ink'
    currentLayout.value = 'card'
    glassAlpha.value = 0.78
    isAutoSwitch.value = false
    bgType.value = 'image'
    bgVideoUrl.value = bgVideoDefault
    articleFontSize.value = 16
    hasUserPreference.value = false
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('theme-preference')
    }
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.setAttribute('data-style', 'ink')
    applyThemeCss('ink')
    document.documentElement.setAttribute('data-layout', 'card')
    applyLayoutCss('card')
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
    articleFontSize,
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
    setArticleFontSize,
    initTheme,
    savePreference,
    resetToDefault
  }
})