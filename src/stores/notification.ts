import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface NotificationItem {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
  buttons: { text: string; onClick: () => void }[]
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationItem[]>([])

  const hasNotifications = computed<boolean>(() => notifications.value.length > 0)

  const addNotification = (message: string, options: Partial<NotificationItem> = {}): void => {
    const notification: NotificationItem = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      message,
      type: options.type || 'info',
      duration: options.duration || 8000,
      buttons: options.buttons || []
    }

    notifications.value.push(notification)
  }

  const removeNotification = (id: string): void => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clearNotifications = (): void => {
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
