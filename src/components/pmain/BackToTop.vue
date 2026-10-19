<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import BackToTop from '../icon/BackToTop.vue'
import { backToTop, scrollProgress } from '@/composables/pamin/post.ts'

// AI修复：保存解绑函数，卸载时清理 scroll 监听，避免反复挂载累积
let clearScroll: (() => void) | null = null

onMounted(() => {
  clearScroll = scrollProgress()
})

onUnmounted(() => {
  clearScroll?.()
})
</script>

<template>
  <button class="back-top-btn" @click="backToTop()">
    <span class="progress"></span>
    <BackToTop class="back-icon" />
  </button>
</template>

<style scoped>
.back-top-btn {
  position: fixed;
  right: 40px;
  bottom: 40px;
  z-index: 999;

  width: 40px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: var(--radius-full);
  background-color: var(--g-color);
}

.back-icon {
  color: white;
}

.progress {
  position: absolute;
  inset: -4px;
  border-radius: var(--radius-full);
  z-index: -1;
  /* AI修复：角度值改用 --scroll-deg（原 --progress 与透明度百分比同符，靠作用域侥幸不冲突） */
  background: conic-gradient(var(--g-color) var(--scroll-deg), transparent 0);
}
</style>
