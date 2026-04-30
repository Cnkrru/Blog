import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDynamicEffectsStore = defineStore('dynamicEffects', () => {
  const isEnabled = ref(true)
  const effects = ref({
    sakura: true,
    snow: true,
    particles: true,
    mouseTrail: true,
    musicVisualizer: true
  })
  const animationDuration = ref(300)

  const hasAnyEffectEnabled = computed(() => {
    return Object.values(effects.value).some(effect => effect)
  })

  const enabledEffects = computed(() => {
    return Object.keys(effects.value).filter(key => effects.value[key])
  })

  const toggleAllEffects = () => {
    isEnabled.value = !isEnabled.value
    saveUserPreference()
  }

  const toggleEffect = (effectName) => {
    if (effects.value.hasOwnProperty(effectName)) {
      effects.value[effectName] = !effects.value[effectName]
      saveUserPreference()
    }
  }

  const enableAllEffects = () => {
    isEnabled.value = true
    Object.keys(effects.value).forEach(effectName => {
      effects.value[effectName] = true
    })
    saveUserPreference()
  }

  const disableAllEffects = () => {
    isEnabled.value = false
    Object.keys(effects.value).forEach(effectName => {
      effects.value[effectName] = false
    })
    saveUserPreference()
  }

  const loadUserPreference = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedEnabled = localStorage.getItem('dynamicEffectEnabled')
      if (savedEnabled !== null) {
        isEnabled.value = savedEnabled === 'true'
      }

      const savedEffects = localStorage.getItem('dynamicEffects')
      if (savedEffects) {
        try {
          const parsedEffects = JSON.parse(savedEffects)
          Object.keys(parsedEffects).forEach(effectName => {
            if (effects.value.hasOwnProperty(effectName)) {
              effects.value[effectName] = parsedEffects[effectName]
            }
          })
        } catch (error) {
          console.error('[dynamicEffectsStore] 解析保存的效果配置失败:', error)
        }
      }
    }
  }

  const saveUserPreference = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('dynamicEffectEnabled', isEnabled.value.toString())
      localStorage.setItem('dynamicEffects', JSON.stringify(effects.value))
    }
  }

  const resetToDefault = () => {
    isEnabled.value = true
    effects.value = {
      sakura: true,
      snow: true,
      particles: true,
      mouseTrail: true,
      musicVisualizer: true
    }
    saveUserPreference()
  }

  return {
    isEnabled,
    effects,
    animationDuration,
    hasAnyEffectEnabled,
    enabledEffects,
    toggleAllEffects,
    toggleEffect,
    enableAllEffects,
    disableAllEffects,
    loadUserPreference,
    saveUserPreference,
    resetToDefault
  }
})