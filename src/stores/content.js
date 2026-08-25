import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContentStore = defineStore('content', () => {
  const contentCache = ref({
    post: {},
    project: {}
  })
  const loadingState = ref({})
  const errorState = ref({})

  const hasContent = computed(() => (type, id) => {
    return !!contentCache.value[type]?.[id]
  })

  const getContent = (type, id) => {
    return contentCache.value[type]?.[id] || null
  }

  const setContent = (type, id, data) => {
    if (!contentCache.value[type]) {
      contentCache.value[type] = {}
    }
    contentCache.value[type][id] = data
  }

  const setLoading = (type, id, value) => {
    if (!loadingState.value[type]) {
      loadingState.value[type] = {}
    }
    loadingState.value[type][id] = value
  }

  const isLoading = (type, id) => {
    return loadingState.value[type]?.[id] || false
  }

  const setError = (type, id, error) => {
    if (!errorState.value[type]) {
      errorState.value[type] = {}
    }
    errorState.value[type][id] = error
  }

  const getError = (type, id) => {
    return errorState.value[type]?.[id] || null
  }

  const clearCache = (type, id) => {
    if (type && id) {
      if (contentCache.value[type]) {
        delete contentCache.value[type][id]
      }
      if (loadingState.value[type]) {
        delete loadingState.value[type][id]
      }
      if (errorState.value[type]) {
        delete errorState.value[type][id]
      }
    } else if (type) {
      contentCache.value[type] = {}
      loadingState.value[type] = {}
      errorState.value[type] = {}
    } else {
      contentCache.value = { post: {}, project: {} }
      loadingState.value = {}
      errorState.value = {}
    }
  }

  return {
    contentCache,
    loadingState,
    errorState,
    hasContent,
    getContent,
    setContent,
    setLoading,
    isLoading,
    setError,
    getError,
    clearCache
  }
})