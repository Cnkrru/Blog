<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  threshold: {
    type: Number,
    default: 0.1
  }
})

const isLoaded = ref(false)
const isInView = ref(false)
const imgRef = ref(null)
let observer = null

const onLoad = () => {
  isLoaded.value = true
}

const onError = () => {
  console.warn(`图片加载失败: ${props.src}`)
  isLoaded.value = true
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isInView.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: props.threshold
    }
  )

  if (imgRef.value) {
    observer.observe(imgRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div ref="imgRef" class="lazy-image-container" :class="{ loaded: isLoaded }">
    <!-- 占位符 -->
    <div v-if="!isLoaded" class="lazy-placeholder">
      <slot name="placeholder">
        <div class="placeholder-bg"></div>
      </slot>
    </div>

    <!-- 实际图片 -->
    <img
      v-if="isInView"
      :src="src"
      :alt="alt"
      class="lazy-image"
      :class="{ visible: isLoaded }"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  background-color: var(--card-bg);
}

.lazy-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.placeholder-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--card-bg) 0%,
    var(--hover-bg) 50%,
    var(--card-bg) 100%
  );
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.lazy-image.visible {
  opacity: 1;
}
</style>