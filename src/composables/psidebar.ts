import axios from 'axios'
import { ref } from 'vue'

export const refSidebar = ref(false)
export const toggleSidebar = () => {
  refSidebar.value = !refSidebar.value
}

/* ====================<api>==================== */
// API 响应契约：先类型化整个响应对象，再中转取出所需字段
type IpInfo = { city: string; loc: string }
type WeatherResponse = { current: { temperature_2m: number } }

/* ====================<ip>==================== */
export const RefIp = ref('')
export const ip = async (): Promise<IpInfo> => {
  const { data } = await axios.get<IpInfo>('https://ipinfo.io/json')
  RefIp.value = data.city
  console.log('[INFO]:IP数据获取成功')
  return data
}
/* ====================<weather>==================== */
export const RefWeather = ref('')
export const weather = async () => {
  const _ipData = await ip()
  if (!_ipData?.loc) {
    console.error('[ERR]:IP数据获取失败,天气请求取消')
    return
  }

  const lat = _ipData.loc.split(',')[0]!
  const lon = _ipData.loc.split(',')[1]!

  const { data } = await axios.get<WeatherResponse>(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`,
  )
  RefWeather.value = `${String(data.current.temperature_2m)}°`
  console.info('[INFO]:天气数据获取成功')
}
/* ====================<busuanzi>==================== */
export const buSuanZi = () => {
  if (document.querySelector<HTMLScriptElement>('bsz-script')) return
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
