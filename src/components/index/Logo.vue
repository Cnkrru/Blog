<script setup lang="ts">
import { INDEX_LOGO } from '@/composables/common/config'
</script>

<template>
  <div class="logo">
    <router-link to="/postlist"><p>{{ INDEX_LOGO }}</p></router-link>
  </div>
</template>

<style scoped>
.logo {
  width: fit-content;
  height: 100%;

  margin-left: var(--space-md);

  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.logo p {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei',
    sans-serif;
  white-space: nowrap;
  transition: opacity 0.2s ease;
  color: var(--g-color);
}

/* ====================<响应式>==================== */

@media (max-width: 768px) {
  /* [响应式-sm] 手机 */
  .logo {
    margin-left: var(--space-sm);
  }
  .logo p {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .logo {
    margin-left: var(--space-xs);
  }
  .logo p {
    font-size: 1.5rem;
  }
}
</style>
