<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'

defineProps({
  playlist: { type: Array, default: () => [] },
  currentIndex: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: false }
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
        <VButton class="v-btn-round v-btn-ghost close-btn" style="height:24px;min-width:24px" title="关闭列表" aria-label="关闭列表" @click="handleClose"><VIcon :src="'x.svg'" :size="13" /></VButton>
      </div>
      <div class="playlist-content">
        <ul class="playlist-items">
          <li
            v-for="(song, index) in playlist"
            :key="index"
            :class="{ active: index === currentIndex }"
            @click="handleSelect(index)"
          >
            <img :src="song.cover" :alt="song.title + ' 封面'" loading="lazy" />
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