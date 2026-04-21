import { defineStore } from 'pinia'

export const useDynamicEffectsStore = defineStore('dynamicEffects', {
  state: () => ({
    // 动态效果状态
    isEnabled: true,
    // 效果配置
    effects: {
      sakura: true, // 樱花效果
      snow: true,    // 雪花效果
      particles: true, // 背景粒子效果
      mouseTrail: true, // 鼠标轨迹效果
      musicVisualizer: true // 音乐可视化效果
    },
    // 动画持续时间
    animationDuration: 300
  }),

  getters: {
    // 检查是否有任何效果启用
    hasAnyEffectEnabled: (state) => {
      return Object.values(state.effects).some(effect => effect)
    },
    // 获取启用的效果列表
    enabledEffects: (state) => {
      return Object.keys(state.effects).filter(key => state.effects[key])
    }
  },

  actions: {
    // 切换所有动态效果
    toggleAllEffects() {
      this.isEnabled = !this.isEnabled
      this.saveUserPreference()
    },

    // 切换单个效果
    toggleEffect(effectName) {
      if (this.effects.hasOwnProperty(effectName)) {
        this.effects[effectName] = !this.effects[effectName]
        this.saveUserPreference()
      }
    },

    // 启用所有效果
    enableAllEffects() {
      this.isEnabled = true
      Object.keys(this.effects).forEach(effectName => {
        this.effects[effectName] = true
      })
      this.saveUserPreference()
    },

    // 禁用所有效果
    disableAllEffects() {
      this.isEnabled = false
      Object.keys(this.effects).forEach(effectName => {
        this.effects[effectName] = false
      })
      this.saveUserPreference()
    },

    // 加载用户偏好
    loadUserPreference() {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedEnabled = localStorage.getItem('dynamicEffectEnabled')
        if (savedEnabled !== null) {
          this.isEnabled = savedEnabled === 'true'
        }

        const savedEffects = localStorage.getItem('dynamicEffects')
        if (savedEffects) {
          try {
            const parsedEffects = JSON.parse(savedEffects)
            Object.keys(parsedEffects).forEach(effectName => {
              if (this.effects.hasOwnProperty(effectName)) {
                this.effects[effectName] = parsedEffects[effectName]
              }
            })
          } catch (error) {
            console.error('Failed to parse saved effects:', error)
          }
        }
      }
    },

    // 保存用户偏好
    saveUserPreference() {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('dynamicEffectEnabled', this.isEnabled.toString())
        localStorage.setItem('dynamicEffects', JSON.stringify(this.effects))
      }
    },

    // 重置为默认设置
    resetToDefault() {
      this.isEnabled = true
      this.effects = {
        sakura: true,
        snow: true,
        particles: true,
        mouseTrail: true,
        musicVisualizer: true
      }
      this.saveUserPreference()
    }
  }
})