import { reactive, ref, nextTick, computed } from 'vue'
import QRCode from 'qrcode'
import axios from 'axios'
import type { Zoom } from 'medium-zoom'
import { RefTheme } from './setting'
import { RefLd } from '../pheader'
/* ====================<postData>==================== */
type PostMeta = {
  order: number
  title: string
  date: string
  updated: string
  category: string
  tags: string[]
  history: string[]
  description: string
  keywords: string
  wordCount: number
  readingTime: number
}
// 导出 PostData：index.ts 的 hitmap 单例复用此全表契约类型
export type PostData = Record<string, PostMeta>
export let postCache: PostData = {}

export const postData = async () => {
  if (Object.keys(postCache).length > 0) return // 有缓存直接读缓存
  const meta = await axios.get<PostData>('/config/post.json')
  postCache = meta.data
  if (postCache) {
    console.info('[INFO]:已经获取到post.json的数据')
  } else {
    console.error('[ERR]:未获取到post.json全表')
  }
}

// 导出 CleanData：tagClean 等 pamin 域内模块共享此类型
export type CleanData = {
  key: string
  title: string
  date: string
  category: string
  tags: string[]
}
export let postCleanCache: CleanData[] = []

export const postClean = async () => {
  if (postCleanCache.length > 0) return // 已有缓存直接返回
  if (Object.keys(postCache).length === 0) {
    await postData()
  }
  // 步骤1：将数据kv反转存入中间对象
  const orderMap: Record<number, string> = Object.create(null)
  Object.entries(postCache).forEach(([k, v]) => {
    orderMap[v.order] = k
  })
  // 步骤2：遍历中间对象，将values取出来压入数组里
  const keys = Object.values(orderMap).filter(Boolean)
  // 步骤3：遍历keys，把精简字段打入容器
  postCleanCache = []
  keys.forEach((key) => {
    const meta = postCache[key]!
    postCleanCache.push({
      key,
      title: meta.title,
      date: meta.date,
      category: meta.category,
      tags: meta.tags,
    })
  })
}

/* ====================<share>==================== */
type Platform = 'weibo' | 'qq' | 'facebook' | 'x' | 'tg'
export const qrCanvas = ref<HTMLCanvasElement>()

export const shareLink = (platform: Platform, url: string, title: string) => {
  const platformMap: Record<Platform, string> = {
    weibo: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    qq: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    tg: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  }

  return platformMap[platform]
}

export const linkOpen = (platform: Platform, url: string, title: string) => {
  window.open(shareLink(platform, url, title), '_blank', 'noopener')
}

export const shareQrcode = async (el: HTMLCanvasElement, url: string) => {
  if (!el) return
  await QRCode.toCanvas(el, url)
  console.log('[INFO]:二维码生成成功')
}

export const qrcodeOpen = async (url: string) => {
  await nextTick()
  if (qrCanvas.value) {
    await shareQrcode(qrCanvas.value, url)
  }
  document.querySelector<HTMLDialogElement>('.qrcode-dialog')?.showModal()
}

export const qrcodeClose = () => {
  document.querySelector<HTMLDialogElement>('.qrcode-dialog')?.close()
}

export const shareCopy = async (text: string) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text)
    toastOpen('success', `已成功复制${text}`)
    console.info('[INFO]:已复制指定内容')
  } else {
    console.error('[ERR]:复制指定内容失败')
  }
}

/* ====================<toast>==================== */
type Level = 'success' | 'info' | 'warning' | 'error'
// toast图标map
const levelIconMap: Record<Level, string> = {
  success:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="成功"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4 9.4 24.6 9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="信息"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="警告"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
  error:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24" role="img" aria-label="错误"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4-9.4-24.6-9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>',
}
// 关闭图标cons
const xIcon: string =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
let toastTimer: ReturnType<typeof setTimeout> | null = null

