// 用在App、Comment、MouseTrail、KatexRender、MermaidRender、SkeletonScreen、VueReplPreview、VideoBackground、FontSizeControl、TocButton、ThemeToggle、Heatmap和Settings
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { applyThemeCss, applyLayoutCss } from '../utils/cssLoader'
import bgVideoDefault from '../assets/imgs/bg.mp4'

function setPrefixedClass(el, prefix, className) {
  const cls = el.classList
  ;[...cls].filter(c => c.startsWith(prefix)).forEach(c => cls.remove(c))
  if (className) cls.add(prefix + className)
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('dark')
  const currentStyle = ref('ink')
  const currentLayout = ref('card')
  const glassAlpha = ref(0.78)
  const isAutoSwitch = ref(false)
  const hasUserPreference = ref(false)
  const bgType = ref('image')
  const bgVideoUrl = ref(bgVideoDefault)
  const articleFontSize = ref(16)

  // 系统主题监听相关
  let mediaQuery = null
  let mediaListener = null

  const isDark = computed(() => currentTheme.value === 'dark')
  const isLight = computed(() => currentTheme.value === 'light')

  const applyThemeDom = () => {
    if (currentTheme.value === 'dark') {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  const applyStyleDom = () => {
    setPrefixedClass(document.documentElement, 'style-', currentStyle.value)
    applyThemeCss(currentStyle.value)
  }

  const applyLayoutDom = () => {
    setPrefixedClass(document.documentElement, 'layout-', currentLayout.value)
    applyLayoutCss(currentLayout.value)
  }

  const applyGlassDom = () => {
    document.documentElement.style.setProperty('--glass-alpha', String(glassAlpha.value))
  }

  const applyBgDom = () => {
    setPrefixedClass(document.documentElement, 'bg-', bgType.value === 'video' ? 'video' : '')
    if (bgVideoUrl.value) {
      document.documentElement.style.setProperty('--bg-video-url', `url(${bgVideoUrl.value})`)
    }
  }

  const applyFontSizeDom = () => {
    document.documentElement.style.setProperty('--article-font-size', `${articleFontSize.value}px`)
  }

  function startAutoSwitch() {
    stopAutoSwitch()
    if (typeof window === 'undefined') return
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaListener = (e) => {
      if (isAutoSwitch.value) {
        currentTheme.value = e.matches ? 'dark' : 'light'
        applyThemeDom()
        savePreference()
      }
    }
    mediaQuery.addEventListener('change', mediaListener)
  }

  function stopAutoSwitch() {
    if (mediaQuery && mediaListener) {
      mediaQuery.removeEventListener('change', mediaListener)
      mediaListener = null
      mediaQuery = null
    }
  }

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    hasUserPreference.value = true
    applyThemeDom()
    savePreference()
  }

  const setStyle = (style) => {
    currentStyle.value = style
    applyStyleDom()
    savePreference()
  }

  const setLayout = (layout) => {
    currentLayout.value = layout
    applyLayoutDom()
    savePreference()
  }

  const setGlassAlpha = (alpha) => {
    glassAlpha.value = alpha
    applyGlassDom()
    savePreference()
  }

  // 实时拖动时仅更新变量与内存，不写 localStorage（由调用方节流落盘）
  const setGlassAlphaLive = (alpha) => {
    glassAlpha.value = alpha
    applyGlassDom()
  }

  const setAutoSwitch = (enabled) => {
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

  const setBgType = (type) => {
    bgType.value = type
    if (type === 'video' && !bgVideoUrl.value) {
      bgVideoUrl.value = bgVideoDefault
    }
    applyBgDom()
    savePreference()
  }

  const setArticleFontSize = (size) => {
    articleFontSize.value = Math.max(14, Math.min(20, size))
    document.documentElement.style.setProperty('--article-font-size', `${articleFontSize.value}px`)
    savePreference()
  }

  const initTheme = () => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('theme-preference')
    if (saved) {
      const { theme, style, layout, glass, auto, bgType: savedBg, bgVideoUrl: savedVideo, fontSize } = JSON.parse(saved)
      currentTheme.value = theme ?? 'dark'
      currentStyle.value = style ?? 'ink'
      currentLayout.value = layout ?? 'card'
      glassAlpha.value = typeof glass === 'number' ? glass : (['sakura', 'purple', 'cyan'].includes(currentStyle.value) ? 0.55 : 0.78)
      isAutoSwitch.value = auto !== false
      bgType.value = savedBg ?? 'image'
      bgVideoUrl.value = savedVideo || bgVideoDefault
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

  const savePreference = () => {
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
    toggleTheme,
    setStyle,
    setLayout,
    setGlassAlpha,
    setGlassAlphaLive,
    setAutoSwitch,
    setBgType,
    setArticleFontSize,
    initTheme,
    savePreference
  }
})