import { computed, ref, watch } from 'vue'
import MiniSearch from 'minisearch'
import { START_LOCATION, type Router } from 'vue-router'
import { getRouter } from '../router'
import { postData } from './config/post.config'
import { DEFAULT_LD } from './config/config'
import { MUSIC_LIST } from './config/music.config'
import type { LD, SearchDoc, Song } from './common/type'

/* ====================<ld>==================== */
const lds: LD[] = ['light', 'dark']

export const refLd = ref<LD>(DEFAULT_LD as LD)
/*
 * id:设置亮暗状态
 * fn:切换类来实现，localstore持久化存储
 */
export const setLd = (ld: LD) => {
  const body = document.body
  lds.forEach((name) => body.classList.remove(name))
  body.classList.add(ld)
  refLd.value = ld

  localStorage.setItem('ld', ld)
  console.info(`亮暗设置成功,当前布局为${ld}`)
}
/*
 * id:初始化亮暗
 * fn:onMounted挂载，首次进入网页根据localstore里的字段配置亮暗，如果是第一次，默认暗色(DEFAULT_LD)
 */
export const initLD = () => {
  const store = localStorage.getItem('ld')
  const l: LD = lds.includes(store as LD) ? (store as LD) : (DEFAULT_LD as LD)
  setLd(l)
  console.info('亮暗初始化成功')
}

/* ====================<immersive>==================== */
let isImmersive = false
/*
 * fn:沉浸阅读模式切换
 * des:开启时移除 body 上的 default/card 布局类并加上 immersive，关闭时移除 immersive 并回填本地存储的布局类
 * type:private
 * param:无
 * return：无
 */
const immersive = () => {
  const body = document.body
  isImmersive = !isImmersive
  if (isImmersive) {
    body.classList.remove('default', 'card')
    body.classList.add('immersive')
  } else {
    body.classList.remove('immersive')
    const store = localStorage.getItem('layout')
    body.classList.add(String(store))
  }
}

/*
 * fn:绑定沉浸阅读按钮
 * des:给 #immersive 按钮绑定点击事件，点击后切换沉浸阅读模式
 * type:public
 * param:无
 * return：无
 */
export const setImmersive = () => {
  const immersiveBtn = document.querySelector('#immersive')!
  immersiveBtn.addEventListener('click', () => {
    immersive()
  })
}

/* ====================<music>==================== */
// 阅读顺序：状态 → 时间工具 → 进度轮询 → 实例销毁/创建 → 切歌入口 → 播放参数 → 面板与事件适配
let player: HTMLAudioElement | null = null
let timer: ReturnType<typeof setInterval> | null = null
// 连续加载失败计数。所有歌曲都加载不通时用它止损，避免 error 事件无限切歌
let loadFailCount = 0

export const musicList = ref<Song[]>(MUSIC_LIST) //歌曲列表
export const musicIndex = ref(0) // 歌曲索引
export const volume = ref(1) // 歌曲音量
export const musicTime = ref(0) // 已经播放了多久
export const duration = ref(0) // 歌曲总长
export const isPlaying = ref(false) // 是否播放
export const isMuted = ref(false) // 是否静音
export const openControl = ref(false) // 是否打开面板
export const openList = ref(false) // 是否打开歌曲列表
export const isLoading = ref(false) // 是否加载
export const isLoadFailed = ref(false) // 是否加载失败

export const currentMusic = computed(() => musicList.value[musicIndex.value]) // 当前歌曲
export const progress = computed(() => (duration.value ? musicTime.value / duration.value : 0)) // 播放进度

/*
 * id:时间规范化函数
 * fn:规范显示时间
 */
