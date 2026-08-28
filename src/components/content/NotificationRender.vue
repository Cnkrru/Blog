<template>
  <Teleport to="body">
    <div class="notification-container">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="notification"
        :class="[n.type, { 'notification-leaving': n.isLeaving }]"
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
          <!-- 图标 -->
          <div class="notif-icon">
            <VIcon v-if="n.type === 'success'" :src="'check.svg'" :size="18" />
            <VIcon v-else-if="n.type === 'error'" :src="'x.svg'" :size="18" />
            <VIcon v-else-if="n.type === 'warning'" :src="'alert-triangle.svg'" :size="18" />
            <VIcon v-else :src="'info.svg'" :size="18" />
          </div>

          <!-- 内容 -->
          <div class="notif-content">
            <div v-if="n.title" class="notif-title">{{ n.title }}</div>
            <div class="notif-message">{{ n.message }}</div>
          </div>

          <!-- 关闭 -->
          <VButton icon="x.svg" size="24" shape="rect" variant="ghost" class="notif-close" @click="removeNotification(n.id)" title="关闭" />
        </div>

        <!-- 操作按钮 -->
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
  </Teleport>
</template>

<script setup>
import VIcon from '@/components/__common/VIcon.vue'
import VButton from '@/components/__common/VButton.vue'
import { ref, computed, watch } from 'vue'
import { useNotificationStore } from '../../stores'

const notificationStore = useNotificationStore()

const pausedIds = ref(new Set())
const timers = new Map()

const notifications = computed(() => {
  return notificationStore.notifications.map((n) => ({
    ...n,
    paused: pausedIds.value.has(n.id)
  }))
})

function scheduleDismiss(id, duration) {
  if (timers.has(id)) clearTimeout(timers.get(id))
  if (duration <= 0) return
  timers.set(id, setTimeout(() => {
    removeNotification(id)
    timers.delete(id)
  }, duration))
}

function pauseDismiss(id) {
  pausedIds.value = new Set([...pausedIds.value, id])
  if (timers.has(id)) {
    clearTimeout(timers.get(id))
    timers.delete(id)
  }
}

function resumeDismiss(id) {
  pausedIds.value = new Set([...pausedIds.value].filter(i => i !== id))
  const n = notificationStore.notifications.find(n => n.id === id)
  if (n && n.duration > 0) {
    scheduleDismiss(id, n.duration)
  }
}

function removeNotification(id) {
  pausedIds.value = new Set([...pausedIds.value].filter(i => i !== id))
  if (timers.has(id)) {
    clearTimeout(timers.get(id))
    timers.delete(id)
  }
  notificationStore.removeNotification(id)
}

function handleButtonClick(id, button) {
  if (button.action) button.action()
  removeNotification(id)
}

// 追踪已处理的 ID，用于检测新增通知
const knownIds = ref(new Set())

watch(
  () => notificationStore.notifications.length,
  () => {
    const currentIds = new Set(notificationStore.notifications.map(n => n.id))
    for (const n of notificationStore.notifications) {
      if (!knownIds.value.has(n.id) && n.duration > 0) {
        scheduleDismiss(n.id, n.duration)
      }
    }
    knownIds.value = currentIds
  },
  { immediate: true }
)

defineExpose({
  remove: removeNotification,
  clear: notificationStore.clearNotifications
})

// 暴露全局 toast 方法
if (typeof window !== 'undefined') {
  window.toast = {
    success: (msg, dur) => notificationStore.addNotification(msg, { type: 'success', duration: dur || 3000 }),
    error: (msg, dur) => notificationStore.addNotification(msg, { type: 'error', duration: dur || 5000 }),
    warning: (msg, dur) => notificationStore.addNotification(msg, { type: 'warning', duration: dur || 4000 }),
    info: (msg, dur) => notificationStore.addNotification(msg, { type: 'info', duration: dur || 3000 }),
    add: (msg, opts) => notificationStore.addNotification(msg, opts || {}),
    clear: () => notificationStore.clearNotifications()
  }
}
</script>

<style scoped>
/* ── 容器 ── */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

/* ── 通知卡片 ── */
.notification {
  position: relative;
  overflow: hidden;
  min-width: 320px;
  max-width: 420px;
  pointer-events: auto;
  border-radius: 12px;
  padding: 0;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid color-mix(in srgb, var(--common-text) 12%, transparent);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: notifSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.notification.notification-leaving {
  animation: notifSlideOut 0.25s cubic-bezier(0.4, 0, 1, 1) forwards;
}

/* ── 进度条 ── */
.notif-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 0 0 0 12px;
  animation: notifShrink linear forwards;
  opacity: 0.6;
}

/* ── 主体 ── */
.notif-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
}

/* ── 图标 ── */
.notif-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--notif-icon-bg, transparent);
  color: var(--notif-icon-color, #fff);
}

.notification.success { --notif-icon-bg: var(--color-success); }
.notification.error { --notif-icon-bg: var(--color-error); }
.notification.warning { --notif-icon-bg: var(--color-warning); --notif-icon-color: #1a1a2e; }
.notification.info { --notif-icon-bg: var(--common-color-1); }

/* ── 内容 ── */
.notif-content {
  flex: 1;
  min-width: 0;
  padding-top: 3px;
}

.notif-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--common-text);
  line-height: 1.3;
  margin-bottom: 3px;
  opacity: 0.9;
}

.notif-message {
  font-size: 13px;
  line-height: 1.45;
  color: var(--common-text);
  opacity: 0.7;
  word-break: break-word;
}

/* ── 关闭按钮 ── */
.notif-close {
  opacity: 0.3;
  margin-top: 1px;
  --v-btn-bg: transparent;
  --v-btn-hover-bg: transparent;
}

.notif-close:hover {
  opacity: 0.7;
  transform: scale(1.1);
}

/* ── 操作按钮 ── */
.notif-actions {
  display: flex;
  gap: 8px;
  padding: 0 16px 12px 62px;
}

.notif-btn {
  padding: 5px 16px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--common-text) 15%, transparent);
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: var(--common-text);
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.notif-btn:hover {
  background: var(--common-color-1);
  color: #fff;
  border-color: var(--common-color-1);
}

/* ── 动画 ── */
@keyframes notifSlideIn {
  from {
    transform: translateX(calc(100% + 20px));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes notifSlideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(calc(100% + 20px));
    opacity: 0;
  }
}

@keyframes notifShrink {
  from { width: 100%; }
  to { width: 0%; }
}

/* ── 响应式 ── */
@media (max-width: 640px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
    gap: 8px;
  }
  .notification {
    min-width: auto;
    max-width: none;
  }
  .notif-body {
    padding: 12px 14px;
    gap: 10px;
  }
  .notif-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
  }
  .notif-icon svg {
    width: 16px;
    height: 16px;
  }
  .notif-actions {
    padding: 0 14px 10px 56px;
  }
}
</style>