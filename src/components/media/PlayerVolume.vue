<script setup>
import { computed, ref, watch } from 'vue'
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'

const props = defineProps({
  volume: { type: Number, default: 0.7 },
  isMuted: { type: Boolean, default: false }
})

const emit = defineEmits(['adjust-volume', 'toggle-mute'])

const volumeBarRef = ref(null)
const volumeFillRef = ref(null)
const isDragging = ref(false)

const volumeIcon = computed(() => {
  if (props.isMuted) return 'volume-x.svg'
  if (props.volume < 0.45) return 'volume-1.svg'
  return 'volume.svg'
})

const handleToggleMute = () => {
  emit('toggle-mute')
}

function setVolumeFromClientX(clientX) {
  if (!volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  emit('adjust-volume', percent)
}

const handlePointerDown = (e) => {
  isDragging.value = true
  volumeBarRef.value?.setPointerCapture?.(e.pointerId)
  setVolumeFromClientX(e.clientX)
  e.preventDefault()
}

const handlePointerMove = (e) => {
  if (isDragging.value) setVolumeFromClientX(e.clientX)
}

const handlePointerUp = () => {
  isDragging.value = false
}

watch(() => props.volume, (val) => {
  if (volumeFillRef.value) {
    volumeFillRef.value.style.width = `${val * 100}%`
  }
})
</script>

<template>
  <div class="player-volume">
    <VButton class="v-btn-round v-btn-ghost control-btn" style="height:36px;min-width:36px" :title="isMuted ? '已静音，点击恢复音量' : '音量'" aria-label="音量" @click="handleToggleMute"><VIcon :src="volumeIcon" :size="20" /></VButton>

    <div
      ref="volumeBarRef"
      class="volume-bar"
      :class="{ dragging: isDragging }"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
    >
      <div
        ref="volumeFillRef"
        class="volume-fill"
        :style="{ width: `${isMuted ? 0 : volume * 100}%` }"
      ></div>
      <div
        class="volume-handle"
        :class="{ dragging: isDragging }"
        :style="{ left: `${isMuted ? 0 : volume * 100}%` }"
      ></div>
    </div>
  </div>
</template>