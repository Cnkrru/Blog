import { defineStore } from 'pinia'

export const useMathStore = defineStore('math', {
  state: () => ({
    katexLoaded: false,
    loading: false,
    error: null,
    renderedCount: 0
  }),
  
  getters: {
    isKaTeXReady: (state) => state.katexLoaded
  },
  
  actions: {
    setKaTeXLoaded(loaded) {
      this.katexLoaded = loaded
    },
    
    setLoading(loading) {
      this.loading = loading
    },
    
    setError(error) {
      this.error = error
    },
    
    incrementRenderedCount() {
      this.renderedCount++
    },
    
    resetError() {
      this.error = null
    }
  }
})
