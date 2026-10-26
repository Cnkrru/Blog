<script setup lang="ts">
import { refProgress, refRouteLoading } from '../../composables/pheader'
import { refText } from '../../composables/i18n'
</script>

<template>
  <div
    class="loading-bar"
    :class="{ 'loading-bar-on': refRouteLoading }"
    :aria-hidden="!refRouteLoading"
    role="progressbar"
    :aria-label="refText.pageLoading"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.round(refProgress)"
  >
    <div class="loading-bar-inner" :style="{ transform: `scaleX(${refProgress / 100})` }"></div>
  </div>
</template>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;

  z-index: 9999;

  opacity: 0;
  pointer-events: none;

  transition: opacity 0.2s ease;
}

.loading-bar-on {
  opacity: 1;
}

.loading-bar-inner {
  width: 100%;
  height: 100%;

  background: var(--g-color);
  transform-origin: left center;
  transition: transform 0.3s ease;
}
</style>
