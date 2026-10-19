<script setup lang="ts">
import { refTw, twStop, twWorker } from '@/composables'
import { onMounted, onUnmounted } from 'vue'
onMounted(() => {
  twWorker()
})
onUnmounted(() => {
  // AI修复：卸载时停掉打字定时链，避免残留定时器在别的页面继续跑
  twStop()
})
</script>

<template>
  <div class="welcome">
    {{ refTw }}
  </div>
</template>

<style scoped>
.welcome {
  width: fit-content;
  height: 50vh;

  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--g-color);

  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

/* ====================<响应式>==================== */

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
  .welcome {
    height: 44vh;
  }
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机 */
  .welcome {
    height: 38vh;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .welcome {
    height: 32vh;
    font-size: clamp(1.5rem, 6vw, 2.4rem);
  }
}
</style>
