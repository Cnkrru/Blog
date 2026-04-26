<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useMusicStore } from '../../stores'
import PlayerControls from './PlayerControls.vue'
import PlayerProgress from './PlayerProgress.vue'
import PlayerVolume from './PlayerVolume.vue'
import PlayerPlaylist from './PlayerPlaylist.vue'
import AudioVisualizer from './AudioVisualizer.vue'
import AudioEffects from './AudioEffects.vue'
import LxMusicSearch from './LxMusicSearch.vue'

const playerRef = ref(null)
const toggleBtnRef = ref(null)
const playerCoverRef = ref(null)
const isEffectsVisible = ref(false)
const visualizerEnabled = ref(false)
const isSearchVisible = ref(false)

const musicStore = useMusicStore()

// 从store中获取状态
const playlist = computed(() => musicStore.playlist)
const currentIndex = computed(() => musicStore.currentIndex)
const isPlaying = computed(() => musicStore.isPlaying)
const isPlayerVisible = computed(() => musicStore.isPlayerVisible)
const isPlaylistVisible = computed(() => musicStore.isPlaylistVisible)
const volume = computed(() => musicStore.volume)
const isMuted = computed(() => musicStore.isMuted)
const currentTime = computed(() => musicStore.currentTime)
const duration = computed(() => musicStore.duration)
const isLoading = computed(() => musicStore.isLoading)
const currentSong = computed(() => musicStore.currentSong)
const progressPercent = computed(() => musicStore.progressPercent)
const effectsEnabled = computed(() => musicStore.effectsEnabled)
const surroundMode = computed(() => musicStore.surroundMode)
const eqPreset = computed(() => musicStore.eqPreset)

// 从store中获取方法
const togglePlay = () => musicStore.togglePlay()
const prevSong = () => musicStore.prevSong()
const nextSong = () => musicStore.nextSong()
const togglePlaylist = () => musicStore.togglePlaylist()
const closePlaylist = () => musicStore.closePlaylist()
const selectSong = (index) => musicStore.selectSong(index)
const seek = (percent) => musicStore.seek(percent)
const setVolume = (percent) => musicStore.setVolume(percent)
const toggleMute = () => musicStore.toggleMute()
const loadMusicConfig = () => musicStore.loadMusicConfig()
const getAudio = () => musicStore.getAudio()
const getAudioContext = () => musicStore.getAudioContext()
const getAnalyser = () => musicStore.getAnalyser()
const applyEffects = (effects) => musicStore.applyEffects(effects)
const cleanup = () => musicStore.cleanup()

const togglePlayer = () => {
  if (!playerRef.value) return
  playerRef.value.classList.toggle('active')
  if (toggleBtnRef.value) {
    toggleBtnRef.value.classList.toggle('active')
  }
  musicStore.setPlayerVisible(playerRef.value.classList.contains('active'))
}

const handleSeek = (percent) => {
  seek(percent)
}

const handleVolumeChange = (percent) => {
  setVolume(percent)
}

const handleSelectSong = (index) => {
  selectSong(index)
}

const handleEffectsChange = (effects) => {
  if (effects.visualizerEnabled !== undefined) {
    visualizerEnabled.value = effects.visualizerEnabled
  }
  applyEffects(effects)
}

const toggleEffects = () => {
  isEffectsVisible.value = !isEffectsVisible.value
  if (!isEffectsVisible.value) {
    // 关闭时自动关闭音效
    effectsEnabled.value = false
    handleEffectsChange({
      enabled: false,
      surroundMode: 'off',
      eqPreset: 'flat',
      visualizerEnabled: visualizerEnabled.value
    })
  }
}

const toggleSearch = () => {
  isSearchVisible.value = !isSearchVisible.value
}

const onClickOutside = (e) => {
  if (isPlaylistVisible.value && playerRef.value &&
      !playerRef.value.contains(e.target) &&
      toggleBtnRef.value && !toggleBtnRef.value.contains(e.target)) {
    closePlaylist()
  }
}

onMounted(() => {
  nextTick(() => {
    playerRef.value = document.getElementById('global-music-player')
    toggleBtnRef.value = document.getElementById('music-player-btn')
    playerCoverRef.value = document.getElementById('player-cover')

    if (typeof document !== 'undefined') {
      document.addEventListener('click', onClickOutside)
    }

    loadMusicConfig()
  })
})

