<script setup>
import skipBackSvg from '@/assets/svg/skip-back.svg?raw'
import playSvg from '@/assets/svg/play.svg?raw'
import pauseSvg from '@/assets/svg/pause.svg?raw'
import skipForwardSvg from '@/assets/svg/skip-forward.svg?raw'

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
    <button
      type="button"
      class="control-btn"
      aria-label="上一首"
      title="上一首"
      @click="handlePrev"
    >
      <span class="svg-icon" :style="{ width: '24px', height: '24px' }" v-html="skipBackSvg"></span>
    </button>

    <button
      type="button"
      class="control-btn play-btn"
      :class="{ playing: isPlaying }"
      aria-label="播放"
      title="播放/暂停"
      @click="handleTogglePlay"
    >
      <span class="svg-icon play-icon" :style="{ width: '24px', height: '24px' }" v-html="playSvg"></span>
      <span class="svg-icon pause-icon" :style="{ width: '24px', height: '24px' }" v-html="pauseSvg"></span>
    </button>

    <button
      type="button"
      class="control-btn"
      aria-label="下一首"
      title="下一首"
      @click="handleNext"
    >
      <span class="svg-icon" :style="{ width: '24px', height: '24px' }" v-html="skipForwardSvg"></span>
    </button>
  </div>
</template>