import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/themes/prism.min.css'

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

// 语言别名标准化（Prism 只认小写 + 特定命名）
const LANG_ALIAS: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  'c++': 'cpp',
  yml: 'yaml',
  cs: 'csharp',
  rb: 'ruby',
  md: 'markdown',
  xml: 'html',
  svg: 'html',
  // vue 不是 Prism 官方语言，模板本质是 HTML，映射到 markup/html 高亮
  vue: 'html'
}

function normalizeLang(lang?: string): string {
  if (!lang) return 'plaintext'
  const lower = lang.toLowerCase()
  return LANG_ALIAS[lower] || lower
}

// Prism 核心自带语言，无需额外组件
const CORE_LANGS = new Set<string>([
  'html', 'markup', 'css', 'clike', 'javascript', 'xml', 'svg', 'mathml'
])

// 常用语言 → 动态加载的组件模块（vite 自动按需拆包）
const LANG_MODULES: Record<string, () => Promise<unknown>> = {
  python: () => import('prismjs/components/prism-python'),
  typescript: () => import('prismjs/components/prism-typescript'),
  json: () => import('prismjs/components/prism-json'),
  json5: () => import('prismjs/components/prism-json5'),
  bash: () => import('prismjs/components/prism-bash'),
  c: () => import('prismjs/components/prism-c'),
  cpp: () => import('prismjs/components/prism-cpp'),
  csharp: () => import('prismjs/components/prism-csharp'),
  cmake: () => import('prismjs/components/prism-cmake'),
  yaml: () => import('prismjs/components/prism-yaml'),
  toml: () => import('prismjs/components/prism-toml'),
  sql: () => import('prismjs/components/prism-sql'),
  markdown: () => import('prismjs/components/prism-markdown'),
  ruby: () => import('prismjs/components/prism-ruby'),
  java: () => import('prismjs/components/prism-java'),
  go: () => import('prismjs/components/prism-go'),
  rust: () => import('prismjs/components/prism-rust'),
  php: () => import('prismjs/components/prism-php'),
  docker: () => import('prismjs/components/prism-docker'),
  git: () => import('prismjs/components/prism-git'),
  ini: () => import('prismjs/components/prism-ini'),
  diff: () => import('prismjs/components/prism-diff'),
  regex: () => import('prismjs/components/prism-regex'),
  nginx: () => import('prismjs/components/prism-nginx')
}

const loadedLangs = new Set<string>()
const loading = new Map<string, Promise<void>>()

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

  /** 确保 Prism 核心 + CSS 已加载（本地打包，无需异步） */
  async function ensurePrismLoaded(): Promise<void> {
    if (prismLoaded.value) return
    // 本地已随包打包核心，挂到 window 供组件使用
    ;(window as any).Prism = Prism
    prismLoaded.value = true
    return
  }

  /** 确保指定语言组件已加载（按需动态 import） */
  async function ensureLanguageLoaded(lang: string): Promise<void> {
    const normalized = normalizeLang(lang)
    if (normalized === 'plaintext') return
    if (CORE_LANGS.has(normalized) || (window as any).Prism?.languages?.[normalized] || loadedLangs.has(normalized)) {
      return
    }
    const loader = LANG_MODULES[normalized]
    if (!loader) return
    if (!loading.has(normalized)) {
      loading.set(
        normalized,
        loader()
          .then(() => { loadedLangs.add(normalized) })
          .catch(() => { /* 加载失败不阻塞渲染 */ })
      )
    }
    await loading.get(normalized)!
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
