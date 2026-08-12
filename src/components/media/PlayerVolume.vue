<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import volumeSvg from '@/assets/svg/volume.svg?raw'
import volume1Svg from '@/assets/svg/volume-1.svg?raw'
import volumeXSvg from '@/assets/svg/volume-x.svg?raw'

const props = withDefaults(defineProps<{ volume?: number; isMuted?: boolean }>(), {
  volume: 0.7,
  isMuted: false
})

const emit = defineEmits<{ 'adjust-volume': [percent: number]; 'toggle-mute': [] }>()

const volumeBarRef = ref(null)
let isDraggingVolume = false

const handleAdjustVolume = (e) => {
  if (!volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('adjust-volume', percent)
}

const handleToggleMute = () => {
  emit('toggle-mute')
}

const onMouseMoveVolume = (e) => {
  if (!isDraggingVolume || !volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('adjust-volume', percent)
}

const onMouseUpVolume = () => {
  isDraggingVolume = false
}

const onMouseDownVolume = () => {
  isDraggingVolume = true
}

watch(() => props.volume, (val) => {
  const fill = document.getElementById('volume-fill')
  if (fill) {
    fill.style.width = `${val * 100}%`
  }
})

watch(() => props.isMuted, (muted) => {
  const btn = document.getElementById('player-volume-btn')
  if (btn) {
    btn.classList.toggle('muted', muted)
  }
})

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', onMouseMoveVolume)
    document.addEventListener('mouseup', onMouseUpVolume)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('mousemove', onMouseMoveVolume)
    document.removeEventListener('mouseup', onMouseUpVolume)
  }
})
</script>

<template>
  <div class="player-volume">
    <button
      type="button"
      id="player-volume-btn"
      class="control-btn"
      :class="{ muted: isMuted }"
      aria-label="音量"
      title="音量控制"
      @click="handleToggleMute"
    >
      <span class="svg-icon volume-icon" :style="{ width: '24px', height: '24px' }" v-html="volumeSvg"></span>
      <span class="svg-icon volume-low-icon" :style="{ width: '24px', height: '24px' }" v-html="volume1Svg"></span>
      <span class="svg-icon mute-icon" :style="{ width: '24px', height: '24px' }" v-html="volumeXSvg"></span>
    </button>

    <div class="volume-bar" ref="volumeBarRef" @click="handleAdjustVolume">
      <div
        id="volume-fill"
        class="volume-fill"
        :style="{ width: `${isMuted ? 0 : volume * 100}%` }"
      ></div>
    </div>
  </div>
</template>