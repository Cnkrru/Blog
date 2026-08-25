<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import downloadSvg from '@/assets/svg/download.svg?raw'

const DISMISS_KEY = 'pwa-install-dismissed'
const INSTALLED_KEY = 'pwa-installed'

// 是否已安装（应用已添加到桌面）
const isInstalled = ref(false)
// 是否展示安装提示
const showPrompt = ref(false)
// 退场动画
const isLeaving = ref(false)
// 储存 beforeinstallprompt 事件，用于延迟触发
let deferredPrompt = null

// 检查是否已安装
function checkInstalled() {
  // 标准模式：display-mode: standalone 或 minimal-ui
  if (window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches) {
    return true
  }
  // iOS 独立模式
  if (window.navigator.standalone === true) {
    return true
  }
  return false
}

// 检查是否被用户主动忽略
function isDismissed() {
  try {
    const val = localStorage.getItem(DISMISS_KEY)
    if (val) {
      const { time } = JSON.parse(val)
      // 7 天内不再提示
      if (Date.now() - time < 7 * 24 * 60 * 60 * 1000) {
        return true
      }
      // 超过 7 天，清除记录
      localStorage.removeItem(DISMISS_KEY)
    }
  } catch { /* ignore */ }
  return false
}

// 标记已安装
function markInstalled() {
  isInstalled.value = true
  showPrompt.value = false
  try {
    localStorage.setItem(INSTALLED_KEY, 'true')
  } catch { /* ignore */ }
}

// 安装
async function handleInstall() {
  if (!deferredPrompt) return
  ;deferredPrompt.prompt()
  const result = await deferredPrompt.userChoice
  if (result.outcome === 'accepted') {
    markInstalled()
  }
  deferredPrompt = null
}

// 关闭提示
function handleDismiss() {
  isLeaving.value = true
  setTimeout(() => {
    showPrompt.value = false
    isLeaving.value = false
  }, 250)
  try {
    localStorage.setItem(DISMISS_KEY, JSON.stringify({ time: Date.now() }))
  } catch { /* ignore */ }
}

// beforeinstallprompt 事件处理
function onBeforeInstallPrompt(e) {
  e.preventDefault()
  deferredPrompt = e
  // 如果已安装或已忽略，不显示
  if (isInstalled.value || isDismissed()) return
  showPrompt.value = true
}

// 安装完成事件
function onAppInstalled() {
  markInstalled()
}

onMounted(() => {
  // 检查是否已安装
  if (checkInstalled() || localStorage.getItem(INSTALLED_KEY) === 'true') {
    isInstalled.value = true
    return
  }

  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.addEventListener('appinstalled', onAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.removeEventListener('appinstalled', onAppInstalled)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="install-banner">
      <div
        v-if="showPrompt && !isLeaving"
        class="install-prompt"
        role="alert"
        aria-live="polite"
      >
        <div class="install-prompt-body">
          <!-- 图标 -->
          <div class="install-icon">
            <span class="svg-icon" :style="{ width: '22px', height: '22px' }" v-html="downloadSvg"></span>
          </div>

          <!-- 文案 -->
          <div class="install-text">
            <div class="install-title">安装到桌面</div>
            <div class="install-desc">一键安装，快速访问 Cnkrru's Blog</div>
          </div>

          <!-- 按钮组 -->
          <div class="install-actions">
            <button class="install-btn install-btn-secondary" @click="handleDismiss">
              稍后再说
            </button>
            <button class="install-btn install-btn-primary" @click="handleInstall">
              安装
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── 容器 ── */
.install-prompt {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99998;
  max-width: 520px;
  width: calc(100% - 32px);
  border-radius: 14px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.94);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid color-mix(in srgb, var(--common-text) 12%, transparent);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18), 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* ── 主体 ── */
.install-prompt-body {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
}

/* ── 图标 ── */
.install-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--common-color-1), var(--common-hover));
  color: #fff;
}

/* ── 文案 ── */
.install-text {
  flex: 1;
  min-width: 0;
}

.install-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--common-text);
  line-height: 1.3;
  margin-bottom: 2px;
}

.install-desc {
  font-size: 12px;
  color: var(--common-text);
  opacity: 0.6;
  line-height: 1.4;
}

/* ── 按钮组 ── */
.install-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.install-btn {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
  white-space: nowrap;
}

.install-btn:active {
  transform: scale(0.96);
}

.install-btn-primary {
  border: none;
  background: linear-gradient(135deg, var(--common-color-1), var(--common-hover));
  color: #fff;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
}

.install-btn-primary:hover {
  box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 45%, transparent);
  filter: brightness(1.08);
}

.install-btn-secondary {
  border: 1px solid color-mix(in srgb, var(--common-text) 15%, transparent);
  background: transparent;
  color: var(--common-text);
  opacity: 0.7;
}

.install-btn-secondary:hover {
  opacity: 1;
  background: color-mix(in srgb, var(--common-text) 6%, transparent);
}

/* ── Transition 动画 ── */
.install-banner-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.install-banner-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.install-banner-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.install-banner-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* ── 响应式 ── */
@media (max-width: 640px) {
  .install-prompt {
    bottom: 16px;
    width: calc(100% - 20px);
  }

  .install-prompt-body {
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px 14px;
  }

  .install-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .install-icon {
    width: 36px;
    height: 36px;
  }

  .install-btn {
    padding: 6px 14px;
    font-size: 12px;
  }
}
</style>