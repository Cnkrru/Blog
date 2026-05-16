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
        class="back-to-top-btn" 
        @click="scrollToTop"
        :class="{ 
            'visible': !isImmersiveReading || isVisible,
            'immersive': isImmersiveReading 
        }"
    >
        <img src="../../assets/imgs/svg/arrow-up.svg" alt="返回顶部">
    </button>
</template>

<style scoped>
.back-to-top-btn {
    width: 40px;
    height: 40px;
    
    border-radius: 25%;

    display: flex;
    justify-content: center;
    align-items: center;
    
    cursor: pointer;
    transition: all 0.3s ease;
    
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top-btn:hover {
    transform: scale(1.1);
}

.back-to-top-btn img {
    width: 20px;
    height: 20px;
    transition: filter 0.3s ease;
}

.back-to-top-btn.immersive {
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 9998;
    
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
}

.back-to-top-btn.immersive.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top-btn.immersive:hover {
    transform: scale(1.1) translateY(0);
}
</style>

<style scoped>
.back-to-top-btn {
    background-color: var(--common-color-1);
    border-color: var(--common-color-1);
}

.back-to-top-btn img {
    filter: invert(1);
}

body.dark-theme .back-to-top-btn img {
    filter: invert(0);
}
</style>

<style scoped>
@media (max-width: 768px) {
    .back-to-top-btn.immersive {
        bottom: 70px;
        right: 10px;
        width: 36px;
        height: 36px;
    }
    
    .back-to-top-btn.immersive img {
        width: 18px;
        height: 18px;
    }
}
</style>
