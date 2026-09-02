// 用在MusicPlay和AudioEffects组件
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// 3D音效处理器类
class SpatialAudioProcessor {
  audioContext
  stereoPanner
  gainNode
  analyser
  filters
  bands
  isSurroundEnabled
  surroundSpeed
  surroundPhase
  animationId

  constructor(audioContext) {
    this.audioContext = audioContext
    this.stereoPanner = audioContext.createStereoPanner()
    this.gainNode = audioContext.createGain()
    this.analyser = audioContext.createAnalyser()

    // 均衡器滤波器
    this.filters = []
    this.bands = 10
    this.createFilters()

    // 连接链: source -> filters -> analyser -> stereoPanner -> gain -> destination
    for (let i = 0; i < this.bands; i++) {
      if (i === 0) {
        this.filters[i].connect(this.analyser)
      } else {
        this.filters[i].connect(this.filters[i - 1])
      }
    }

    this.analyser.connect(this.stereoPanner)
    this.stereoPanner.connect(this.gainNode)
    this.gainNode.connect(audioContext.destination)

    // 环绕效果参数
    this.isSurroundEnabled = false
    this.surroundSpeed = 0.5 // 移动速度 (Hz)
    this.surroundPhase = 0 // 当前相位 (0-2π)
    this.animationId = null
  }

  createFilters() {
    for (let i = 0; i < this.bands; i++) {
      const filter = this.audioContext.createBiquadFilter()

      if (i === 0) {
        filter.type = 'lowshelf'
      } else if (i === this.bands - 1) {
        filter.type = 'highshelf'
      } else {
        filter.type = 'peaking'
      }

      filter.frequency.value = 20 * Math.pow(2, i * 0.5)
      filter.Q.value = 1
      filter.gain.value = 0

      this.filters.push(filter)
    }

    // 设置 analyser
    this.analyser.fftSize = 256
    this.analyser.smoothingTimeConstant = 0.8
  }

  startSurroundAnimation() {
    if (this.animationId) return

    const animate = () => {
      if (!this.isSurroundEnabled) return

      const pan = Math.sin(this.surroundPhase)
      this.stereoPanner.pan.value = pan
      this.surroundPhase += 0.05 * this.surroundSpeed

      if (this.surroundPhase >= Math.PI * 2) {
        this.surroundPhase = 0
      }

      this.animationId = requestAnimationFrame(animate)
    }

    animate()
  }

  stopSurroundAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.stereoPanner.pan.value = 0
  }

  setSurroundMode(mode) {
    if (mode === 'off') {
      this.isSurroundEnabled = false
      this.stopSurroundAnimation()
    } else {
      this.isSurroundEnabled = true
      switch (mode) {
        case 'stereo':
          this.surroundSpeed = 0.3
          break
        case '3d':
          this.surroundSpeed = 0.5
          break
        case 'concert':
          this.surroundSpeed = 0.8
          break
        case 'church':
          this.surroundSpeed = 0.2
          break
        default:
          this.surroundSpeed = 0.5
      }
      this.startSurroundAnimation()
    }
  }

  setEqPreset(preset) {
    const eqPresets = {
      flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      bass: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
      treble: [0, 0, 0, 0, 0, 2, 4, 5, 6, 6],
      pop: [-2, 0, 2, 4, 5, 4, 2, 0, -2, -4],
      rock: [5, 4, 2, 0, -2, -2, 0, 2, 4, 5],
      jazz: [4, 3, 1, 2, -2, -2, 0, 1, 3, 4],
      classical: [5, 4, 3, 2, 0, 0, 0, 2, 3, 5]
    }

    const gains = eqPresets[preset] || eqPresets.flat
    gains.forEach((gain, i) => {
      if (this.filters[i]) {
        this.filters[i].gain.value = gain
      }
    })
  }

  connect(source) {
    source.connect(this.filters[0])
  }

  setVolume(volume) {
    this.gainNode.gain.value = volume
  }
}

