import { ref } from 'vue'
import { postCache, postData, type PostData } from './pamin/post'

/* ====================<hitmap>==================== */
export const hitmap = (() => {
  type DayData = { date: string; activity: number; publish: number }
  type MonthData = { year: number; month: number; days: DayData[] }
  type DateCounter = { publish: number; updated: number; history: number }

  const years = ref<number[]>([])
  const monthsData = ref<MonthData[]>([])
  const selectedMonth = ref<number>(1)
  const selectedYear = ref<number | null>(null)
  const openYear = ref(false)
  const openMonth = ref(false)
  const daysData = ref<MonthData | undefined>(undefined)
  const isLoading = ref(false)

  const dateMap = new Map<string, DateCounter>()
  const yearSet = new Set<number>()
  let cacheRaw: PostData | null = null
  const yearsDone = new Set<number>()

  /* ====================<数据清洗与统计>==================== */
  // 清洗数据
  const cleaner = (raw: PostData) => {
    // 日期检查者
    const checker = (rawData: string): string | null => {
      const date = String(rawData).trim().slice(0, 10)
      return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null
    }
    // 日期分类者
    const category = (data: string, cat: keyof DateCounter) => {
      const date = checker(data)
      if (!date) return
      if (!dateMap.has(date)) {
        dateMap.set(date, { publish: 0, updated: 0, history: 0 })
      }
      dateMap.get(date)![cat]++
    }

    // 同一输入引用已算过 → 命中缓存，跳过重洗；输入变化才清空重算
    if (dateMap.size > 0 && raw === cacheRaw) return
    // 输入变化：清空上一轮的清洗/派生缓存，重新全量计算
    dateMap.clear()
    yearSet.clear()
    yearsDone.clear()
    monthsData.value = []
    years.value = []
    cacheRaw = raw
    Object.values(raw).forEach((meta) => {
      category(meta.date, 'publish')
      category(meta.updated, 'updated')
      ;(meta.history ?? []).forEach((item) => category(item, 'history'))
    })
  }

  // 年份计算，切数据年份，统计数据有哪几年
  const year = () => {
    if (yearSet.size > 0) return
    dateMap.forEach((_, date) => yearSet.add(Number(date.slice(0, 4))))
    years.value = Array.from(yearSet).sort((a, b) => b - a)
  }

  // 算每一天的数据，打入days数组，days数组数据按照月份打入months数组
  const month = (year: number) => {
    // 按年份缓存：该年份已算过直接返回，避免切换年份时重复算或漏算
    if (yearsDone.has(year)) return
    yearsDone.add(year)
    // 兜底：该年份数据已存在也直接返回（防止 yearsDone 被外部改动）
    if (monthsData.value.some((m) => m.year === year)) return

    for (let m = 1; m <= 12; ++m) {
      const daysInMonth = new Date(year, m, 0).getDate()
      const days: DayData[] = []
      for (let day = 1; day <= daysInMonth; ++day) {
        const date = `${year}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const dateData = dateMap.get(date) ?? { publish: 0, updated: 0, history: 0 }
        days.push({
          date,
          activity: dateData.publish + dateData.updated + dateData.history,
          publish: dateData.publish,
        })
      }
      monthsData.value.push({ year, month: m, days })
    }
  }

  /* ====================<UI 交互与渲染派生>==================== */
  const level = (day: DayData) => (day.activity >= 4 ? 4 : day.activity)

  const toggleYear = () => {
    openYear.value = !openYear.value
    openMonth.value = false
  }

  const toggleMonth = () => {
    openMonth.value = !openMonth.value
    openYear.value = false
  }

  const setYear = (year: number) => {
    month(year)
    selectedYear.value = year
    openYear.value = false
    // 限定当前年份内找最新有活动月：多年份数据并存时，避免取到别的年份
    const yearMonths = monthsData.value.filter((m) => m.year === year)
    let activeMonth: MonthData | undefined
    for (let i = yearMonths.length - 1; i >= 0; i--) {
      if (yearMonths[i]!.days.some((d) => d.activity > 0)) {
        activeMonth = yearMonths[i]
        break
      }
    }
    setMonth(activeMonth?.month ?? 1)
  }

  const setMonth = (month: number) => {
    selectedMonth.value = month
    openMonth.value = false
    // 按"年份+月"双键取天数：多年份并存时按当前选中年份过滤，避免取错年月
    daysData.value = monthsData.value.find(
      (m) => m.year === selectedYear.value && m.month === month,
    )
  }

  const init = (data: PostData) => {
    cleaner(data)
    year()
    const first = years.value[0]
    if (first !== undefined) setYear(first)
  }

  // 数据加载：确保 post 全表已拉取后初始化（接当前项目 postData 数据层）
  const load = async () => {
    if (isLoading.value) return
    isLoading.value = true
    await postData()
    init(postCache)
    isLoading.value = false
  }

  return {
    years,
    monthsData,
    selectedMonth,
    selectedYear,
    openYear,
    openMonth,
    daysData,
    isLoading,
    level,
    toggleYear,
    toggleMonth,
    setYear,
    setMonth,
    init,
    load,
  }
})()
/* ====================<particle>==================== */
export const particles = () => {
  type Particle = { x: number; y: number; vX: number; vY: number; radius: number }
  type MousePoint = { x: number; y: number }

  // 粒子配置：移动端与桌面端两套预设，小屏减量减速，保证观感与性能
  type ParticleConfig = { count: number; link: number; speed: number }
  const getConfig = (): ParticleConfig =>
    document.documentElement.clientWidth < 768
      ? { count: 40, link: 100, speed: 1.0 } // 移动端：少粒子、短连线、慢速度
      : { count: 80, link: 180, speed: 1.5 } // 桌面端：保持原有观感
  let config = getConfig()
  const DPR_CAP = 2

  // 画布上下文与尺寸
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let width = 0
  let height = 0
  let raf: number | null = null
  // 粒子与鼠标状态
  let particleList: Particle[] = []
  let mouse: MousePoint | null = null
  let currentColor = ''

  // 主题色：随亮暗切换读取 CSS 变量
  const pickThemeColor = () => getComputedStyle(canvas!).getPropertyValue('--g-color').trim()

  const toRgba = (hex: string, opacity: number) => {
    const _hex = hex.replace('#', '')
    const r = parseInt(_hex.slice(0, 2), 16)
    const g = parseInt(_hex.slice(2, 4), 16)
    const b = parseInt(_hex.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${opacity})`
  }

  // 粒子配置：随机位置/速度/半径
  const createParticle = (canvasWidth: number, canvasHeight: number): Particle => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vX: (Math.random() - 0.5) * config.speed,
    vY: (Math.random() - 0.5) * config.speed,
    radius: Math.random() * 2 + 1,
  })

  // 单粒子运行：移动 + 触边反弹 + 描点
  const runParticle = (particle: Particle) => {
    particle.x += particle.vX
    particle.y += particle.vY
    if (particle.x < 0 || particle.x > width) particle.vX = -particle.vX
    if (particle.y < 0 || particle.y > height) particle.vY = -particle.vY

    ctx!.beginPath()
    ctx!.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    ctx!.fillStyle = toRgba(currentColor, 0.8)
    ctx!.fill()
  }

  // 粒子间连线：间距小于阈值画线，透明度随距离增大
  const drawLinks = () => {
    for (let i = 0; i < particleList.length; i++) {
      const p1 = particleList[i]!
      for (let j = i + 1; j < particleList.length; j++) {
        const p2 = particleList[j]!
        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y)
        if (distance < config.link) {
          ctx!.beginPath()
          ctx!.strokeStyle = toRgba(currentColor, 1 - distance / config.link)
          ctx!.lineWidth = 1
          ctx!.moveTo(p1.x, p1.y)
          ctx!.lineTo(p2.x, p2.y)
          ctx!.stroke()
        }
      }
    }
  }

  // 鼠标连线：距鼠标最近的 8 个粒子与鼠标连线
  const drawMouseLinks = () => {
    if (!mouse) return
    const nearParticles = particleList
      .map((particle, index) => ({
        index,
        distance: Math.hypot(particle.x - mouse!.x, particle.y - mouse!.y),
      }))
      .filter((item) => item.distance < config.link)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8)

    ctx!.lineWidth = 1.5
    for (const item of nearParticles) {
      const particle = particleList[item.index]!
      ctx!.strokeStyle = toRgba(currentColor, 1 - item.distance / config.link)
      ctx!.beginPath()
      ctx!.moveTo(particle.x, particle.y)
      ctx!.lineTo(mouse!.x, mouse!.y)
      ctx!.stroke()
    }
  }

  // 画布配置：DPR 缩放 + 重设尺寸 + 重建粒子
  const resizeCanvas = () => {
    const dpr = Math.min(devicePixelRatio, DPR_CAP)
    const vw = document.documentElement.clientWidth
    const vh = document.documentElement.clientHeight

    canvas!.width = vw * dpr
    canvas!.height = vh * dpr
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    width = vw
    height = vh

    // 每次重设尺寸按最新宽度选配置：横竖屏切换、窗口拖动也能换套
    config = getConfig()
    particleList = Array.from({ length: config.count }, () => createParticle(width, height))
  }

  /* ====================<鼠标/触摸事件>==================== */
  const mouseMove = (e: MouseEvent) => {
    mouse = { x: e.clientX, y: e.clientY }
  }
  const mouseLeave = () => {
    mouse = null
  }
  const touchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      mouse = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY }
    }
  }
  const touchLeave = () => {
    mouse = null
  }

  // 清理器：停帧循环并解绑全部监听
  const stop = () => {
    if (raf) {
      cancelAnimationFrame(raf)
      raf = null
    }
    window.removeEventListener('resize', resizeCanvas)
    window.removeEventListener('mousemove', mouseMove)
    window.removeEventListener('mouseleave', mouseLeave)
    window.removeEventListener('touchmove', touchMove)
    window.removeEventListener('touchend', touchLeave)

    particleList = []
    mouse = null
  }

  // 帧循环：清屏 → 跑粒子 → 粒子连线 → 鼠标连线 → 下一帧
  const tick = () => {
    currentColor = pickThemeColor()
    ctx!.clearRect(0, 0, width, height)
    particleList.forEach((particle) => runParticle(particle))
    drawLinks()
    drawMouseLinks()
    raf = requestAnimationFrame(tick)
  }

  // 启动函数：绑定画布/上下文/监听后进入帧循环
  const start = (el: HTMLCanvasElement) => {
    canvas = el
    ctx = el.getContext('2d')
    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseleave', mouseLeave)
    window.addEventListener('touchmove', touchMove, { passive: true })
    window.addEventListener('touchend', touchLeave)
    tick()
  }

  return {
    start,
    stop,
  }
}
/* ====================<typewrite>==================== */
export const RefTw = ref('')
let twTimer: ReturnType<typeof setTimeout> | null = null
let strIndex: number = 0 // 句子索引，打到第几个句子了
let charIndex: number = 0 // 字符索引。打到第几个字符了
let increasing: boolean = true // 是否正向，正反两个打字方向
const texts = ['欢迎来到我的博客', 'welcome to my blog']
const onSpeed: number = 100 // 正向打字速度(打字间隔时间)
const unSpeed: number = 40 // 反向打字速度
const loopSpeed: number = 3000 // 句子轮询间隔时间
export const twManager = (fn: () => void, delay: number) => {
  if (twTimer) clearTimeout(twTimer)
  twTimer = setTimeout(fn, delay)
}
export const twWorker = () => {
  const currentStr: string = texts[strIndex]!
  if (increasing) {
    charIndex++
    RefTw.value = currentStr.slice(0, charIndex)
    // 反转打印方向，延时loop_speed后重新执行tw
    if (charIndex === currentStr.length) {
      increasing = false
      twManager(twWorker, loopSpeed)
      return
    }
    // 正向打字+type_speed延时
    twManager(twWorker, onSpeed)
  } else {
    charIndex--
    RefTw.value = currentStr.slice(0, charIndex)
    // 反转打印方向，延时loop_speed后重新执行tw
    if (charIndex === 0) {
      increasing = true
      strIndex = (strIndex + 1) % texts.length // 学到了，很精妙
      twManager(twWorker, loopSpeed)
      return
    }
    // 反向打字+delete_speed延时
    twManager(twWorker, unSpeed)
  }
}
