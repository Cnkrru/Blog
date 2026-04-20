<script setup>
defineProps({
  playlist: {
    type: Array,
    default: () => []
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'close'])

const handleSelect = (index) => {
  emit('select', index)
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="player-playlist" :class="{ active: isVisible }">
    <div class="playlist-container">
      <div class="playlist-header">
        <h3>音乐列表</h3>
        <button
          type="button"
          class="close-btn"
          aria-label="关闭列表"
          title="关闭列表"
          @click="handleClose"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="playlist-content">
        <ul class="playlist-items">
          <li
            v-for="(song, index) in playlist"
            :key="index"
            :class="{ active: index === currentIndex }"
            @click="handleSelect(index)"
          >
            <img :src="song.cover" :alt="song.title + ' 封面'" />
            <div class="playlist-item-info">
              <div class="playlist-item-title">{{ song.title }}</div>
              <div class="playlist-item-artist">{{ song.artist }}</div>
            </div>
            <div class="playlist-item-status">{{ index === currentIndex ? '▶' : '' }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>