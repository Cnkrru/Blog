<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

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
      <img class="volume-icon" src="../../assets/imgs/svg/volume.svg" alt="音量" />
      <img class="volume-low-icon" src="../../assets/imgs/svg/volume-low.svg" alt="低音量" />
      <img class="mute-icon" src="../../assets/imgs/svg/mute.svg" alt="静音" />
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