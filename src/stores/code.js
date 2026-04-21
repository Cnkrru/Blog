import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCodeStore = defineStore('code', () => {
  // 状态
  const prismLoaded = ref(false)
  const loadedLanguages = ref([])
  const codeStats = ref({
    totalLines: 0,
    totalChars: 0,
    highlightCount: 0
  })
  const theme = ref('default')
  const lineNumbersEnabled = ref(true)
  const showLanguageBadge = ref(true)
  const copyEnabled = ref(true)

  // 计算属性
  const isPrismLoaded = computed(() => prismLoaded.value)
  const hasLoadedLanguages = computed(() => loadedLanguages.value.length > 0)
  const totalHighlightCount = computed(() => codeStats.value.highlightCount)

  // 方法
  const setPrismLoaded = (loaded) => {
    prismLoaded.value = loaded
  }

  const addLoadedLanguage = (language) => {
    if (!loadedLanguages.value.includes(language)) {
      loadedLanguages.value.push(language)
    }
  }

  const incrementHighlightCount = () => {
    codeStats.value.highlightCount++
  }

  const updateCodeStats = (lines, chars) => {
    codeStats.value.totalLines += lines
    codeStats.value.totalChars += chars
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
  }

  const toggleLineNumbers = () => {
    lineNumbersEnabled.value = !lineNumbersEnabled.value
  }

  const toggleLanguageBadge = () => {
    showLanguageBadge.value = !showLanguageBadge.value
  }

  const toggleCopy = () => {
    copyEnabled.value = !copyEnabled.value
  }

  // 持久化设置到 localStorage
  const saveSettings = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('codeSettings', JSON.stringify({
          theme: theme.value,
          lineNumbersEnabled: lineNumbersEnabled.value,
          showLanguageBadge: showLanguageBadge.value,
          copyEnabled: copyEnabled.value
        }))
      } catch (error) {
        console.error('保存代码设置失败:', error)
      }
    }
  }

  // 从 localStorage 加载
  const loadSettings = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('codeSettings')
        if (saved) {
          const data = JSON.parse(saved)
          theme.value = data.theme || 'default'
          lineNumbersEnabled.value = data.lineNumbersEnabled !== false
          showLanguageBadge.value = data.showLanguageBadge !== false
          copyEnabled.value = data.copyEnabled !== false
        }
      } catch (error) {
        console.error('加载代码设置失败:', error)
      }
    }
  }

  // 初始化
  const init = () => {
    loadSettings()
  }

  return {
    // 状态
    prismLoaded,
    loadedLanguages,
    codeStats,
    theme,
    lineNumbersEnabled,
    showLanguageBadge,
    copyEnabled,

    // 计算属性
    isPrismLoaded,
    hasLoadedLanguages,
    totalHighlightCount,

    // 方法
    setPrismLoaded,
    addLoadedLanguage,
    incrementHighlightCount,
    updateCodeStats,
    setTheme,
    toggleLineNumbers,
    toggleLanguageBadge,
    toggleCopy,
    saveSettings,
    loadSettings,
    init
  }
})