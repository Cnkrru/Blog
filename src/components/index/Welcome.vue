<script setup lang="ts">
import { RefTw, twWorker } from '@/composables'
import { onMounted } from 'vue'
onMounted(() => {
  twWorker()
})
</script>

<template>
  <div class="welcome">
    {{ RefTw }}
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
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏 */
}

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
