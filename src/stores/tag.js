import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTagStore = defineStore('tag', () => {
  const tags = ref([])
  const tagStats = ref([])
  const allArticles = ref([])
  const sortBy = ref('frequency')
  const loading = ref(false)
  const error = ref(null)
  const lastLoaded = ref(null)
  const tagCache = ref(new Map())

  const hasTags = computed(() => tags.value.length > 0)
  const getTagCount = computed(() => tags.value.length)
  const getPopularTags = computed(() => tagStats.value.slice(0, 10))

  const loadTags = async (articles) => {
    loading.value = true
    error.value = null

    try {
      const tagCounts = new Map()
      const tagLastUsed = new Map()

      articles.forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach((tag) => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
            const currentDate = new Date(article.date).getTime()
            const lastDate = tagLastUsed.get(tag) || 0
            if (currentDate > lastDate) {
              tagLastUsed.set(tag, currentDate)
            }
          })
        }
      })

      const stats = []
      tagCounts.forEach((count, tag) => {
        stats.push({
          tag,
          count,
          frequency: count / articles.length,
          lastUsed: tagLastUsed.get(tag) || Date.now()
        })
      })

      stats.sort((a, b) => {
        switch (sortBy.value) {
          case 'frequency': return b.frequency - a.frequency
          case 'count': return b.count - a.count
          case 'recent': return b.lastUsed - a.lastUsed
          case 'trending': {
            const aTrend = a.count * (Date.now() - a.lastUsed) / 1000000
            const bTrend = b.count * (Date.now() - b.lastUsed) / 1000000
            return bTrend - aTrend
          }
          default: return b.count - a.count
        }
      })

      tagStats.value = stats.slice(0, 50)
      tags.value = tagStats.value.map(item => item.tag)
      allArticles.value = articles
      lastLoaded.value = new Date()
    } catch (err) {
      console.error('[tagStore] 加载标签失败:', err)
      error.value = '加载标签失败'
    } finally {
      loading.value = false
    }
  }

  const getTagArticles = async (tag, articles) => {
    const cacheKey = `tag_articles_${tag}`
    const cachedArticles = tagCache.value.get(cacheKey)
    if (cachedArticles) return cachedArticles

    const filteredArticles = articles.filter(article =>
      article.tags && article.tags.includes(tag)
    )
    if (filteredArticles.length > 0) {
      tagCache.value.set(cacheKey, filteredArticles)
    }
    return filteredArticles
  }

  const getRelatedTags = (_tag, _limit = 5) => {
    // 返回与给定标签相关的其他标签，按共现频率排序
    const articles = allArticles.value
    if (articles.length === 0) return []

    const cooccurrence = new Map()
    for (const article of articles) {
      if (!article.tags || !article.tags.includes(_tag)) continue
      for (const t of article.tags) {
        if (t === _tag) continue
        cooccurrence.set(t, (cooccurrence.get(t) || 0) + 1)
      }
    }

    return Array.from(cooccurrence.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, _limit)
      .map(([tag]) => tag)
  }

  const setSortBy = (newSortBy) => {
    sortBy.value = newSortBy
    try {
      localStorage.setItem('tag_sort_preference', newSortBy)
    } catch (e) {
      console.warn('[tagStore] 无法保存标签排序偏好:', e)
    }
  }

  const resetError = () => {
    error.value = null
  }

  const clearCache = () => {
    tagCache.value.clear()
    try {
      localStorage.removeItem('tag_sort_preference')
    } catch (e) {
      console.warn('[tagStore] 无法清除标签缓存:', e)
    }
  }

  return {
    tags,
    tagStats,
    sortBy,
    loading,
    error,
    lastLoaded,
    tagCache,
    hasTags,
    getTagCount,
    getPopularTags,
    loadTags,
    getTagArticles,
    getRelatedTags,
    setSortBy,
    resetError,
    clearCache
  }
})