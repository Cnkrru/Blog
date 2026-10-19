<script setup lang="ts">
import Clock from '../icon/Clock.vue'
import { onMounted } from 'vue'
import { refWebage, webageStart } from '@/composables/pfooter.ts'
onMounted(() => {
  webageStart()
})
</script>

<template>
  <div class="webage"><Clock class="icon" />{{ refWebage }}</div>
</template>

<style scoped>
.webage {
  width: 80%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);

  border-radius: var(--radius-full);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  padding: var(--space-sm);

  background: color-mix(in srgb, var(--g-color) 15%, transparent);
  color: var(--g-text);
}

/* ====================<响应式>==================== */

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .webage {
    width: 90%;
    font-size: 0.9em;
  }
}
</style>
