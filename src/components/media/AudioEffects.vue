<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useAudioStore } from '../../stores'

const props = defineProps({
  audioContext: {
    type: Object,
    default: null
  },
  isPlaying: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['effect-change', 'close'])

const audioStore = useAudioStore()

// 从store中获取状态
const effectsEnabled = computed(() => audioStore.effectsEnabled)
const visualizerEnabled = computed(() => audioStore.visualizerEnabled)
const currentSurroundMode = computed(() => audioStore.currentSurroundMode)
const currentEqPreset = computed(() => audioStore.currentEqPreset)
const surroundModes = computed(() => audioStore.surroundModes)
const eqPresets = computed(() => audioStore.eqPresets)

const isExpanded = ref(false)

// 切换可视化状态
const toggleVisualizer = () => {
  audioStore.toggleVisualizer()
  emit('effect-change', {
    enabled: audioStore.effectsEnabled,
    surroundMode: audioStore.surroundMode,
    eqPreset: audioStore.eqPreset,
    visualizerEnabled: audioStore.visualizerEnabled
  })
}

// 切换音效启用状态
const toggleEffects = () => {
  audioStore.toggleEffects()
  emit('effect-change', {
    enabled: audioStore.effectsEnabled,
    surroundMode: audioStore.surroundMode,
    eqPreset: audioStore.eqPreset,
    visualizerEnabled: audioStore.visualizerEnabled
  })
}

// 切换环绕模式
const changeSurroundMode = (mode) => {
  audioStore.setSurroundMode(mode)
  emit('effect-change', {
    enabled: audioStore.effectsEnabled,
    surroundMode: mode,
    eqPreset: audioStore.eqPreset,
    visualizerEnabled: audioStore.visualizerEnabled
  })
}

// 切换均衡器预设
const changeEqPreset = (preset) => {
  audioStore.setEqPreset(preset)
  emit('effect-change', {
    enabled: audioStore.effectsEnabled,
    surroundMode: audioStore.surroundMode,
    eqPreset: preset,
    visualizerEnabled: audioStore.visualizerEnabled
  })
}

watch(() => props.isPlaying, (playing) => {
  if (!playing) {
    isExpanded.value = false
  }
})

watch(() => props.isVisible, (visible) => {
  isExpanded.value = visible
})

const closePanel = () => {
  emit('close')
}

onMounted(() => {
  // 初始化音效设置
  audioStore.init()
})

onUnmounted(() => {
  // 清理工作
})
</script>

<template>
  <div class="audio-effects" :class="{ expanded: isExpanded, enabled: effectsEnabled }">
    <!-- 音效面板 -->
    <div v-show="isExpanded" class="effects-panel">
      <div class="effects-header">
        <h4>音效设置</h4>
        <div class="header-actions">
          <button class="enable-btn" :class="{ active: effectsEnabled }" @click="toggleEffects">
            {{ effectsEnabled ? '已启用' : '已关闭' }}
          </button>
          <button class="close-btn" @click="closePanel" title="关闭">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="effects-content" :class="{ disabled: !effectsEnabled }">
        <!-- 可视化开关 -->
        <div class="effect-section">
          <div class="visualizer-toggle">
            <label class="effect-label">音频可视化</label>
            <button class="visualizer-btn" :class="{ active: visualizerEnabled }" @click="toggleVisualizer">
              {{ visualizerEnabled ? '已开启' : '已关闭' }}
            </button>
          </div>
        </div>

        <!-- 环绕模式 -->
        <div class="effect-section">
          <label class="effect-label">环绕模式</label>
          <div class="surround-modes">
            <button
              v-for="mode in surroundModes"
              :key="mode.value"
              class="mode-btn"
              :class="{ active: currentSurroundMode === mode.value }"
              @click="changeSurroundMode(mode.value)"
              :disabled="!effectsEnabled"
            >
              {{ mode.label }}
            </button>
          </div>
        </div>

        <!-- 均衡器预设 -->
        <div class="effect-section">
          <label class="effect-label">均衡器</label>
          <div class="eq-presets">
            <button
              v-for="preset in eqPresets"
              :key="preset.value"
              class="preset-btn"
              :class="{ active: currentEqPreset === preset.value }"
              @click="changeEqPreset(preset.value)"
              :disabled="!effectsEnabled"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.audio-effects {
  position: relative;
  display: flex;
  align-items: center;
}

.effects-toggle-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.effects-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.effects-toggle-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.effects-toggle-btn svg {
  width: 18px;
  height: 18px;
}

.effects-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  background: rgba(30, 30, 50, 0.95);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeIn 0.3s ease;
  z-index: 1000;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.effects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.effects-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.enable-btn {
  padding: 4px 12px;
  border-radius: 12px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: #888;
}

.close-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.enable-btn.active {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.effects-content.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.effect-section {
  margin-bottom: 16px;
}

.effect-section:last-child {
  margin-bottom: 0;
}

.effect-label {
  display: block;
  font-size: 12px;
  color: #aaa;
  margin-bottom: 8px;
}

.visualizer-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.visualizer-btn {
  padding: 6px 16px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #ccc;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.visualizer-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.visualizer-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.surround-modes,
.eq-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mode-btn,
.preset-btn {
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #ccc;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-btn:hover,
.preset-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.mode-btn.active,
.preset-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.mode-btn:disabled,
.preset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>