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

const CDN_PRISM = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0'

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

  // ======== 共享 Prism.js 加载 ========

  // 存储加载中的 Promise，避免重复加载
  let prismLoadingPromise: Promise<void> | null = null

  /** 确保 Prism 核心 + CSS + 常用语言已加载 */
  async function ensurePrismLoaded(): Promise<void> {
    if (prismLoaded.value) return
    if (prismLoadingPromise) return prismLoadingPromise

    prismLoadingPromise = new Promise<void>((resolve, reject) => {
      if (window.Prism) {
        prismLoaded.value = true
        resolve()
        return
      }

      // 加载 CSS
      const cssLink = document.createElement('link')
      cssLink.rel = 'stylesheet'
      cssLink.href = `${CDN_PRISM}/themes/prism.min.css`
      document.head.appendChild(cssLink)

      // 加载核心 JS
      const script = document.createElement('script')
      script.src = `${CDN_PRISM}/prism.min.js`
      script.onload = () => {
        // 加载常用语言组件
        const languages = ['javascript', 'typescript', 'css', 'html', 'json', 'python', 'bash', 'vue', 'c', 'cpp', 'yaml', 'toml']
        let loadedCount = 0

        const checkComplete = () => {
          if (loadedCount >= languages.length) {
            prismLoaded.value = true
            resolve()
          }
        }

        languages.forEach(lang => {
          const langScript = document.createElement('script')
          langScript.src = `${CDN_PRISM}/components/prism-${lang}.min.js`
          langScript.onload = () => {
            addLoadedLanguage(lang)
            loadedCount++
            checkComplete()
          }
          langScript.onerror = () => {
            loadedCount++
            checkComplete()
          }
          document.head.appendChild(langScript)
        })
      }
      script.onerror = reject
      document.head.appendChild(script)
    })

    return prismLoadingPromise
  }

  /** 确保指定语言组件已加载 */
  async function ensureLanguageLoaded(lang: string): Promise<void> {
    if (!window.Prism) {
      await ensurePrismLoaded()
    }

    if (window.Prism && window.Prism.languages[lang]) return

    // 检查是否已经在加载中（通过 loadedLanguages 判断）
    if (loadedLanguages.value.includes(lang)) return

    return new Promise<void>((resolve) => {
      const script = document.createElement('script')
      script.src = `${CDN_PRISM}/components/prism-${lang}.min.js`
      script.onload = () => {
        addLoadedLanguage(lang)
        resolve()
      }
      script.onerror = () => resolve() // 加载失败不阻塞
      document.head.appendChild(script)
    })
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
    ensurePrismLoaded,
    ensureLanguageLoaded,
    init
  }
})
