import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTocStore = defineStore('toc', () => {
  const show = ref(false)
  const activeId = ref('')
  const toc = ref([])
  const lastScrollTime = ref(0)
  const scrollThrottleDelay = ref(100)

  const hasToc = computed(() => toc.value.length > 0)

  const activeItem = computed(() => {
    if (!activeId.value) return null
    return toc.value.find(item => item.id === activeId.value)
  })

  const tocDepth = computed(() => {
    if (toc.value.length === 0) return 0
    return Math.max(...toc.value.map(item => item.level))
  })

  const toggleToc = () => {
    show.value = !show.value

    try {
      localStorage.setItem('toc_show_preference', show.value.toString())
    } catch (e) {
      console.warn('[tocStore] 无法保存目录显示偏好:', e)
    }
  }

  const setShow = (newShow) => {
    show.value = newShow

    try {
      localStorage.setItem('toc_show_preference', newShow.toString())
    } catch (e) {
      console.warn('[tocStore] 无法保存目录显示偏好:', e)
    }
  }

  const setToc = (newToc) => {
    toc.value = newToc
  }

  const setActiveId = (id) => {
    if (id !== activeId.value) {
      activeId.value = id
    }
  }

  const scrollToHeading = (id) => {
    const element = document.getElementById(id)
    if (!element) return

    const scrollContainers = [
      document.querySelector('.center-card-content'),
      document.querySelector('.post-content'),
      document.querySelector('.markdown-content')
    ]

    let container = null
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
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const loadUserPreference = () => {
    try {
      const savedPreference = localStorage.getItem('toc_show_preference')
      if (savedPreference !== null) {
        show.value = savedPreference === 'true'
      }
    } catch (e) {
      console.warn('[tocStore] 无法加载目录显示偏好:', e)
    }
  }

  const reset = () => {
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