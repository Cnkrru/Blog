import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchKeyword = ref('')
  const sortBy = ref('id')
  const sortOrder = ref('asc')

  const filteredPosts = computed(() => {
    let filtered = [...posts.value]

    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(keyword) ||
        post.id.toLowerCase().includes(keyword)
      )
    }

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy.value) {
        case 'date':
          comparison = new Date(b.date) - new Date(a.date)
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'id':
        default:
          const idA = isNaN(parseInt(a.id)) ? a.id : parseInt(a.id)
          const idB = isNaN(parseInt(b.id)) ? b.id : parseInt(b.id)
          if (typeof idA === 'number' && typeof idB === 'number') {
            comparison = idA - idB
          } else {
            comparison = String(a.id).localeCompare(String(b.id))
          }
          break
      }

      return sortOrder.value === 'desc' ? -comparison : comparison
    })

    return filtered
  })

  const postCount = computed(() => posts.value.length)

  const fetchPosts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/config/search.json')
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      posts.value = data.filter(post => post.id !== 'changelog')
    } catch (errorData) {
      error.value = errorData.message
      console.error('[postsStore] 加载文章失败:', errorData)
    } finally {
      loading.value = false
    }
  }

  const setSearchKeyword = (keyword) => {
    searchKeyword.value = keyword
  }

  const setSortBy = (newSortBy) => {
    sortBy.value = newSortBy
  }

  const setSortOrder = (newSortOrder) => {
    sortOrder.value = newSortOrder
  }

  const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  }

  const resetFilters = () => {
    searchKeyword.value = ''
    sortBy.value = 'id'
    sortOrder.value = 'asc'
  }

  return {
    posts,
    loading,
    error,
    searchKeyword,
    sortBy,
    sortOrder,
    filteredPosts,
    postCount,
    fetchPosts,
    setSearchKeyword,
    setSortBy,
    setSortOrder,
    toggleSortOrder,
    resetFilters
  }
})