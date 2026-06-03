<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
      const fetchWithTimeout = (url: string, options = {}, timeout = 10000): Promise<Response> => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout((): void => {
            reject(new Error('请求超时'))
          }, timeout)
          
          fetch(url, options)
            .then((response: Response): void => {
              clearTimeout(timer)
              resolve(response)
            })
            .catch((err: Error): void => {
              clearTimeout(timer)
              reject(err)
            })
        })
      }

      let ipData: IPData | null = null
      try {
        console.log('尝试使用 ip-api 获取位置...')
        try {
          const ipResponse: Response = await fetchWithTimeout('https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon')
          if (ipResponse.ok) {
            ipData = await ipResponse.json()
            if (ipData.status !== 'fail') {
              console.log('ip-api 获取成功:', ipData.city)
            } else {
              throw new Error('ip-api 返回失败状态')
            }
          } else {
            throw new Error('ip-api 请求失败')
          }
        } catch (e) {
          console.log('ip-api 失败，尝试方案2: ipinfo.io...')
          try {
            const ipinfoResponse: Response = await fetchWithTimeout('https://ipinfo.io/json')
            if (ipinfoResponse.ok) {
              const ipinfoData = await ipinfoResponse.json()
              if (ipinfoData.city) {
                ipData = {
                  city: ipinfoData.city,
                  countryCode: ipinfoData.country,
                  lat: parseFloat(ipinfoData.loc.split(',')[0]),
                  lon: parseFloat(ipinfoData.loc.split(',')[1])
                }
                console.log('ipinfo.io 获取成功:', ipData.city)
              } else {
                throw new Error('ipinfo.io 无城市数据')
              }
            } else {
              throw new Error('ipinfo.io 请求失败')
            }
          } catch (e) {
            console.log('ipinfo.io 失败，尝试方案3: ipify + 默认位置...')
            try {
              const ipifyResponse: Response = await fetchWithTimeout('https://api.ipify.org?format=json')
              if (ipifyResponse.ok) {
                const ipifyData = await ipifyResponse.json()
                console.log('获取到IP:', ipifyData.ip)
                ipData = {
                  city: 'Changchun',
                  countryCode: 'CN',
                  lat: 43.8168,
                  lon: 125.3240
                }
                console.log('使用默认位置: 长春')
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

    const weatherResponse: Response = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}&current=temperature_2m,weather_code&timezone=auto`)
    if (!weatherResponse.ok) throw new Error('获取天气失败')
    const weatherData: WeatherData = await weatherResponse.json()

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
      <svg class="weather-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <!-- 晴天 -->
        <template v-if="weather.weatherCode === 0">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </template>
        <!-- 多云 -->
        <template v-else-if="weather.weatherCode <= 3">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </template>
        <!-- 雾 -->
        <template v-else-if="weather.weatherCode <= 49">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="3" y1="14" x2="21" y2="14"/>
          <line x1="13" y1="18" x2="21" y2="18"/>
        </template>
        <!-- 毛毛雨/小雨 -->
        <template v-else-if="weather.weatherCode <= 59">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
          <line x1="8" y1="18" x2="8.01" y2="18"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
          <line x1="16" y1="18" x2="16.01" y2="18"/>
        </template>
        <!-- 小雪 -->
        <template v-else-if="weather.weatherCode <= 69">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
          <circle cx="8" cy="19" r="1" fill="currentColor" stroke="none"/>
          <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>
          <circle cx="16" cy="19" r="1" fill="currentColor" stroke="none"/>
        </template>
        <!-- 大雨/暴雨 -->
        <template v-else-if="weather.weatherCode <= 82">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
          <line x1="8" y1="18" x2="8.01" y2="18"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
          <line x1="16" y1="18" x2="16.01" y2="18"/>
          <line x1="8" y1="22" x2="8.01" y2="22"/>
          <line x1="12" y1="22" x2="12.01" y2="22"/>
          <line x1="16" y1="22" x2="16.01" y2="22"/>
        </template>
        <!-- 暴雪 -->
        <template v-else-if="weather.weatherCode <= 86">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
          <circle cx="8" cy="18" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="14" cy="18" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="11" cy="22" r="1.5" fill="currentColor" stroke="none"/>
        </template>
        <!-- 雷暴 -->
        <template v-else-if="weather.weatherCode <= 99">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
          <polygon points="13 12 10 16 13 16 12 20 16 14 13 14 14 12" fill="currentColor" stroke="none"/>
        </template>
        <!-- 兜底 -->
        <template v-else>
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
        </template>
      </svg>
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
  background: rgba(255, 255, 255, 0.3);
  color: var(--common-text);
  border-color: rgba(255, 255, 255, 0.3);
}

body.dark-theme .weather-mini {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
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
