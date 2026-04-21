import { defineStore } from 'pinia'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    loading: false,
    error: null,
    searchKeyword: '',
    sortBy: 'date', // date, title, id
    sortOrder: 'desc' // desc, asc
  }),
  
  getters: {
    filteredPosts: (state) => {
      let filtered = [...state.posts]
      
      // 搜索过滤
      if (state.searchKeyword) {
        const keyword = state.searchKeyword.toLowerCase()
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(keyword) ||
          post.id.toLowerCase().includes(keyword)
        )
      }
      
      // 排序
      filtered.sort((a, b) => {
        let comparison = 0
        
        switch (state.sortBy) {
          case 'date':
            comparison = new Date(b.date) - new Date(a.date)
            break
          case 'title':
            comparison = a.title.localeCompare(b.title)
            break
          case 'id':
            comparison = a.id.localeCompare(b.id)
            break
        }
        
        return state.sortOrder === 'desc' ? comparison : -comparison
      })
      
      return filtered
    },
    postCount: (state) => state.posts.length
  },
  
  actions: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/config/search.json')
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        // 过滤掉终端和日志条目
        this.posts = data.filter(post => post.id !== 'terminal' && post.id !== 'changelog')
      } catch (error) {
        this.error = error.message
        console.error('Failed to load posts:', error)
      } finally {
        this.loading = false
      }
    },
    
    setSearchKeyword(keyword) {
      this.searchKeyword = keyword
    },
    
    setSortBy(sortBy) {
      this.sortBy = sortBy
    },
    
    setSortOrder(sortOrder) {
      this.sortOrder = sortOrder
    },
    
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc'
    },
    
    resetFilters() {
      this.searchKeyword = ''
      this.sortBy = 'date'
      this.sortOrder = 'desc'
    }
  }
})
