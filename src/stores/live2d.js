import { defineStore } from 'pinia'

export const useLive2dStore = defineStore('live2d', {
  state: () => ({
    isVisible: true
  }),
  actions: {
    toggle() {
      this.isVisible = !this.isVisible
    },
    show() {
      this.isVisible = true
    },
    hide() {
      this.isVisible = false
    }
  }
})
