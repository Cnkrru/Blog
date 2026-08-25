import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcementContent = ref('')
  const loading = ref(true)
  const showModal = ref(false)
  const lastUpdated = ref(null)

  const controlAnnouncement = () => {
    showModal.value = !loading.value && !!announcementContent.value
  }

  const openAnnouncement = () => {
    showModal.value = true
  }

  const closeAnnouncement = () => {
    showModal.value = false
  }

  const loadAnnouncement = async () => {
    try {
      const mdModule = await import('../../content/announcement/index.md?raw')
      announcementContent.value = mdModule.default
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('[announcementStore] 加载公告失败:', error)
      announcementContent.value = '## 网站公告\n\n公告加载失败，请稍后再试。'
    } finally {
      loading.value = false
    }
  }

  const checkForUpdates = async () => {
    if (lastUpdated.value) {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      if (lastUpdated.value < oneWeekAgo) {
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
    controlAnnouncement,
    openAnnouncement,
    closeAnnouncement,
    loadAnnouncement,
    checkForUpdates
  }
})