import { ref } from 'vue'

/* ====================<webage>==================== */
export const RefWebage = ref('')
let timer: ReturnType<typeof setInterval> | null = null
export const webageTick = () => {
  const initDate: number = Number(new Date('2026-10-04'))
  const currentDate: number = Number(new Date())
  const diffTime: number = currentDate - initDate
  const year: number = Date.prototype.getFullYear.call(new Date(diffTime)) - 1970
  const month: number = Date.prototype.getMonth.call(new Date(diffTime))
  const day: number = Date.prototype.getDate.call(new Date(diffTime)) - 1
  const hours: number = Date.prototype.getHours.call(new Date(diffTime))
  const minutes: number = Date.prototype.getMinutes.call(new Date(diffTime))
  const seconds: number = Date.prototype.getSeconds.call(new Date(diffTime))

  RefWebage.value = `本博客已运行: ${year} 年 ${month} 月 ${day} 天 ${hours} 时 ${minutes} 分 ${seconds}秒`
}

export const webageStart = () => {
  if (timer) return
  webageTick()
  timer = setInterval(webageTick, 1000)
}
