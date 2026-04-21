import { defineStore } from 'pinia'

export const useMouseStore = defineStore('mouse', {
  state: () => ({
    enabled: true,
    trailLength: 20,
    trailSpeed: 40, // 毫秒
    trailSize: 18,
    trailOpacity: 1,
    trailMode: 'random', // random, gradient, fixed
    trailColor: '#3498db',
    trailChars: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    isDarkTheme: false
  }),
  
  getters: {
    isTrailEnabled: (state) => state.enabled,
    currentTrailConfig: (state) => {
      return {
        length: state.trailLength,
        speed: state.trailSpeed,
        size: state.trailSize,
        opacity: state.trailOpacity,
        mode: state.trailMode,
        color: state.trailColor,
        chars: state.trailChars
      }
    }
  },
  
  actions: {
    setEnabled(enabled) {
      this.enabled = enabled
    },
    
    setTrailLength(length) {
      this.trailLength = Math.max(5, Math.min(50, length))
    },
    
    setTrailSpeed(speed) {
      this.trailSpeed = Math.max(10, Math.min(100, speed))
    },
    
    setTrailSize(size) {
      this.trailSize = Math.max(8, Math.min(32, size))
    },
    
    setTrailMode(mode) {
      this.trailMode = mode
    },
    
    setTrailColor(color) {
      this.trailColor = color
    },
    
    setDarkTheme(isDark) {
      this.isDarkTheme = isDark
    },
    
    resetConfig() {
      this.trailLength = 20
      this.trailSpeed = 40
      this.trailSize = 18
      this.trailOpacity = 1
      this.trailMode = 'random'
      this.trailColor = '#3498db'
    }
  }
})
