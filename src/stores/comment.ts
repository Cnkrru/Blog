import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommentStore = defineStore('comment', () => {
  const commentLoaded = ref<boolean>(false)
  const commentEnabled = ref<boolean>(true)
  const commentPlatform = ref<'giscus' | 'disqus' | 'none'>('giscus')
  const commentCount = ref<number>(0)
  const isExpanded = ref<boolean>(false)

  const setCommentLoaded = (loaded: boolean): void => {
    commentLoaded.value = loaded
  }

  const toggleComments = (): void => {
    commentEnabled.value = !commentEnabled.value
    savePreference()
  }

  const setCommentCount = (count: number): void => {
    commentCount.value = count
  }

  const incrementCommentCount = (): void => {
    commentCount.value++
  }

  const toggleExpanded = (): void => {
    isExpanded.value = !isExpanded.value
  }

  const updateGiscusTheme = (theme: string): void => {
    const isDark = document.body.classList.contains('dark-theme')
    const themeUrl = isDark
      ? 'https://cnkrru.github.io/static/giscus-theme-dark.css'
      : 'https://cnkrru.github.io/static/giscus-theme-light.css'
    const giscusFrame = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
    if (giscusFrame?.contentWindow) {
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: themeUrl } } },
        'https://giscus.app'
      )
    }
  }

  const initCommentSystem = (): void => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    const existing = document.querySelector('.giscus, script[src*=\"giscus\"]')
    if (existing) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'Cnkrru/Blog')
    script.setAttribute('data-repo-id', '')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', '')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    const isDark = document.body.classList.contains('dark-theme')
    script.setAttribute('data-theme', isDark
      ? 'https://cnkrru.github.io/static/giscus-theme-dark.css'
      : 'https://cnkrru.github.io/static/giscus-theme-light.css')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    const container = document.querySelector('.comment-container')
    if (container) container.appendChild(script)
  }

  const savePreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('comment_enabled', commentEnabled.value.toString())
    } catch (e) {
      console.warn('[commentStore] 保存评论偏好失败:', e)
    }
  }

  const loadPreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('comment_enabled')
      if (saved !== null) {
        commentEnabled.value = saved === 'true'
      }
    } catch (e) {
      console.warn('[commentStore] 加载评论偏好失败:', e)
    }
  }

  return {
    commentLoaded,
    commentEnabled,
    commentPlatform,
    commentCount,
    isExpanded,
    setCommentLoaded,
    toggleComments,
    setCommentCount,
    incrementCommentCount,
    toggleExpanded,
    initCommentSystem,
    updateGiscusTheme,
    savePreference,
    loadPreference
  }
})
