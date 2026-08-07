<script setup lang="ts">
withDefaults(defineProps<{ isPlaying?: boolean; currentSong?: any }>(), {
  isPlaying: false,
  currentSong: null
})

const emit = defineEmits<{
  'toggle-play': [];
   prev: [];
   next: [] 
}>()

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
    <button
      type="button"
      class="control-btn"
      aria-label="上一首"
      title="上一首"
      @click="handlePrev"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/></svg>
    </button>

    <button
      type="button"
      class="control-btn play-btn"
      :class="{ playing: isPlaying }"
      aria-label="播放"
      title="播放/暂停"
      @click="handleTogglePlay"
    >
      <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      <svg class="pause-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
    </button>

    <button
      type="button"
      class="control-btn"
      aria-label="下一首"
      title="下一首"
      @click="handleNext"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/></svg>
    </button>
  </div>
</template>