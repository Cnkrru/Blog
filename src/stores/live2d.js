import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLive2dStore = defineStore('live2d', () => {
  const isVisible = ref(true)

  const toggle = () => {
    isVisible.value = !isVisible.value
  }

  const show = () => {
    isVisible.value = true
  }

  const hide = () => {
    isVisible.value = false
  }

  return {
    isVisible,
    toggle,
    show,
    hide
  }
})