<template>
  <button
    class="copy-button"
    :class="{
      'copied': isCopied,
      'loading': isLoading,
      [animationClass]: animationClass
    }"
    @click="copyCode"
    @keydown="handleKeydown"
    title="Copy code"
    tabindex="0"
    role="button"
    :aria-label="isCopied ? 'Code copied!' : 'Copy code'"
  >
    <span v-if="isLoading" class="loading-spinner"></span>
    <span v-else-if="isCopied" class="status-text success">
      <span class="check-icon">✓</span>
      <span class="text">Copied!</span>
    </span>
    <span v-else class="status-text">
      <span class="copy-icon">⎘</span>
      <span class="text">Copy</span>
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useClipboardStore } from '../../stores'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const clipboardStore = useClipboardStore()
const isCopied = ref(false)
const isLoading = ref(false)
const animationClass = ref('')

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    copyCode()
  }
}

// 复制代码到剪贴板
const copyCode = async () => {
  if (isLoading.value) return

  isLoading.value = true
  animationClass.value = 'copying'

  try {
    // 使用浏览器原生Clipboard API
    await navigator.clipboard.writeText(props.code)

    // 显示复制成功状态
    isCopied.value = true
    animationClass.value = 'copied-success'

    // 添加到历史记录
    clipboardStore.addToHistory(props.code, true)

    // 3秒后恢复默认状态
    setTimeout(() => {
      isCopied.value = false
      animationClass.value = ''
    }, 3000)
  } catch (err) {
    // 降级方案：使用传统的复制方法
    fallbackCopyTextToClipboard()
  } finally {
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}

// 降级复制方法
const fallbackCopyTextToClipboard = () => {
  const textArea = document.createElement('textarea')
  textArea.value = props.code

  // 确保文本区域不在屏幕上显示
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)

  // 选择文本并复制
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      isCopied.value = true
      animationClass.value = 'copied-success'
      clipboardStore.addToHistory(props.code, true)
      setTimeout(() => {
        isCopied.value = false
        animationClass.value = ''
      }, 3000)
    } else {
      animationClass.value = 'copied-fail'
      clipboardStore.addToHistory(props.code, false)
      setTimeout(() => {
        animationClass.value = ''
      }, 3000)
    }
  } catch (err) {
    animationClass.value = 'copied-fail'
    clipboardStore.addToHistory(props.code, false)
    setTimeout(() => {
      animationClass.value = ''
    }, 3000)
  } finally {
    document.body.removeChild(textArea)
    isLoading.value = false
  }
}

onMounted(() => {
  clipboardStore.init()
})
</script>

<style scoped>
.copy-button {
  background-color: var(--button-bg);
  border: 2px solid var(--button-border);
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  text-align: center;
  color: var(--button-text);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: bold;
  box-shadow: 0 2px 8px var(--shadow-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 70px;
  position: relative;
  overflow: hidden;
}

.copy-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    120deg,
    transparent 30%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.copy-button:hover::before {
  transform: translateX(100%);
}

.copy-button:hover {
  background-color: var(--button-hover-bg);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px var(--shadow-color);
}

.copy-button:active {
  transform: translateY(0) scale(0.98);
}

.copy-button:focus {
  outline: 2px solid var(--button-focus);
  outline-offset: 2px;
}

/* 复制成功状态 */
.copy-button.copied-success {
  background-color: #28a745;
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.5);
  animation: successPulse 0.6s ease;
}

.copy-button.copied-success:hover {
  background-color: #28a745;
  transform: translateY(-2px) scale(1.05);
}

/* 复制失败状态 */
.copy-button.copied-fail {
  background-color: #dc3545;
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.5);
  animation: failShake 0.6s ease;
}

.copy-button.copied-fail:hover {
  background-color: #dc3545;
  transform: translateY(-2px) scale(1.05);
}

/* 加载状态 */
.copy-button.loading {
  pointer-events: none;
  opacity: 0.8;
}

.copy-button.loading .loading-spinner {
  animation: spin 0.8s linear infinite;
}

/* 状态文本样式 */
.status-text {
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.status-text .copy-icon,
.status-text .check-icon {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.copy-button:hover .copy-icon {
  transform: scale(1.2);
}

.copy-button.copied-success .check-icon {
  animation: checkBounce 0.5s ease;
}

/* 加载动画 */
.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 动画关键帧 */
@keyframes successPulse {
  0% {
    transform: translateY(-2px) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.1);
  }
  100% {
    transform: translateY(-2px) scale(1.05);
  }
}

@keyframes failShake {
  0%, 100% {
    transform: translateY(-2px) scale(1.05) translateX(0);
  }
  25% {
    transform: translateY(-2px) scale(1.05) translateX(-4px);
  }
  75% {
    transform: translateY(-2px) scale(1.05) translateX(4px);
  }
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .copy-button {
    padding: 3px 6px;
    font-size: 10px;
    min-width: 60px;
  }

  .loading-spinner {
    width: 12px;
    height: 12px;
  }
}
</style>