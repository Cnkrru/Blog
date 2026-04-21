import { defineStore } from 'pinia'

export const useTagStore = defineStore('tag', {
  state: () => ({
    tags: [],
    tagStats: [],
    sortBy: 'frequency',
    loading: false,
    error: null,
    lastLoaded: null,
    tagCache: new Map() // 简单的内存缓存
  }),
  
  getters: {
    hasTags: (state) => state.tags.length > 0,
    getTagCount: (state) => state.tags.length,
    getPopularTags: (state) => state.tagStats.slice(0, 10)
  },
  
  actions: {
    async loadTags(articles) {
      this.loading = true
      this.error = null
      
      try {
        const startTime = performance.now()
        
        // 提取所有文章的标签
        const allTags = []
        articles.forEach(article => {
          if (article.tags && Array.isArray(article.tags)) {
            allTags.push(...article.tags)
          }
        })
        
        // 计算标签统计
        const tagCounts = new Map()
        const tagLastUsed = new Map()
        
        articles.forEach(article => {
          if (article.tags && Array.isArray(article.tags)) {
            article.tags.forEach(tag => {
              // 计算标签出现次数
              tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
              
              // 记录最后使用时间
              const currentDate = new Date(article.date).getTime()
              const lastDate = tagLastUsed.get(tag) || 0
              if (currentDate > lastDate) {
                tagLastUsed.set(tag, currentDate)
              }
            })
          }
        })
        
        // 生成标签统计数据
        const stats = []
        tagCounts.forEach((count, tag) => {
          stats.push({
            tag,
            count,
            frequency: count / articles.length,
            lastUsed: tagLastUsed.get(tag) || Date.now()
          })
        })
        
        // 根据排序方式排序
        stats.sort((a, b) => {
          switch (this.sortBy) {
            case 'frequency':
              return b.frequency - a.frequency
            case 'count':
              return b.count - a.count
            case 'recent':
              return b.lastUsed - a.lastUsed
            case 'trending':
              // 简单的趋势计算，基于出现次数和时间
              const aTrend = a.count * (Date.now() - a.lastUsed) / 1000000
              const bTrend = b.count * (Date.now() - b.lastUsed) / 1000000
              return bTrend - aTrend
            default:
              return b.count - a.count
          }
        })
        
        // 限制标签数量
        this.tagStats = stats.slice(0, 50)
        this.tags = this.tagStats.map(item => item.tag)
        
        this.lastLoaded = new Date()
        
        const endTime = performance.now()
        const duration = endTime - startTime
        
        console.log(`标签更新完成 - 耗时: ${duration.toFixed(2)}ms - 标签数: ${this.tags.length}`)
      } catch (err) {
        console.error('加载标签失败:', err)
        this.error = '加载标签失败'
      } finally {
        this.loading = false
      }
    },
    
    async getTagArticles(tag, articles) {
      // 检查缓存
      const cacheKey = `tag_articles_${tag}`
      const cachedArticles = this.tagCache.get(cacheKey)
      
      if (cachedArticles) {
        console.log('标签文章缓存命中:', tag)
        return cachedArticles
      } else {
        // 过滤包含该标签的文章
        const filteredArticles = articles.filter(article => 
          article.tags && article.tags.includes(tag)
        )
        
        // 缓存结果（简单缓存，没有过期时间）
        if (filteredArticles.length > 0) {
          this.tagCache.set(cacheKey, filteredArticles)
        }
        
        return filteredArticles
      }
    },
    
    getRelatedTags(tag, limit = 5) {
      // 简单的相关标签计算
      // 基于标签共同出现的频率
      const relatedTags = new Map()
      
      // 这里应该有更复杂的算法，但为了简化，我们返回空数组
      // 实际项目中可以实现更复杂的相关标签计算
      return []
    },
    
    setSortBy(sortBy) {
      this.sortBy = sortBy
      
      // 记录用户偏好
      try {
        localStorage.setItem('tag_sort_preference', sortBy)
      } catch (e) {
        console.warn('无法保存标签排序偏好:', e)
      }
    },
    
    resetError() {
      this.error = null
    },
    
    clearCache() {
      // 清除标签相关缓存
      this.tagCache.clear()
      try {
        localStorage.removeItem('tag_sort_preference')
      } catch (e) {
        console.warn('无法清除标签缓存:', e)
      }
    }
  }
})