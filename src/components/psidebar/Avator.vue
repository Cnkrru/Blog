<script setup lang="ts">
import { refText } from '@/composables/i18n'
</script>

<template>
  <div class="avator">
    <img
      src="@/assets/media/avator.webp"
      :alt="refText.avatarAlt"
      loading="lazy"
      :title="refText.avatarTitle"
    />
  </div>
</template>

<style scoped>
.avator {
  width: 100px;
  height: 100px;

  border: 3px solid var(--g-color);
  border-radius: var(--radius-full);
  margin-top: var(--space-md);

  overflow: hidden;
}

.avator img {
  width: 100%;
  height: 100%;

  object-fit: cover;
  transition: transform 0.6s ease-in-out;
}

.avator:hover img {
  transform: rotate(360deg);
}
</style>