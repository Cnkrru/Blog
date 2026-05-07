import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface TagStat {
  tag: string
  count: number
  frequency: number
  lastUsed: number
}

export const useTagStore = defineStore('tag', () => {
  const tags = ref<string[]>([])
  const tagStats = ref<TagStat[]>([])
  const sortBy = ref<'frequency' | 'count' | 'recent' | 'trending'>('frequency')
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastLoaded = ref<Date | null>(null)
  const tagCache = ref<Map<string, any[]>>(new Map())

  const hasTags = computed<boolean>(() => tags.value.length > 0)
  const getTagCount = computed<number>(() => tags.value.length)
  const getPopularTags = computed<TagStat[]>(() => tagStats.value.slice(0, 10))

  const loadTags = async (articles: any[]): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const tagCounts = new Map<string, number>()
      const tagLastUsed = new Map<string, number>()

      articles.forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach((tag: string) => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
            const currentDate = new Date(article.date).getTime()
            const lastDate = tagLastUsed.get(tag) || 0
            if (currentDate > lastDate) {
              tagLastUsed.set(tag, currentDate)
            }
          })
        }
      })

      const stats: TagStat[] = []
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
      lastLoaded.value = new Date()
    } catch (err) {
      console.error('[tagStore] 加载标签失败:', err)
      error.value = '加载标签失败'
    } finally {
      loading.value = false
    }
  }

  const getTagArticles = async (tag: string, articles: any[]): Promise<any[]> => {
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

  const getRelatedTags = (_tag: string, _limit: number = 5): string[] => {
    return []
  }

  const setSortBy = (newSortBy: 'frequency' | 'count' | 'recent' | 'trending'): void => {
    sortBy.value = newSortBy
    try {
      localStorage.setItem('tag_sort_preference', newSortBy)
    } catch (e) {
      console.warn('[tagStore] 无法保存标签排序偏好:', e)
    }
  }

  const resetError = (): void => {
    error.value = null
  }

  const clearCache = (): void => {
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
