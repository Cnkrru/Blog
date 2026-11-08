<script setup lang="ts">
import { refIp, refWeather, refIpLoading, refWeatherLoading, weather } from '@/composables/psidebar'
import { onMounted } from 'vue'

onMounted(() => {
  weather()
})
</script>

<template>
  <div class="weather-ip">
    <span
      class="weather weather-skeleton weather-skeleton-temp"
      v-if="refWeatherLoading"
    ></span>
    <span
      class="weather"
      v-else
    >
      {{ refWeather || '--' }}
    </span>
    <span
      class="ip weather-skeleton weather-skeleton-city"
      v-if="refIpLoading"
    ></span>
    <span
      class="ip"
      v-else
    >
      {{ refIp || '未知' }}
    </span>
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

.weather {
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
