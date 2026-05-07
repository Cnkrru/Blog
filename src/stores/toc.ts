import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TocItem } from '../types/index'

export const useTocStore = defineStore('toc', () => {
  const show = ref<boolean>(false)
  const activeId = ref<string>('')
  const toc = ref<TocItem[]>([])
  const lastScrollTime = ref<number>(0)
  const scrollThrottleDelay = ref<number>(100)

  const hasToc = computed<boolean>(() => toc.value.length > 0)

  const activeItem = computed<TocItem | null>(() => {
    if (!activeId.value) return null
    return toc.value.find(item => item.id === activeId.value) || null
  })

  const tocDepth = computed<number>(() => {
    if (toc.value.length === 0) return 0
    return Math.max(...toc.value.map(item => item.level))
  })

  const toggleToc = (): void => {
    show.value = !show.value
    try {
      localStorage.setItem('toc_show_preference', show.value.toString())
    } catch (e) {
      console.warn('[tocStore] 无法保存目录显示偏好:', e)
    }
  }

  const setShow = (newShow: boolean): void => {
    show.value = newShow
    try {
      localStorage.setItem('toc_show_preference', newShow.toString())
    } catch (e) {
      console.warn('[tocStore] 无法保存目录显示偏好:', e)
    }
  }

  const setToc = (newToc: TocItem[]): void => {
    toc.value = newToc
  }

  const setActiveId = (id: string): void => {
    if (id !== activeId.value) {
      activeId.value = id
    }
  }

  const scrollToHeading = (id: string): void => {
    const element = document.getElementById(id)
    if (!element) return

    const scrollContainers = [
      document.querySelector('.center-card-content'),
      document.querySelector('.post-content'),
      document.querySelector('.markdown-content')
    ]

    let container: Element | null = null
    for (const potentialContainer of scrollContainers) {
      if (potentialContainer && potentialContainer.contains(element)) {
        container = potentialContainer
        break
      }
    }

    if (container) {
      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const relativeTop = rect.top - containerRect.top
      container.scrollTo({
        top: container.scrollTop + relativeTop - 20,
        behavior: 'smooth'
      })
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const loadUserPreference = (): void => {
    try {
      const savedPreference = localStorage.getItem('toc_show_preference')
      if (savedPreference !== null) {
        show.value = savedPreference === 'true'
      }
    } catch (e) {
      console.warn('[tocStore] 无法加载目录显示偏好:', e)
    }
  }

  const reset = (): void => {
    show.value = false
    activeId.value = ''
    toc.value = []
  }

  return {
    show,
    activeId,
    toc,
    lastScrollTime,
    scrollThrottleDelay,
    hasToc,
    activeItem,
    tocDepth,
    toggleToc,
    setShow,
    setToc,
    setActiveId,
    scrollToHeading,
    loadUserPreference,
    reset
  }
})
