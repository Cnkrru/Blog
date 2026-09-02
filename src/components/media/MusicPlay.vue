<script setup>
import VIcon from '@/components/__common/VIcon.vue'
import VButton from '@/components/__common/VButton.vue'
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useMusicStore } from '../../stores'
import PlayerControls from './PlayerControls.vue'
import PlayerProgress from './PlayerProgress.vue'
import PlayerVolume from './PlayerVolume.vue'
import PlayerPlaylist from './PlayerPlaylist.vue'
import AudioVisualizer from './AudioVisualizer.vue'
import AudioEffects from './AudioEffects.vue'
import MusicPlayerStyles from './MusicPlayerStyles.vue'

const playerRef = ref(null)
const toggleBtnRef = ref(null)
const playerCoverRef = ref(null)
const playerTitleRef = ref(null)
const playerArtistRef = ref(null)
const isEffectsVisible = ref(false)
const visualizerEnabled = ref(false)
const isBtnAnimating = ref(false)

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
  isBtnAnimating.value = true
  if (!playerRef.value) return
  playerRef.value.classList.toggle('active')
  if (toggleBtnRef.value) {
    toggleBtnRef.value.$el.classList.toggle('active')
  }
  musicStore.setPlayerVisible(playerRef.value.classList.contains('active'))
  setTimeout(() => { isBtnAnimating.value = false }, 400)
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
}

const onClickOutside = (e) => {
  if (isPlaylistVisible.value && playerRef.value &&
      !playerRef.value.contains(e.target) &&
      toggleBtnRef.value && !toggleBtnRef.value.$el.contains(e.target)) {
    closePlaylist()
  }
}

onMounted(() => {
  nextTick(() => {
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
    if (playerTitleRef.value) playerTitleRef.value.textContent = song.title
    if (playerArtistRef.value) playerArtistRef.value.textContent = song.artist
    if (playerCoverRef.value) playerCoverRef.value.src = song.cover
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
  <MusicPlayerStyles />
  <div>

    <VButton
      class="button-style v-btn-primary music-player-btn"
      ref="toggleBtnRef"
      :class="{ animating: isBtnAnimating }"
      title="音乐播放"
      aria-label="打开音乐播放器"
      style="height:36px;min-width:36px"
      @click="togglePlayer"
    >
      <VIcon :src="'music.svg'" :size="24" />
      <span v-if="isBtnAnimating" class="emoji-burst">✨</span>
    </VButton>

    <Teleport to="body">
      <AudioVisualizer
        :is-playing="isPlaying"
        :get-analyser="getAnalyser"
        :enabled="visualizerEnabled"
      />
      <div class="global-music-player" ref="playerRef">
        <div class="player-content">

          <!-- 第一行：封面 + 信息 + 按钮 + 音量 -->
          <div class="player-top-row">
            <div class="player-cover">
              <img ref="playerCoverRef" src="" alt="封面">
            </div>
            <div class="player-meta">
              <h4 ref="playerTitleRef" class="player-title">未选择歌曲</h4>
              <p ref="playerArtistRef" class="player-artist">未知艺术家</p>
            </div>
            <PlayerControls
              :is-playing="isPlaying"
              :current-song="currentSong"
              @toggle-play="togglePlay"
              @prev="prevSong"
              @next="nextSong"
            />
            <div class="player-extra">
              <PlayerVolume
                :volume="volume"
                :is-muted="isMuted"
                @adjust-volume="handleVolumeChange"
                @toggle-mute="toggleMute"
              />
              <div class="player-list">
                <VButton class="v-btn-round v-btn-ghost control-btn list-btn" style="height:36px;min-width:36px" title="音乐列表" aria-label="音乐列表" @click="togglePlaylist"><VIcon :src="'list.svg'" :size="20" /></VButton>
              </div>
              <div class="player-effects">
                <VButton class="v-btn-round v-btn-ghost control-btn effects-btn" style="height:36px;min-width:36px" :class="{ active: isEffectsVisible || effectsEnabled }" title="音效设置" aria-label="音效" @click="toggleEffects"><VIcon :src="'settings.svg'" :size="18" /></VButton>
              </div>
            </div>
          </div>

          <!-- 第二行：进度条 -->
          <PlayerProgress
            :current-time="currentTime"
            :duration="duration"
            :progress-percent="progressPercent"
            @seek="handleSeek"
          />
        </div>
      </div>

      <PlayerPlaylist
        :playlist="playlist"
        :current-index="currentIndex"
        :is-visible="isPlaylistVisible"
        @select="handleSelectSong"
        @close="closePlaylist"
      />
      <AudioEffects
        :audio-context="getAudioContext()"
        :is-playing="isPlaying"
        :is-visible="isEffectsVisible"
        :visualizer-enabled="visualizerEnabled"
        @effect-change="handleEffectsChange"
        @close="toggleEffects"
      />
    </Teleport>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.button-style {
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
  cursor: pointer;
}
</style>


