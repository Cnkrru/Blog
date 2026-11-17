import bgVideoSrc from '@/assets/media/bg.mp4'
import { DEFAULT_THEME, DEFAULT_LAYOUT, DEFAULT_BG, DEFAULT_OPACITY } from '../common/config'

/* ====================<theme>==================== */
type Theme = 'ink' | 'blue' | 'cyan' | 'sakura' | 'purple'
/*
 * fn:设置主题
 * des:移除 body 上的旧主题类，写入新主题类并持久化到本地存储
 * type:private
 * param:theme 主题名：ink / blue / cyan / sakura / purple
 * return：无
 */
const theme = (theme: Theme) => {
  const body = document.body
  const lastTheme = localStorage.getItem('theme')
  body.classList.remove(lastTheme as Theme)
  body.classList.add(theme)
  localStorage.setItem('theme', theme)
  console.info(`[INFO]:主题设置成功,当前主题为${theme}`)
}

/*
 * fn:绑定天蓝色主题按钮
 * des:给 #blue 按钮绑定点击事件，点击后切换为天蓝色主题
 * type:public
 * param:无
 * return：无
 */
export const setBlueTheme = () => {
  const blueBtn = document.querySelector('#blue')
  if (blueBtn) {
    blueBtn.addEventListener('click', () => {
      theme('blue')
    })
  }
}

/*
 * fn:绑定水墨风主题按钮
 * des:给 #ink 按钮绑定点击事件，点击后切换为水墨风主题
 * type:public
 * param:无
 * return：无
 */
export const setInkTheme = () => {
  const inkBtn = document.querySelector('#ink')
  if (inkBtn) {
    inkBtn.addEventListener('click', () => {
      theme('ink')
    })
  }
}

/*
 * fn:绑定樱花粉主题按钮
 * des:给 #sakura 按钮绑定点击事件，点击后切换为樱花粉主题
 * type:public
 * param:无
 * return：无
 */
export const setSakuraTheme = () => {
  const sakuraBtn = document.querySelector('#sakura')
  if (sakuraBtn) {
    sakuraBtn.addEventListener('click', () => {
      theme('sakura')
    })
  }
}

/*
 * fn:绑定紫罗兰主题按钮
 * des:给 #purple 按钮绑定点击事件，点击后切换为紫罗兰主题
 * type:public
 * param:无
 * return：无
 */
export const setPurpleTheme = () => {
  const purpleBtn = document.querySelector('#purple')
  if (purpleBtn) {
    purpleBtn.addEventListener('click', () => {
      theme('purple')
    })
  }
}

/*
 * fn:绑定天青色主题按钮
 * des:给 #cyan 按钮绑定点击事件，点击后切换为天青色主题
 * type:public
 * param:无
 * return：无
 */
export const setCyanTheme = () => {
  const cyanBtn = document.querySelector('#cyan')
  if (cyanBtn) {
    cyanBtn.addEventListener('click', () => {
      theme('cyan')
    })
  }
}

/*
 * fn:初始化主题
 * des:读取本地存储的主题，缺失时使用默认主题，并应用到 body
 * type:public
 * param:无
 * return：无
 */
export const initTheme = () => {
  const store = localStorage.getItem('theme') ?? DEFAULT_THEME
  theme(store as Theme)
  console.info('[INFO]:主题初始化成功')
}

/* ====================<layout>==================== */
type Layout = 'default' | 'card'
/*
 * fn:设置布局
 * des:移除 body 上已有的布局类，写入新布局并持久化到本地存储
 * type:private
 * param:layout 布局名：default / card
 * return：无
 */
const layout = (layout: Layout) => {
  const body = document.body
  body.classList.remove('card', 'default')
  body.classList.add(layout)
  localStorage.setItem('layout', layout)
  console.info(`[INFO]:布局设置成功,当前布局为${layout}`)
}

/*
 * fn:绑定默认布局按钮
 * des:给 #default 按钮绑定点击事件，点击后切换为默认布局
 * type:public
 * param:无
 * return：无
 */
export const setDefaultLayout = () => {
  const defaultBtn = document.querySelector('#default')
  if (defaultBtn) {
    defaultBtn.addEventListener('click', () => {
      layout('default')
    })
  }
}

