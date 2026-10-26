import axios from 'axios'
import { ref } from 'vue'

export const refSidebar = ref(false)
export const toggleSidebar = () => {
  refSidebar.value = !refSidebar.value
}

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
// 命名统一（原 RefWeather）
export const refWeather = ref('')
// 天气胶囊加载态：IP 与温度两次请求都结束后才置 false
export const refWeatherLoading = ref(true)
export const weather = async () => {
  try {
    const _ipData = await ip()
    // IP 失败时 ip() 内部已打日志，这里直接返回，不再重复报错
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
/* ====================<busuanzi>==================== */
let bszLoaded = false
export const buSuanZi = () => {
  if (bszLoaded || document.querySelector('.bsz-script')) return
  bszLoaded = true
  const s = document.createElement('script')
  s.className = 'bsz-script'
  s.async = true
  s.defer = true
  s.src = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
  document.body.appendChild(s)
}

export const bszOpen = () => {
  document.querySelector<HTMLDialogElement>('.bsz-box')?.showModal()
}

export const bszClose = () => {
  document.querySelector<HTMLDialogElement>('.bsz-box')?.close()
}
