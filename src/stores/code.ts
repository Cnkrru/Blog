import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CodeSettings {
  theme: string
  lineNumbersEnabled: boolean
  showLanguageBadge: boolean
  copyEnabled: boolean
}

export interface CopyHistoryItem {
  code: string
  timestamp: string
  success: boolean
}

export interface CodeStats {
  totalLines: number
  totalChars: number
  highlightCount: number
}

export const useCodeStore = defineStore('code', () => {
  const prismLoaded = ref<boolean>(false)
  const loadedLanguages = ref<string[]>([])
  const codeStats = ref<CodeStats>({
    totalLines: 0,
    totalChars: 0,
    highlightCount: 0
  })
  const theme = ref<string>('default')
  const lineNumbersEnabled = ref<boolean>(true)
  const showLanguageBadge = ref<boolean>(true)
  const copyEnabled = ref<boolean>(true)

  const copyHistory = ref<CopyHistoryItem[]>([])
  const lastCopiedCode = ref<string>('')
  const lastCopiedTime = ref<string | null>(null)
  const copyCount = ref<number>(0)
  const isCopying = ref<boolean>(false)
  const copyError = ref<string | null>(null)

  const isPrismLoaded = computed<boolean>(() => prismLoaded.value)
  const hasLoadedLanguages = computed<boolean>(() => loadedLanguages.value.length > 0)
  const totalHighlightCount = computed<number>(() => codeStats.value.highlightCount)
  const hasCopyHistory = computed<boolean>(() => copyHistory.value.length > 0)
  const recentCopies = computed<CopyHistoryItem[]>(() => copyHistory.value.slice(0, 10))
  const totalCopyCount = computed<number>(() => copyCount.value)

  const setPrismLoaded = (loaded: boolean): void => {
    prismLoaded.value = loaded
  }

  const addLoadedLanguage = (language: string): void => {
    if (!loadedLanguages.value.includes(language)) {
      loadedLanguages.value.push(language)
    }
  }

  const incrementHighlightCount = (): void => {
    codeStats.value.highlightCount++
  }

  const updateCodeStats = (lines: number, chars: number): void => {
    codeStats.value.totalLines += lines
    codeStats.value.totalChars += chars
  }

  const setTheme = (newTheme: string): void => {
    theme.value = newTheme
  }

  const toggleLineNumbers = (): void => {
    lineNumbersEnabled.value = !lineNumbersEnabled.value
  }

  const toggleLanguageBadge = (): void => {
    showLanguageBadge.value = !showLanguageBadge.value
  }

  const toggleCopy = (): void => {
    copyEnabled.value = !copyEnabled.value
  }

  const addToHistory = (code: string, success: boolean = true): void => {
    const timestamp = new Date().toISOString()

    if (success) {
      copyHistory.value.unshift({
        code: code.substring(0, 100),
        timestamp,
        success: true
      })

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

  const clearCopyHistory = (): void => {
    copyHistory.value = []
    lastCopiedCode.value = ''
    lastCopiedTime.value = null
  }

  const setCopying = (copying: boolean): void => {
    isCopying.value = copying
  }

  const setCopyError = (error: string | null): void => {
    copyError.value = error
  }

  const clearCopyError = (): void => {
    copyError.value = null
  }

  const saveSettings = (): void => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('codeSettings', JSON.stringify({
          theme: theme.value,
          lineNumbersEnabled: lineNumbersEnabled.value,
          showLanguageBadge: showLanguageBadge.value,
          copyEnabled: copyEnabled.value
        }))
        localStorage.setItem('clipboardHistory', JSON.stringify({
          copyHistory: copyHistory.value,
          copyCount: copyCount.value
        }))
      } catch (error) {
        console.error('[codeStore] 保存设置失败:', error)
      }
    }
  }

  const loadSettings = (): void => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('codeSettings')
        if (saved) {
          const data = JSON.parse(saved) as CodeSettings
          theme.value = data.theme || 'default'
          lineNumbersEnabled.value = data.lineNumbersEnabled !== false
          showLanguageBadge.value = data.showLanguageBadge !== false
          copyEnabled.value = data.copyEnabled !== false
        }
        const savedClipboard = localStorage.getItem('clipboardHistory')
        if (savedClipboard) {
          const data = JSON.parse(savedClipboard)
          copyHistory.value = data.copyHistory || []
          copyCount.value = data.copyCount || 0
        }
      } catch (error) {
        console.error('[codeStore] 加载设置失败:', error)
      }
    }
  }

  const init = (): void => {
    loadSettings()
  }

  return {
    prismLoaded,
    loadedLanguages,
    codeStats,
    theme,
    lineNumbersEnabled,
    showLanguageBadge,
    copyEnabled,
    copyHistory,
    lastCopiedCode,
    lastCopiedTime,
    copyCount,
    isCopying,
    copyError,
    isPrismLoaded,
    hasLoadedLanguages,
    totalHighlightCount,
    hasCopyHistory,
    recentCopies,
    totalCopyCount,
    setPrismLoaded,
    addLoadedLanguage,
    incrementHighlightCount,
    updateCodeStats,
    setTheme,
    toggleLineNumbers,
    toggleLanguageBadge,
    toggleCopy,
    addToHistory,
    clearCopyHistory,
    setCopying,
    setCopyError,
    clearCopyError,
    saveSettings,
    loadSettings,
    init
  }
})
