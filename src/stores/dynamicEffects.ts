import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDynamicEffectsStore = defineStore('dynamicEffects', () => {
  const sakuraEnabled = ref<boolean>(false)
  const snowflakeEnabled = ref<boolean>(false)
  const isMounted = ref<boolean>(false)
  const currentEffect = ref<'none' | 'sakura' | 'snowflake'>('none')

  const isEnabled = computed<boolean>(() => sakuraEnabled.value || snowflakeEnabled.value)

  const toggleEffect = (effect: 'sakura' | 'snowflake'): void => {
    if (effect === 'sakura') {
      sakuraEnabled.value = !sakuraEnabled.value
    } else if (effect === 'snowflake') {
      snowflakeEnabled.value = !snowflakeEnabled.value
    }
    updateCurrentEffect()
  }

  const setEffect = (effect: 'sakura' | 'snowflake', enabled: boolean): void => {
    if (effect === 'sakura') {
      sakuraEnabled.value = enabled
    } else if (effect === 'snowflake') {
      snowflakeEnabled.value = enabled
    }
    updateCurrentEffect()
  }

  const setAllEffects = (enabled: boolean): void => {
    sakuraEnabled.value = enabled
    snowflakeEnabled.value = enabled
    updateCurrentEffect()
  }

  const updateCurrentEffect = (): void => {
    if (snowflakeEnabled.value) {
      currentEffect.value = 'snowflake'
    } else if (sakuraEnabled.value) {
      currentEffect.value = 'sakura'
    } else {
      currentEffect.value = 'none'
    }
  }

  const setMounted = (mounted: boolean): void => {
    isMounted.value = mounted
  }

  return {
    sakuraEnabled,
    snowflakeEnabled,
    isMounted,
    currentEffect,
    isEnabled,
    toggleEffect,
    setEffect,
    setAllEffects,
    updateCurrentEffect,
    setMounted
  }
})
