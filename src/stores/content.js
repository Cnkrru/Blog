import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContentStore = defineStore('content', () => {
  // 状态
  const posts = ref({})
  const projects = ref({})
  const loading = ref({})
  const errors = ref({})
  const cache = ref({})

  // 计算属性
  const isAnyLoading = computed(() => Object.values(loading.value).some(Boolean))
  const hasErrors = computed(() => Object.values(errors.value).some(Boolean))

  // 方法
  const setLoading = (type, id, isLoading) => {
    if (!loading.value[type]) {
      loading.value[type] = {}
    }
    loading.value[type][id] = isLoading
  }

  const setError = (type, id, error) => {
    if (!errors.value[type]) {
      errors.value[type] = {}
    }
    errors.value[type][id] = error
  }

  const clearError = (type, id) => {
    if (errors.value[type]) {
      delete errors.value[type][id]
    }
  }

  const setContent = (type, id, content) => {
    if (!posts.value[type]) {
      posts.value[type] = {}
    }
    posts.value[type][id] = content
    // 缓存内容
    cacheContent(type, id, content)
  }

  const getContent = (type, id) => {
    if (posts.value[type] && posts.value[type][id]) {
      return posts.value[type][id]
    }
    return getFromCache(type, id)
  }

  const cacheContent = (type, id, content) => {
    if (!cache.value[type]) {
      cache.value[type] = {}
    }
    // 只缓存必要的内容
    cache.value[type][id] = {
      ...content,
      cachedAt: new Date().toISOString()
    }
    
    // 限制缓存大小
    const cacheSize = Object.keys(cache.value[type] || {}).length
    if (cacheSize > 50) {
      // 删除最旧的缓存
      const oldestKey = Object.keys(cache.value[type]).reduce((oldest, key) => {
        return cache.value[type][key].cachedAt < cache.value[type][oldest].cachedAt ? key : oldest
      })
      delete cache.value[type][oldestKey]
    }
  }

  const getFromCache = (type, id) => {
    if (cache.value[type] && cache.value[type][id]) {
      // 检查缓存是否过期（24小时）
      const cachedAt = new Date(cache.value[type][id].cachedAt)
      const now = new Date()
      const hoursDiff = (now - cachedAt) / (1000 * 60 * 60)
      
      if (hoursDiff < 24) {
        return cache.value[type][id]
      } else {
        // 缓存过期，删除
        delete cache.value[type][id]
      }
    }
    return null
  }

  const clearCache = (type, id) => {
    if (id) {
      if (cache.value[type]) {
        delete cache.value[type][id]
      }
    } else {
      cache.value[type] = {}
    }
  }

  const clearAllCache = () => {
    cache.value = {}
  }

  // 初始化
  const init = () => {
    // 可以在这里加载缓存数据
  }

  return {
    // 状态
    posts,
    projects,
    loading,
    errors,
    cache,
    
    // 计算属性
    isAnyLoading,
    hasErrors,
    
    // 方法
    setLoading,
    setError,
    clearError,
    setContent,
    getContent,
    cacheContent,
    getFromCache,
    clearCache,
    clearAllCache,
    init
  }
})