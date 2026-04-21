<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useScrollStore } from '../../stores'

const scrollStore = useScrollStore()
const isVisible = computed(() => scrollStore.isVisible)

// 滚动到顶部
const scrollToTop = (): void => {
  scrollStore.scrollToTop()
}

// 清理函数
let cleanupScrollListener: (() => void) | undefined

onMounted(() => {
  // 初始化滚动监听
  cleanupScrollListener = scrollStore.initScrollListener()
})

onUnmounted(() => {
  // 清理滚动监听
  if (cleanupScrollListener) {
    cleanupScrollListener()
  }
})
</script>

<template>
    <button class="back-to-top-btn" @click="scrollToTop" :class="{ 'visible': isVisible }">
        <img src="../../assets/imgs/svg/arrow-up.svg" alt="返回顶部">
    </button>
</template>

<style scoped>
/* 返回顶部按钮样式 - 与页眉功能按钮一致 */
.back-to-top-btn {
    width: 40px;
    height: 40px;
    border-radius: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 10px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
}

/* 按钮显示状态 */
.back-to-top-btn.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

/* 沉浸阅读模式下的返回顶部按钮 */
body.immersive-reading .back-to-top-btn {
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 9998;
    margin-right: 0;
    box-shadow: 0 4px 12px var(--shadow-color);
}

.back-to-top-btn:hover {
    transform: scale(1.1) translateY(0);
}

/* 返回顶部按钮图标 */
.back-to-top-btn img {
    width: 20px;
    height: 20px;
    transition: filter 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
    body.immersive-reading .back-to-top-btn {
        bottom: 70px;
        right: 10px;
        width: 36px;
        height: 36px;
    }
    
    body.immersive-reading .back-to-top-btn img {
        width: 18px;
        height: 18px;
    }
}
</style>