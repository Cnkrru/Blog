<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useMusicStore } from '../../stores'

const props = withDefaults(defineProps<{ audioContext?: any; isPlaying?: boolean; isVisible?: boolean; visualizerEnabled?: boolean }>(), {
  audioContext: null,
  isPlaying: false,
  isVisible: false,
  visualizerEnabled: false
})

const emit = defineEmits<{ 'effect-change': [effect: any]; close: [] }>()

const musicStore = useMusicStore()

const effectsEnabled = computed(() => {
  console.log('[AudioEffects] effectsEnabled changed:', musicStore.effectsEnabled)
  return musicStore.effectsEnabled
})
const currentSurroundMode = computed(() => {
  console.log('[AudioEffects] surroundMode changed:', musicStore.surroundMode)
  return musicStore.surroundMode
})
const currentEqPreset = computed(() => {
  console.log('[AudioEffects] eqPreset changed:', musicStore.eqPreset)
  return musicStore.eqPreset
})

const isExpanded = ref(false)

// 硬编码选项，musicStore 没有暴露 surroundModes 和 eqPresets
const surroundModes = [
  { value: 'off', label: '关闭' },
  { value: 'hall', label: '大厅' },
  { value: 'room', label: '房间' },
  { value: 'stadium', label: '体育场' },
]
const eqPresets = [
  { value: 'flat', label: '标准' },
  { value: 'pop', label: '流行' },
  { value: 'rock', label: '摇滚' },
  { value: 'classical', label: '古典' },
  { value: 'jazz', label: '爵士' },
  { value: 'bass', label: '低音增强' },
]

const toggleEffects = () => {
  emit('effect-change', {
    enabled: !effectsEnabled.value,
    surroundMode: currentSurroundMode.value,
    eqPreset: currentEqPreset.value,
  })
}

const isVizEnabled = computed(() => props.visualizerEnabled)

const toggleVisualizer = () => {
  emit('effect-change', {
    enabled: effectsEnabled.value,
    surroundMode: currentSurroundMode.value,
    eqPreset: currentEqPreset.value,
    visualizerEnabled: !isVizEnabled.value,
  })
}

const changeSurroundMode = (mode: string) => {
  emit('effect-change', {
    enabled: true,
    surroundMode: mode,
    eqPreset: currentEqPreset.value,
  })
}

const changeEqPreset = (preset: string) => {
  emit('effect-change', {
    enabled: true,
    surroundMode: currentSurroundMode.value,
    eqPreset: preset,
  })
}

watch(() => props.isPlaying, (playing) => {
  if (!playing) isExpanded.value = false
})

watch(() => props.isVisible, (visible) => {
  isExpanded.value = visible
})

const closePanel = () => {
  emit('close')
}
</script>

<template>
  <div class="audio-effects" :class="{ expanded: isExpanded, enabled: effectsEnabled }">
    <div v-show="isExpanded" class="effects-panel" @click.stop>
      <div class="effects-header">
        <h4>音效设置</h4>
        <div class="header-actions">
          <button class="enable-btn" :style="effectsEnabled ? { background: 'var(--common-color-1)', color: '#fff', borderColor: 'var(--common-color-1)' } : {}" @click="toggleEffects">
            {{ effectsEnabled ? '已启用' : '已关闭' }}
          </button>
          <button class="close-btn" @click="closePanel">
            <img src="../../assets/imgs/svg/close.svg" alt="" width="14" height="14">
          </button>
        </div>
      </div>

      <div class="effects-body">
        <div class="effect-section">
          <div class="visualizer-toggle">
            <span class="effect-label">音频可视化</span>
            <button class="toggle-btn" :style="isVizEnabled ? { background: 'var(--common-color-1)', color: '#fff', borderColor: 'var(--common-color-1)' } : {}" @click="toggleVisualizer">{{ isVizEnabled ? '已开启' : '已关闭' }}</button>
          </div>
        </div>

        <div class="effect-section">
          <span class="effect-label">环绕模式</span>
          <div class="btn-group">
            <button
              v-for="mode in surroundModes"
              :key="mode.value"
              class="chip-btn"
              :style="currentSurroundMode === mode.value ? { background: 'var(--common-color-1)', color: '#fff', borderColor: 'var(--common-color-1)' } : {}"
              @click="changeSurroundMode(mode.value)"
            >{{ mode.label }}</button>
          </div>
        </div>

        <div class="effect-section">
          <span class="effect-label">均衡器</span>
          <div class="btn-group">
            <button
              v-for="preset in eqPresets"
              :key="preset.value"
              class="chip-btn"
              :style="currentEqPreset === preset.value ? { background: 'var(--common-color-1)', color: '#fff', borderColor: 'var(--common-color-1)' } : {}"
              @click="changeEqPreset(preset.value)"
            >{{ preset.label }}</button>
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

.effects-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid;
  animation: fadeIn 0.25s ease;
  z-index: 10000;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.effects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid;
}

.effects-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.enable-btn {
  padding: 4px 14px;
  border-radius: 14px;
  border: 1px solid;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.1) rotate(90deg);
}

.effects-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.effect-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.effect-label {
  font-size: 12px;
  font-weight: 500;
}

.visualizer-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-btn {
  padding: 4px 14px;
  border-radius: 14px;
  border: 1px solid;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip-btn {
  padding: 5px 12px;
  border-radius: 14px;
  border: 1px solid;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
</style>

<style scoped>
.effects-panel {
  background: rgba(255, 255, 255, 0.88);
  border-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
}

body.dark-theme .effects-panel {
  background: rgba(21, 7, 60, 0.9);
  border-color: rgba(255, 255, 255, 0.08);
}

.effects-header {
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

body.dark-theme .effects-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.effects-header h4 { color: var(--common-text); }

.enable-btn {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.1);
  color: var(--common-text);
}

body.dark-theme .enable-btn {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.enable-btn.active {
  background: var(--common-color-1);
  border-color: var(--common-color-1);
  color: #fff;
}

.close-btn {
  background: rgba(0, 0, 0, 0.05);
  color: var(--common-text);
}

body.dark-theme .close-btn { background: rgba(255, 255, 255, 0.08); }
.close-btn:hover { background: rgba(0, 0, 0, 0.1); }
body.dark-theme .close-btn:hover { background: rgba(255, 255, 255, 0.15); }

.effect-label { color: var(--common-text); opacity: 0.6; }

.toggle-btn {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.1);
  color: var(--common-text);
}

body.dark-theme .toggle-btn {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.toggle-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  border-color: var(--common-color-1);
}

.toggle-btn.active {
  background: var(--common-color-1);
  border-color: var(--common-color-1);
  color: #fff;
}

.chip-btn {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.08);
  color: var(--common-text);
}

body.dark-theme .chip-btn {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.chip-btn:hover {
  background: rgba(0, 0, 0, 0.06);
  border-color: var(--common-color-1);
}

body.dark-theme .chip-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--common-color-1);
}

.chip-btn.active {
  background: var(--common-color-1);
  border-color: var(--common-color-1);
  color: #fff;
}
</style>
