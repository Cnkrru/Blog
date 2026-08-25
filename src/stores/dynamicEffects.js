import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDynamicEffectsStore = defineStore('dynamicEffects', () => {
  const sakuraEnabled = ref(false)
  const snowflakeEnabled = ref(false)
  const isMounted = ref(false)
  const currentEffect = ref('none')

  const isEnabled = computed(() => sakuraEnabled.value || snowflakeEnabled.value)

  const toggleEffect = (effect) => {
    if (effect === 'sakura') {
      sakuraEnabled.value = !sakuraEnabled.value
    } else if (effect === 'snowflake') {
      snowflakeEnabled.value = !snowflakeEnabled.value
    }
    updateCurrentEffect()
  }

  const setEffect = (effect, enabled) => {
    if (effect === 'sakura') {
      sakuraEnabled.value = enabled
    } else if (effect === 'snowflake') {
      snowflakeEnabled.value = enabled
    }
    updateCurrentEffect()
  }

  const setAllEffects = (enabled) => {
    sakuraEnabled.value = enabled
    snowflakeEnabled.value = enabled
    updateCurrentEffect()
  }

  const updateCurrentEffect = () => {
    if (snowflakeEnabled.value) {
      currentEffect.value = 'snowflake'
    } else if (sakuraEnabled.value) {
      currentEffect.value = 'sakura'
    } else {
      currentEffect.value = 'none'
    }
  }

  const setMounted = (mounted) => {
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