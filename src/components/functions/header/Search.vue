<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useArticlesStore } from '../../../stores/articles'
import { escapeRegex, escapeHtml, highlightMatch } from '../../../utils/helpers'
import { ElasticsearchLikeScorer } from '../../../utils/algorithms'
import { RedisLikeCache } from '../../../utils/cache'

const { t } = useI18n()
const searchText = ref('')
const searchResults = ref([])
const showResults = ref(false)
const router = useRouter()
const store = useArticlesStore()
const searchData = ref([])

// Elasticsearch-like 搜索索引
let searchIndex = null

// Redis-like 缓存
const searchCache = new RedisLikeCache({
  memoryCapacity: 50,
  storageCapacity: 200,
  defaultTTL: 600 // 10分钟
})

// 加载搜索数据
onMounted(async () => {
  console.log('开始加载搜索数据')
  try {
    const data = await store.fetchArticles()
    console.log('搜索数据加载成功:', data)
    // 过滤掉终端和日志条目
    searchData.value = data.filter(item => item.id !== 'terminal' && item.id !== 'changelog')
    console.log('过滤后的搜索数据:', searchData.value)

    // 构建Elasticsearch-like搜索索引
    searchIndex = new ElasticsearchLikeScorer()
    searchIndex.buildInvertedIndex(searchData.value)
    console.log('Elasticsearch-like搜索索引构建完成:', searchIndex.getIndexStats())

    // 缓存预热
    const cacheWarmupData = searchData.value.map(doc => ({
      key: `article_${doc.id}`,
      value: doc,
      options: { priority: 'high', ttl: 3600 }
    }))

    await searchCache.warmup(cacheWarmupData)
    console.log('缓存预热完成')

  } catch (error) {
    console.error('加载搜索数据失败:', error)
    searchData.value = []
  }
})

// 监听搜索文本变化 - 输入即搜索
watch(searchText, (newValue) => {
  const query = newValue.trim()

  if (query.length === 0) {
    searchResults.value = []
    showResults.value = false
    return
  }

  // 输入即搜索，借鉴 search.js 的用户体验
  performSearch(query)
})

// 执行搜索
const performSearch = (query) => {
  console.log('开始执行搜索:', query)
  console.log('搜索索引:', searchIndex)
  console.log('搜索数据长度:', searchData.value.length)

  if (!searchIndex || searchData.value.length === 0) {
    console.warn('搜索索引未初始化')
    return
  }

  const startTime = performance.now()

  // 先检查缓存
  const cacheKey = `search_${query}`
  const cachedResults = searchCache.get(cacheKey)

  if (cachedResults) {
    console.log('缓存命中:', cacheKey, '结果数量:', cachedResults.length)
    searchResults.value = cachedResults
    showResults.value = cachedResults.length > 0

    // 记录缓存访问
    searchCache.recordAccess(cacheKey)
  } else {
    console.log('缓存未命中，执行搜索:', query)

    // 使用Elasticsearch-like评分器进行搜索
    const results = searchIndex.search(query, searchData.value, 20)
    console.log('搜索结果:', results)
    searchResults.value = results
    showResults.value = results.length > 0
    console.log('设置 showResults 为:', showResults.value)

    // 缓存搜索结果
    if (results.length > 0) {
      searchCache.set(cacheKey, results, {
        ttl: 300, // 5分钟
        priority: 'normal'
      })
    }
  }

  const endTime = performance.now()
  const duration = endTime - startTime

  // 性能监控
  if (typeof window !== 'undefined' && window.globalMonitor && typeof window.globalMonitor.recordMetric === 'function') {
    try {
      window.globalMonitor.recordMetric('search', duration, {
        timestamp: Date.now(),
        cacheHit: cachedResults ? 1 : 0,
        resultCount: searchResults.value.length,
        query: query
      })
    } catch (e) {
      // 性能监控失败不影响搜索功能
    }
  }

  console.log(`搜索完成: "${query}" - 结果: ${searchResults.value.length} - 耗时: ${duration.toFixed(2)}ms`)

  // 动态调整搜索结果卡片位置
  if (showResults.value) {
    setTimeout(() => {
      positionSearchResults()
    }, 0)
  }
}

