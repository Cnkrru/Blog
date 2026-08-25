import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMathStore = defineStore('math', () => {
  const katexLoaded = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const renderedCount = ref(0)
  const autoRender = ref(true)

  const setKaTeXLoaded = (loaded) => {
    katexLoaded.value = loaded
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

  const setAutoRender = (enabled) => {
    autoRender.value = enabled
  }

  const resetError = () => {
    error.value = null
  }

  const reset = () => {
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