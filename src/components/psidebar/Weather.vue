<script setup lang="ts">
import { RefIp, RefWeather, ip, weather } from '@/composables/psidebar'
import { onMounted } from 'vue'

onMounted(() => {
  ip()
  weather()
})
</script>

<template>
  <div class="weather-ip">
    <span class="weather-number">{{ RefWeather }}</span>
    <span class="ip">{{ RefIp }}</span>
  </div>
</template>

<style scoped>
.weather-ip {
  width: 75%;
  height: fit-content;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: var(--space-sm);

  border-radius: var(--radius-full);
  border: var(--border-width) solid color-mix(in srgb, var(--g-text) 8%, transparent);
  padding: var(--space-sm);

  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
}

.weather-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--g-text);
}

.ip {
  width: fit-content;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 11px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--g-text);
}
</style>