/*
 * fn:绑定卡片布局按钮
 * des:给 #card 按钮绑定点击事件，点击后切换为卡片布局
 * type:public
 * param:无
 * return：无
 */
export const setCardLayout = () => {
  const cardBtn = document.querySelector('#card')
  if (cardBtn) {
    cardBtn.addEventListener('click', () => {
      layout('card')
    })
  }
}

/*
 * fn:初始化布局
 * des:读取本地存储的布局，缺失时使用默认布局，并应用到 body
 * type:public
 * param:无
 * return：无
 */
export const initLayout = () => {
  const store = localStorage.getItem('layout') ?? DEFAULT_LAYOUT
  layout(store as Layout)
  console.info('[INFO]:布局初始化成功')
}

/* ====================<bg>==================== */
type Bg = 'img' | 'video'
/*
 * fn:设置背景
 * des:图片背景移除视频元素并给 body 加 bg-img 类；视频背景创建静音循环视频并挂载到 body
 * type:private
 * param:bg 背景类型：img / video
 * return：无
 */
const bg = (bg: Bg) => {
  const body = document.body
  if (bg === 'img') {
    document.querySelector('.bg-video')?.remove()
    body.classList.add('bg-img')

    localStorage.setItem('bg', 'img')
    console.info('[INFO]:背景已设置为图片')
  } else if (bg === 'video') {
    const video = document.createElement('video')
    body.classList.remove('bg-img')

    video.className = 'bg-video'
    video.src = bgVideoSrc
    video.autoplay = true
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.load()
    video.play()
    document.body.appendChild(video)

    localStorage.setItem('bg', 'video')
    console.info('[INFO]:背景已设置为视频')
  }
}

/*
 * fn:绑定图片背景按钮
 * des:给 #img 按钮绑定点击事件，点击后切换为图片背景
 * type:public
 * param:无
 * return：无
 */
export const setImgBg = () => {
  const imgBtn = document.querySelector<HTMLButtonElement>('#img')
  if (imgBtn) {
    imgBtn.addEventListener('click', () => {
      bg('img')
    })
  }
}

/*
 * fn:绑定视频背景按钮
 * des:给 #video 按钮绑定点击事件，点击后切换为视频背景
 * type:public
 * param:无
 * return：无
 */
export const setVideoBg = () => {
  const videoBtn = document.querySelector('#video')
  if (videoBtn) {
    videoBtn.addEventListener('click', () => {
      bg('video')
    })
  }
}

/*
 * fn:初始化背景
 * des:读取本地存储的背景类型，缺失时使用默认背景，并应用到页面
 * type:public
 * param:无
 * return：无
 */
export const initBg = () => {
  const store = localStorage.getItem('bg') ?? DEFAULT_BG
  bg(store as Bg)
  console.log('[INFO]:背景已成功初始化')
}

/* ====================<opacity>==================== */
/*
 * fn:应用透明度
 * des:读取滑块当前值，写入 CSS 变量 --glass-opacity 并持久化到本地存储
 * type:private
 * param:无
 * return：无
 */
const opacity = () => {
  const opacityInput = document.querySelector<HTMLInputElement>('.opacity-input')!
  document.documentElement.style.setProperty('--glass-opacity', String(opacityInput.value))
  localStorage.setItem('opacity', String(opacityInput.value))
  console.info('[INFO]:透明度修改成功')
}
/*
 * fn:绑定透明度滑块
 * des:给 .opacity-input 滑块绑定 input 事件，拖动时实时应用透明度
 * type:public
 * param:无
 * return：无
 */
export const setOpacity = () => {
  const opacityInput = document.querySelector<HTMLInputElement>('.opacity-input')
  if (opacityInput) {
    opacityInput.addEventListener('input', () => {
      opacity()
    })
  }
}

/*
 * fn:初始化透明度
 * des:读取本地存储的透明度回填滑块，并应用到 CSS 变量
 * type:public
 * param:无
 * return：无
 */
export const initOpacity = () => {
  const opacityInput = document.querySelector<HTMLInputElement>('.opacity-input')
  if (opacityInput) {
    opacityInput.value = localStorage.getItem('opacity') ?? DEFAULT_OPACITY
    opacity()
  }
}
