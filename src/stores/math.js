import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMathStore = defineStore('math', () => {
  const katexLoaded = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const renderedCount = ref(0)

  const isKaTeXReady = computed(() => katexLoaded.value)

  const setKaTeXLoaded = (loaded) => {
    katexLoaded.value = loaded
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  const setError = (err) => {
    error.value = err
  }

  const incrementRenderedCount = () => {
    renderedCount.value++
  }

  const resetError = () => {
    error.value = null
  }

  return {
    katexLoaded,
    loading,
    error,
    renderedCount,
    isKaTeXReady,
    setKaTeXLoaded,
    setLoading,
    setError,
    incrementRenderedCount,
    resetError
  }
})