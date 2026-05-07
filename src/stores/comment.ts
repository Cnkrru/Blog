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
    const giscusFrame = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
    if (giscusFrame?.contentWindow) {
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app'
      )
    }
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
    updateGiscusTheme,
    savePreference,
    loadPreference
  }
})
