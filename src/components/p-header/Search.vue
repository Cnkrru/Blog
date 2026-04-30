<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticlesStore } from '../../stores'
import { ElasticsearchLikeScorer } from '../../utils/algorithms'
import { RedisLikeCache } from '../../utils/cache'
import SearchResults from './SearchResults.vue'

const searchText = ref('')
const searchResults = ref([])
const showResults = ref(false)
const router = useRouter()
const store = useArticlesStore()
const searchData = ref([])

let searchIndex = null

const searchCache = new RedisLikeCache({
  memoryCapacity: 50,
  storageCapacity: 200,
  defaultTTL: 600
})

onMounted(async () => {
  console.log('开始加载搜索数据')
  try {
    const data = await store.fetchArticles()
    searchData.value = data.filter(item => item.id !== 'terminal' && item.id !== 'changelog')

    searchIndex = new ElasticsearchLikeScorer()
    searchIndex.buildInvertedIndex(searchData.value)

    const cacheWarmupData = searchData.value.map(doc => ({
      key: `article_${doc.id}`,
      value: doc,
      options: { priority: 'high', ttl: 3600 }
    }))

    await searchCache.warmup(cacheWarmupData)
  } catch (error) {
    console.error('加载搜索数据失败:', error)
    searchData.value = []
  }
})

watch(searchText, (newValue) => {
  const query = newValue.trim()

  if (query.length === 0) {
    searchResults.value = []
    showResults.value = false
    return
  }

  performSearch(query)
})

const performSearch = (query) => {
  if (!searchIndex || searchData.value.length === 0) {
    console.warn('搜索索引未初始化')
    return
  }

  const startTime = performance.now()

  const cacheKey = `search_${query}`
  const cachedResults = searchCache.get(cacheKey)

  if (cachedResults) {
    searchResults.value = cachedResults
    showResults.value = cachedResults.length > 0
    searchCache.recordAccess(cacheKey)
  } else {
    const results = searchIndex.search(query, searchData.value, 20)
    searchResults.value = results
    showResults.value = results.length > 0

    if (results.length > 0) {
      searchCache.set(cacheKey, results, {
        ttl: 300,
        priority: 'normal'
      })
    }
  }

  const endTime = performance.now()
  const duration = endTime - startTime

  if (typeof window !== 'undefined' && window.globalMonitor && typeof window.globalMonitor.recordMetric === 'function') {
    try {
      window.globalMonitor.recordMetric('search', duration, {
        timestamp: Date.now(),
        cacheHit: cachedResults ? 1 : 0,
        resultCount: searchResults.value.length,
        query: query
      })
    } catch (e) {
    }
  }

  console.log(`搜索完成: "${query}" - 结果: ${searchResults.value.length} - 耗时: ${duration.toFixed(2)}ms`)

  if (showResults.value) {
    setTimeout(() => {
      positionSearchResults()
    }, 0)
  }
}

const positionSearchResults = () => {
  if (typeof document !== 'undefined') {
    const searchContainer = document.querySelector('.search-container')
    const searchResultsEl = document.querySelector('.search-results')

    if (searchContainer && searchResultsEl) {
      const rect = searchContainer.getBoundingClientRect()
      searchResultsEl.style.left = `${rect.left}px`
      searchResultsEl.style.top = `${rect.bottom + 8}px`
      searchResultsEl.style.width = `${rect.width}px`
    }
  }
}

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
      router.push(`/post/${searchResults.value[0].id}`)
      searchText.value = ''
      showResults.value = false
    } else if (searchData.value.length > 0) {
      const post = searchData.value.find(item => item.id === query)
      if (post) {
        router.push(`/post/${post.id}`)
        searchText.value = ''
        showResults.value = false
      }
    }
  }
}

const handleResultClick = (item) => {
  router.push(`/post/${item.id}`)
  searchText.value = ''
  showResults.value = false
}

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

const handleResize = () => {
  if (showResults.value) {
    positionSearchResults()
  }
}
</script>

<template>
  <div class="search-card search-container">
    <input
      type="text"
      placeholder="搜索"
      v-model="searchText"
      @keypress="handleKeyPress"
    >

    <SearchResults
      :search-text="searchText"
      :results="searchResults"
      :show="showResults"
      @result-click="handleResultClick"
    />
  </div>
</template>

<style scoped>
.search-card {
  position: relative;
  min-width: 120px;
  max-width: 400px;
  height: 40px;
  margin: 0;
  padding: 0 16px;
  border-radius: 8px;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.search-card input {
  width: 100%;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: color 0.3s ease;
}
</style>

<style scoped>
.search-card {
  border: 2px solid var(--common-color-1);
  background-color: var(--common-bg);
}

.search-card input {
  color: var(--common-text);
  background-color: transparent;
}
</style>

<style scoped>
@media (max-width: var(--md)) {
  .search-card {
      width: 80%;
      max-width: none;
  }
}

@media (max-width: var(--lg)) {
  .search-card {
      max-width: 400px;
  }
}

@media (max-width: var(--xl)) {
  .search-card {
      max-width: 500px;
  }
}

@media (max-width: var(--2xl)) {
  .search-card {
      max-width: 600px;
  }
}
</style>
