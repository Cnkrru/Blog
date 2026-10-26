<script setup lang="ts">
import { refIp, refWeather, refWeatherLoading, weather } from '@/composables/psidebar'
import { refText } from '@/composables/i18n'
import { onMounted } from 'vue'

onMounted(() => {
  weather()
})
</script>

<template>
  <div class="weather-ip">
    <template v-if="refWeatherLoading">
      <span class="weather-number weather-skeleton weather-skeleton-temp"></span>
      <span class="ip weather-skeleton weather-skeleton-city"></span>
    </template>
    <template v-else>
      <span class="weather-number">{{ refWeather || '--°' }}</span>
      <span class="ip">{{ refIp || refText.unknown }}</span>
    </template>
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

.weather-skeleton {
  height: 12px;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--g-text) 12%, transparent);
  animation: weather-pulse 1.2s ease-in-out infinite;
}

.weather-skeleton-temp {
  width: 34px;
}

.weather-skeleton-city {
  width: 52px;
}

@keyframes weather-pulse {
  50% {
    opacity: 0.45;
  }
}
</style>
