import { SITE_START_TIME } from './config/config'

/* ====================<webage>==================== */
let timer: ReturnType<typeof setInterval> | null = null
/*
 * fn:刷新运行时长
 * des:计算建站时间到当前时间的差值，写入 #webageText 元素
 * type:private
 * param:无
 * return：无
 */
const webageTick = () => {
  const initDate: number = Number(new Date(SITE_START_TIME))
  const currentDate: number = Number(new Date())
  const diffTime: number = currentDate - initDate

  const totalSeconds = Math.floor(Math.max(diffTime, 0) / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const text = document.querySelector<HTMLSpanElement>('#webageText')
  if (text) {
    text.textContent = `本博客已运行: ${days} 天 ${hours} 时 ${minutes} 分 ${seconds}秒`
  }
}

/*
 * fn:初始化运行时长
 * des:立即刷新一次运行时长，并启动每秒更新一次的定时器，重复调用不会重复启动
 * type:public
 * param:无
 * return：无
 */
export const webageInit = () => {
  if (timer) return
  webageTick()
  timer = setInterval(webageTick, 1000)
}
