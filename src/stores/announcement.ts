import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAnnouncementStore = defineStore('announcement', () => {
  /* ====================状态==================== */
  const announcementContent : string = ref('')          //公告内容  
  const loading : boolean = ref(true)                   //公告是否加载出来
  const showModal : boolean = ref(false)                //公告是否显示弹窗
  const lastUpdated : Date | null = ref(null)           //最后更新公告时间

  /* ====================控制公告弹窗显示==================== */
  const controlAnnouncement = ():void => {
    if (loading.value && announcementContent.value) 
    {
      showModal.value = true
    }
    else 
    {
      showModal.value = false
    }
  }

  /* ====================加载公告内容==================== */
  const loadAnnouncement = async ():Promise<void> => {
    try 
    {
      const mdModule = await import('../pages/announcement/index.md?raw')
      announcementContent.value = mdModule.default
      lastUpdated.value = new Date()                  // 更新最后更新时间
      loading.value = true 
    } 
    catch (error)
    { //加载公告失败显示信息
      console.error('[announcementStore] 加载公告失败:', error)
      announcementContent.value = '## 网站公告\n\n公告加载失败，请稍后再试。'
    }
    finally 
    {
      loading.value = false
    }
  }
  
  /* ====================检查更新时间是否需要加载==================== */
  const checkForUpdates = async ():Promise<boolean> => {
    if (lastUpdated.value) {
      // 每7天检查一次更新
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      // 如果最后更新时间早于7天前，加载新的公告
      if (lastUpdated.value < oneWeekAgo) {
        await loadAnnouncement()
        return true
      }
    }
    return false
  }
  
  /* ====================导出==================== */
  return {
    // 状态
    showModal,
    announcementContent,
    loading,
    lastUpdated,
    // 方法
    controlAnnouncement,
    loadAnnouncement,
    checkForUpdates
  }
})