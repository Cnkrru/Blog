import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const audioContext = ref<AudioContext | null>(null)
  const isAudioInitialized = ref<boolean>(false)
  const audioEnabled = ref<boolean>(true)
  const volume = ref<number>(0.7)
  const analyserNode = ref<AnalyserNode | null>(null)

  const isReady = computed<boolean>(() => isAudioInitialized.value && audioEnabled.value)

  const initAudio = (): AudioContext | null => {
    if (audioContext.value) return audioContext.value
    try {
      audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
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

  const setVolume = (vol: number): void => {
    volume.value = Math.max(0, Math.min(1, vol))
  }

  const toggleAudio = (): void => {
    audioEnabled.value = !audioEnabled.value
    if (audioEnabled.value && !audioContext.value) {
      initAudio()
    }
  }

  const cleanup = (): void => {
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
