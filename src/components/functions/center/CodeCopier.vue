<template>
  <button 
    class="copy-button" 
    :class="{ 'copied': isCopied }"
    @click="copyCode"
    title="Copy code"
  >
    <span v-if="!isCopied">Copy</span>
    <span v-else>Copied!</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const isCopied = ref(false)

// 复制代码到剪贴板
const copyCode = async () => {
  try {
    // 使用浏览器原生Clipboard API
    await navigator.clipboard.writeText(props.code)
    
    // 显示复制成功状态
    isCopied.value = true
    
    // 3秒后恢复默认状态
    setTimeout(() => {
      isCopied.value = false
    }, 3000)
  } catch (err) {
    // 降级方案：使用传统的复制方法
    fallbackCopyTextToClipboard()
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
      setTimeout(() => {
        isCopied.value = false
      }, 3000)
    }
  } catch (err) {
    // 静默处理错误
  } finally {
    document.body.removeChild(textArea)
  }
}
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
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.copy-button:hover {
  background-color: var(--button-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.copy-button.copied {
  background-color: #28a745;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .copy-button {
    padding: 3px 6px;
    font-size: 10px;
  }
}
</style>