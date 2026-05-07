import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLive2dStore = defineStore('live2d', () => {
  const isLive2dLoaded = ref<boolean>(false)
  const isLive2dVisible = ref<boolean>(true)
  const live2dModelPath = ref<string>('')
  const live2dModel = ref<any>(null)
  const live2dPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 })
  const tips = ref<string[]>(['你好呀！', '今天也是美好的一天~', '代码写得开心吗？'])

  const setLive2dLoaded = (loaded: boolean): void => {
    isLive2dLoaded.value = loaded
  }

  const toggleVisibility = (): void => {
    isLive2dVisible.value = !isLive2dVisible.value
    savePreference()
  }

  const setVisibility = (visible: boolean): void => {
    isLive2dVisible.value = visible
    savePreference()
  }

  const setLive2dModel = (model: any): void => {
    live2dModel.value = model
  }

  const setModelPath = (path: string): void => {
    live2dModelPath.value = path
  }

  const updatePosition = (x: number, y: number): void => {
    live2dPosition.value = { x, y }
  }

  const setTips = (newTips: string[]): void => {
    tips.value = newTips
  }

  const savePreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem('live2d_visible', isLive2dVisible.value.toString())
    } catch (e) {
      console.warn('[live2dStore] 保存看板娘偏好失败:', e)
    }
  }

  const loadPreference = (): void => {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('live2d_visible')
      if (saved !== null) {
        isLive2dVisible.value = saved === 'true'
      }
    } catch (e) {
      console.warn('[live2dStore] 加载看板娘偏好失败:', e)
    }
  }

  return {
    isLive2dLoaded,
    isLive2dVisible,
    live2dModelPath,
    live2dModel,
    live2dPosition,
    tips,
    setLive2dLoaded,
    toggleVisibility,
    setVisibility,
    setLive2dModel,
    setModelPath,
    updatePosition,
    setTips,
    savePreference,
    loadPreference
  }
})
