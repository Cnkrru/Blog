<script setup lang="ts"></script>

<template>
  <div class="copyright">&copy Cnkrru,power by Vue,All rights reserved</div>
</template>

<style scoped>
.copyright {
  width: 80%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: var(--radius-full);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  padding: var(--space-sm);

  background: color-mix(in srgb, var(--g-color) 15%, transparent);
  color: var(--g-text);
}

/* ====================<响应式>==================== */

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .copyright {
    width: 100%;
    font-size: 0.9em;
  }
}
</style>
