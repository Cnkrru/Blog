import { ref } from 'vue'
import bgVideo from '@/assets/media/bg.mp4'

/* ====================<theme>==================== */
// 主题键类型：PascalCase，作为唯一的"取值集合"类型
type Theme = 'ink' | 'blue' | 'cyan' | 'sakura' | 'purple'
// 主题列表
const themes: Theme[] = ['ink', 'blue', 'cyan', 'sakura', 'purple']

// UI 响应式状态：初值给默认主题，避免加载期 ref 为空
export const RefTheme = ref<Theme>('sakura')

export const setTheme = (theme: Theme) => {
  const body = document.body
  themes.forEach((name) => body.classList.remove(name)) // 清理旧类，避免硬编码
  body.classList.add(theme)
  RefTheme.value = theme
  localStorage.setItem('theme', theme)
  console.info(`[INFO]:主题设置成功,当前主题为${theme}`)
}

export const initTheme = () => {
  const store = localStorage.getItem('theme')
  const t: Theme = themes.includes(store as Theme) ? (store as Theme) : 'sakura'
  setTheme(t)
  console.info('[INFO]:主题初始化成功')
}

/* ====================<layout>==================== */
type Layout = 'default' | 'card'
const layouts: Layout[] = ['default', 'card']

export const RefLayout = ref<Layout>('default')
export const setLayout = (layout: Layout) => {
  const body = document.body
  layouts.forEach((name) => body.classList.remove(name)) // 清理旧类，避免硬编码
  body.classList.add(layout)
  RefLayout.value = layout

  localStorage.setItem('layout', layout)
  console.info(`[INFO]:布局设置成功,当前布局为${layout}`)
}
export const initLayout = () => {
  const store = localStorage.getItem('layout')
  const l: Layout = layouts.includes(store as Layout) ? (store as Layout) : 'default'
  setLayout(l)
  console.info('[INFO]:布局初始化成功')
}

/* ====================<bg>==================== */
type Bg = 'video' | 'img'
const bgs: Bg[] = ['video', 'img']

export const RefBg = ref<Bg>('img')
export const setBg = (bg: Bg) => {
  const body = document.body
  if (bg === 'img') {
    document.querySelector('.bg-video')?.remove()
    body.classList.add('bg-img')
    RefBg.value = 'img'

    localStorage.setItem('bg', 'img')
    console.info('[INFO]:背景已设置为图片')
  } else if (bg === 'video') {
    const video = document.createElement('video')
    body.classList.remove('bg-img')

    video.className = 'bg-video'
    video.src = bgVideo
    video.autoplay = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.load() // 立即触发下载/解码
    video.play().catch(() => {}) // autoplay 被策略拦时静默
    document.body.appendChild(video)

    RefBg.value = 'video'
    localStorage.setItem('bg', 'video')
    console.info('[INFO]:背景已设置为视频')
  }
}
export const initBg = () => {
  const store = localStorage.getItem('bg')
  const b: Bg = bgs.includes(store as Bg) ? (store as Bg) : 'img'
  setBg(b)
  console.info('[INFO]:背景初始化成功')
}

/* ====================<opacity>==================== */
export const RefOpacity = ref(1)

export const setOpacity = () => {
  document.documentElement.style.setProperty('--glass-opacity', String(RefOpacity.value)) // 修改透明度CSS
  document.documentElement.style.setProperty('--progress', String(RefOpacity.value * 100) + '%') // 修改进度条CSS
  localStorage.setItem('opacity', String(RefOpacity.value)) // 持久化存储
  console.info('[INFO]:透明度修改成功')
}

export const initOpacity = () => {
  const store = localStorage.getItem('opacity') ?? '1'
  document.documentElement.style.setProperty('--glass-opacity', store)
  document.documentElement.style.setProperty('--progress', String(parseFloat(store) * 100) + '%')
  console.info('[INFO]:透明度初始化成功')
}
