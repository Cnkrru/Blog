import { ref } from 'vue'
import { refText } from './i18n'

/* ====================<webage>==================== */
export const refWebage = ref('')
let timer: ReturnType<typeof setInterval> | null = null
export const webageTick = () => {
  const initDate: number = Number(new Date('2026-10-04'))
  const currentDate: number = Number(new Date())
  const diffTime: number = currentDate - initDate

  const totalSeconds = Math.floor(Math.max(diffTime, 0) / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  refWebage.value = refText.value.runtime(days, hours, minutes, seconds)
}

export const webageStart = () => {
  if (timer) return
  webageTick()
  timer = setInterval(webageTick, 1000)
}
