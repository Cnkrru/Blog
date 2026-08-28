import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMouseStore = defineStore('mouse', () => {
  const enabled = ref(true)
  const trailLength = ref(20)
  const trailSpeed = ref(40)
  const trailSize = ref(18)
  const trailMode = ref('random')
  const trailColor = ref('#3498db')
  const trailChars = ref('!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')

  return {
    enabled,
    trailLength,
    trailSpeed,
    trailSize,
    trailMode,
    trailColor,
    trailChars
  }
})