import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  // 状态
  const effectsEnabled = ref(false)
  const visualizerEnabled = ref(false)
  const surroundMode = ref('off')
  const eqPreset = ref('flat')
  const customEqSettings = ref([])
  
  // 环绕模式选项
  const surroundModes = [
    { value: 'off', label: '关闭' },
    { value: 'stereo', label: '立体声' },
    { value: '3d', label: '3D环绕' },
    { value: 'concert', label: '演唱会' },
    { value: 'church', label: '教堂' }
  ]
  
  // 均衡器预设选项
  const eqPresets = [
    { value: 'flat', label: '平坦' },
    { value: 'bass', label: '低音增强' },
    { value: 'treble', label: '高音增强' },
    { value: 'pop', label: '流行' },
    { value: 'rock', label: '摇滚' },
    { value: 'jazz', label: '爵士' },
    { value: 'classical', label: '古典' }
  ]
  
  // 计算属性
  const currentSurroundMode = computed(() => surroundMode.value)
  const currentEqPreset = computed(() => eqPreset.value)
  
  // 方法
  const toggleEffects = () => {
    effectsEnabled.value = !effectsEnabled.value
    saveSettings()
  }
  
  const toggleVisualizer = () => {
    visualizerEnabled.value = !visualizerEnabled.value
    saveSettings()
  }
  
  const setSurroundMode = (mode) => {
    surroundMode.value = mode
    // 如果当前是关闭且选择非关闭模式，自动开启音效
    if (mode !== 'off' && !effectsEnabled.value) {
      effectsEnabled.value = true
    }
    saveSettings()
  }
  
  const setEqPreset = (preset) => {
    eqPreset.value = preset
    // 如果当前是关闭且选择非平坦预设，自动开启音效
    if (preset !== 'flat' && !effectsEnabled.value) {
      effectsEnabled.value = true
    }
    saveSettings()
  }
  
  const setCustomEqSettings = (settings) => {
    customEqSettings.value = settings
    saveSettings()
  }
  
  const saveSettings = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('audioSettings', JSON.stringify({
          effectsEnabled: effectsEnabled.value,
          visualizerEnabled: visualizerEnabled.value,
          surroundMode: surroundMode.value,
          eqPreset: eqPreset.value,
          customEqSettings: customEqSettings.value
        }))
      } catch (error) {
        console.error('[audioStore] 保存音效设置失败:', error)
      }
    }
  }
  
  const loadSettings = () => {
    if (typeof localStorage !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('audioSettings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          effectsEnabled.value = settings.effectsEnabled || false
          visualizerEnabled.value = settings.visualizerEnabled || false
          surroundMode.value = settings.surroundMode || 'off'
          eqPreset.value = settings.eqPreset || 'flat'
          customEqSettings.value = settings.customEqSettings || []
        }
      } catch (error) {
        console.error('[audioStore] 加载音效设置失败:', error)
      }
    }
  }
  
  // 初始化
  const init = () => {
    loadSettings()
  }
  
  return {
    // 状态
    effectsEnabled,
    visualizerEnabled,
    surroundMode,
    eqPreset,
    customEqSettings,
    surroundModes,
    eqPresets,
    
    // 计算属性
    currentSurroundMode,
    currentEqPreset,
    
    // 方法
    toggleEffects,
    toggleVisualizer,
    setSurroundMode,
    setEqPreset,
    setCustomEqSettings,
    saveSettings,
    loadSettings,
    init
  }
})