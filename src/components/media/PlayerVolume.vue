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
      <svg class="volume-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
      <svg class="volume-low-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      <svg class="mute-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
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