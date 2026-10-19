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
// AI修复：模块级共享 ref 命名统一为 camelCase 的 ref 前缀（原 RefIp）
export const refIp = ref('')
// AI修复：ip 结果模块级缓存，避免 Weather 挂载时重复请求 ipinfo.io
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
    // AI修复：限流/网络异常补 try/catch，避免未处理的 Promise rejection
    console.error('[ERR]:IP数据获取失败')
    return null
  }
}
/* ====================<weather>==================== */
// AI修复：命名统一（原 RefWeather）
export const refWeather = ref('')
export const weather = async () => {
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
    // AI修复：天气接口异常补 try/catch
    console.error('[ERR]:天气数据获取失败')
  }
}
/* ====================<busuanzi>==================== */
let bszLoaded = false
export const buSuanZi = () => {
  // AI修复：加重复注入守卫（此前选择器写成 'bsz-script' 且无人调用，统计永远为 …）
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
