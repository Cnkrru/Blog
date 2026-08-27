<script setup>
import VButton from '@/components/common/VButton.vue'

defineProps({
  isPlaying: { type: Boolean, default: false },
  currentSong: { default: null }
})

const emit = defineEmits(['toggle-play', 'prev', 'next'])

const handleTogglePlay = () => {
  emit('toggle-play')
}

const handlePrev = () => {
  emit('prev')
}

const handleNext = () => {
  emit('next')
}
</script>

<template>
  <div class="player-controls">
    <VButton round variant="ghost" size="36" class="control-btn" icon="skip-back.svg" icon-size="24" title="上一首" aria-label="上一首" @click="handlePrev" />

    <VButton round variant="ghost" size="40" class="control-btn play-btn" :icon="isPlaying ? 'pause.svg' : 'play.svg'" icon-size="24" title="播放/暂停" aria-label="播放" @click="handleTogglePlay" />

    <VButton round variant="ghost" size="36" class="control-btn" icon="skip-forward.svg" icon-size="24" title="下一首" aria-label="下一首" @click="handleNext" />
  </div>
</template>