const isBrowser = typeof window !== 'undefined'

export const useMusicStore = defineStore('music', () => {
  const playlist = ref([])
  const currentIndex = ref(0)
  const isPlaying = ref(false)
  const isPlayerVisible = ref(false)
  const isPlaylistVisible = ref(false)
  const volume = ref(0.7)
  const isMuted = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const isLoading = ref(false)

  const effectsEnabled = ref(false)
  const surroundMode = ref('off')
  const eqPreset = ref('flat')

  let audio = null
  let audioContext = null
  let spatialProcessor = null
  let saveStateInterval = null

  const currentSong = computed(() => playlist.value[currentIndex.value] || null)

  const progressPercent = computed(() => {
    if (duration.value <= 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const savePlayerState = () => {
    if (!isBrowser || !audio) return
    const state = {
      currentIndex: currentIndex.value,
      currentTime: audio.currentTime || 0,
      isPlaying: !audio.paused,
      volume: audio.volume,
      isMuted: audio.muted
    }
    try {
      localStorage.setItem('musicPlayerState', JSON.stringify(state))
    } catch (error) {
      // ignore
    }
  }

  const loadPlayerState = () => {
    if (!isBrowser) return { currentTime: 0, isPlaying: false }
    try {
      const savedState = localStorage.getItem('musicPlayerState')
      if (savedState) {
        const state = JSON.parse(savedState)
        currentIndex.value = state.currentIndex ?? 0
        volume.value = state.volume ?? 0.7
        isMuted.value = state.isMuted ?? false
        return { currentTime: state.currentTime ?? 0, isPlaying: state.isPlaying ?? false }
      }
    } catch (error) {
      // ignore
    }
    return { currentTime: 0, isPlaying: false }
  }

  const loadSong = (index) => {
    const song = playlist.value[index]
    if (!song || !audio) return
    isLoading.value = true
    audio.crossOrigin = 'anonymous'
    loadAudioWithFallback(song)
  }

  const applyEffects = ({ enabled, surroundMode: mode, eqPreset: preset }) => {
    effectsEnabled.value = enabled
    surroundMode.value = mode
    eqPreset.value = preset
    if (!spatialProcessor) return
    spatialProcessor.setEqPreset(preset)
    spatialProcessor.setSurroundMode(enabled ? mode : 'off')
  }

  const initSpatialAudio = () => {
    if (!isBrowser) return
    if (!audioContext && audio) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      spatialProcessor = new SpatialAudioProcessor(audioContext)
      const source = audioContext.createMediaElementSource(audio)
      spatialProcessor.connect(source)
      spatialProcessor.setVolume(volume.value)
    }
  }

  const loadAudioWithFallback = (song) => {
    if (!audio) return
    const audioPath = song.audio
    const backupUrls = song.backupAudio || []
    let currentBackupIndex = 0

    const tryLoadUrl = (url) => {
      audio.src = url
    }

    const handleError = () => {
      if (currentBackupIndex < backupUrls.length) {
        currentBackupIndex++
        tryLoadUrl(backupUrls[currentBackupIndex - 1])
      } else {
        setTimeout(() => nextSong(), 1000)
      }
    }

    audio.onerror = handleError
    tryLoadUrl(audioPath)
  }

  const togglePlay = () => {
    if (!audio) return
    if (!spatialProcessor) initSpatialAudio()
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume()
    }
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
    savePlayerState()
  }

  const prevSong = () => {
    if (playlist.value.length === 0) return
    const wasPlaying = isPlaying.value
    currentIndex.value = (currentIndex.value - 1 + playlist.value.length) % playlist.value.length
    loadSong(currentIndex.value)
    if (wasPlaying && audio) {
      audio.addEventListener('canplay', () => { audio?.play().catch(() => {}) }, { once: true })
    }
    savePlayerState()
  }

  const nextSong = () => {
    if (playlist.value.length === 0) return
    const wasPlaying = isPlaying.value
    currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    loadSong(currentIndex.value)
    if (wasPlaying && audio) {
      audio.addEventListener('canplay', () => { audio?.play().catch(() => {}) }, { once: true })
    }
    savePlayerState()
  }

  const togglePlaylist = () => {
    isPlaylistVisible.value = !isPlaylistVisible.value
  }

  const closePlaylist = () => {
    isPlaylistVisible.value = false
  }

  const selectSong = (index) => {
    if (!audio) initializePlayer()
    if (index !== currentIndex.value) {
      const wasPlaying = isPlaying.value
      currentIndex.value = index
      loadSong(currentIndex.value)
      if (wasPlaying && audio) {
        audio.addEventListener('canplay', () => { audio?.play().catch(() => {}) }, { once: true })
      }
      savePlayerState()
    } else if (audio?.paused) {
      audio.play().catch(() => {})
    } else if (audio) {
      audio.pause()
    }
  }

  const seek = (percent) => {
    if (!audio) return
    audio.currentTime = percent * duration.value
  }

  const setVolume = (percent) => {
    if (!audio) return
    audio.volume = percent
    volume.value = percent
    if (percent === 0) {
      audio.muted = true
      isMuted.value = true
    } else {
      audio.muted = false
      isMuted.value = false
    }
    savePlayerState()
  }

  const toggleMute = () => {
    if (!audio) return
    audio.muted = !audio.muted
    isMuted.value = audio.muted
    savePlayerState()
  }

  const initializePlayer = () => {
    if (!isBrowser || audio) return
    audio = new Audio()
    audio.addEventListener('timeupdate', () => {
      if (audio) {
        currentTime.value = audio.currentTime || 0
        duration.value = audio.duration || 0
      }
    })
    audio.addEventListener('ended', () => nextSong())
    audio.addEventListener('loadedmetadata', () => {
      if (audio) duration.value = audio.duration || 0
    })
    audio.addEventListener('play', () => { isPlaying.value = true })
    audio.addEventListener('pause', () => { isPlaying.value = false })
    audio.addEventListener('canplay', () => { isLoading.value = false })
    const savedState = loadPlayerState()
    audio.volume = volume.value
    audio.muted = isMuted.value
    loadSong(currentIndex.value)
    if (savedState.currentTime > 0) {
      audio.addEventListener('loadedmetadata', () => {
        if (audio) audio.currentTime = savedState.currentTime
      }, { once: true })
    }
    initSpatialAudio()
    saveStateInterval = setInterval(savePlayerState, 500)
  }

  const loadMusicConfig = async () => {
    try {
      const { data } = await axios.get('/config/music.json')
      playlist.value = data.songs
      initializePlayer()
    } catch (error) {
      console.error('[musicStore] 加载音乐配置失败:', error)
    }
  }

  const cleanup = () => {
    if (saveStateInterval) clearInterval(saveStateInterval)
    audio?.pause()
  }

  const getAudio = () => audio
  const getAudioContext = () => audioContext
  const getAnalyser = () => spatialProcessor?.analyser || null

  const setPlayerVisible = (visible) => {
    isPlayerVisible.value = visible
  }

  return {
    playlist,
    currentIndex,
    isPlaying,
    isPlayerVisible,
    isPlaylistVisible,
    volume,
    isMuted,
    currentTime,
    duration,
    isLoading,
    currentSong,
    progressPercent,
    effectsEnabled,
    surroundMode,
    eqPreset,
    formatTime,
    loadSong,
    togglePlay,
    prevSong,
    nextSong,
    togglePlaylist,
    closePlaylist,
    selectSong,
    seek,
    setVolume,
    toggleMute,
    loadMusicConfig,
    savePlayerState,
    cleanup,
    getAudio,
    getAudioContext,
    getAnalyser,
    applyEffects,
    setPlayerVisible
  }
})