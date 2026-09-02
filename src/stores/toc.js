// 用在Toc和TocButton组件
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTocStore = defineStore('toc', () => {
  const show = ref(false)
  const activeId = ref('')
  const toc = ref([])

  const hasToc = computed(() => toc.value.length > 0)

  const toggleToc = () => {
    show.value = !show.value
    try {
      localStorage.setItem('toc_show_preference', show.value.toString())
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
    hasToc,
    toggleToc,
    setToc,
    setActiveId,
    loadUserPreference,
    reset
  }
})