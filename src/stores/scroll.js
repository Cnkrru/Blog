import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useScrollStore = defineStore('scroll', () => {
  const scrollPosition = ref(0)
  const backToTopVisible = ref(false)
  const showThreshold = ref(300)

  const isVisible = computed(() => backToTopVisible.value)
  const threshold = computed(() => showThreshold.value)

  const updateScrollPosition = (position) => {
    scrollPosition.value = position
    updateBackToTopVisibility()
  }

  const updateBackToTopVisibility = () => {
    backToTopVisible.value = scrollPosition.value > showThreshold.value
  }

  const setShowThreshold = (newThreshold) => {
    showThreshold.value = newThreshold
    updateBackToTopVisibility()
  }

  const scrollToTop = () => {
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

  const initScrollListener = () => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
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

      return () => {
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