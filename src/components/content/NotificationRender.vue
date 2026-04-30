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
/* 布局样式 */
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

/* 通知卡片 */
.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease-out forwards;
  backdrop-filter: blur(10px);
  pointer-events: auto;
  transition: all 0.3s ease;
}

/* 离开动画 */
.notification.notification-leaving {
  animation: fadeOut 0.3s ease-in forwards;
}

/* 通知内容 */
.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

/* 通知图标 */
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

/* 通知消息 */
.notification-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
}

/* 关闭按钮 */
.notification-close {
  background: none;
  border: none;
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
  background-color: rgba(0, 0, 0, 0.1);
}

/* 操作按钮区域 */
.notification-actions {
  display: flex;
  gap: 8px;
  margin-right: 12px;
  flex-shrink: 0;
}

/* 通知按钮 */
.notification-button {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.notification-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
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
</style>

<style scoped>
/* 颜色样式 */
/* 通知卡片 */
.notification {
  border: 1px solid var(--common-color-1);
  background-color: var(--common-bg);
  box-shadow: 0 4px 12px var(--common-shadow);
}

.notification-dark {
  border: 1px solid var(--common-color-1);
  background-color: var(--common-bg);
  box-shadow: 0 4px 12px var(--common-shadow);
}

/* 通知内容颜色 */
.notification-content {
  color: var(--common-text);
}

.notification-dark .notification-content {
  color: var(--common-text);
}

/* 通知图标颜色 */
.notification-icon {
  color: var(--common-text);
}

.notification.success .notification-icon {
  background-color: #28a745;
}

.notification.error .notification-icon {
  background-color: #dc3545;
}

.notification.warning .notification-icon {
  background-color: #ffc107;
  color: #333;
}

.notification.info .notification-icon {
  background-color: #17a2b8;
}

/* 关闭按钮颜色 */
.notification-close {
  color: var(--common-color-1);
  opacity: 0.8;
}

.notification-dark .notification-close {
  color: var(--common-color-1);
  opacity: 0.8;
}

.notification-close:hover {
  background-color: var(--common-color-1);
  color: var(--common-content);
  opacity: 1;
}

.notification-dark .notification-close:hover {
  background-color: var(--common-color-1);
  color: var(--common-content);
  opacity: 1;
}

/* 操作按钮颜色 */
.notification-button {
  background-color: var(--common-color-1);
  color: var(--common-content);
  border: 1px solid var(--common-color-1);
}

.notification-dark .notification-button {
  background-color: var(--common-color-1);
  color: var(--common-content);
  border: 1px solid var(--common-color-1);
}

.notification-button:hover {
  background-color: var(--common-hover);
  border-color: var(--common-hover);
  transform: translateY(-1px);
}

.notification-dark .notification-button:hover {
  background-color: var(--common-hover);
  border-color: var(--common-hover);
  transform: translateY(-1px);
}

/* 通知类型颜色 */
.notification.success {
  border-left: 4px solid #28a745;
}

.notification.error {
  border-left: 4px solid #dc3545;
}

.notification.warning {
  border-left: 4px solid #ffc107;
}

.notification.info {
  border-left: 4px solid #17a2b8;
}
</style>

<style scoped>
/* 响应式设计 */
@media (max-width: var(--md)) {
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
