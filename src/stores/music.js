import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 3D音效处理器类
class SpatialAudioProcessor {
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

  // 启动环绕动画
  startSurroundAnimation() {
    if (this.animationId) return

    const animate = () => {
      if (!this.isSurroundEnabled) return

      // 根据相位计算-pan值，范围-1到1
      // 使用正弦波实现来回移动
      const pan = Math.sin(this.surroundPhase)
      this.stereoPanner.pan.value = pan

      // 增加相位，实现动画
      this.surroundPhase += 0.05 * this.surroundSpeed

      // 保持相位在0-2π范围内
      if (this.surroundPhase >= Math.PI * 2) {
        this.surroundPhase = 0
      }

      this.animationId = requestAnimationFrame(animate)
    }

    animate()
  }

  // 停止环绕动画
  stopSurroundAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this.stereoPanner.pan.value = 0 // 重置到中间
  }

  // 设置环绕角度（开启动态环绕）
  setSurroundMode(mode) {
    if (mode === 'off') {
      this.isSurroundEnabled = false
      this.stopSurroundAnimation()
    } else {
      this.isSurroundEnabled = true
      // 根据模式调整速度
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
          this.surroundSpeed = 0.2 // 教堂模式较慢
          break
        default:
          this.surroundSpeed = 0.5
      }
      this.startSurroundAnimation()
    }
  }

  setEqPreset(preset) {
    const presets = {
      flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      bass: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
      treble: [0, 0, 0, 0, 0, 2, 4, 5, 6, 6],
      pop: [-2, 0, 2, 4, 5, 4, 2, 0, -2, -4],
      rock: [5, 4, 2, 0, -2, -2, 0, 2, 4, 5],
      jazz: [4, 3, 1, 2, -2, -2, 0, 1, 3, 4],
      classical: [5, 4, 3, 2, 0, 0, 0, 2, 3, 5]
    }

    const gains = presets[preset] || presets.flat
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
  // 状态
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
  
  // 音效状态
  const effectsEnabled = ref(false)
  const surroundMode = ref('off')
  const eqPreset = ref('flat')

  // 音频对象
  let audio = null
  let audioContext = null
  let spatialProcessor = null
  let saveStateInterval = null

  // 计算属性
  const currentSong = computed(() => playlist.value[currentIndex.value] || null)
  
  const progressPercent = computed(() => {
    if (duration.value <= 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  // 方法
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const savePlayerState = () => {
    if (!isBrowser) return
    if (!audio) return
    const state = {
      currentIndex: currentIndex.value,
      currentTime: audio.currentTime,
      isPlaying: !audio.paused,
      volume: audio.volume,
      isMuted: audio.muted
    }
    try {
      localStorage.setItem('musicPlayerState', JSON.stringify(state))
    } catch (error) {
      // 静默处理错误
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
      // 静默处理错误
    }
    return { currentTime: 0, isPlaying: false }
  }

  const loadSong = (index) => {
    const song = playlist.value[index]
    if (!song) return

    isLoading.value = true

    if (audio) {
      audio.crossOrigin = 'anonymous'
      loadAudioWithFallback(song)
    }
  }

  // 应用音效设置
  const applyEffects = ({ enabled, surroundMode: mode, eqPreset: preset }) => {
    effectsEnabled.value = enabled
    surroundMode.value = mode
    eqPreset.value = preset

    if (!spatialProcessor) return

    // 设置均衡器
    spatialProcessor.setEqPreset(preset)

    // 设置环绕模式（动态或关闭）
    spatialProcessor.setSurroundMode(enabled ? mode : 'off')
  }

  // 初始化3D音效处理器
  const initSpatialAudio = () => {
    if (!isBrowser) return
    if (!audioContext && audio) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      spatialProcessor = new SpatialAudioProcessor(audioContext)
      
      // 将音频连接到音效处理器
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
        setTimeout(() => {
          nextSong()
        }, 1000)
      }
    }

    audio.onerror = handleError
    tryLoadUrl(audioPath)
  }

  const togglePlay = () => {
    if (!audio) return

    // 初始化3D音效（需要用户交互后才能创建AudioContext）
    if (!spatialProcessor) {
      initSpatialAudio()
    }
    
    // 确保 AudioContext 不是 suspended 状态
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume()
    }

    if (audio.paused) {
      audio.play().catch(() => {
        // 播放失败，静默处理
      })
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
      audio.addEventListener('canplay', () => {
        audio.play().catch(() => {
          // 播放失败，静默处理
        })
      }, { once: true })
    }

    savePlayerState()
  }

  const nextSong = () => {
    if (playlist.value.length === 0) return
    const wasPlaying = isPlaying.value
    currentIndex.value = (currentIndex.value + 1) % playlist.value.length
    loadSong(currentIndex.value)

    if (wasPlaying && audio) {
      audio.addEventListener('canplay', () => {
        audio.play().catch(() => {
          // 播放失败，静默处理
        })
      }, { once: true })
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
    // 确保音频对象已初始化
    if (!audio) {
      initializePlayer()
    }
    
    if (index !== currentIndex.value) {
      const wasPlaying = isPlaying.value
      currentIndex.value = index
      loadSong(currentIndex.value)
      
      if (wasPlaying && audio) {
        audio.addEventListener('canplay', () => {
          audio.play().catch(() => {
            // 播放失败，静默处理
          })
        }, { once: true })
      }
      
      savePlayerState()
    } else {
      if (audio && audio.paused) {
        audio.play().catch(() => {
          // 播放失败，静默处理
        })
      } else if (audio) {
        audio.pause()
      }
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
    if (!isBrowser) return
    if (!audio) {
      audio = new Audio()

      audio.addEventListener('timeupdate', () => {
        currentTime.value = audio.currentTime || 0
        duration.value = audio.duration || 0
      })

      audio.addEventListener('ended', () => {
        nextSong()
      })

      audio.addEventListener('loadedmetadata', () => {
        duration.value = audio.duration || 0
      })

      audio.addEventListener('play', () => {
        isPlaying.value = true
      })

      audio.addEventListener('pause', () => {
        isPlaying.value = false
      })

      audio.addEventListener('canplay', () => {
        isLoading.value = false
      })
    }

    const savedState = loadPlayerState()

    audio.volume = volume.value
    audio.muted = isMuted.value

    loadSong(currentIndex.value)

    if (savedState.currentTime > 0) {
      audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = savedState.currentTime
      }, { once: true })
    }

    // 初始化音效处理器（在播放前就准备好）
    initSpatialAudio()

    // 移除自动播放逻辑，确保只有用户点击才播放
    // 即使 savedState.isPlaying 为 true，也不会自动播放

    saveStateInterval = setInterval(savePlayerState, 500)
  }

  const loadMusicConfig = async () => {
    try {
      const response = await fetch('/config/music.json')
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      playlist.value = data.songs
      initializePlayer()
    } catch (error) {
      // 静默处理错误
    }
  }

  const cleanup = () => {
    if (saveStateInterval) {
      clearInterval(saveStateInterval)
    }
    if (audio) {
      audio.pause()
    }
  }

  const getAudio = () => audio

  const getAudioContext = () => audioContext
  
  const getAnalyser = () => spatialProcessor ? spatialProcessor.analyser : null
  
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