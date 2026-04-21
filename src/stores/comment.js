import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCommentStore = defineStore('comment', () => {
  // 状态
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const commentCount = ref(0)
  const giscusConfig = ref({
    repo: 'Cnkrru/Blog',
    repoId: 'R_kgDORzTTCQ',
    category: 'Announcements',
    categoryId: 'DIC_kwDORzTTCc4C5e-m',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'bottom',
    lang: 'zh-CN',
    theme: 'light'
  })
  const baseThemeUrl = 'https://pub-b8c25e855b194f5aa9d5e32789ca6f9d.r2.dev'

  // 计算属性
  const currentTheme = computed(() => giscusConfig.value.theme)
  const isDarkTheme = computed(() => currentTheme.value === 'dark')
  const giscusThemeUrl = computed(() => {
    return isDarkTheme.value 
      ? `${baseThemeUrl}/comment-dark.css` 
      : `${baseThemeUrl}/comment-light.css`
  })

  // 方法
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (err) => {
    error.value = err
  }

  const setLoaded = (loaded) => {
    isLoaded.value = loaded
  }

  const setCommentCount = (count) => {
    commentCount.value = count
  }

  const setTheme = (isDark) => {
    giscusConfig.value.theme = isDark ? 'dark' : 'light'
    updateGiscusTheme()
  }

  const setLanguage = (lang) => {
    giscusConfig.value.lang = lang
  }

  const initCommentSystem = () => {
    if (typeof document === 'undefined') return

    setLoading(true)
    setError(null)

    try {
      const commentContainers = document.querySelectorAll('.comment-container')
      
      commentContainers.forEach(container => {
        // 避免重复注入
        if (container.querySelector('script[src*="giscus"]')) {
          setLoaded(true)
          setLoading(false)
          return
        }

        const giscusScript = document.createElement('script')
        giscusScript.src = 'https://giscus.app/client.js'
        giscusScript.setAttribute('data-repo', giscusConfig.value.repo)
        giscusScript.setAttribute('data-repo-id', giscusConfig.value.repoId)
        giscusScript.setAttribute('data-category', giscusConfig.value.category)
        giscusScript.setAttribute('data-category-id', giscusConfig.value.categoryId)
        giscusScript.setAttribute('data-mapping', giscusConfig.value.mapping)
        giscusScript.setAttribute('data-strict', giscusConfig.value.strict)
        giscusScript.setAttribute('data-reactions-enabled', giscusConfig.value.reactionsEnabled)
        giscusScript.setAttribute('data-emit-metadata', giscusConfig.value.emitMetadata)
        giscusScript.setAttribute('data-input-position', giscusConfig.value.inputPosition)
        giscusScript.setAttribute('data-theme', giscusThemeUrl.value)
        giscusScript.setAttribute('data-lang', giscusConfig.value.lang)
        giscusScript.setAttribute('crossorigin', 'anonymous')
        giscusScript.setAttribute('async', '')
        
        // 加载完成回调
        giscusScript.onload = () => {
          setLoaded(true)
          setLoading(false)
        }
        
        giscusScript.onerror = () => {
          setError('评论系统加载失败')
          setLoading(false)
        }
        
        container.appendChild(giscusScript)
      })
    } catch (err) {
      setError('初始化评论系统失败')
      setLoading(false)
    }
  }

  const updateGiscusTheme = () => {
    if (typeof document === 'undefined') return

    const iframe = document.querySelector('iframe.giscus-frame')
    if (iframe) {
      try {
        iframe.contentWindow.postMessage({
          giscus: {
            setConfig: {
              theme: giscusThemeUrl.value
            }
          }
        }, 'https://giscus.app')
      } catch (err) {
        setError('更新主题失败')
      }
    }
  }

  const refreshComments = () => {
    if (typeof document === 'undefined') return

    const iframe = document.querySelector('iframe.giscus-frame')
    if (iframe) {
      try {
        iframe.contentWindow.postMessage({
          giscus: {
            refresh: true
          }
        }, 'https://giscus.app')
      } catch (err) {
        setError('刷新评论失败')
      }
    }
  }

  // 初始化
  const init = () => {
    // 监听主题变化
    if (typeof window !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const isDark = document.body.classList.contains('dark-theme')
            setTheme(isDark)
          }
        })
      })

      observer.observe(document.body, { attributes: true })

      return () => observer.disconnect()
    }
  }

  return {
    // 状态
    isLoaded,
    isLoading,
    error,
    commentCount,
    giscusConfig,
    
    // 计算属性
    currentTheme,
    isDarkTheme,
    giscusThemeUrl,
    
    // 方法
    setLoading,
    setError,
    setLoaded,
    setCommentCount,
    setTheme,
    setLanguage,
    initCommentSystem,
    updateGiscusTheme,
    refreshComments,
    init
  }
})