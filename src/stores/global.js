import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  // 状态
  const isLoading = ref(false)
  const notifications = ref([])
  const performance = ref({
    memory: 0,
    cpu: 0,
    network: 0
  })
  
  // 方法
  const setLoading = (loading) => {
    isLoading.value = loading
  }
  
  const addNotification = (message, type = 'info', duration = 3000, buttons = []) => {
    const id = Date.now().toString()
    notifications.value.push({
      id,
      message,
      type,
      duration,
      buttons
    })
    
    // 自动移除通知
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
  
  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(notification => notification.id !== id)
  }
  
  const updatePerformance = (data) => {
    performance.value = { ...performance.value, ...data }
  }
  
  return {
    isLoading,
    notifications,
    performance,
    setLoading,
    addNotification,
    removeNotification,
    updatePerformance
  }
})