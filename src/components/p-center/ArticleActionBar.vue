<script setup lang="ts">
import Sponsor from '../api/Sponsor.vue'
import ShareButton from '../api/ShareButton.vue'

defineProps<{ title: string; url: string; description?: string }>()
</script>

<template>
  <div class="action-bar">
    <div class="action-bar-inner">
      <ShareButton
        :title="title"
        :url="url"
        :description="description"
      />
      <div class="action-divider"></div>
      <Sponsor />
    </div>
  </div>
</template>

<style scoped>
.action-bar {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.action-bar-inner {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.5));
  border: 1px solid color-mix(in srgb, var(--common-color-1) 12%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.action-divider {
  width: 1px;
  height: 20px;
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  margin: 0 8px;
}

@media (max-width: 639px) {
  .action-bar-inner {
    flex-direction: column;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 16px;
  }
  .action-divider {
    width: 60%;
    height: 1px;
    margin: 0;
  }
}
</style>