export const toastOpen = (level: Level, mes: string) => {
  const toastOn = document.querySelector('.toast-box') ?? undefined
  if (!toastOn) {
    const body = document.body
    const toast = document.createElement('div')
    const icon = document.createElement('div')
    const message = document.createElement('span')
    const x = document.createElement('div')

    // 给父级加样式
    toast.className = 'toast-box'
    // 给level图标的位置填充一下图标，加一下样式
    icon.innerHTML = levelIconMap[level]
    icon.className = 'toast-icon'
    // 把toast消息填进去，加一下样式
    message.innerText = mes
    message.className = 'toast-mes'
    // 把关闭图标加上，加一下样式
    x.innerHTML = xIcon
    x.className = 'toast-close'
    x.addEventListener('click', () => toastClose())
    // 先给子级挂上去，生成时，先生成父级，再挂载子级
    toast.appendChild(icon)
    toast.appendChild(message)
    toast.appendChild(x)
    // 挂父级
    body.appendChild(toast)
    // 按照level添加对应样式
    toast.classList.add('toast-' + level)

    toastTimer = setTimeout(() => toastClose(), 3000)
  }
}

export const toastClose = () => {
  const toastOn = document.querySelector('.toast-box')
  if (toastOn && toastTimer) {
    clearTimeout(toastTimer)
    toastOn.remove()
    console.info('[INFO]:toast已成功移除')
  } else {
    console.error('[ERR]:toast移除失败')
  }
}

