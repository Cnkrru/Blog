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
let observer: MutationObserver | null = null

onMounted(() => {
  checkImmersiveMode()

  observer = new MutationObserver(() => {
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
  if (observer) {
    observer.disconnect()
    observer = null
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
    background: var(--common-color-1);
    border: 1px solid var(--common-color-1);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
}

.back-to-top-btn.immersive {
    position: fixed;
    bottom: 24px;
    right: 34px;
    z-index: 9998;
}

.back-to-top-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

.back-to-top-btn img {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
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
