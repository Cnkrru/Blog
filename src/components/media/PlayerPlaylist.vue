<script setup lang="ts">
withDefaults(defineProps<{
  playlist?: any[];
   currentIndex?: number;
   isVisible?: boolean 
}>(), {
  playlist: () => [],
  currentIndex: 0,
  isVisible: false
})

const emit = defineEmits<{ select: [index: number]; close: [] }>()

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
          <img src="../../assets/imgs/svg/close.svg" alt="" width="20" height="20">
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