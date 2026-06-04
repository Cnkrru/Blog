<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useScrollStore } from '../../stores'

const scrollStore = useScrollStore()
const isVisible = computed(() => scrollStore.isVisible)

const isImmersiveReading = ref(false)

const checkImmersiveMode = () => {
  const was = isImmersiveReading.value
  isImmersiveReading.value = document.body.classList.contains('immersive-reading')

  if (!was && isImmersiveReading.value) {
    cleanupScrollListener = scrollStore.initScrollListener()
  } else if (was && !isImmersiveReading.value) {
    if (cleanupScrollListener) {
      cleanupScrollListener()
      cleanupScrollListener = undefined
    }
  }
}

const scrollToTop = (): void => {
  scrollStore.scrollToTop()
}

let cleanupScrollListener: (() => void) | undefined

onMounted(() => {
  checkImmersiveMode()
  
  const observer = new MutationObserver(() => {
    checkImmersiveMode()
  })
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  
  if (isImmersiveReading.value) {
    cleanupScrollListener = scrollStore.initScrollListener()
  }
})

onUnmounted(() => {
  if (cleanupScrollListener) {
    cleanupScrollListener()
  }
})
</script>

<template>
    <button
        v-if="!isImmersiveReading"
        class="back-to-top-btn"
        @click="scrollToTop"
    >
        <img src="../../assets/imgs/svg/arrow-up.svg" alt="返回顶部">
    </button>
    <Teleport to="body">
        <button
            v-if="isImmersiveReading"
            class="back-to-top-btn immersive visible"
            @click="scrollToTop"
        >
            <img src="../../assets/imgs/svg/arrow-up.svg" alt="返回顶部">
        </button>
    </Teleport>
</template>

<style scoped>
.back-to-top-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
    opacity: 1;
    visibility: visible;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.10),
        inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.back-to-top-btn.immersive {
    position: fixed;
    bottom: 24px;
    right: 34px;
    z-index: 9998;
}

.back-to-top-btn:hover {
    transform: scale(1.1);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.15),
        inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.back-to-top-btn img {
    width: 20px;
    height: 20px;
}
</style>

<style scoped>
.back-to-top-btn {
    background-color: rgba(255, 192, 203, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

body.dark-theme .back-to-top-btn {
    background-color: rgba(58, 170, 231, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.back-to-top-btn img {
    filter: brightness(0) invert(1) !important;
}

</style>

<style scoped>
@media (max-width: 768px) {
    .back-to-top-btn.immersive {
        bottom: 16px;
        right: 26px;
        width: 36px;
        height: 36px;
    }

    .back-to-top-btn.immersive img {
        width: 18px;
        height: 18px;
    }
}

@media (max-width: 639px) {
    .back-to-top-btn.immersive {
        bottom: 72px;
        right: 22px;
    }
}
</style>
