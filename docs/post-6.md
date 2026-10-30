---
order: 7
title: blog-3-天气IP组件
date: 2026-10-26
category: 前端
tags: [blog]
description: 记录blog侧边栏天气组件的做法
keywords: blog,weather,ip
---

## 天气组件

- 该组件需要调用两个公开API
  - `https://ipinfo.io/json`
  - `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`

```tip
weather API需要地理位置，需要IPAPI的数据
```

### IPAPI返回的数据

```json
{
  "ip": "131.143.239.175",
  "city": "Hoi Fu Court",
  "region": "Yau Tsim Mong District",
  "country": "HK",
  "loc": "22.3163,114.1647",
  "org": "AS12198 JSMSR Network",
  "postal": "999077",
  "timezone": "Asia/Hong_Kong",
  "readme": "https://ipinfo.io/missingauth"
}
```

### 天气API返回的数据

```terminal
https://api.open-meteo.com/v1/forecast?latitude=22.3163&longitude=114.1647&current=temperature_2m,weather_code&timezone=auto
```

- 这里把IPAPI获取的经纬度直接填充到了对应位置，实际ts代码里需要把IPAPI获取到的经纬度拆分一下，拿出来，传给天气API

```json
{
  "latitude": 22.319859,
  "longitude": 114.198555,
  "generationtime_ms": 0.0768899917602539,
  "utc_offset_seconds": 28800,
  "timezone": "Asia/Hong_Kong",
  "timezone_abbreviation": "GMT+8",
  "elevation": 11,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "weather_code": "wmo code"
  },
  "current": {
    "time": "2026-10-26T20:30",
    "interval": 900,
    "temperature_2m": 25.4,
    "weather_code": 1
  }
}
```

### 天气组件vue部分

```vue
<script setup lang="ts">
import { refIp, refWeather, refWeatherLoading, weather } from '@/composables/psidebar'
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
      <span class="ip">{{ refIp || '未知' }}</span>
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
```

### 天气组件typescript部分

```ts
/* ====================<api>==================== */
type IpInfo = { city: string; loc: string }
type WeatherResponse = { current: { temperature_2m: number } }

/* ====================<ip>==================== */
export const refIp = ref('')
let ipCache: IpInfo | null = null
export const ip = async (): Promise<IpInfo | null> => {
  if (ipCache) return ipCache
  try {
    const { data } = await axios.get<IpInfo>('https://ipinfo.io/json')
    ipCache = data
    refIp.value = data.city
    console.log('[INFO]:IP数据获取成功')
    return data
  } catch {
    console.error('[ERR]:IP数据获取失败')
    return null
  }
}
/* ====================<weather>==================== */
export const refWeather = ref('')
export const refWeatherLoading = ref(true)
export const weather = async () => {
  try {
    const _ipData = await ip()
    if (!_ipData?.loc) return

    const lat = _ipData.loc.split(',')[0]!
    const lon = _ipData.loc.split(',')[1]!

    try {
      const { data } = await axios.get<WeatherResponse>(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`,
      )
      refWeather.value = `${String(data.current.temperature_2m)}°`
      console.info('[INFO]:天气数据获取成功')
    } catch {
      // 天气接口异常补 try/catch
      console.error('[ERR]:天气数据获取失败')
    }
  } finally {
    // 无 loc、接口异常、成功三条路径统一收起骨架
    refWeatherLoading.value = false
  }
}
```

```info
1. 这里笔者用了`axios`这个库，笔者没学`Fetch API`，直接学封装好的库了，这个库也确实好用
    - axios文档:[https://axios.rest/zh/](https://axios.rest/zh/)
2. 这个组件也没什么复杂的，就是两个`axios.get()`，把数据拿出来，交给ref变量渲染就行，另外有加两个加载标志位做一下加载态的骨架屏
3. 这里给加载态做了骨架屏，ref变量+v-if+几个css即可
```
