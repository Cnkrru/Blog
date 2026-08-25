import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMermaidStore = defineStore('mermaid', () => {
  const mermaidLoaded = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const renderedCount = ref(0)
  const theme = ref('default')

  const setMermaidLoaded = (loaded) => {
    mermaidLoaded.value = loaded
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  const setError = (err) => {
    error.value = err
  }

  const incrementRenderedCount = (count = 1) => {
    renderedCount.value += count
  }

  const setTheme = (themeName) => {
    theme.value = themeName
  }

  const resetError = () => {
    error.value = null
  }

  const reset = () => {
    mermaidLoaded.value = false
    loading.value = false
    error.value = null
    renderedCount.value = 0
    theme.value = 'default'
  }

  return {
    mermaidLoaded,
    loading,
    error,
    renderedCount,
    theme,
    setMermaidLoaded,
    setLoading,
    setError,
    incrementRenderedCount,
    setTheme,
    resetError,
    reset
  }
})