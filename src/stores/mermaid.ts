import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMermaidStore = defineStore('mermaid', () => {
  const mermaidLoaded = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const error = ref<any>(null)
  const renderedCount = ref<number>(0)
  const theme = ref<'default' | 'dark' | 'neutral'>('default')

  const setMermaidLoaded = (loaded: boolean): void => {
    mermaidLoaded.value = loaded
  }

  const setLoading = (isLoading: boolean): void => {
    loading.value = isLoading
  }

  const setError = (err: any): void => {
    error.value = err
  }

  const incrementRenderedCount = (count: number = 1): void => {
    renderedCount.value += count
  }

  const setTheme = (themeName: 'default' | 'dark' | 'neutral'): void => {
    theme.value = themeName
  }

  const resetError = (): void => {
    error.value = null
  }

  const reset = (): void => {
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
