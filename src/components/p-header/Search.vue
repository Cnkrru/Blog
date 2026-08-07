<script setup lang="ts">
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
  try {
    const data = await store.fetchArticles()
    searchData.value = data.filter(item => item.id !== 'terminal' && item.id !== 'changelog')

    searchIndex = new ElasticsearchLikeScorer()
    searchIndex.buildInvertedIndex(searchData.value)
  } catch (error) {
    console.error('加载搜索数据失败:', error)
    searchData.value = []
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
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

    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
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

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div class="search-card search-container">
    <span class="search-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </span>
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
  border-radius: 20px;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 8px;
  z-index: 1000;
}

.search-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.search-card:focus-within .search-icon {
  opacity: 0.8;
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
  border: 1px solid color-mix(in srgb, var(--common-color-1) 15%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.6));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.search-card:focus-within {
  border-color: var(--common-color-1);
}

.search-icon {
  color: var(--common-text);
}

.search-card input {
  color: var(--common-text);
  background-color: transparent;
}

.search-card input::placeholder {
  color: var(--common-text);
  opacity: 0.4;
}
</style>

<style scoped>
@media (max-width: 768px) {
  .search-card {
      width: 80%;
      max-width: none;
  }
}

@media (max-width: 1024px) {
  .search-card {
      max-width: 400px;
  }
}

@media (max-width: 1280px) {
  .search-card {
      max-width: 500px;
  }
}

@media (max-width: 1536px) {
  .search-card {
      max-width: 600px;
  }
}
</style>