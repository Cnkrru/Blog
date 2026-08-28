<script setup>
import VIcon from '@/components/__common/VIcon.vue'
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

const scrollToTop = () => {
  scrollStore.scrollToTop()
}

let cleanupScrollListener = undefined
let observer = null

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
        title="返回顶部"
        aria-label="返回顶部"
        @click="scrollToTop"
    >
        <VIcon :src="'arrow-up.svg'" :size="24" />
    </button>
    <Teleport to="body">
        <button
            v-if="isImmersiveReading"
            class="back-to-top-btn immersive visible"
            title="返回顶部"
            aria-label="返回顶部"
            @click="scrollToTop"
        >
            <VIcon :src="'arrow-up.svg'" :size="24" />
        </button>
    </Teleport>
</template>

<style scoped>
.back-to-top-btn {
    width: 38px;
    height: 38px;

    border-radius: 50%;
    border: 1px solid var(--common-color-1);
    
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

    color: #fff;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
}

.back-to-top-btn.immersive {
    bottom: 24px;
    right: 34px;

    position: fixed;
    z-index: 9998;
}

.back-to-top-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

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

@media (max-width: 640px) {
    .back-to-top-btn.immersive {
        bottom: 72px;
        right: 22px;
    }
}
</style>