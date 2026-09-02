<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'

defineProps({
  isPlaying: { type: Boolean, default: false }
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
    <VButton class="v-btn-round v-btn-ghost control-btn" style="height:36px;min-width:36px" title="上一首" aria-label="上一首" @click="handlePrev"><VIcon :src="'skip-back.svg'" :size="24" /></VButton>

    <VButton class="v-btn-round v-btn-ghost control-btn play-btn" style="height:40px;min-width:40px" title="播放/暂停" aria-label="播放" @click="handleTogglePlay"><VIcon :src="isPlaying ? 'pause.svg' : 'play.svg'" :size="24" /></VButton>

    <VButton class="v-btn-round v-btn-ghost control-btn" style="height:36px;min-width:36px" title="下一首" aria-label="下一首" @click="handleNext"><VIcon :src="'skip-forward.svg'" :size="24" /></VButton>
  </div>
</template>