<template>
  <div class="notification-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
      :class="[notification.type, { 'notification-dark': isDarkTheme, 'notification-leaving': notification.isLeaving }]"
      :style="{ animationDelay: `${notification.index * 0.1}s` }"
    >
      <div class="notification-content">
        <div class="notification-icon" v-if="notification.type">
          <span v-if="notification.type === 'success'">✓</span>
          <span v-else-if="notification.type === 'error'">✗</span>
          <span v-else-if="notification.type === 'warning'">!</span>
          <span v-else>i</span>
        </div>
        <div class="notification-message">{{ notification.message }}</div>
      </div>
      <div class="notification-actions" v-if="notification.buttons && notification.buttons.length > 0">
        <button 
          v-for="button in notification.buttons" 
          :key="button.text"
          class="notification-button"
          @click="handleButtonClick(notification.id, button)"
        >
          {{ button.text }}
        </button>
      </div>
      <button class="notification-close" @click="removeNotification(notification.id)">
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useNotificationStore, useThemeStore } from '../../stores'

const notificationStore = useNotificationStore()
const themeStore = useThemeStore()

const isDarkTheme = computed(() => themeStore.isDarkTheme)
const notifications = computed(() => {
  // 添加索引用于动画延迟
  return notificationStore.notifications.map((notification, index) => ({
    ...notification,
    index
  }))
})

const addNotification = (message, type = 'info', duration = null, buttons = []) => {
  return notificationStore.addNotification(message, type, duration, buttons)
}

const removeNotification = (id) => {
  notificationStore.removeNotification(id)
}

const handleButtonClick = (notificationId, button) => {
  if (button.action) {
    button.action()
  }
  removeNotification(notificationId)
}

const handleAnimationEnd = (event, notificationId) => {
  if (event.animationName === 'fadeOut') {
    removeNotification(notificationId)
  }
}

const success = (message, duration) => addNotification(message, 'success', duration)
const error = (message, duration) => addNotification(message, 'error', duration)
const warning = (message, duration) => addNotification(message, 'warning', duration)
const info = (message, duration) => addNotification(message, 'info', duration)

// 暴露方法
defineExpose({
  success,
  error,
  warning,
  info,
  remove: removeNotification,
  add: addNotification,
  clear: notificationStore.clearAllNotifications
})

// 全局方法
if (typeof window !== 'undefined') {
  window.toast = {
    success,
    error,
    warning,
    info,
    add: addNotification,
    clear: notificationStore.clearAllNotifications
  }
  
  // 暴露组件实例到window对象
  window.notificationComponent = {
    addNotification,
    removeNotification,
    clearAll: notificationStore.clearAllNotifications
  }
}

onMounted(() => {
  // 初始化主题
  notificationStore.setDarkTheme(isDarkTheme.value)
})

// 监听主题变化
watch(() => isDarkTheme.value, (newValue) => {
  notificationStore.setDarkTheme(newValue)
})
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out forwards;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  pointer-events: auto;
  transition: all 0.3s ease;
}

.notification.notification-leaving {
  animation: fadeOut 0.3s ease-in forwards;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  color: #ffffff;
  word-break: break-word;
}

.notification-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 12px;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.notification-actions {
  display: flex;
  gap: 8px;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-button {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  flex-shrink: 0;
}

.notification-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* 通知类型样式 */
.notification.success {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.notification.error {
  background: linear-gradient(135deg, #f5222d, #ff4d4f);
}

.notification.warning {
  background: linear-gradient(135deg, #faad14, #ffc53d);
}

.notification.info {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

/* 图标样式 */
.notification.success .notification-icon {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.notification.error .notification-icon {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.notification.warning .notification-icon {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.notification.info .notification-icon {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* 暗色主题适配 */
.notification.notification-dark {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 动画效果 */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification {
    min-width: auto;
    max-width: none;
    padding: 10px 16px;
  }
  
  .notification-message {
    font-size: 13px;
  }
  
  .notification-actions {
    gap: 6px;
    margin-right: 8px;
  }
  
  .notification-button {
    padding: 3px 10px;
    font-size: 11px;
  }
}
</style>
