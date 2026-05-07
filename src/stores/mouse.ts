import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MouseTrailConfig {
  length: number
  speed: number
  size: number
  opacity: number
  mode: 'random' | 'gradient' | 'fixed'
  color: string
  chars: string
}

export const useMouseStore = defineStore('mouse', () => {
  const enabled = ref<boolean>(true)
  const trailLength = ref<number>(20)
  const trailSpeed = ref<number>(40)
  const trailSize = ref<number>(18)
  const trailOpacity = ref<number>(1)
  const trailMode = ref<'random' | 'gradient' | 'fixed'>('random')
  const trailColor = ref<string>('#3498db')
  const trailChars = ref<string>('!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  const isDarkTheme = ref<boolean>(false)

  const setEnabled = (val: boolean): void => {
    enabled.value = val
  }

  const setTrailLength = (length: number): void => {
    trailLength.value = Math.max(5, Math.min(50, length))
  }

  const setTrailSpeed = (speed: number): void => {
    trailSpeed.value = Math.max(10, Math.min(100, speed))
  }

  const setTrailSize = (size: number): void => {
    trailSize.value = Math.max(8, Math.min(32, size))
  }

  const setTrailMode = (mode: 'random' | 'gradient' | 'fixed'): void => {
    trailMode.value = mode
  }

  const setTrailColor = (color: string): void => {
    trailColor.value = color
  }

  const setDarkTheme = (isDark: boolean): void => {
    isDarkTheme.value = isDark
  }

  const resetConfig = (): void => {
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
    isDarkTheme,
    setEnabled,
    setTrailLength,
    setTrailSpeed,
    setTrailSize,
    setTrailMode,
    setTrailColor,
    setDarkTheme,
    resetConfig
  }
})
