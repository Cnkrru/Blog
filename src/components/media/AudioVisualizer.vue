<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useAudioStore } from '../../stores'

const props = defineProps({
  isPlaying: {
    type: Boolean,
    default: false
  },
  getAnalyser: {
    type: Function,
    default: null
  }
})

const audioStore = useAudioStore()
const enabled = computed(() => audioStore.visualizerEnabled)

const canvasRef = ref(null)
const isInitialized = ref(false)

let analyser = null
let animationId = null

const isBrowser = typeof window !== 'undefined'

const initVisualization = () => {
  if (!isBrowser) return
  if (isInitialized.value) return

  // 获取 analyser
  if (props.getAnalyser) {
    analyser = props.getAnalyser()
  }

  if (analyser) {
    isInitialized.value = true
  }
}

const drawWaveform = () => {
  if (!isBrowser) return
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const width = canvas.width
  const height = canvas.height
  const dpr = window.devicePixelRatio || 1

  // 使用模拟动画，无论 analyser 是否存在都能看到效果
  let phase = 0
  
  const draw = () => {
    if (!canvasRef.value || !enabled.value) {
      animationId = null
      return
    }
    
    animationId = requestAnimationFrame(draw)

    ctx.clearRect(0, 0, width, height)

    const barCount = 64
    const barWidth = (width / barCount) * 2.5
    let x = 0

    phase += 0.1

    for (let i = 0; i < barCount; i++) {
      const t = (i / barCount) * Math.PI * 2
      let barHeight = Math.abs(Math.sin(t + phase)) * height * 0.4
      
      // 如果有 analyser 且正在播放，使用真实数据
      if (analyser && props.isPlaying) {
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyser.getByteFrequencyData(dataArray)
        const index = Math.floor((i / barCount) * bufferLength)
        barHeight = (dataArray[index] / 255) * height * 0.8
      }

      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height)
      gradient.addColorStop(0, 'rgba(100, 200, 255, 0.8)')
      gradient.addColorStop(0.5, 'rgba(150, 100, 255, 0.6)')
      gradient.addColorStop(1, 'rgba(255, 100, 150, 0.4)')

      ctx.fillStyle = gradient
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight)

      x += barWidth + 1
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()
  }

  draw()
}

const startVisualization = () => {
  if (!isBrowser) return
  if (!enabled.value) return
  
  // 如果还没有 analyser，再尝试获取一次
  if (!analyser && props.getAnalyser) {
    analyser = props.getAnalyser()
  }
  
  if (!animationId) {
    drawWaveform()
  }
}

const stopVisualization = () => {
  if (!isBrowser) return
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const resizeCanvas = () => {
  if (!isBrowser) return
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const dpr = window.devicePixelRatio || 1
  const width = window.innerWidth
  const height = 120

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
}

// 监听 enabled 状态变化
watch(enabled, (enabled) => {
  if (enabled) {
    startVisualization()
  } else {
    stopVisualization()
  }
})

// 监听 isPlaying 状态变化
watch(() => props.isPlaying, (playing) => {
  if (playing && enabled.value) {
    if (!isInitialized.value) {
      initVisualization()
    }
    // 如果还是没有 analyser，再尝试获取一次
    if (!analyser && props.getAnalyser) {
      analyser = props.getAnalyser()
    }
    startVisualization()
  }
})

onMounted(() => {
  if (isBrowser) {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // 如果启用，立即开始显示动画
    if (enabled.value) {
      setTimeout(() => {
        startVisualization()
      }, 100)
    }
  }
})

onUnmounted(() => {
  stopVisualization()
  if (isBrowser) {
    window.removeEventListener('resize', resizeCanvas)
  }
})
</script>

<template>
  <div class="audio-visualizer" :class="{ hidden: !enabled }">
    <canvas ref="canvasRef" class="visualizer-canvas"></canvas>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.audio-visualizer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  z-index: 1000;
  pointer-events: none;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.audio-visualizer.hidden {
  opacity: 0;
}

.audio-visualizer:hover {
  opacity: 0.9;
}

.visualizer-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

<!-- 颜色样式 -->
<style scoped>
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
