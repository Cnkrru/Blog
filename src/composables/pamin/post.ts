import { reactive, ref, nextTick, computed, watch } from 'vue'
import QRCode from 'qrcode'
import axios from 'axios'
import type { Zoom } from 'medium-zoom'
import { refTheme } from './setting'
import { refLd } from '../pheader'
import { refText } from '../i18n'
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

// 构建期可同步取到 post 全表（.cache/post.json 由构建管线从 public/config/post.json 复制，
//   是可 import 的同源副本），setup 期即可用 → 列表页/上下篇/字数在 SSG 产物里就有真内容；
//   副本缺失时（异常场景）仍走 postData 的 axios 兜底
const localPost = import.meta.glob<PostData>('/.cache/post.json', { eager: true, import: 'default' })
export let postCache: PostData = localPost['/.cache/post.json'] ?? {}

// order→key 映射收敛到数据层构建一次，postClean/postNav 复用（原先各自重建一遍）
let orderMapCache: Record<number, string> | null = null
const orderMapGet = () => {
  if (orderMapCache) return orderMapCache
  const map: Record<number, string> = Object.create(null)
  Object.entries(postCache).forEach(([k, v]) => {
    map[v.order] = k
  })
  orderMapCache = map
  return map
}

// in-flight Promise 复用，避免同一 tick 内 PostStatus/postEdit/PostNav 并发重复拉取整表
let postDataPromise: Promise<void> | null = null
export const postData = async () => {
  if (Object.keys(postCache).length > 0) return // 有缓存直接读缓存
  if (!postDataPromise) {
    postDataPromise = axios
      .get<PostData>('/config/post.json')
      .then((meta) => {
        orderMapCache = null // 新数据落地，作废旧映射
        postCache = meta.data
        console.info('[INFO]:已经获取到post.json的数据')
      })
      .catch(() => {
        console.error('[ERR]:未获取到post.json全表')
        postDataPromise = null // 失败后释放，允许下次重试
      })
  }
  await postDataPromise
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

// 清洗核心可同步执行（SSG 期 .cache 副本已在内存）；数据未就绪返回 false 交异步兜底
export const postCleanSync = (): boolean => {
  if (postCleanCache.length > 0) return true // 已有缓存直接返回
  if (Object.keys(postCache).length === 0) return false
  // 步骤1：复用数据层构建的 order→key 映射，将 values 取出来压入数组里
  const orderMap = orderMapGet()
  const keys = Object.values(orderMap).filter(Boolean)
  // 步骤2：遍历keys，把精简字段打入容器
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
  return true
}

export const postClean = async () => {
  if (postCleanSync()) return
  await postData()
  postCleanSync()
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
    toastOpen('success', refText.value.copied(text))
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
// 关闭图标
const xIcon: string =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
let toastTimer: ReturnType<typeof setTimeout> | null = null

export const toastOpen = (level: Level, mes: string) => {
  let toast = document.querySelector<HTMLElement>('.toast-box')
  // 退场中的旧节点直接丢弃，避免新旧提示重叠
  if (toast?.classList.contains('is-hide')) {
    toast.remove()
    toast = null
  }

  let icon: HTMLElement
  let message: HTMLElement

  if (toast) {
    icon = toast.querySelector<HTMLElement>('.toast-icon')!
    message = toast.querySelector<HTMLElement>('.toast-mes')!
  } else {
    toast = document.createElement('div')
    toast.className = 'toast-box'
    toast.setAttribute('role', 'status')

    icon = document.createElement('div')
    icon.className = 'toast-icon'

    message = document.createElement('span')
    message.className = 'toast-mes'

    const closeButton = document.createElement('button')
    closeButton.type = 'button'
    closeButton.className = 'toast-close'
    closeButton.setAttribute('aria-label', refText.value.closeTip)
    closeButton.title = refText.value.closeTip
    closeButton.innerHTML = xIcon
    closeButton.addEventListener('click', () => toastClose())

    toast.append(icon, message, closeButton)
    document.body.appendChild(toast)
  }

  icon.innerHTML = levelIconMap[level]
  message.textContent = mes
  toast.className = 'toast-box toast-' + level

  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  toastTimer = setTimeout(() => toastClose(), 3000)
}

export const toastClose = () => {
  const toastOn = document.querySelector<HTMLElement>('.toast-box')
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }
  if (toastOn && !toastOn.classList.contains('is-hide')) {
    toastOn.classList.add('is-hide')
    setTimeout(() => {
      toastOn.remove()
      console.info('[INFO]:toast已成功移除')
    }, 200)
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

export const scrollProgress = (): (() => void) => {
  const area = document.querySelector<HTMLElement>('.main')
  // 收窄到返回顶部按钮内部。正文的 progress 围栏代码块也生成 .progress（在 .main 内、文档序更靠前），
  //   用全局 '.progress' 会命中正文那个 div，进度环 span 反而取不到、--scroll-deg 永远没值
  const progress = document.querySelector<HTMLElement>('.back-top-btn .progress')
  if (!area || !progress) return () => {}

  const update = () => {
    // canArea 改为每次重算。原先只在挂载时探一次，而正文是异步组件（客户端跳转时挂载瞬间
    //   .main 还没被撑开），会被误判成"不可滚"从而只监听 window；此后桌面端真正滚动的是 .main，
    //   收不到 window 的 scroll 事件，进度就永久冻结（移动端恰好 window 才是滚动者，所以没暴露）
    const canArea = area.scrollHeight > area.clientHeight
    // 进度改以正文块(.content)为基准。桌面端 .main 可滚时仍按容器行程计；
    //   移动端整页滚动时不再回落 window(body) 整页行程，改按正文块顶部进视口→底部出视口计
    let _progress = 0
    if (canArea) {
      const total = area.scrollHeight - area.clientHeight // 用总可滚px做保护
      _progress = total > 0 ? Math.min(1, area.scrollTop / total) : 0
    } else {
      const content = document.querySelector<HTMLElement>('.content')
      if (content) {
        const rect = content.getBoundingClientRect()
        const total = rect.height - window.innerHeight // 正文块高 − 可视高 = 有效阅读行程
        _progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      }
    }
    // --progress 一符多义，这里角度值改用 --scroll-deg 专用
    progress.style.setProperty('--scroll-deg', _progress * 360 + 'deg') // 设置样式
  }

  // 同时监听 .main 与 window——滚动者取决于当前布局（桌面滚 .main、移动端滚 window），
  //   两边都挂才能在异步内容撑开 .main 后自动切换到正确的度量口径
  area.addEventListener('scroll', update, { passive: true })
  window.addEventListener('scroll', update, { passive: true })
  update()
  // 返回清理函数，供 BackToTop 卸载时解绑（原先每次挂载都新增监听，反复切页累积）
  return () => {
    area.removeEventListener('scroll', update)
    window.removeEventListener('scroll', update)
  }
}

/* ====================<mermaid>==================== */
// mermaid 按当前亮暗初始化主题，并在主题变更时重渲染
let mermaidWatchBound = false

const mermaidRender = async () => {
  const mermaidCode = document.querySelectorAll<HTMLElement>('pre[data-lang="mermaid"] code')
  if (!mermaidCode.length) return
  mermaidCode.forEach((el) => {
    // run 会用 svg 替换 code 内容：首次存源码，重渲染前还原源码并清掉 processed 标记
    const src = el.dataset.mermaidSrc ?? el.textContent ?? ''
    el.dataset.mermaidSrc = src
    el.textContent = src
    el.removeAttribute('data-processed')
  })

  //   库变量改名 mermaidLib，避免与导出函数同名遮蔽
  const { default: mermaidLib } = await import('mermaid')
  // 配置mermaid.js：主题跟随站点亮暗
  mermaidLib.initialize({
    startOnLoad: false,
    theme: refLd.value === 'dark' ? 'dark' : 'default',
  })
  try {
    await mermaidLib.run({ nodes: Array.from(mermaidCode) })
  } catch {
    console.error('[ERR]:mermaid渲染错误')
  }
}

export const mermaid = async () => {
  // 首次调用绑定一次主题监听（全局单例，不随组件卸载销毁）
  if (!mermaidWatchBound) {
    watch([refLd, refTheme], () => {
      mermaidRender()
    })
    mermaidWatchBound = true
  }
  await mermaidRender()
}

// 正文改为异步组件后晚于 Content 挂载，图片放大与 mermaid 初始化改由此处触发
//   （来源：Post.vue 的 Suspense @resolve），避免初始化时正文还没进 DOM
export const contentReady = () => {
  imgBox()
  mermaid()
}

/* ====================<comment>==================== */
// 首帧即算出完整主题 URL：giscus-widget 创建时 theme 属性就是对的，
// 若先用空值再回填，iframe 会先按默认主题构建，后续变更来不及生效。
// window 只在客户端访问，组件侧用 ClientOnly 包住，SSR 阶段不会求值
export const comment = computed(() => `${window.location.origin}/css/${refTheme.value}-${refLd.value}.css`)

/* ====================<comment loading>==================== */
// 评论加载态：脚本导入结束即收起骨架；导入失败单独标记，避免骨架一直转
export const refCommentLoading = ref(true)
export const refCommentFailed = ref(false)

/* ====================<postNav>==================== */
export const preOrder = ref('')
export const nextOrder = ref('')
export const preTitle = ref('')
export const nextTitle = ref('')
export const postNav = async (postKey: string) => {
  await postData()
  const meta = postCache[postKey]
  if (!meta) return

  // 复用数据层构建的 order→key 映射，不再各自重建
  const orderMap = orderMapGet()

  // 根据映射查原来的key（首尾无相邻文章时为空）
  preOrder.value = orderMap[meta.order - 1] ?? ''
  nextOrder.value = orderMap[meta.order + 1] ?? ''

  // 根据上下篇的key拿对应title
  preTitle.value = preOrder.value ? postCache[preOrder.value]!.title : refText.value.noPost
  nextTitle.value = nextOrder.value ? postCache[nextOrder.value]!.title : refText.value.noPost
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

const historyClean = (meta: PostMeta) => {
  const list: HistoryItem[] = []
  // 去掉 historyRaw 中转变量，直接遍历 meta.history
  meta.history?.forEach((item) => {
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
// 导出名按域加 toc 前缀，避免与 pheader.ts 的音乐 mount/unmount 同名导出撞车
export const tocMount = () => {
  scan()
  const main = document.querySelector<HTMLElement>('.main')
  if (main && !mobs) {
    mobs = new MutationObserver(scanScheduled)
    mobs.observe(main, { childList: true, subtree: true })
  } else if (main) {
    scanScheduled()
  }
}

export const tocUnmount = () => {
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
export const codeToggle = (e: MouseEvent) => {
  const el = (e.target as HTMLElement).closest<HTMLButtonElement>('button.code-expand')
  if (!el || !root.value?.contains(el)) return
  const wrapper = el.closest<HTMLElement>('.code-collapse')
  if (!wrapper) return

  const expanded = wrapper.classList.toggle('code-expanded')
  const lines = el.dataset.lines ?? ''
  const text = el.querySelector<HTMLElement>('.code-expand-text')
  if (text)
    text.textContent = expanded
      ? refText.value.codeCollapse
      : refText.value.codeExpand(lines)
  el.setAttribute('aria-expanded', String(expanded))
  el.setAttribute(
    'aria-label',
    expanded ? refText.value.codeCollapse : refText.value.codeExpandAria(lines),
  )
  el.title = expanded ? refText.value.codeCollapse : refText.value.codeExpandAria(lines)

  // 收起时若代码块顶部已滚出视口，拉回顶部，避免高度骤减导致页面跳动
  if (!expanded && wrapper.getBoundingClientRect().top < 0) {
    wrapper.scrollIntoView({ block: 'start' })
  }
}
// 正文点击统一入口：复制与折叠各自判断目标，互不干扰
export const contentClick = (e: MouseEvent) => {
  codeCopy(e)
  codeToggle(e)
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
