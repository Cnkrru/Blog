<template>
  <div class="notification-container">
    <div
      v-for="(n, i) in notifications"
      :key="n.id"
      class="notification"
      :class="[n.type, { 'notification-leaving': n.isLeaving }]"
      :style="{ '--offset': `${i * 60}px`, zIndex: notifications.length - i }"
      @mouseenter="pauseDismiss(n.id)"
      @mouseleave="resumeDismiss(n.id)"
    >
      <!-- 进度条 -->
      <div
        v-if="n.duration > 0 && n.type !== 'error'"
        class="notif-progress"
        :style="{ animationDuration: n.duration + 'ms', animationPlayState: n.paused ? 'paused' : 'running' }"
      ></div>

      <div class="notif-body">
        <div class="notif-icon">
          <span v-if="n.type === 'success'">✓</span>
          <span v-else-if="n.type === 'error'">✗</span>
          <span v-else-if="n.type === 'warning'">!</span>
          <span v-else>i</span>
        </div>
        <div class="notif-message">{{ n.message }}</div>
        <button class="notif-close" @click="removeNotification(n.id)">&times;</button>
      </div>

      <div v-if="n.buttons && n.buttons.length > 0" class="notif-actions">
        <button
          v-for="b in n.buttons"
          :key="b.text"
          class="notif-btn"
          @click="handleButtonClick(n.id, b)"
        >{{ b.text }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNotificationStore, useThemeStore } from '../../stores'

const notificationStore = useNotificationStore()
const themeStore = useThemeStore()

const pausedIds = ref<Set<string>>(new Set())
const timers = new Map<string, ReturnType<typeof setTimeout>>()

const notifications = computed(() => {
  return notificationStore.notifications.map((n, i) => ({
    ...n,
    index: i,
    paused: pausedIds.value.has(n.id),
    offset: i * 60
  }))
})

function scheduleDismiss(id: string, duration: number) {
  if (timers.has(id)) clearTimeout(timers.get(id))
  if (duration <= 0) return
  timers.set(id, setTimeout(() => {
    removeNotification(id)
    timers.delete(id)
  }, duration))
}

function pauseDismiss(id: string) {
  pausedIds.value = new Set([...pausedIds.value, id])
  if (timers.has(id)) {
    clearTimeout(timers.get(id))
    timers.delete(id)
  }
}

function resumeDismiss(id: string) {
  pausedIds.value = new Set([...pausedIds.value].filter(i => i !== id))
  const n = notificationStore.notifications.find(n => n.id === id)
  if (n && n.duration > 0) {
    scheduleDismiss(id, n.duration)
  }
}

function removeNotification(id: string) {
  pausedIds.value = new Set([...pausedIds.value].filter(i => i !== id))
  if (timers.has(id)) {
    clearTimeout(timers.get(id))
    timers.delete(id)
  }
  notificationStore.removeNotification(id)
}

function handleButtonClick(id: string, button: any) {
  if (button.action) button.action()
  removeNotification(id)
}

// 监听新增通知，自动调度移除
watch(
  () => notificationStore.notifications,
  (newList, oldList) => {
    for (const n of newList) {
      const old = oldList?.find(o => o.id === n.id)
      if (!old && n.duration > 0) {
        scheduleDismiss(n.id, n.duration)
      }
    }
  },
  { immediate: true, deep: true }
)

defineExpose({
  remove: removeNotification,
  clear: notificationStore.clearNotifications
})

// 暴露全局 toast 方法
if (typeof window !== 'undefined') {
  window.toast = {
    success: (msg: string, dur?: number) => notificationStore.addNotification(msg, { type: 'success', duration: dur || 3000 }),
    error: (msg: string, dur?: number) => notificationStore.addNotification(msg, { type: 'error', duration: dur || 5000 }),
    warning: (msg: string, dur?: number) => notificationStore.addNotification(msg, { type: 'warning', duration: dur || 4000 }),
    info: (msg: string, dur?: number) => notificationStore.addNotification(msg, { type: 'info', duration: dur || 3000 }),
    add: (msg: string, opts?: any) => notificationStore.addNotification(msg, opts || {}),
    clear: () => notificationStore.clearNotifications()
  }
}
</script>

<!-- 布局样式 -->
<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.notification {
  position: relative;
  overflow: hidden;
  min-width: 300px;
  max-width: 400px;
  padding: 14px 16px;
  border-radius: 14px;
  pointer-events: auto;
  animation: notifIn 0.35s ease-out;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.notification.notification-leaving {
  animation: notifOut 0.3s ease-in forwards;
}

.notif-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: 0 0 0 14px;
  animation: notifShrink linear forwards;
}

.notif-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notif-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.notif-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  padding-top: 1px;
}

.notif-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 0 2px;
  flex-shrink: 0;
  line-height: 1;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.notif-close:hover { opacity: 1; }

.notif-actions {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  padding-left: 36px;
}

.notif-btn {
  padding: 4px 14px;
  border-radius: 14px;
  border: 1px solid;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

@keyframes notifIn {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes notifOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(120%); opacity: 0; }
}

@keyframes notifShrink {
  from { width: 100%; }
  to { width: 0%; }
}

@media (max-width: 768px) {
  .notification-container {
    top: 60px;
    right: 12px;
    left: 12px;
  }
  .notification {
    min-width: auto;
    max-width: none;
    padding: 12px 14px;
  }
}
</style>

<!-- 颜色样式 -->
<style scoped>
.notification {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-left: 4px solid var(--common-color-1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

body.dark-theme .notification {
  background: rgba(21, 7, 60, 0.9);
  border-color: rgba(255, 255, 255, 0.08);
}

.notification.success { border-left-color: #22c55e; }
.notification.error { border-left-color: #ef4444; }
.notification.warning { border-left-color: #f59e0b; }
.notification.info { border-left-color: var(--common-color-1); }

.notif-progress {
  background: var(--common-color-1);
}

.notif-icon {
  color: #fff;
}

.notification.success .notif-icon { background: #22c55e; }
.notification.error .notif-icon { background: #ef4444; }
.notification.warning .notif-icon { background: #f59e0b; color: #333; }
.notification.info .notif-icon { background: var(--common-color-1); }

.notification.success .notif-progress { background: #22c55e; }
.notification.error .notif-progress { background: #ef4444; }
.notification.warning .notif-progress { background: #f59e0b; }

.notif-message { color: var(--common-text); }
.notif-close { color: var(--common-text); }

.notif-btn {
  border-color: rgba(0, 0, 0, 0.1);
  color: var(--common-text);
}

body.dark-theme .notif-btn {
  border-color: rgba(255, 255, 255, 0.1);
}

.notif-btn:hover {
  background: var(--common-color-1);
  color: #fff;
  border-color: var(--common-color-1);
}
</style>
