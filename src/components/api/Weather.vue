<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Weather {
  temperature: number;
  weatherCode: number;
  weatherText: string;
  weatherIcon: string;
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

const weatherIcons: Record<string, string> = {
  sunny: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️',
  thunderstorm: '⛈️',
  foggy: '🌫️',
  unknown: '🌡️',
}

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

const getWeatherIcon = (code: number): string => {
  if (code === 0) return weatherIcons.sunny
  if (code <= 3) return weatherIcons.partly_cloudy
  if (code <= 49) return weatherIcons.foggy
  if (code <= 59) return weatherIcons.rainy
  if (code <= 69) return weatherIcons.snowy
  if (code <= 79) return weatherIcons.rainy
  if (code <= 82) return weatherIcons.rainy
  if (code <= 86) return weatherIcons.snowy
  if (code <= 99) return weatherIcons.thunderstorm
  return weatherIcons.unknown
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
      // 创建带超时的 fetch
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
        // 1. 获取 IP 地理位置 - 方案1: ip-api
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
          // 方案2: ipinfo.io
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
            // 方案3: ipify 获取IP + 默认位置
            try {
              const ipifyResponse: Response = await fetchWithTimeout('https://api.ipify.org?format=json')
              if (ipifyResponse.ok) {
                const ipifyData = await ipifyResponse.json()
                console.log('获取到IP:', ipifyData.ip)
                // 使用默认位置（吉林长春）
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
        // 使用默认位置（吉林长春）
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

    // 2. 获取天气
    const weatherResponse: Response = await fetchWithTimeout(`https://api.open-meteo.com/v1/forecast?latitude=${ipData.lat}&longitude=${ipData.lon}&current=temperature_2m,weather_code&timezone=auto`)
    if (!weatherResponse.ok) throw new Error('获取天气失败')
    const weatherData: WeatherData = await weatherResponse.json()

    if (weatherData.current) {
      weather.value = {
        temperature: Math.round(weatherData.current.temperature_2m),
        weatherCode: weatherData.current.weather_code,
        weatherText: getWeatherText(weatherData.current.weather_code),
        weatherIcon: getWeatherIcon(weatherData.current.weather_code)
      }
    }
  } 
  catch (err: unknown) {
    error.value = '加载失败'
    console.warn('天气加载失败:', err)
    // 使用默认天气数据
    weather.value = {
      temperature: 20,
      weatherCode: 0,
      weatherText: '晴',
      weatherIcon: weatherIcons.sunny
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
      <span class="weather-icon">{{ weather.weatherIcon }}</span>
      <span class="weather-temp">{{ weather.temperature }}°</span>
      <span class="weather-city">{{ locationInfo.city }}</span>
    </div>
  </div>
</template>

<style>
.weather-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  min-width: 90px;
  transition: all 0.3s ease;
}

.weather-mini:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.weather-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.weather-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.weather-icon {
  font-size: 18px;
}

.weather-temp {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.weather-city {
  font-size: 11px;
  color: var(--text-muted);
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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