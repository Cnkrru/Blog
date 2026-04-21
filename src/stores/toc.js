import { defineStore } from 'pinia'

export const useTocStore = defineStore('toc', {
  state: () => ({
    show: false,
    activeId: '',
    toc: [],
    lastScrollTime: 0,
    scrollThrottleDelay: 100
  }),
  
  getters: {
    hasToc: (state) => state.toc.length > 0,
    activeItem: (state) => {
      if (!state.activeId) return null
      return state.toc.find(item => item.id === state.activeId)
    },
    tocDepth: (state) => {
      if (state.toc.length === 0) return 0
      return Math.max(...state.toc.map(item => item.level))
    }
  },
  
  actions: {
    toggleToc() {
      this.show = !this.show
      
      // 记录用户偏好
      try {
        localStorage.setItem('toc_show_preference', this.show.toString())
      } catch (e) {
        console.warn('无法保存目录显示偏好:', e)
      }
    },
    
    setShow(show) {
      this.show = show
      
      // 记录用户偏好
      try {
        localStorage.setItem('toc_show_preference', show.toString())
      } catch (e) {
        console.warn('无法保存目录显示偏好:', e)
      }
    },
    
    setToc(toc) {
      this.toc = toc
    },
    
    setActiveId(id) {
      if (id !== this.activeId) {
        this.activeId = id
      }
    },
    
    scrollToHeading(id) {
      const element = document.getElementById(id)
      if (!element) return
      
      // 尝试找到中心内容卡片作为滚动容器
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
        // 计算元素相对于容器的位置
        const rect = element.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const relativeTop = rect.top - containerRect.top
        
        // 在容器内滚动
        container.scrollTo({
          top: container.scrollTop + relativeTop - 20, // 减去20像素的偏移，让标题显示在顶部
          behavior: 'smooth'
        })
      } else {
        // 如果没有找到合适的容器，直接滚动到元素
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    },
    
    loadUserPreference() {
      try {
        const savedPreference = localStorage.getItem('toc_show_preference')
        if (savedPreference !== null) {
          this.show = savedPreference === 'true'
        }
      } catch (e) {
        console.warn('无法加载目录显示偏好:', e)
      }
    },
    
    reset() {
      this.show = false
      this.activeId = ''
      this.toc = []
    }
  }
})