// 定位搜索结果卡片到搜索框下方
const positionSearchResults = () => {
  if (typeof document !== 'undefined') {
    const searchContainer = document.querySelector('.search-container')
    const searchResultsEl = document.querySelector('.search-results')

    if (searchContainer && searchResultsEl) {
      const rect = searchContainer.getBoundingClientRect()
      searchResultsEl.style.left = `${rect.left}px`
      searchResultsEl.style.top = `${rect.bottom + 8}px`
      searchResultsEl.style.width = `${rect.width}px`
      console.log('定位搜索结果卡片:', rect)
    }
  }
}

// 处理回车键
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    const query = searchText.value.trim()

    if (query === 'cmd') {
      router.push('/terminal')
      searchText.value = ''
      showResults.value = false
      return
    }

    if (searchResults.value.length > 0) {
      // 跳转到第一个结果
      router.push(`/post/${searchResults.value[0].id}`)
      searchText.value = ''
      showResults.value = false
    } else if (searchData.value.length > 0) {
      // 如果没有搜索结果，尝试直接通过 ID 跳转
      const post = searchData.value.find(item => item.id === query)
      if (post) {
        router.push(`/post/${post.id}`)
        searchText.value = ''
        showResults.value = false
      }
    }
  }
}

// 点击搜索结果
const handleResultClick = (item) => {
  // 使用路由跳转而不是直接链接
  router.push(`/post/${item.id}`)
  searchText.value = ''
  showResults.value = false
}

// 点击外部关闭结果
const handleClickOutside = (e) => {
  const searchContainer = e.target.closest('.search-container')
  if (!searchContainer) {
    showResults.value = false
  }
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})

// 处理窗口大小改变
const handleResize = () => {
  if (showResults.value) {
    positionSearchResults()
  }
}
</script>

<template>
  <div class="search-container">
    <input
      type="text"
      :placeholder="t('search')"
      v-model="searchText"
      @keypress="handleKeyPress"
    >

    <!-- 搜索结果列表 -->
    <div v-if="showResults" class="search-results">
      <!-- 无结果 -->
      <div v-if="searchResults.length === 0" class="search-empty">
        {{ t('search') }}: "{{ escapeHtml(searchText) }}" - {{ t('noResults') || 'No results found' }}
      </div>

      <!-- 有结果 -->
      <template v-else>
        <div class="search-counter">
          {{ searchResults.length }} {{ t('resultsFound') || 'results found' }}
        </div>

        <div
          v-for="item in searchResults"
          :key="item.id"
          class="search-result-item"
          @click="handleResultClick(item)"
        >
          <div class="result-title" v-html="highlightMatch(escapeHtml(item.title), searchText)"></div>
          <div class="result-meta">
            {{ t('categories') }}: <span v-html="highlightMatch(escapeHtml(item.category || ''), searchText)"></span> |
            ID: <span v-html="highlightMatch(escapeHtml(item.id), searchText)"></span>
          </div>
          <div class="result-tags" v-if="item.tags && item.tags.length > 0">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  flex: 1;
  min-width: 120px;
  max-width: 400px;
  height: 40px;
  margin: 0;
  padding: 0 16px;
  border-radius: 8px;
  border: 3px solid var(--search-card-border-color);
  background-color: var(--card-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.search-container input {
  width: 100%;
  color: var(--text-color);
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 14px;
  box-sizing: border-box;
}

.search-results {
  position: fixed;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px var(--shadow-color);
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;
  width: 400px;
  max-width: 90%;
}

.search-empty {
  padding: 16px;
  text-align: center;
  color: var(--text-muted);
}

.search-counter {
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-muted);
}

.search-result-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: var(--hover-bg);
}

.search-result-item:last-child {
  border-bottom: none;
}

.result-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.result-meta {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.result-tags {
  font-size: 12px;
  margin-top: 4px;
}

.tag {
  background-color: var(--button-bg);
  color: var(--button-text);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  margin-right: 4px;
  display: inline-block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-results {
    position: fixed;
    left: 10px;
    right: 10px;
    max-height: 60vh;
  }
}
</style>