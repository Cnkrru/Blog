import { defineStore } from 'pinia'

export const useMermaidStore = defineStore('mermaid', {
  state: () => ({
    mermaidLoaded: false,
    loading: false,
    error: null,
    renderedCount: 0
  }),
  
  getters: {
    isMermaidReady: (state) => state.mermaidLoaded
  },
  
  actions: {
    setMermaidLoaded(loaded) {
      this.mermaidLoaded = loaded
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
