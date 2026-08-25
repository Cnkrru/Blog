import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMouseStore = defineStore('mouse', () => {
  const enabled = ref(true)
  const trailLength = ref(20)
  const trailSpeed = ref(40)
  const trailSize = ref(18)
  const trailOpacity = ref(1)
  const trailMode = ref('random')
  const trailColor = ref('#3498db')
  const trailChars = ref('!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')

  const setEnabled = (val) => {
    enabled.value = val
  }

  const setTrailLength = (length) => {
    trailLength.value = Math.max(5, Math.min(50, length))
  }

  const setTrailSpeed = (speed) => {
    trailSpeed.value = Math.max(10, Math.min(100, speed))
  }

  const setTrailSize = (size) => {
    trailSize.value = Math.max(8, Math.min(32, size))
  }

  const setTrailMode = (mode) => {
    trailMode.value = mode
  }

  const setTrailColor = (color) => {
    trailColor.value = color
  }

  const resetConfig = () => {
    trailLength.value = 20
    trailSpeed.value = 40
    trailSize.value = 18
    trailOpacity.value = 1
    trailMode.value = 'random'
    trailColor.value = '#3498db'
  }

  return {
    enabled,
    trailLength,
    trailSpeed,
    trailSize,
    trailOpacity,
    trailMode,
    trailColor,
    trailChars,
    setEnabled,
    setTrailLength,
    setTrailSpeed,
    setTrailSize,
    setTrailMode,
    setTrailColor,
    resetConfig
  }
})