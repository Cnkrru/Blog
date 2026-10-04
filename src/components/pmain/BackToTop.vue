<script setup lang="ts">
import { onMounted } from 'vue'
import BackToTop from '../icon/BackToTop.vue'
import { backToTop, scrollProgress } from '@/composables/pamin/post.ts'

onMounted(() => {
  scrollProgress()
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
  background: conic-gradient(var(--g-color) var(--progress), transparent 0);
}
</style>
