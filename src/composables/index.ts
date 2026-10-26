import { ref } from 'vue'
import { postCache, postData, type PostData } from './pamin/post'
// 粒子配色跟随主题变化，需读取当前亮暗/主题
import { refLd } from './pheader'
import { refTheme } from './pamin/setting'
import { refText } from './i18n'

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
  type Ripple = { x: number; y: number; radius: number }

  const LINK_DISTANCE = 180 // 连接长度阈值
  const PARTICLE_COUNT = 80 // 桌面端粒子数
  const PARTICLE_COUNT_SM = 32 // 移动端（≤768px）粒子数，避免小屏拥挤与算力浪费
  const DPR_CAP = 2
  const REPEL_DISTANCE = 110 // 光标排斥半径
  const REPEL_STRENGTH = 2.2 // 光标排斥强度（每帧位移）
  const RIPPLE_MAX = 140 // 涟漪最大半径，超过即销毁
  const RIPPLE_SPEED = 3.2 // 涟漪每帧扩张量
  const RIPPLE_FORCE = 6 // 点击时附近粒子获得的径向冲量

  // 画布上下文与尺寸
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let width = 0
  let height = 0
  let raf: number | null = null
  let resizeRaf: number | null = null
  // 粒子与鼠标状态
  let particleList: Particle[] = []
  let mouse: MousePoint | null = null
  let rippleList: Ripple[] = []

  // 主题色：随亮暗切换读取 CSS 变量
  const pickThemeColor = () => getComputedStyle(canvas!).getPropertyValue('--g-color').trim()

  // rgb 分量在主题色变化时预解析一次，避免 O(n²) 连线循环里反复解析字符串
  let colorRgb = { r: 0, g: 0, b: 0 }
  const parseColor = (hex: string) => {
    const _hex = hex.replace('#', '')
    colorRgb = {
      r: parseInt(_hex.slice(0, 2), 16),
      g: parseInt(_hex.slice(2, 4), 16),
      b: parseInt(_hex.slice(4, 6), 16),
    }
  }
  const toRgba = (opacity: number) => `rgba(${colorRgb.r},${colorRgb.g},${colorRgb.b},${opacity})`

  // 主题色只在亮暗/主题变化时重读，避免每帧 getComputedStyle
  let themeKey = ''
  const syncThemeColor = () => {
    const key = `${refLd.value}|${refTheme.value}`
    if (key === themeKey) return
    themeKey = key
    parseColor(pickThemeColor())
  }

  // 粒子配置：随机位置/速度/半径
  const createParticle = (canvasWidth: number, canvasHeight: number): Particle => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vX: (Math.random() - 0.5) * 1.5,
    vY: (Math.random() - 0.5) * 1.5,
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
    ctx!.fillStyle = toRgba(0.8)
    ctx!.fill()
  }

  // 粒子间连线：间距小于阈值画线，透明度随距离增大
  const drawLinks = () => {
    for (let i = 0; i < particleList.length; i++) {
      const p1 = particleList[i]!
      for (let j = i + 1; j < particleList.length; j++) {
        const p2 = particleList[j]!
        const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y)
        if (distance < LINK_DISTANCE) {
          ctx!.beginPath()
          ctx!.strokeStyle = toRgba(1 - distance / LINK_DISTANCE)
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
      .filter((item) => item.distance < LINK_DISTANCE)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8)

    ctx!.lineWidth = 1.5
    for (const item of nearParticles) {
      const particle = particleList[item.index]!
      ctx!.strokeStyle = toRgba(1 - item.distance / LINK_DISTANCE)
      ctx!.beginPath()
      ctx!.moveTo(particle.x, particle.y)
      ctx!.lineTo(mouse!.x, mouse!.y)
      ctx!.stroke()
    }
  }

  // 光标排斥：光标附近的粒子被轻微推开，移开后自行漂回原轨迹
  const applyRepel = () => {
    if (!mouse) return
    for (let i = 0; i < particleList.length; i++) {
      const particle = particleList[i]!
      const dx = particle.x - mouse.x
      const dy = particle.y - mouse.y
      const distance = Math.hypot(dx, dy)
      if (distance > 0 && distance < REPEL_DISTANCE) {
        const force = (1 - distance / REPEL_DISTANCE) * REPEL_STRENGTH
        particle.x += (dx / distance) * force
        particle.y += (dy / distance) * force
      }
    }
  }

  // 点击涟漪：半径逐帧扩张并淡出，超出阈值即移除
  const runRipple = () => {
    for (let i = rippleList.length - 1; i >= 0; i--) {
      const ripple = rippleList[i]!
      ripple.radius += RIPPLE_SPEED
      if (ripple.radius > RIPPLE_MAX) {
        rippleList.splice(i, 1)
        continue
      }
      ctx!.beginPath()
      ctx!.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
      ctx!.strokeStyle = toRgba(0.5 * (1 - ripple.radius / RIPPLE_MAX))
      ctx!.lineWidth = 1.5
      ctx!.stroke()
    }
  }

  // 双端粒子配置：断点与 CSS 的 sm（768px）保持一致
  const particleCount = () => (window.matchMedia('(max-width: 768px)').matches ? PARTICLE_COUNT_SM : PARTICLE_COUNT)

  // 粒子数量同步：只按目标数量增删，不重建已有粒子，resize 时位置不会重置
  const syncParticleCount = () => {
    const target = particleCount()
    if (particleList.length < target) {
      for (let i = particleList.length; i < target; i++) {
        particleList.push(createParticle(width, height))
      }
    } else if (particleList.length > target) {
      particleList.length = target
    }
  }

  // 画布配置：DPR 缩放 + 重设尺寸（复用已有粒子，尺寸变化时粒子自行反弹回界内）
  const resizeCanvas = () => {
    const dpr = Math.min(devicePixelRatio, DPR_CAP)
    const vw = document.documentElement.clientWidth
    const vh = document.documentElement.clientHeight

    canvas!.width = vw * dpr
    canvas!.height = vh * dpr
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    width = vw
    height = vh

    syncParticleCount()
  }

  // resize 用 rAF 节流，连续拖拽窗口不再每个事件都重设画布
  const onResize = () => {
    if (resizeRaf) return
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = null
      resizeCanvas()
    })
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
  // 点击：生成涟漪，并给附近粒子一次径向冲量
  const windowClick = (e: MouseEvent) => {
    rippleList.push({ x: e.clientX, y: e.clientY, radius: 0 })
    for (let i = 0; i < particleList.length; i++) {
      const particle = particleList[i]!
      const dx = particle.x - e.clientX
      const dy = particle.y - e.clientY
      const distance = Math.hypot(dx, dy)
      if (distance > 0 && distance < RIPPLE_MAX) {
        const force = (1 - distance / RIPPLE_MAX) * RIPPLE_FORCE
        particle.x += (dx / distance) * force
        particle.y += (dy / distance) * force
      }
    }
  }

  // 清理器：停帧循环并解绑全部监听
  const stop = () => {
    if (raf) {
      cancelAnimationFrame(raf)
      raf = null
    }
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = null
    }
    window.removeEventListener('resize', onResize)
    window.removeEventListener('mousemove', mouseMove)
    window.removeEventListener('mouseleave', mouseLeave)
    window.removeEventListener('touchmove', touchMove)
    window.removeEventListener('touchend', touchLeave)
    window.removeEventListener('click', windowClick)

    particleList = []
    mouse = null
    rippleList = []
  }

  // 帧循环：清屏 → 排斥 → 跑粒子 → 粒子连线 → 鼠标连线 → 涟漪 → 下一帧
  const tick = () => {
    syncThemeColor()
    ctx!.clearRect(0, 0, width, height)
    applyRepel()
    particleList.forEach((particle) => runParticle(particle))
    drawLinks()
    drawMouseLinks()
    runRipple()
    raf = requestAnimationFrame(tick)
  }

  // 启动函数：绑定画布/上下文/监听后进入帧循环
  const start = (el: HTMLCanvasElement) => {
    canvas = el
    ctx = el.getContext('2d')
    resizeCanvas()

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseleave', mouseLeave)
    window.addEventListener('touchmove', touchMove, { passive: true })
    window.addEventListener('touchend', touchLeave)
    window.addEventListener('click', windowClick)
    tick()
  }

  return {
    start,
    stop,
  }
}
/* ====================<typewrite>==================== */
// 模块级共享 ref 命名统一为 camelCase 的 ref 前缀（原 RefTw）
export const refTw = ref('')
let twTimer: ReturnType<typeof setTimeout> | null = null
let twRunning = false // 打字链是否在跑
let strIndex: number = 0 // 句子索引，打到第几个句子了
let charIndex: number = 0 // 字符索引。打到第几个字符了
let increasing: boolean = true // 是否正向，正反两个打字方向
const onSpeed: number = 100 // 正向打字速度(打字间隔时间)
const unSpeed: number = 40 // 反向打字速度
const loopSpeed: number = 3000 // 句子轮询间隔时间
const twManager = (fn: () => void, delay: number) => {
  if (twTimer) clearTimeout(twTimer)
  twTimer = setTimeout(fn, delay)
}
// 打字步进（内部递归）：正/反两个方向 + 句子轮询
const twStep = () => {
  // 每次步进都读当前语言的文案，切换语言后下一句即生效
  const texts = refText.value.welcomeTexts
  const currentStr: string = texts[strIndex] ?? texts[0] ?? ''
  // 切换语言后句长可能变短，游标先夹回当前句长，避免越界后无法收敛
  charIndex = Math.min(charIndex, currentStr.length)
  if (increasing) {
    charIndex++
    refTw.value = currentStr.slice(0, charIndex)
    // 反转打印方向，延时loop_speed后重新执行tw
    if (charIndex === currentStr.length) {
      increasing = false
      twManager(twStep, loopSpeed)
      return
    }
    // 正向打字+type_speed延时
    twManager(twStep, onSpeed)
  } else {
    charIndex--
    refTw.value = currentStr.slice(0, charIndex)
    // 反转打印方向，延时loop_speed后重新执行tw
    if (charIndex === 0) {
      increasing = true
      strIndex = (strIndex + 1) % texts.length // 学到了，很精妙
      twManager(twStep, loopSpeed)
      return
    }
    // 反向打字+delete_speed延时
    twManager(twStep, unSpeed)
  }
}
// 加运行守卫，反复进出首页时不再出现两条定时链同时改同一组游标
export const twWorker = () => {
  if (twRunning) return
  twRunning = true
  twStep()
}
// 停止定时链并复位守卫，供 Welcome 卸载时清理
export const twStop = () => {
  if (twTimer) {
    clearTimeout(twTimer)
    twTimer = null
  }
  twRunning = false
}