export const formatTime = (time: number) => {
  const min = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${min}:${s < 10 ? '0' : ''}${s}`
}

/*
 * fn:停止进度轮询
 * des:清除进度轮询定时器
 * type:public
 * param:无
 * return：无
 */
export const stopProgressLoop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

/*
 * fn:开启进度轮询
 * des:每 0.5s 读取一次 audio.currentTime，同步播放进度
 * type:public
 * param:无
 * return：无
 */
export const startProgressLoop = () => {
  if (!player) return
  stopProgressLoop()
  timer = setInterval(() => {
    musicTime.value = player?.currentTime ?? 0
  }, 500)
}

/*
 * fn:销毁音频实例
 * des:先停止进度轮询，再暂停并释放当前 audio 元素
 * type:public
 * param:无
 * return：无
 */
export const musicUnmount = () => {
  stopProgressLoop()
  if (player) {
    player.pause()
    player.removeAttribute('src')
    player.load()
    player = null
  }
  isPlaying.value = false
}

/*
 * fn:创建音频实例
 * des:清理可能遗留的实例，新建 Audio 并挂载事件，按 autoplay 决定是否立即播放
 * type:public
 * param:song 歌曲配置，autoplay 是否立即播放
 * return：无
 */
export const musicMount = (song: Song, autoplay: boolean) => {
  musicUnmount()
  if (!song.audio) return
  musicTime.value = 0
  duration.value = 0
  isLoading.value = true
  isLoadFailed.value = false

  const audio = new Audio()
  player = audio
  audio.preload = 'metadata'
  audio.volume = isMuted.value ? 0 : volume.value
  audio.muted = isMuted.value

  // 元数据就绪即可拿到时长，不必等 canplaythrough
  audio.addEventListener('loadedmetadata', () => {
    duration.value = Math.ceil(audio.duration * 10) / 10
    isLoading.value = false
    loadFailCount = 0 // 加载成功即清零失败计数
  })
  // 开始播放
  audio.addEventListener('play', () => {
    isPlaying.value = true
    startProgressLoop()
  })
  // 暂停播放
  audio.addEventListener('pause', () => {
    isPlaying.value = false
    stopProgressLoop()
  })
  // 播放结束
  audio.addEventListener('ended', () => {
    isPlaying.value = false
    stopProgressLoop()
    nextMusic()
  })
  // 加载失败兜底
  audio.addEventListener('error', () => {
    isLoading.value = false
    // 每首歌都试过一轮仍失败则停下来，避免在坏源之间无限轮换
    loadFailCount += 1
    if (loadFailCount >= musicList.value.length) {
      isLoadFailed.value = true
      console.error('[ERR]:音乐源全部加载失败，已停止自动切歌')
      return
    }
    nextMusic()
  })

  audio.src = song.audio
  if (autoplay) {
    audio.play().catch(() => {
      isPlaying.value = false
      console.error('[ERR]:音乐播放失败')
    })
  }
}

/*
 * fn:播放歌曲
 * des:切换索引并挂载对应歌曲的音频实例
 * type:public
 * param:index 歌曲索引，autoplay 是否立即播放
 * return：无
 */
export const loadMusic = (index: number, autoplay: boolean) => {
  const target = musicList.value[index]
  if (!target) return
  musicIndex.value = index
  musicMount(target, autoplay)
}

/*
 * fn:播放/暂停当前音乐
 * des:已有实例时按暂停态切换播放与暂停，没有实例时先加载当前歌曲再播放
 * type:public
 * param:无
 * return：无
 */
export const toggleMusic = () => {
  if (player) {
    if (player.paused) {
      player.play().catch(() => {
        isPlaying.value = false
        console.error('[ERR]:音乐播放失败')
      })
    } else {
      player.pause()
    }
    return
  }
  if (musicList.value.length) {
    loadMusic(musicIndex.value, true)
  }
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
  if (player && duration.value) player.currentTime = percent * duration.value
}

export const setVolume = (vol: number) => {
  volume.value = vol
  if (player) {
    player.volume = isMuted.value ? 0 : volume.value
  }
}

export const toggleMuted = () => {
  isMuted.value = !isMuted.value
  if (player) {
    player.muted = isMuted.value
  }
}

/*
 * fn:切换音乐面板
 * des:翻转面板开关，关闭时一并收起歌曲列表，避免残留展开态
 * type:public
 * param:无
 * return：无
 */
export const toggleUi = () => {
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
    // postData 的 key 字段映射为 minisearch 文档 id 字段
    miniSearch.addAll(
      postData.map((item) => ({
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

/* ====================<loading progress>==================== */
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