watch(currentSong, (song) => {
  if (song && playerCoverRef.value) {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (playerCoverRef.value) {
        playerCoverRef.value.src = song.cover
      }
    }
    img.src = song.cover
  }

  if (song) {
    const titleEl = document.getElementById('player-title')
    const artistEl = document.getElementById('player-artist')
    const coverEl = document.getElementById('player-cover')
    if (titleEl) titleEl.textContent = song.title
    if (artistEl) artistEl.textContent = song.artist
    if (coverEl) coverEl.src = song.cover
  }
}, { immediate: true })

watch(isPlaying, (playing) => {
  if (playerRef.value) {
    playerRef.value.classList.toggle('playing', playing)
  }
  if (playerCoverRef.value && playerCoverRef.value.parentElement) {
    playerCoverRef.value.parentElement.classList.toggle('playing', playing)
  }
})

onUnmounted(() => {
  cleanup()
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onClickOutside)
  }
})
</script>

<template>
  <div>
    <AudioVisualizer
      :is-playing="isPlaying"
      :get-analyser="getAnalyser"
      :enabled="visualizerEnabled"
    />

    <div
      class="button-style music-player-btn"
      id="music-player-btn"
      title="音乐播放"
      role="button"
      tabindex="0"
      aria-label="打开音乐播放器"
      @keydown.enter="togglePlayer"
      @keydown.space.prevent="togglePlayer"
      @click="togglePlayer"
    >
      <img src="../../assets/imgs/svg/music-player.svg" alt="音乐播放">
    </div>

    <div id="global-music-player" class="global-music-player" ref="playerRef">
      <div class="player-content">
        <div class="player-cover">
          <img id="player-cover" src="" alt="封面">
        </div>
        <div class="player-meta">
          <h4 id="player-title">未选择歌曲</h4>
          <p id="player-artist">未知艺术家</p>
        </div>
        <PlayerProgress
          :current-time="currentTime"
          :duration="duration"
          :progress-percent="progressPercent"
          @seek="handleSeek"
        />
        <PlayerControls
          :is-playing="isPlaying"
          :current-song="currentSong"
          @toggle-play="togglePlay"
          @prev="prevSong"
          @next="nextSong"
        />
        <PlayerVolume
          :volume="volume"
          :is-muted="isMuted"
          @adjust-volume="handleVolumeChange"
          @toggle-mute="toggleMute"
        />
        <div class="player-list">
          <button
            type="button"
            class="control-btn list-btn"
            aria-label="音乐列表"
            title="音乐列表"
            @click="togglePlaylist"
          >
            <img src="../../assets/imgs/svg/playlist.svg" alt="音乐列表">
          </button>
        </div>
        <div class="player-effects">
          <button
            type="button"
            class="control-btn effects-btn"
            :class="{ active: isEffectsVisible || effectsEnabled }"
            aria-label="音效"
            title="音效设置"
            @click="toggleEffects"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
        </div>
        <div class="player-search">
          <button
            type="button"
            class="control-btn search-btn"
            :class="{ active: isSearchVisible }"
            aria-label="搜索音乐"
            title="搜索音乐"
            @click="toggleSearch"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <AudioEffects
      :audio-context="getAudioContext()"
      :is-playing="isPlaying"
      :is-visible="isEffectsVisible"
      @effect-change="handleEffectsChange"
      @close="toggleEffects"
    />

    <LxMusicSearch
      :is-visible="isSearchVisible"
      @close="toggleSearch"
    />

    <PlayerPlaylist
      :playlist="playlist"
      :current-index="currentIndex"
      :is-visible="isPlaylistVisible"
      @select="handleSelectSong"
      @close="closePlaylist"
    />
  </div>
</template>

<style scoped>
.button-style {
  background-color: var(--button-bg);
  border: 1px solid var(--button-border);
  transition: all 0.3s ease;
  cursor: pointer;
}

.button-style img {
  filter: invert(1);
  transition: filter 0.3s ease;
}

body.dark-theme .button-style img {
  filter: invert(0);
}
</style>