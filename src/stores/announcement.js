import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAnnouncementStore = defineStore('announcement', () => {
  // 状态
  const showModal = ref(false)
  const announcementContent = ref('')
  const loading = ref(true)
  const lastUpdated = ref(null)
  
  // 计算属性
  const isLoaded = computed(() => !loading.value && announcementContent.value)
  
  // 方法
  const openAnnouncement = () => {
    showModal.value = true
  }
  
  const closeAnnouncement = () => {
    showModal.value = false
  }
  
  const loadAnnouncement = async () => {
    try {
      const mdModule = await import('../pages/announcement/index.md?raw')
      announcementContent.value = mdModule.default
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('加载公告失败:', error)
      announcementContent.value = '## 网站公告\n\n公告加载失败，请稍后再试。'
    } finally {
      loading.value = false
    }
  }
  
  const checkForUpdates = async () => {
    // 简单的更新检查，实际项目中可以根据需要实现更复杂的逻辑
    if (lastUpdated.value) {
      // 每小时检查一次更新
      const oneHourAgo = new Date()
      oneHourAgo.setHours(oneHourAgo.getHours() - 1)
      
      if (lastUpdated.value < oneHourAgo) {
        await loadAnnouncement()
        return true
      }
    }
    return false
  }
  
  return {
    showModal,
    announcementContent,
    loading,
    lastUpdated,
    isLoaded,
    openAnnouncement,
    closeAnnouncement,
    loadAnnouncement,
    checkForUpdates
  }
})