import axios from 'axios'
import { ref } from 'vue'

/* ====================<sidebar>==================== */
export const refSidebar = ref(false)
/*
 * id:侧边栏显隐
 * fn:header的按钮呼出侧边栏，移动端侧边栏遮盖层点击隐藏侧边栏
 */
export const toggleSidebar = () => {
  refSidebar.value = !refSidebar.value
}

/* ====================<weather>==================== */
type IpInfo = {
  city: string
  loc: string
}
type WeatherResponse = {
  current: { temperature_2m: number }
}
// IP
export const refIp = ref('')
// 天气
export const refWeather = ref('')
// 加载态
export const refIpLoading = ref(true)
export const refWeatherLoading = ref(true)
// ip和天气的缓存
let ipCache: IpInfo | null = null
let weatherCache: number | null = null

/*
 * id:IP获取函数
 * fn:用ipinfo获取IP
 */
export const ip = async (): Promise<IpInfo | null> => {
  if (ipCache) return ipCache
  try {
    const { data } = await axios.get<IpInfo>('https://ipinfo.io/json')
    ipCache = data
    refIp.value = data.city
    refIpLoading.value = false
    console.log('[INFO]:IP数据获取成功')
    return data
  } catch {
    console.error('[ERR]:IP数据获取失败')
    return null
  }
}

/*
 * id:天气获取函数
 * fn:给open-meteo从ipAPI获取到的经纬度，获取对应的温度
 */
export const weather = async () => {
  if (weatherCache) return
  const _ipData = await ip()
  if (!_ipData?.loc) return

  const lat = _ipData.loc.split(',')[0]!
  const lon = _ipData.loc.split(',')[1]!

  try {
    const { data } = await axios.get<WeatherResponse>(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`,
    )
    weatherCache = data.current.temperature_2m
    refWeatherLoading.value = false
    refWeather.value = `${String(data.current.temperature_2m)}°`
    console.info('[INFO]:天气数据获取成功')
  } catch {
    console.error('[ERR]:天气数据获取失败')
  }
}
/* ====================<busuanzi>==================== */
export const buSuanZi = () => {
  if (document.querySelector('.bsz-script')) return
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
