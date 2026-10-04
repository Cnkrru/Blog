import { computed, ref, watch } from 'vue'
import axios from 'axios'
import MiniSearch from 'minisearch'
import { Howl } from 'howler'
import { getRouter } from '../router'
import { postClean, postCleanCache } from './pamin/post'
import { RefLayout, setLayout } from './pamin/setting'

/* ====================<ld>==================== */
type LD = 'light' | 'dark'
const lds: LD[] = ['light', 'dark']

export const RefLd = ref<LD>('dark')
export const setLd = (ld: LD) => {
  const body = document.body
  lds.forEach((name) => body.classList.remove(name)) // 清理旧类，避免硬编码
  body.classList.add(ld)
  RefLd.value = ld

  localStorage.setItem('ld', ld)
  console.info(`亮暗设置成功,当前布局为${ld}`)
}

export const initLD = () => {
  const store = localStorage.getItem('ld')
  const l = lds.includes(store as LD) ? (store as LD) : 'dark'
  setLd(l)
  console.info('亮暗初始化成功')
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
    layoutBeforeImmersive = RefLayout.value
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

/* ====================<派生数据>==================== */
export const currentMusic = computed(() => musicList.value[musicIndex.value])
export const progress = computed(() => (duration.value ? musicTime.value / duration.value : 0))

export const formatTime = (time: number) => {
  const min = Math.floor(time / 60)
  const s = Math.floor(time % 60)
  return `${min}:${s < 10 ? '0' : ''}${s}`
}

/* ====================<工人：进度轮询>==================== */
export const stop = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

export const start = () => {
  if (!howler) return
  stop()
  timer = setInterval(() => {
    musicTime.value = howler?.seek() ?? 0
  }, 500)
}

/* ====================<工人：构建/销毁 Howl>==================== */
export const unmount = () => {
  stop()
  if (howler) {
    howler.unload()
    howler = null
  }
}

export const mount = (song: Song, autoplay: boolean) => {
  unmount()
  if (!song.audio) return
  isLoading.value = true

  howler = new Howl({
    src: [song.audio, ...(song.backupAudio || [])],
    html5: true,
    autoplay,
    volume: isMuted.value ? 0 : volume.value,
    onplay: () => {
      isPlaying.value = true
      start()
    },
    onpause: () => {
      isPlaying.value = false
      stop()
    },
    onstop: () => {
      isPlaying.value = false
      stop()
    },
    onend: () => {
      isPlaying.value = false
      stop()
      nextMusic()
    },
    onload: () => {
      duration.value = howler?.duration() ?? 0
      isLoading.value = false
    },
    onloaderror: () => {
      isLoading.value = false
      nextMusic()
    },
  })
}

export const loadMusic = (index: number, autoplay: boolean) => {
  const target = musicList.value[index]
  if (!target) return
  musicIndex.value = index
  mount(target, autoplay)
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

export const RefKeyword = ref('')
export const RefSearchRes = ref<SearchDoc[]>([])
export const searchReady = ref(false)
export const searchLoading = ref(false)
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
    console.error('[ERR]:miniSearch初始化失败')
  }
}

// 检索
const assembler = (key: string) => {
  const q = key.trim()
  if (!q) {
    RefSearchRes.value = []
    return
  }
  if (!miniSearch) {
    RefSearchRes.value = []
    return
  }
  // SearchResult 靠索引签名携带 storeFields，显式提取字段映射回 SearchDoc 契约
  RefSearchRes.value = miniSearch
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
  RefSearchRes.value = []
}

// 输入清空：keyword、结果、面板一次性复位（点击结果/回车跳转后调用）
export const resetSearch = () => {
  RefKeyword.value = ''
  clearRes()
  searchOpen.value = false
}

// 输入联动：空输入收起面板，非空则检索并展开（Search.vue 只做 v-model 绑定）
watch(RefKeyword, (v) => {
  const q = v.trim()
  if (!q) {
    clearRes()
    searchOpen.value = false
    return
  }
  assembler(q)
  searchOpen.value = true
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
export const RefSearchPos = ref({ left: 0, top: 0, width: 0 })
const syncSearchPos = () => {
  const pane = document.querySelector<HTMLElement>('.search')
  if (!pane) return
  const r = pane.getBoundingClientRect()
  RefSearchPos.value = { left: r.left, top: r.top + r.height + 8, width: r.width }
}

// 点击结果：跳转文章页并复位搜索状态（router 实例由 main.ts 注入）
export const go = (id: string) => {
  getRouter()?.push(`/post/${id}`)
  resetSearch()
}

export const onEnter = () => {
  const first = RefSearchRes.value[0]
  if (first) go(first.id)
}

export const onFocus = () => {
  if (RefKeyword.value.trim()) searchOpen.value = true
}

const onClickOutside = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.search')) searchOpen.value = false
}

// 挂载/卸载：初始化定位并注册全局监听，Search.vue 生命周期调用
export const mountSearch = () => {
  syncSearchPos()
  document.addEventListener('click', onClickOutside)
  document.addEventListener('scroll', syncSearchPos, true)
  window.addEventListener('resize', syncSearchPos)
}
export const unmountSearch = () => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('scroll', syncSearchPos, true)
  window.removeEventListener('resize', syncSearchPos)
}
