<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import sunSvg from '@/assets/svg/sun.svg?raw'
import cloudSvg from '@/assets/svg/cloud.svg?raw'
import cloudFogSvg from '@/assets/svg/cloud-fog.svg?raw'
import cloudDrizzleSvg from '@/assets/svg/cloud-drizzle.svg?raw'
import cloudSnowSvg from '@/assets/svg/cloud-snow.svg?raw'
import cloudLightningSvg from '@/assets/svg/cloud-lightning.svg?raw'

interface Weather {
  temperature: number;
  weatherCode: number;
  weatherText: string;
}

interface IPData {
  city: string;
  countryCode: string;
  lat: number;
  lon: number;
  status?: string;
}

interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
}

const weather = ref<Weather | null>(null)
const loading = ref(true)
const error = ref('')
const locationInfo = ref<{ city: string, country: string }>({
  city: '加载中..',
  country: ''
})

const cityNames: Record<string, string> = {
  'Beijing': '北京', 'Shanghai': '上海', 'Guangzhou': '广州', 'Shenzhen': '深圳',
  'Hangzhou': '杭州', 'Nanjing': '南京', 'Wuhan': '武汉', 'Chengdu': '成都',
  'Xian': '西安', 'Chongqing': '重庆', 'Suzhou': '苏州', 'Dalian': '大连',
  'Qingdao': '青岛', 'Tianjin': '天津', 'Changsha': '长沙', 'Zhengzhou': '郑州',
  'Harbin': '哈尔滨', 'Shenyang': '沈阳', 'Changchun': '长春', 'Fuzhou': '福州',
  'Nanchang': '南昌', 'Hefei': '合肥', 'Taiyuan': '太原', 'Lanzhou': '兰州',
  'Urumqi': '乌鲁木齐', 'Kunming': '昆明', 'Shijiazhuang': '石家庄', 'Jinan': '济南',
  'Nanning': '南宁', 'Guiyang': '贵阳', 'Haikou': '海口', 'Hong Kong': '香港',
  'Macau': '澳门', 'Taipei': '台北', 'Tokyo': '东京', 'Seoul': '首尔',
  'Singapore': '新加坡', 'Bangkok': '曼谷'
}

const getCityName = (city: string): string => {
  if (!city) return '未知'
  return cityNames[city] || city
}

const getWeatherText = (code: number): string => {
  if (code === 0) return '晴'
  if (code <= 3) return '多云'
  if (code <= 49) return '雾'
  if (code <= 59) return '毛毛雨'
  if (code <= 69) return '小雪'
  if (code <= 79) return '中雪'
  if (code <= 82) return '大雨'
  if (code <= 86) return '暴雪'
  if (code <= 99) return '雷暴'
  return '未知'
}

const fetchLocationAndWeather = async (): Promise<void> => {
  loading.value = true
  error.value = ''

  try {
      let ipData: IPData | null = null
      try {
        try {
          const { data: ipDataRaw } = await axios.get('https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon', { timeout: 10000 })
          if (ipDataRaw.status === 'fail') {
            throw new Error('ip-api 返回失败状态')
          }
          ipData = ipDataRaw
        } catch (e) {
          try {
            const { data: ipinfoData } = await axios.get('https://ipinfo.io/json', { timeout: 10000 })
            if (ipinfoData.city) {
              ipData = {
                city: ipinfoData.city,
                countryCode: ipinfoData.country,
                lat: parseFloat(ipinfoData.loc.split(',')[0]),
                lon: parseFloat(ipinfoData.loc.split(',')[1])
              }
            } else {
              throw new Error('ipinfo.io 无城市数据')
            }
          } catch (e) {
            try {
              const { data: ipifyData } = await axios.get('https://api.ipify.org?format=json', { timeout: 10000 })
              if (ipifyData) {
                ipData = {
                  city: 'Changchun',
                  countryCode: 'CN',
                  lat: 43.8168,
                  lon: 125.3240
                }
              } else {
                throw new Error('ipify 请求失败')
              }
            } catch (e) {
              throw new Error('所有IP定位方案均失败')
            }
          }
        }
      } 
      catch (locationError: unknown) {
        console.warn('位置获取失败，使用默认位置:', locationError)
        ipData = {
          city: 'Changchun',
          countryCode: 'CN',
          lat: 43.8168,
          lon: 125.3240
        }
      }

    const city = getCityName(ipData.city)
    const country = ipData.countryCode || ''
    locationInfo.value = { city, country }

    const { data: weatherData } = await axios.get<WeatherData>(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}&current=temperature_2m,weather_code&timezone=auto`, { timeout: 10000 })

    if (weatherData.current) {
      weather.value = {
        temperature: Math.round(weatherData.current.temperature_2m),
        weatherCode: weatherData.current.weather_code,
        weatherText: getWeatherText(weatherData.current.weather_code)
      }
    }
  } 
  catch (err: unknown) {
    error.value = '加载失败'
    console.warn('天气加载失败:', err)
    weather.value = {
      temperature: 20,
      weatherCode: 0,
      weatherText: '晴'
    }
    locationInfo.value = {
      city: '北京',
      country: 'CN'
    }
  } finally {
    loading.value = false
  }
}

const currentWeatherSvg = computed(() => {
  if (!weather.value) return sunSvg
  const code = weather.value.weatherCode
  if (code === 0) return sunSvg
  if (code <= 3) return cloudSvg
  if (code <= 49) return cloudFogSvg
  if (code <= 59) return cloudDrizzleSvg
  if (code <= 69) return cloudSnowSvg
  if (code <= 82) return cloudDrizzleSvg
  if (code <= 86) return cloudSnowSvg
  if (code <= 99) return cloudLightningSvg
  return sunSvg
})

onMounted(() => {
  fetchLocationAndWeather()
})
</script>

<template>
  <div class="weather-mini">
    <div v-if="loading || error" class="weather-loading">
      <span>天气之子失踪了……</span>
    </div>

    <div v-else-if="weather" class="weather-content">
      <span class="svg-icon weather-icon" :style="{ width: '18px', height: '18px' }" v-html="currentWeatherSvg"></span>
      <span class="weather-temp">{{ weather.temperature }}°</span>
      <span class="weather-city">{{ locationInfo.city }}</span>
    </div>
  </div>
</template>

<style scoped>
.weather-mini {
  min-width: 90px;
  padding: 6px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
}

.weather-loading {
  font-size: 12px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weather-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.weather-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.weather-temp {
  font-size: 14px;
  font-weight: 600;
}

.weather-city {
  font-size: 11px;
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.7;
}
</style>

<style scoped>
.weather-mini {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
  color: var(--common-text);
  border-color: color-mix(in srgb, var(--common-text) 8%, transparent);
}

.weather-icon {
  color: var(--common-color-1);
}

.weather-temp {
  color: var(--common-text);
}

.weather-city {
  color: var(--common-text);
}
</style>

<style scoped>
@media (max-width: 768px) {
  .weather-mini {
    padding: 4px 8px;
    min-width: 80px;
  }

  .weather-icon {
    font-size: 16px;
  }

  .weather-temp {
    font-size: 13px;
  }

  .weather-city {
    font-size: 10px;
    max-width: 40px;
  }
}
</style>
