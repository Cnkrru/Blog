import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMathStore = defineStore('math', () => {
  const katexLoaded = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const error = ref<any>(null)
  const renderedCount = ref<number>(0)
  const autoRender = ref<boolean>(true)

  const setKaTeXLoaded = (loaded: boolean): void => {
    katexLoaded.value = loaded
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

  const setAutoRender = (enabled: boolean): void => {
    autoRender.value = enabled
  }

  const resetError = (): void => {
    error.value = null
  }

  const reset = (): void => {
    katexLoaded.value = false
    loading.value = false
    error.value = null
    renderedCount.value = 0
    autoRender.value = true
  }

  return {
    katexLoaded,
    loading,
    error,
    renderedCount,
    autoRender,
    setKaTeXLoaded,
    setLoading,
    setError,
    incrementRenderedCount,
    setAutoRender,
    resetError,
    reset
  }
})
