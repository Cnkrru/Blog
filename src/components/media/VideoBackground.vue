<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="video-container"
      aria-hidden="true"
    >
      <video
        ref="videoRef"
        class="video-element"
        autoplay
        muted
        loop
        playsinline
        :poster="posterUrl"
        :key="videoUrl"
        @canplay="onCanPlay"
        @error="onVideoError"
      >
        <source :src="videoUrl" type="video/mp4">
      </video>
      <!-- 暗色遮罩：确保文字可读性 -->
      <div class="video-overlay"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '../../stores'

const themeStore = useThemeStore()

const videoRef = ref(null)
const videoLoaded = ref(false)

const videoUrl = computed(() => themeStore.bgVideoUrl)
const visible = computed(() => themeStore.bgType === 'video' && !!themeStore.bgVideoUrl)

// poster 兜底：使用当前 background.jpg
const posterUrl = computed(() => {
  return new URL('../../assets/imgs/background.jpg', import.meta.url).href
})

function onCanPlay() {
  videoLoaded.value = true
}

function onVideoError() {
  videoLoaded.value = false
}

// 当 URL 变化时重置加载状态
watch(videoUrl, () => {
  videoLoaded.value = false
})
</script>

<style scoped>
.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.video-element {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
</style>