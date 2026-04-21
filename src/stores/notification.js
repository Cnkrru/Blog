import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    maxNotifications: 5,
    defaultDuration: 10000,
    isDarkTheme: false
  }),
  
  getters: {
    activeNotifications: (state) => state.notifications,
    notificationCount: (state) => state.notifications.length
  },
  
  actions: {
    addNotification(message, type = 'info', duration = null, buttons = []) {
      // 限制通知数量
      if (this.notifications.length >= this.maxNotifications) {
        this.notifications.shift() // 移除最早的通知
      }
      
      const id = Date.now().toString() + '-' + Math.floor(Math.random() * 1000)
      const notification = {
        id,
        message,
        type,
        duration: duration || this.defaultDuration,
        buttons,
        timestamp: Date.now()
      }
      
      this.notifications.push(notification)
      
      // 设置自动移除
      if (notification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, notification.duration)
      }
      
      return id
    },
    
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        // 添加离开标记，触发淡出动画
        this.notifications[index].isLeaving = true
        
        // 等待动画完成后移除
        setTimeout(() => {
          this.notifications.splice(index, 1)
        }, 300) // 与 CSS 动画持续时间一致
      }
    },
    
    clearAllNotifications() {
      this.notifications = []
    },
    
    setMaxNotifications(max) {
      this.maxNotifications = Math.max(1, Math.min(10, max))
      // 如果当前通知数量超过新的最大值，移除多余的
      while (this.notifications.length > this.maxNotifications) {
        this.notifications.shift()
      }
    },
    
    setDefaultDuration(duration) {
      this.defaultDuration = Math.max(1000, Math.min(10000, duration))
    },
    
    setDarkTheme(isDark) {
      this.isDarkTheme = isDark
    }
  }
})
