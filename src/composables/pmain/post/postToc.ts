import { ref } from 'vue'
import type { HeadingItem } from '../../common/type'
/* ====================<postToc>==================== */
// toc 单例（PostToc 挂载/卸载驱动）：headings/active 为全文唯一响应式源状态，
//   scrollspy 用 IntersectionObserver 观察标题越过视口顶部条带（rootMargin 收缩底部 80%），
//   触底高亮末章由轻量 scroll 监听兜底（仅数值比较，不触发布局）
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
