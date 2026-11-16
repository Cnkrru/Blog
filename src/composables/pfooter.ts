import { SITE_START_TIME } from './common/config'

/* ====================<webage>==================== */
let timer: ReturnType<typeof setInterval> | null = null
/*
 * fn:设置布局
 * des:
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
 * fn:将布局改为默认
 * des:
 * type:public
 * param:无
 * return：无
 */
export const webageInit = () => {
  if (timer) return
  webageTick()
  timer = setInterval(webageTick, 1000)
}
