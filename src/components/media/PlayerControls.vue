<script setup lang="ts">
withDefaults(defineProps<{ isPlaying?: boolean; currentSong?: any }>(), {
  isPlaying: false,
  currentSong: null
})

const emit = defineEmits<{ 'toggle-play': []; prev: []; next: [] }>()

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
      <img src="../../assets/imgs/svg/prev.svg" alt="上一首" />
    </button>

    <button
      type="button"
      class="control-btn play-btn"
      :class="{ playing: isPlaying }"
      aria-label="播放"
      title="播放/暂停"
      @click="handleTogglePlay"
    >
      <img class="play-icon" src="../../assets/imgs/svg/play.svg" alt="播放" />
      <img class="pause-icon" src="../../assets/imgs/svg/pause.svg" alt="暂停" />
    </button>

    <button
      type="button"
      class="control-btn"
      aria-label="下一首"
      title="下一首"
      @click="handleNext"
    >
      <img src="../../assets/imgs/svg/next.svg" alt="下一首" />
    </button>
  </div>
</template>