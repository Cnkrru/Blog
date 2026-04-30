import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useClipboardStore = defineStore('clipboard', () => {
  // 状态
  const copyHistory = ref([])
  const lastCopiedCode = ref('')
  const lastCopiedTime = ref(null)
  const copyCount = ref(0)
  const isCopying = ref(false)
  const copyError = ref(null)

  // 计算属性
  const hasCopyHistory = computed(() => copyHistory.value.length > 0)
  const recentCopies = computed(() => copyHistory.value.slice(0, 10))
  const totalCopyCount = computed(() => copyCount.value)

  // 方法
  const addToHistory = (code, success = true) => {
    const timestamp = new Date().toISOString()

    if (success) {
      copyHistory.value.unshift({
        code: code.substring(0, 100), // 只保存前100个字符
        timestamp,
        success: true
      })

      // 限制历史记录数量
      if (copyHistory.value.length > 50) {
        copyHistory.value.pop()
      }

      lastCopiedCode.value = code
      lastCopiedTime.value = timestamp
      copyCount.value++
    } else {
      copyError.value = '复制失败'
    }
  }

  const clearHistory = () => {
    copyHistory.value = []
    lastCopiedCode.value = ''
    lastCopiedTime.value = null
  }

  const setCopying = (copying) => {
    isCopying.value = copying
  }

  const setError = (error) => {
    copyError.value = error
  }

  const clearError = () => {
    copyError.value = null
  }

  const saveToStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('clipboardHistory', JSON.stringify({
          copyHistory: copyHistory.value,
          copyCount: copyCount.value
        }))
      } catch (error) {
        console.error('[clipboardStore] 保存剪贴板历史失败:', error)
      }
    }
  }

  const loadFromStorage = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('clipboardHistory')
        if (saved) {
          const data = JSON.parse(saved)
          copyHistory.value = data.copyHistory || []
          copyCount.value = data.copyCount || 0
        }
      } catch (error) {
        console.error('[clipboardStore] 加载剪贴板历史失败:', error)
      }
    }
  }

  // 初始化
  const init = () => {
    loadFromStorage()
  }

  return {
    // 状态
    copyHistory,
    lastCopiedCode,
    lastCopiedTime,
    copyCount,
    isCopying,
    copyError,

    // 计算属性
    hasCopyHistory,
    recentCopies,
    totalCopyCount,

    // 方法
    addToHistory,
    clearHistory,
    setCopying,
    setError,
    clearError,
    saveToStorage,
    loadFromStorage,
    init
  }
})