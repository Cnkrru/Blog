import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useScrollStore = defineStore('scroll', () => {
  // 状态
  const scrollPosition = ref(0)
  const backToTopVisible = ref(false)
  const showThreshold = ref(300) // 显示阈值
  
  // 计算属性
  const isVisible = computed(() => backToTopVisible.value)
  const threshold = computed(() => showThreshold.value)
  
  // 方法
  const updateScrollPosition = (position) => {
    scrollPosition.value = position
    updateBackToTopVisibility()
  }
  
  const updateBackToTopVisibility = () => {
    backToTopVisible.value = scrollPosition.value > showThreshold.value
  }
  
  const setShowThreshold = (threshold) => {
    showThreshold.value = threshold
    updateBackToTopVisibility()
  }
  
  const scrollToTop = () => {
    // 检查是否处于沉浸阅读模式
    const isImmersiveReading = document.body.classList.contains('immersive-reading')
    
    if (isImmersiveReading) {
      // 在沉浸阅读模式下，滚动整个窗口
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      // 正常模式下，滚动中心卡片内容
      const centerCardContent = document.querySelector('.center-card-content')
      if (centerCardContent) {
        centerCardContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      } else {
        // 如果找不到中心卡片内容，滚动整个窗口
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  }
  
  // 初始化滚动监听
  const initScrollListener = () => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        // 检查是否处于沉浸阅读模式
        const isImmersiveReading = document.body.classList.contains('immersive-reading')
        
        if (isImmersiveReading) {
          // 在沉浸阅读模式下，使用窗口滚动位置
          updateScrollPosition(window.scrollY)
        } else {
          // 正常模式下，使用中心卡片内容的滚动位置
          const centerCardContent = document.querySelector('.center-card-content')
          if (centerCardContent) {
            updateScrollPosition(centerCardContent.scrollTop)
          } else {
            // 如果找不到中心卡片内容，使用窗口滚动位置
            updateScrollPosition(window.scrollY)
          }
        }
      }
      
      // 添加滚动事件监听
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      // 初始检查
      handleScroll()
      
      // 返回清理函数
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }
  
  return {
    // 状态
    scrollPosition,
    backToTopVisible,
    showThreshold,
    
    // 计算属性
    isVisible,
    threshold,
    
    // 方法
    updateScrollPosition,
    updateBackToTopVisibility,
    setShowThreshold,
    scrollToTop,
    initScrollListener
  }
})