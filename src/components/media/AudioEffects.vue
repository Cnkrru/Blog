<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
import { ref, watch, computed } from 'vue'
import { useMusicStore } from '../../stores'

const props = defineProps({
  audioContext: { default: null },
  isPlaying: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: false },
  visualizerEnabled: { type: Boolean, default: false }
})

const emit = defineEmits(['effect-change', 'close'])

const musicStore = useMusicStore()

const effectsEnabled = computed(() => {
  return musicStore.effectsEnabled
})
const currentSurroundMode = computed(() => {
  return musicStore.surroundMode
})
const currentEqPreset = computed(() => {
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

const changeSurroundMode = (mode) => {
  emit('effect-change', {
    enabled: true,
    surroundMode: mode,
    eqPreset: currentEqPreset.value,
  })
}

const changeEqPreset = (preset) => {
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
          <VButton class="v-btn-pill v-btn-ghost enable-btn" :style="effectsEnabled ? { background: 'var(--common-color-1)', color: 'var(--common-content)', borderColor: 'var(--common-color-1)' } : {}" @click="toggleEffects" aria-label="切换音效状态">
            {{ effectsEnabled ? '已启用' : '已关闭' }}
          </VButton>
          <VButton class="v-btn-round v-btn-ghost close-btn" style="height:28px;min-width:28px" title="关闭音效设置" aria-label="关闭音效设置" @click="closePanel"><VIcon :src="'x.svg'" :size="15" /></VButton>
        </div>
      </div>

      <div class="effects-body">
        <div class="effect-section">
          <div class="visualizer-toggle">
            <span class="effect-label">音频可视化</span>
            <VButton class="v-btn-pill v-btn-ghost toggle-btn" :style="isVizEnabled ? { background: 'var(--common-color-1)', color: 'var(--common-content)', borderColor: 'var(--common-color-1)' } : {}" @click="toggleVisualizer" aria-label="切换音频可视化">{{ isVizEnabled ? '已开启' : '已关闭' }}</VButton>
          </div>
        </div>

        <div class="effect-section">
          <span class="effect-label">环绕模式</span>
          <div class="btn-group">
            <VButton
              v-for="mode in surroundModes"
              :key="mode.value"
              class="v-btn-pill v-btn-ghost chip-btn"
              :aria-label="'环绕模式：' + mode.label"
              :style="currentSurroundMode === mode.value ? { background: 'var(--common-color-1)', color: 'var(--common-content)', borderColor: 'var(--common-color-1)' } : {}"
              @click="changeSurroundMode(mode.value)"
            >{{ mode.label }}</VButton>
          </div>
        </div>

        <div class="effect-section">
          <span class="effect-label">均衡器</span>
          <div class="btn-group">
            <VButton
              v-for="preset in eqPresets"
              :key="preset.value"
              class="v-btn-pill v-btn-ghost chip-btn"
              :aria-label="'均衡器：' + preset.label"
              :style="currentEqPreset === preset.value ? { background: 'var(--common-color-1)', color: 'var(--common-content)', borderColor: 'var(--common-color-1)' } : {}"
              @click="changeEqPreset(preset.value)"
            >{{ preset.label }}</VButton>
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

.enable-btn,
.toggle-btn,
.chip-btn {
  --v-btn-pad: 4px 14px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.chip-btn {
  --v-btn-pad: 5px 12px;
}

.close-btn {
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

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.effects-panel {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-alpha));
  border-color: color-mix(in srgb, var(--common-text) 8%, transparent);
  box-shadow: 0 16px 48px var(--common-shadow);
}

.effects-header {
    border-bottom-color: color-mix(in srgb, var(--common-text) 8%, transparent);
}

.effects-header h4 { color: var(--common-text); }

.effect-label {
  color: var(--common-text);
  opacity: 0.6;
}

.enable-btn,
.toggle-btn {
  --v-btn-bg: color-mix(in srgb, var(--common-text) 6%, transparent);
  --v-btn-border: color-mix(in srgb, var(--common-text) 10%, transparent);
  --v-btn-color: var(--common-text);
  --v-btn-hover-bg: color-mix(in srgb, var(--common-text) 10%, transparent);
}

.toggle-btn:hover {
  --v-btn-border: var(--common-color-1);
}

.chip-btn {
  --v-btn-bg: color-mix(in srgb, var(--common-text) 5%, transparent);
  --v-btn-border: color-mix(in srgb, var(--common-text) 8%, transparent);
  --v-btn-color: var(--common-text);
  --v-btn-hover-bg: color-mix(in srgb, var(--common-text) 8%, transparent);
}

.chip-btn:hover {
  --v-btn-border: var(--common-color-1);
}

.close-btn {
  --v-btn-bg: color-mix(in srgb, var(--common-text) 8%, transparent);
  --v-btn-color: var(--common-text);
  --v-btn-hover-bg: color-mix(in srgb, var(--common-text) 15%, transparent);
}

@keyframes fadeIn {
  from {
  opacity: 0;
   transform: translate(-50%, -50%) scale(0.92);
   
}
  to   {
  opacity: 1;
   transform: translate(-50%, -50%) scale(1);
   
}
}
</style>
