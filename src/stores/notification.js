// 用在CodeRender、MarkdownRender和NotificationRender组件
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  const hasNotifications = computed(() => notifications.value.length > 0)

  const addNotification = (message, options = {}) => {
    const notification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      message,
      type: options.type || 'info',
      duration: options.duration || 8000,
      buttons: options.buttons || []
    }

    notifications.value.push(notification)
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  return {
    notifications,
    hasNotifications,
    addNotification,
    removeNotification,
    clearNotifications
  }
})