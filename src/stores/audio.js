// 用在AudioVisualizer组件
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const audioContext = ref(null)
  const isAudioInitialized = ref(false)
  const audioEnabled = ref(true)
  const volume = ref(0.7)
  const analyserNode = ref(null)

  const isReady = computed(() => isAudioInitialized.value && audioEnabled.value)

  const initAudio = () => {
    if (audioContext.value) return audioContext.value
    try {
      audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
      analyserNode.value = audioContext.value.createAnalyser()
      analyserNode.value.fftSize = 256
      analyserNode.value.smoothingTimeConstant = 0.8
      isAudioInitialized.value = true
      return audioContext.value
    } catch (e) {
      console.warn('[audioStore] Web Audio API 不可用:', e)
      return null
    }
  }

  const setVolume = (vol) => {
    volume.value = Math.max(0, Math.min(1, vol))
  }

  const toggleAudio = () => {
    audioEnabled.value = !audioEnabled.value
    if (audioEnabled.value && !audioContext.value) {
      initAudio()
    }
  }

  const cleanup = () => {
    if (audioContext.value) {
      audioContext.value.close()
      audioContext.value = null
      analyserNode.value = null
      isAudioInitialized.value = false
    }
  }

  return {
    audioContext,
    isAudioInitialized,
    audioEnabled,
    volume,
    analyserNode,
    isReady,
    initAudio,
    setVolume,
    toggleAudio,
    cleanup
  }
})