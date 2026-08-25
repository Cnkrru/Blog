import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/themes/prism.min.css'

// 语言别名标准化（Prism 只认小写 + 特定命名）
const LANG_ALIAS = {
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

function normalizeLang(lang) {
  if (!lang) return 'plaintext'
  const lower = lang.toLowerCase()
  return LANG_ALIAS[lower] || lower
}

// Prism 核心自带语言，无需额外组件
const CORE_LANGS = new Set([
  'html', 'markup', 'css', 'clike', 'javascript', 'xml', 'svg', 'mathml'
])

// 常用语言 → 动态加载的组件模块（vite 自动按需拆包）
const LANG_MODULES = {
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

const loadedLangs = new Set()
const loading = new Map()

export const useCodeStore = defineStore('code', () => {
  const prismLoaded = ref(false)
  const codeStats = ref({
    totalLines: 0,
    totalChars: 0,
    highlightCount: 0
  })
  const lineNumbersEnabled = ref(true)
  const showLanguageBadge = ref(true)
  const copyEnabled = ref(true)

  const copyHistory = ref([])
  const lastCopiedCode = ref('')
  const lastCopiedTime = ref(null)
  const copyCount = ref(0)
  const copyError = ref(null)

  const isPrismLoaded = computed(() => prismLoaded.value)

  const incrementHighlightCount = () => {
    codeStats.value.highlightCount++
  }

  const updateCodeStats = (lines, chars) => {
    codeStats.value.totalLines += lines
    codeStats.value.totalChars += chars
  }

  const addToHistory = (code, success = true) => {
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

  const loadSettings = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('codeSettings')
        if (saved) {
          const data = JSON.parse(saved)
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
  async function ensurePrismLoaded() {
    if (prismLoaded.value) return
    // 本地已随包打包核心，挂到 window 供组件使用
    window.Prism = Prism
    prismLoaded.value = true
    return
  }

  /** 确保指定语言组件已加载（按需动态 import） */
  async function ensureLanguageLoaded(lang) {
    const normalized = normalizeLang(lang)
    if (normalized === 'plaintext') return
    if (CORE_LANGS.has(normalized) || window.Prism?.languages?.[normalized] || loadedLangs.has(normalized)) {
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
    await loading.get(normalized)
  }

  const init = () => {
    loadSettings()
  }

  return {
    prismLoaded,
    codeStats,
    lineNumbersEnabled,
    showLanguageBadge,
    copyEnabled,
    copyHistory,
    lastCopiedCode,
    lastCopiedTime,
    copyCount,
    copyError,
    isPrismLoaded,
    incrementHighlightCount,
    updateCodeStats,
    addToHistory,
    loadSettings,
    ensurePrismLoaded,
    ensureLanguageLoaded,
    init
  }
})