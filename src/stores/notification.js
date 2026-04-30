import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const maxNotifications = ref(5)
  const defaultDuration = ref(10000)
  const isDarkTheme = ref(false)

  const activeNotifications = computed(() => notifications.value)
  const notificationCount = computed(() => notifications.value.length)

  const addNotification = (message, type = 'info', duration = null, buttons = []) => {
    if (notifications.value.length >= maxNotifications.value) {
      notifications.value.shift()
    }

    const id = Date.now().toString() + '-' + Math.floor(Math.random() * 1000)
    const notification = {
      id,
      message,
      type,
      duration: duration || defaultDuration.value,
      buttons,
      timestamp: Date.now()
    }

    notifications.value.push(notification)

    if (notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value[index].isLeaving = true

      setTimeout(() => {
        notifications.value.splice(index, 1)
      }, 300)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const setMaxNotifications = (max) => {
    maxNotifications.value = Math.max(1, Math.min(10, max))
    while (notifications.value.length > maxNotifications.value) {
      notifications.value.shift()
    }
  }

  const setDefaultDuration = (duration) => {
    defaultDuration.value = Math.max(1000, Math.min(10000, duration))
  }

  const setDarkTheme = (isDark) => {
    isDarkTheme.value = isDark
  }

  return {
    notifications,
    maxNotifications,
    defaultDuration,
    isDarkTheme,
    activeNotifications,
    notificationCount,
    addNotification,
    removeNotification,
    clearAllNotifications,
    setMaxNotifications,
    setDefaultDuration,
    setDarkTheme
  }
})