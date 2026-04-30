import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMermaidStore = defineStore('mermaid', () => {
  const mermaidLoaded = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const renderedCount = ref(0)

  const isMermaidReady = computed(() => mermaidLoaded.value)

  const setMermaidLoaded = (loaded) => {
    mermaidLoaded.value = loaded
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
    mermaidLoaded,
    loading,
    error,
    renderedCount,
    isMermaidReady,
    setMermaidLoaded,
    setLoading,
    setError,
    incrementRenderedCount,
    resetError
  }
})