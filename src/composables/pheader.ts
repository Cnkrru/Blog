import { computed, nextTick, ref, watch } from 'vue'
import axios from 'axios'
import MiniSearch from 'minisearch'
import { Howl } from 'howler'
import { START_LOCATION, type Router } from 'vue-router'
import { getRouter } from '../router'
import { postClean, postCleanCache } from './pamin/post'
import { refLayout, setLayout } from './pamin/setting'
import { switchLocale, type Locale } from './i18n'

/* ====================<ld>==================== */
type LD = 'light' | 'dark'
const lds: LD[] = ['light', 'dark']

// 模块级共享 ref 命名统一为 camelCase 的 ref 前缀（原 RefLd）
export const refLd = ref<LD>('dark')
export const setLd = (ld: LD) => {
  const body = document.body
  lds.forEach((name) => body.classList.remove(name)) // 清理旧类，避免硬编码
  body.classList.add(ld)
  refLd.value = ld

  localStorage.setItem('ld', ld)
  console.info(`亮暗设置成功,当前布局为${ld}`)
}

export const initLD = () => {
  const store = localStorage.getItem('ld')
  const l: LD = lds.includes(store as LD) ? (store as LD) : 'dark'
  setLd(l)
  console.info('亮暗初始化成功')
}

// 明暗切换动作收敛到 .ts，组件模板只做事件转发
export const toggleLd = () => {
  setLd(refLd.value === 'light' ? 'dark' : 'light')
}

/* ====================<immersive>==================== */
let immersive = false
let layoutBeforeImmersive: 'default' | 'card' = 'default'
export const setImmersive = () => {
  const body = document.body
  if (immersive) {
    // 退出沉浸：去掉沉浸类，恢复进入前的布局
    body.classList.remove('immersive')
    setLayout(layoutBeforeImmersive)
  } else {
    // 进入沉浸：先记住当前布局，再切到 immersive
    layoutBeforeImmersive = refLayout.value
    body.classList.remove('default', 'card')
    body.classList.add('immersive')
  }
  immersive = !immersive
  console.info(`[INFO]:沉浸模式${immersive ? '开启' : '关闭'}`)
}

/* ====================<music>==================== */
type Song = {
  id: number
  title: string
  artist: string
  cover: string
  audio: string
  backupAudio?: string[]
}
type MusicConfig = { songs: Song[] }

// SSR 守卫：构建期(SSG)无 window，loadConfig 直接跳过，避免 ReferenceError
const isBrowser = typeof window !== 'undefined'

let howler: Howl | null = null
let timer: ReturnType<typeof setInterval> | null = null
// 连续加载失败计数。所有歌曲源都不通时用它止损，避免 onloaderror 无限切歌
let loadFailCount = 0

export const musicList = ref<Song[]>([])
export const musicIndex = ref(0)
export const volume = ref(1)
export const musicTime = ref(0)
export const duration = ref(0)
export const isPlaying = ref(false)
export const isMuted = ref(false)
export const openControl = ref(false)
export const openList = ref(false)
export const isLoading = ref(false)
// 音乐源全部加载失败时置位，供 UI 提示（原先加载态与失败态都无处可见）
export const isLoadFailed = ref(false)

/* ====================<派生数据>==================== */
export const currentMusic = computed(() => musicList.value[musicIndex.value])
export const progress = computed(() => (duration.value ? musicTime.value / duration.value : 0))

