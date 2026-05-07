import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContentStore = defineStore('content', () => {
  const contentCache = ref<Record<string, Record<string, any>>>({
    post: {},
    project: {}
  })
  const loadingState = ref<Record<string, Record<string, boolean>>>({})
  const errorState = ref<Record<string, Record<string, string>>>({})

  const hasContent = computed(() => (type: string, id: string): boolean => {
    return !!contentCache.value[type]?.[id]
  })

  const getContent = (type: string, id: string): any | null => {
    return contentCache.value[type]?.[id] || null
  }

  const setContent = (type: string, id: string, data: any): void => {
    if (!contentCache.value[type]) {
      contentCache.value[type] = {}
    }
    contentCache.value[type][id] = data
  }

  const setLoading = (type: string, id: string, value: boolean): void => {
    if (!loadingState.value[type]) {
      loadingState.value[type] = {}
    }
    loadingState.value[type][id] = value
  }

  const isLoading = (type: string, id: string): boolean => {
    return loadingState.value[type]?.[id] || false
  }

  const setError = (type: string, id: string, error: string): void => {
    if (!errorState.value[type]) {
      errorState.value[type] = {}
    }
    errorState.value[type][id] = error
  }

  const getError = (type: string, id: string): string | null => {
    return errorState.value[type]?.[id] || null
  }

  const clearCache = (type?: string, id?: string): void => {
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
