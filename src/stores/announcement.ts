import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnnouncementStore = defineStore('announcement', () => {
  const announcementContent = ref<string>('')
  const loading = ref<boolean>(true)
  const showModal = ref<boolean>(false)
  const lastUpdated = ref<Date | null>(null)

  const controlAnnouncement = (): void => {
    showModal.value = !loading.value && !!announcementContent.value
  }

  const openAnnouncement = (): void => {
    showModal.value = true
  }

  const closeAnnouncement = (): void => {
    showModal.value = false
  }

  const loadAnnouncement = async (): Promise<void> => {
    try {
      const mdModule = await import('../pages/announcement/index.md?raw')
      announcementContent.value = mdModule.default
      lastUpdated.value = new Date()
      loading.value = true
    } catch (error) {
      console.error('[announcementStore] 加载公告失败:', error)
      announcementContent.value = '## 网站公告\n\n公告加载失败，请稍后再试。'
    } finally {
      loading.value = false
    }
  }

  const checkForUpdates = async (): Promise<boolean> => {
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