export const formatTime = (time: number) => {
  const min = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${min}:${s < 10 ? '0' : ''}${s}`
}

/* ====================<工人：进度轮询>==================== */
// 导出名按域加 music 前缀，避免与 post.ts 的 mount/unmount 等同名导出撞车
export const musicStop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

export const musicStart = () => {
  if (!howler) return
  musicStop()
  timer = setInterval(() => {
    musicTime.value = howler?.seek() ?? 0
  }, 500)
}

/* ====================<工人：构建/销毁 Howl>==================== */
export const musicUnmount = () => {
  musicStop()
  if (howler) {
    howler.unload()
    howler = null
  }
}

export const musicMount = (song: Song, autoplay: boolean) => {
  musicUnmount()
  if (!song.audio) return
  // 换歌时重置播放进度与时长，避免进度条停留在上一首的位置
  musicTime.value = 0
  duration.value = 0
  isLoading.value = true
  isLoadFailed.value = false

  howler = new Howl({
    src: [song.audio, ...(song.backupAudio || [])],
    html5: true,
    autoplay,
    volume: isMuted.value ? 0 : volume.value,
    onplay: () => {
      isPlaying.value = true
      musicStart()
    },
    onpause: () => {
      isPlaying.value = false
      musicStop()
    },
    onstop: () => {
      isPlaying.value = false
      musicStop()
    },
    onend: () => {
      isPlaying.value = false
      musicStop()
      nextMusic()
    },
    onload: () => {
      duration.value = howler?.duration() ?? 0
      isLoading.value = false
      loadFailCount = 0 // 加载成功即清零失败计数
    },
    onloaderror: () => {
      isLoading.value = false
      // 每首歌都试过一轮仍失败则停下来，避免在坏源之间无限轮换
      loadFailCount += 1
      if (loadFailCount >= musicList.value.length) {
        isLoadFailed.value = true
        console.error('[ERR]:音乐源全部加载失败，已停止自动切歌')
        return
      }
      nextMusic()
    },
  })

  // html5 模式下 Howler 只在 canplaythrough 才写内部 _duration，而该事件对远程大文件
  //   常常迟迟不触发甚至不触发，于是 howler.duration() 恒为 0：右侧总长一直 0:00，
  //   而 onSeek 又以 duration 作守卫，进度条就拖不动。这里直接听底层 audio 元素的
  //   loadedmetadata（远早于 canplaythrough）取时长。
  const audioNode = (howler as unknown as { _sounds: { _node?: HTMLAudioElement }[] })._sounds[0]
    ?._node
  audioNode?.addEventListener(
    'loadedmetadata',
    () => {
      duration.value = Math.ceil(audioNode.duration * 10) / 10
    },
    { once: true },
  )
}

export const loadMusic = (index: number, autoplay: boolean) => {
  const target = musicList.value[index]
  if (!target) return
  musicIndex.value = index
  musicMount(target, autoplay)
}

/* ====================<外层动作>==================== */
export const loadConfig = async () => {
  if (!isBrowser) return
  try {
    const { data } = await axios.get<MusicConfig>('/config/music.json')
    musicList.value = data.songs
    if (musicList.value.length) {
      loadMusic(musicIndex.value, false)
    }
  } catch {
    console.error('[ERR]:加载音乐配置失败')
  }
}

export const toggleMusic = () => {
  if (howler && howler.playing()) {
    howler.pause()
    return
  }
  if (howler) {
    howler.play()
    return
  }
  if (musicList.value.length) {
    loadMusic(musicIndex.value, true)
  }
}

export const play = () => {
  if (howler) {
    howler.play()
  } else if (musicList.value.length) {
    loadMusic(musicIndex.value, true)
  }
}

export const pause = () => {
  if (howler) howler.pause()
}

export const preMusic = () => {
  if (!musicList.value.length) return
  const pre = (musicIndex.value - 1 + musicList.value.length) % musicList.value.length
  loadMusic(pre, true)
}

export const nextMusic = () => {
  if (!musicList.value.length) return
  const next = (musicIndex.value + 1 + musicList.value.length) % musicList.value.length
  loadMusic(next, true)
}

export const selectMusic = (index: number) => {
  if (index === musicIndex.value) {
    toggleMusic()
    return
  }
  loadMusic(index, true)
}

export const seek = (percent: number) => {
  if (howler && duration.value) howler.seek(percent * duration.value)
}

export const setVolume = (vol: number) => {
  volume.value = vol
  if (howler) {
    howler.volume(isMuted.value ? 0 : volume.value)
  }
}

export const toggleMuted = () => {
  isMuted.value = !isMuted.value
  if (howler) {
    howler.mute(isMuted.value)
  }
}

/* ====================<UI 交互>==================== */
export const toggleUi = () => {
  // 翻转主面板开关；关闭时列表一起收起，避免残留展开态
  const next = !openControl.value
  openControl.value = next
  if (!next) openList.value = false
}

// 事件适配：进度条/音量条取值后转交域内动作，Music.vue 只做绑定
export const onSeek = (e: Event) => {
  seek(Number((e.target as HTMLInputElement).value) / 100)
}
export const onVolume = (e: Event) => {
  setVolume(Number((e.target as HTMLInputElement).value))
}

/* ====================<search>==================== */
type SearchDoc = { id: string; title: string; category: string; tags: string[]; date: string }

export const refKeyword = ref('')
export const refSearchRes = ref<SearchDoc[]>([])
export const searchReady = ref(false)
export const searchLoading = ref(false)
export const searchFailed = ref(false)
export const searchOpen = ref(false)

let miniSearch: MiniSearch<SearchDoc> | null = null
let buildFlag = false

// 分词
const slicer = (text: string) => {
  const words = String(text)
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
  const tokens = new Set(words)
  words.forEach((w) => {
    if (/[\u4e00-\u9fff]/.test(w) && w.length > 1) {
      for (let i = 0; i < w.length; i++) {
        tokens.add(w.slice(i, i + 2))
      }
    }
  })
  return [...tokens]
}

// 配置minisearch
export const buildIndex = async () => {
  if (buildFlag) return
  searchLoading.value = true
  searchFailed.value = false

  try {
    await postClean()
    miniSearch = new MiniSearch<SearchDoc>({
      fields: ['title', 'category', 'tags', 'date'], // 参与检索的字段
      storeFields: ['id', 'title', 'category', 'tags', 'date'], // 检索结果里返回的字段
      tokenize: slicer, // 中文分词
      searchOptions: {
        boost: { title: 3, tags: 2, category: 1, date: 1 }, // 标题权重最高
        fuzzy: 0.2, // 容错匹配
        prefix: true, // 允许前缀匹配
        combineWith: 'OR', // 多个 token 命中任一即可，提升召回
      },
    })
    // postCleanCache 的 key 字段映射为 minisearch 文档 id 字段
    miniSearch.addAll(
      postCleanCache.map((item) => ({
        id: item.key,
        title: item.title,
        category: item.category,
        tags: item.tags,
        date: item.date,
      })),
    )
    searchReady.value = true
    buildFlag = true
    searchLoading.value = false
    console.info('[INFO]:minisearch初始化完成')
  } catch {
    searchLoading.value = false
    searchFailed.value = true
    console.error('[ERR]:miniSearch初始化失败')
  }
}

// 检索
const assembler = (key: string) => {
  const q = key.trim()
  if (!q) {
    refSearchRes.value = []
    return
  }
  if (!miniSearch) {
    refSearchRes.value = []
    return
  }
  // SearchResult 靠索引签名携带 storeFields，显式提取字段映射回 SearchDoc 契约
  refSearchRes.value = miniSearch
    .search(q)
    .slice(0, 10)
    .map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      tags: r.tags,
      date: r.date,
    }))
}

// 结果清空（原 _cleaner 因与数据清洗撞名加 _，当前无冲突用语义名 clearRes）
export const clearRes = () => {
  refSearchRes.value = []
}

// 输入清空：keyword、结果、面板一次性复位（点击结果/回车跳转后调用）
export const resetSearch = () => {
  refKeyword.value = ''
  clearRes()
  searchOpen.value = false
}

// 输入联动：空输入收起面板；非空则防抖检索并展开（Search.vue 只做 v-model 绑定）
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(refKeyword, (v) => {
  const q = v.trim()
  if (searchTimer) clearTimeout(searchTimer)
  if (!q) {
    clearRes()
    searchOpen.value = false
    return
  }
  // 检索加轻量防抖，避免连打时每键都同步检索
  searchTimer = setTimeout(() => {
    assembler(q)
    searchOpen.value = true
    syncSearchPos()
  }, 200)
})

// 高亮命中片段：keyword 前后内容分别转义后回填高亮标签
const escMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}
export const searchHl = (text: string, kw: string) => {
  const s = String(text ?? '')
  const k = (kw || '').trim()
  const esc = (str: string) => str.replace(/[&<>"']/g, (c) => escMap[c] ?? c)
  if (!k) return esc(s)
  const i = s.toLowerCase().indexOf(k.toLowerCase())
  if (i === -1) return esc(s)
  return (
    esc(s.slice(0, i)) +
    '<b class="search-hit">' +
    esc(s.slice(i, i + k.length)) +
    '</b>' +
    esc(s.slice(i + k.length))
  )
}

/* ====================<search UI 交互>==================== */
// 结果下拉定位：读输入框位置，下移 8px 对齐
export const refSearchPos = ref({ left: 0, top: 0, width: 0 })
const syncSearchPos = () => {
  const pane = document.querySelector<HTMLElement>('.search')
  if (!pane) return
  const r = pane.getBoundingClientRect()
  refSearchPos.value = { left: r.left, top: r.top + r.height + 8, width: r.width }
}

// 点击结果：跳转文章页并复位搜索状态（router 实例由 main.ts 注入）
export const go = (id: string) => {
  getRouter()?.push(`/post/${id}`)
  resetSearch()
}

export const onEnter = (e: KeyboardEvent) => {
  // 中文输入法组词中的回车是选词，不当作跳转
  if (e.isComposing) return
  const first = refSearchRes.value[0]
  if (first) go(first.id)
}

export const onFocus = () => {
  if (refKeyword.value.trim()) searchOpen.value = true
}

const onClickOutside = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.search')) searchOpen.value = false
}

// 滚动定位仅面板展开时同步，并用 rAF 节流（原 capture scroll 每次滚动都算 getBoundingClientRect）
let posRaf: number | null = null
const syncSearchPosOnView = () => {
  if (!searchOpen.value || posRaf) return
  posRaf = requestAnimationFrame(() => {
    posRaf = null
    syncSearchPos()
  })
}

// 挂载/卸载：初始化定位并注册全局监听，Search.vue 生命周期调用
export const mountSearch = () => {
  syncSearchPos()
  document.addEventListener('click', onClickOutside)
  document.addEventListener('scroll', syncSearchPosOnView, true)
  window.addEventListener('resize', syncSearchPosOnView)
}
export const unmountSearch = () => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('scroll', syncSearchPosOnView, true)
  window.removeEventListener('resize', syncSearchPosOnView)
  if (posRaf) {
    cancelAnimationFrame(posRaf)
    posRaf = null
  }
}

/* ====================<locale menu>==================== */
export const refLocaleOpen = ref(false)
export const refLocaleMenuPos = ref({ left: 0, top: 0 })

// 菜单宽度与 CSS 的 .locale-menu width 保持一致
const LOCALE_MENU_WIDTH = 168
const LOCALE_MENU_GAP = 8
let localeIndex = 0

const localeTriggerEl = () => document.querySelector<HTMLElement>('.locale-btn')
const localeItemEls = () =>
  Array.from(document.querySelectorAll<HTMLButtonElement>('.locale-menu .locale-item'))

const syncLocaleMenuPos = () => {
  const trigger = localeTriggerEl()
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  const maxLeft = window.innerWidth - LOCALE_MENU_WIDTH - 8
  refLocaleMenuPos.value = {
    left: Math.max(8, Math.min(rect.right - LOCALE_MENU_WIDTH, maxLeft)),
    top: rect.bottom + LOCALE_MENU_GAP,
  }
}

const focusLocaleItem = (index: number) => {
  const items = localeItemEls()
  if (!items.length) return
  localeIndex = (index + items.length) % items.length
  items[localeIndex]?.focus()
}

const onLocaleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('.locale-btn') || target.closest('.locale-menu')) return
  closeLocaleMenu()
}

let localeRaf: number | null = null
const syncLocaleMenuPosOnView = () => {
  if (!refLocaleOpen.value || localeRaf) return
  localeRaf = requestAnimationFrame(() => {
    localeRaf = null
    syncLocaleMenuPos()
  })
}

// 开合与外部监听成对注册：只在菜单展开期间挂全局事件，避免常驻监听
export const openLocaleMenu = async () => {
  syncLocaleMenuPos()
  refLocaleOpen.value = true
  document.addEventListener('click', onLocaleClickOutside)
  document.addEventListener('scroll', syncLocaleMenuPosOnView, true)
  window.addEventListener('resize', syncLocaleMenuPosOnView)

  await nextTick()
  // 打开即聚焦当前语言项，键盘用户可直接上下选择
  const items = localeItemEls()
  const current = items.findIndex((el) => el.getAttribute('aria-checked') === 'true')
  localeIndex = Math.max(0, current)
  items[localeIndex]?.focus()
}

export const closeLocaleMenu = (focusTrigger = false) => {
  if (!refLocaleOpen.value) return
  refLocaleOpen.value = false
  document.removeEventListener('click', onLocaleClickOutside)
  document.removeEventListener('scroll', syncLocaleMenuPosOnView, true)
  window.removeEventListener('resize', syncLocaleMenuPosOnView)
  if (localeRaf) {
    cancelAnimationFrame(localeRaf)
    localeRaf = null
  }
  if (focusTrigger) localeTriggerEl()?.focus()
}

export const toggleLocaleMenu = () => {
  if (refLocaleOpen.value) closeLocaleMenu()
  else openLocaleMenu()
}

export const chooseLocale = (locale: Locale) => {
  switchLocale(locale)
  closeLocaleMenu(true)
}

// Enter/Space 交给按钮原生 click，只在方向键时手动展开，避免双触发
export const localeTriggerKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    openLocaleMenu()
  } else if (e.key === 'Escape') {
    closeLocaleMenu(true)
  }
}

export const localeMenuKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusLocaleItem(localeIndex + 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusLocaleItem(localeIndex - 1)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    closeLocaleMenu(true)
  } else if (e.key === 'Tab') {
    closeLocaleMenu()
  }
}

// 组件卸载时兜底收尾，避免 Header 已卸载但全局监听还挂在 document 上
export const unmountLocaleMenu = () => {
  closeLocaleMenu()
}

/* ====================<route loading>==================== */
// 全局路由加载状态：模块级单例，由 App 的 LoadingBar 消费
export const refRouteLoading = ref(false)
export const refProgress = ref(0)

const SHOW_DELAY = 150 // 延迟出现，避免快速跳转闪一下
const MIN_VISIBLE = 300 // 出现后最短停留
const LEAVE_DURATION = 200 // 补满 100% 后淡出的时间
const SAFE_TIMEOUT = 10000 // 守卫异常时的兜底收尾

let pending = 0
let showTimer: ReturnType<typeof setTimeout> | null = null
let finishTimer: ReturnType<typeof setTimeout> | null = null
let safeTimer: ReturnType<typeof setTimeout> | null = null
let shownAt = 0

// 清空上一轮导航的定时器，避免旧回调落到新导航
const clearTimers = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (finishTimer) {
    clearTimeout(finishTimer)
    finishTimer = null
  }
  if (safeTimer) {
    clearTimeout(safeTimer)
    safeTimer = null
  }
}

const reset = () => {
  pending = 0
  clearTimers()
  refRouteLoading.value = false
  refProgress.value = 0
}

const start = () => {
  pending++
  if (pending > 1) return
  clearTimers()

  // 上一轮进度条还没淡出：直接复用，重新计时并回落到 80%
  if (refRouteLoading.value) {
    shownAt = Date.now()
    refProgress.value = 80
    safeTimer = setTimeout(() => reset(), SAFE_TIMEOUT)
    return
  }

  refProgress.value = 0
  showTimer = setTimeout(() => {
    showTimer = null
    shownAt = Date.now()
    refRouteLoading.value = true
    refProgress.value = 80
  }, SHOW_DELAY)
  safeTimer = setTimeout(() => reset(), SAFE_TIMEOUT)
}

const finish = () => {
  if (pending === 0) return
  pending--
  if (pending > 0) return

  // 还没到显示时机：本轮没有出现过进度条，直接复位
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
    if (safeTimer) {
      clearTimeout(safeTimer)
      safeTimer = null
    }
    refProgress.value = 0
    return
  }

  if (!refRouteLoading.value) return

  refProgress.value = 100
  if (safeTimer) {
    clearTimeout(safeTimer)
    safeTimer = null
  }

  const wait = Math.max(0, MIN_VISIBLE - (Date.now() - shownAt)) + LEAVE_DURATION
  finishTimer = setTimeout(() => {
    finishTimer = null
    refRouteLoading.value = false
    refProgress.value = 0
  }, wait)
}

export const bindLoading = (router: Router) => {
  // SSG 构建期不挂进度条，避免服务端定时器拖慢构建
  if (typeof window === 'undefined') return

  router.beforeEach((to, from) => {
    // 首次导航是 SSG 首屏 hydration，不显示进度条
    if (from === START_LOCATION) return
    start()
  })
  // 成功、取消、重定向都会走到 afterEach，计数在这里平衡
  router.afterEach(() => finish())
  router.onError(() => reset())
}