/* ====================<backToTop>==================== */
export const backToTop = () => {
  const area = document.querySelector('.main')
  const canArea = area && area.scrollHeight > area.clientHeight
  if (canArea) {
    area.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export const scrollProgress = () => {
  const area = document.querySelector<HTMLElement>('.main')
  const progress = document.querySelector<HTMLElement>('.progress')
  if (!area || !progress) return

  const canArea = area.scrollHeight > area.clientHeight
  const scroller = canArea ? area : window
  const scrolled = canArea ? () => area.scrollTop : () => window.scrollY
  const total = canArea
    ? area.scrollHeight - area.clientHeight
    : document.documentElement.scrollHeight - window.innerHeight

  const update = () => {
    const _progress = total > 0 ? Math.min(1, scrolled() / total) : 0 // 用总可滚px做保护
    progress.style.setProperty('--progress', _progress * 360 + 'deg') // 设置样式
  }
  scroller.addEventListener('scroll', update, { passive: true })
  update()
}

/* ====================<mermaid>==================== */
export const mermaid = async () => {
  const mermaidCode = document.querySelectorAll('pre[data-lang="mermaid"] code')

  //   库变量改名 mermaidLib，避免与导出函数同名遮蔽
  const { default: mermaidLib } = await import('mermaid')
  // 配置mermaid.js
  mermaidLib.initialize({ startOnLoad: false })
  try {
    await mermaidLib.run({ nodes: Array.from(mermaidCode) as HTMLElement[] })
  } catch {
    console.error('[ERR]:mermaid渲染错误')
  }
}

/* ====================<comment>==================== */
// 首帧即算出完整主题 URL：giscus-widget 创建时 theme 属性就是对的，
// 若先用空值再回填，iframe 会先按默认主题构建，后续变更来不及生效。
// window 只在客户端访问，组件侧用 ClientOnly 包住，SSR 阶段不会求值
export const comment = computed(() => `${window.location.origin}/css/${RefTheme.value}-${RefLd.value}.css`)

/* ====================<postNav>==================== */
export const preOrder = ref('')
export const nextOrder = ref('')
export const preTitle = ref('')
export const nextTitle = ref('')
export const postNav = async (postKey: string) => {
  await postData()
  const meta = postCache[postKey]
  if (!meta) return

  // 抽order对调kv建新表
  const orderMap = Object.create(null)
  Object.entries(postCache).forEach(([k, v]) => {
    orderMap[v.order] = k
  })

  // 根据新表查原来的key（首尾无相邻文章时为 null）
  preOrder.value = orderMap[meta.order - 1]
  nextOrder.value = orderMap[meta.order + 1]

  // 根据上下篇的key拿对应title
  preTitle.value = preOrder.value ? postCache[preOrder.value]!.title : '暂无'
  nextTitle.value = nextOrder.value ? postCache[nextOrder.value]!.title : '暂无'
}

/* ====================<postStatus>==================== */
export const word = ref(0)
export const time = ref(0)
export const postStatus = async (postKey: string) => {
  await postData()
  const meta = postCache[postKey]
  if (!meta) return

  word.value = meta.wordCount
  time.value = meta.readingTime
}

/* ====================<postEdit>==================== */
type HistoryItem = {
  date: string
  text: string
}
export const publish = ref('')
export const update = ref('')
export const history = reactive<HistoryItem[]>([])
let historyRaw: string[] = []

const historyClean = (meta: PostMeta) => {
  historyRaw = meta.history
  const list: HistoryItem[] = []
  historyRaw.forEach((item) => {
    const text = String(item).trim()
    if (!text) return
    const match = text.match(/^(\S+)\s+(.*)$/)
    if (match) {
      list.push({ date: match[1]!, text: match[2]! })
    } else {
      list.push({ date: '', text })
    }
  })
  history.splice(0, history.length, ...list)
}

export const postEdit = async (postKey: string) => {
  await postData()

  const meta = postCache[postKey]
  if (!meta) return
  publish.value = meta.date
  update.value = meta.updated
  historyClean(meta)
}

/* ====================<postToc>==================== */
// toc 单例（PostToc 挂载/卸载驱动）：headings/active 为全文唯一响应式源状态，
//   scrollspy 用 IntersectionObserver 观察标题越过视口顶部条带（rootMargin 收缩底部 80%），
//   触底高亮末章由轻量 scroll 监听兜底（仅数值比较，不触发布局）
type HeadingItem = {
  id: string
  text: string
  level: number
}
// 模块级单例（ES 模块只求值一次，无需 IIFE 壳）：headings/active 为全文唯一响应式源状态
export const headings = ref<HeadingItem[]>([])
export const active = ref('')

let scrollCtn: HTMLElement | null = null // 正文滚动容器（.main 可滚时为 .main，否则整页滚动）
let scrollBound = false // 滚动监听是否已绑定（null 态也需区分已绑定/未绑定）
let mobs: MutationObserver | null = null // 正文注入观察器（挂在 .main 上）
let observer: IntersectionObserver | null = null // 章节高亮观察器
let scanTimer: ReturnType<typeof setTimeout> | null = null
let scrollTimer: ReturnType<typeof setTimeout> | null = null

/* 探测滚动容器：.main 自身可滚则滚容器，否则整页滚动（移动端） */
const probeCtn = () => {
  const main = document.querySelector<HTMLElement>('.main')
  const canInner = !!main && main.scrollHeight > main.clientHeight
  return canInner ? main : null
}

const onObserve = (entries: IntersectionObserverEntry[]) => {
  // 回调按 observe 顺序派发（同 DOM 顺序），最后进入条带的标题即当前章节
  for (const entry of entries) {
    if (entry.isIntersecting && active.value !== entry.target.id) {
      active.value = entry.target.id
    }
  }
}

/* 触底高亮末章：正文底部可能凑不进条带，滚到底时直接切到最后一章 */
const updateTail = () => {
  if (!headings.value.length) return
  const atBottom = scrollCtn
    ? scrollCtn.scrollTop + scrollCtn.clientHeight >= scrollCtn.scrollHeight - 2
    : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
  if (!atBottom) return
  const last = headings.value[headings.value.length - 1]
  if (last && active.value !== last.id) active.value = last.id
}

const onScroll = () => {
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(updateTail, 40)
}

/* 滚动容器随路由/注入变化时，监听跟到最新容器（先解旧再绑新） */
const bindScroll = () => {
  const nextCtn = probeCtn()
  if (nextCtn === scrollCtn && scrollBound) return
  if (scrollBound) {
    if (scrollCtn) scrollCtn.removeEventListener('scroll', onScroll)
    else window.removeEventListener('scroll', onScroll)
  }
  scrollCtn = nextCtn
  if (scrollCtn) scrollCtn.addEventListener('scroll', onScroll, { passive: true })
  else window.addEventListener('scroll', onScroll, { passive: true })
  scrollBound = true
}

const sameIds = (a: HeadingItem[], b: HeadingItem[]) =>
  a.length === b.length && a.every((item, i) => item.id === b[i]?.id)

const rebuildObserver = (list: HeadingItem[]) => {
  observer?.disconnect()
  observer = null
  if (!list.length) return
  const main = document.querySelector<HTMLElement>('.main')
  const canInner = !!main && main.scrollHeight > main.clientHeight
  observer = new IntersectionObserver(onObserve, {
    root: canInner ? main : null,
    rootMargin: '0px 0px -80% 0px',
    threshold: 0,
  })
  list.forEach((h) => {
    const el = document.getElementById(h.id)
    if (el) observer?.observe(el)
  })
}

const scan = () => {
  bindScroll()
  const ct = document.querySelector('.content')
  if (!ct) {
    // 不在文章页 / 正文未注入：清空目录与观察器
    if (headings.value.length || active.value) {
      active.value = ''
      headings.value = []
    }
    rebuildObserver([])
    return
  }
  const next = [...ct.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .map((h) => ({ id: h.id, text: h.textContent?.trim() ?? '', level: Number(h.tagName[1]) }))
    .filter((h) => h.id)
  // 标题未变（如图片懒加载触发）则复用现有观察器，只重扫不重建
  if (sameIds(headings.value, next)) return
  headings.value = next
  active.value = ''
  rebuildObserver(next)
  updateTail()
}

const scanScheduled = () => {
  if (scanTimer) clearTimeout(scanTimer)
  scanTimer = setTimeout(scan, 60)
}

/* 跳转：容器可滚时走容器平滑滚动（-20px 呼吸），否则回退 scrollIntoView（移动端整页滚动） */
export const jump = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  if (scrollCtn && scrollCtn.scrollHeight > scrollCtn.clientHeight && scrollCtn.contains(el)) {
    const top =
      el.getBoundingClientRect().top - scrollCtn.getBoundingClientRect().top + scrollCtn.scrollTop
    scrollCtn.scrollTo({ top: top - 20, behavior: 'smooth' })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* 挂载（PostToc 生命周期负责）：首扫 + 观察 .main 子树，异步注入/路由切换均触发重扫 */
export const mount = () => {
  scan()
  const main = document.querySelector<HTMLElement>('.main')
  if (main && !mobs) {
    mobs = new MutationObserver(scanScheduled)
    mobs.observe(main, { childList: true, subtree: true })
  } else if (main) {
    scanScheduled()
  }
}

export const unmount = () => {
  if (scanTimer) clearTimeout(scanTimer)
  if (scrollTimer) clearTimeout(scrollTimer)
  mobs?.disconnect()
  mobs = null
  observer?.disconnect()
  observer = null
  if (scrollBound) {
    if (scrollCtn) scrollCtn.removeEventListener('scroll', onScroll)
    else window.removeEventListener('scroll', onScroll)
  }
  scrollBound = false
  scrollCtn = null
  headings.value = []
  active.value = ''
}

/* ====================<content>==================== */
// 正文根元素：Content.vue 的 .content 容器经模板 ref 绑定，供代码复制委托与图片灯箱复用
export const root = ref<HTMLElement>()
let zoom: Zoom | null = null

export const codeCopy = (e: MouseEvent) => {
  const el = (e.target as HTMLElement).closest<HTMLButtonElement>('button.copy')
  if (!el || !root.value?.contains(el)) return
  const wrapper = el.closest('div[class*="language-"]')
  // textContent 不含行号伪元素，复制的是纯净源码
  const text = wrapper?.querySelector('pre code')?.textContent || ''
  navigator.clipboard.writeText(text).then(() => {
    el.classList.add('copied')
    setTimeout(() => {
      el.classList.remove('copied')
      el.blur()
    }, 2000)
  })
}
export const imgBox = async () => {
  if (!root.value) return
  const { default: mediumZoom } = await import('medium-zoom')
  if (!zoom) {
    zoom = mediumZoom('.content img', { background: 'var(--g-bg)' })
  } else {
    zoom.attach('.content img')
  }
}
