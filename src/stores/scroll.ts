import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useScrollStore = defineStore('scroll', () => {
  const scrollPosition = ref<number>(0)
  const backToTopVisible = ref<boolean>(false)
  const showThreshold = ref<number>(300)

  const isVisible = computed<boolean>(() => backToTopVisible.value)
  const threshold = computed<number>(() => showThreshold.value)

  const updateScrollPosition = (position: number): void => {
    scrollPosition.value = position
    updateBackToTopVisibility()
  }

  const updateBackToTopVisibility = (): void => {
    backToTopVisible.value = scrollPosition.value > showThreshold.value
  }

  const setShowThreshold = (newThreshold: number): void => {
    showThreshold.value = newThreshold
    updateBackToTopVisibility()
  }

  const scrollToTop = (): void => {
    const isImmersiveReading = document.body.classList.contains('immersive-reading')
    if (isImmersiveReading) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const centerCardContent = document.querySelector('.center-card-content')
      if (centerCardContent) {
        centerCardContent.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const initScrollListener = (): (() => void) | undefined => {
    if (typeof window !== 'undefined') {
      const handleScroll = (): void => {
        const isImmersiveReading = document.body.classList.contains('immersive-reading')
        if (isImmersiveReading) {
          updateScrollPosition(window.scrollY)
        } else {
          const centerCardContent = document.querySelector('.center-card-content')
          if (centerCardContent) {
            updateScrollPosition(centerCardContent.scrollTop)
          } else {
            updateScrollPosition(window.scrollY)
          }
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()

      return (): void => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }

  return {
    scrollPosition,
    backToTopVisible,
    showThreshold,
    isVisible,
    threshold,
    updateScrollPosition,
    updateBackToTopVisibility,
    setShowThreshold,
    scrollToTop,
    initScrollListener
  }
})
