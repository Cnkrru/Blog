import bgVideoSrc from '@/assets/media/bg.mp4'
import { DEFAULT_THEME, DEFAULT_LAYOUT, DEFAULT_BG, DEFAULT_OPACITY } from '../common/config'

/* ====================<theme>==================== */
type Theme = 'ink' | 'blue' | 'cyan' | 'sakura' | 'purple'
/*
 * fn:设置布局
 * des:
 * type:private
 * param:无
 * return：无
 */
const theme = (theme: Theme) => {
  const blueBtn = document.querySelector('#blue')
  const inkBtn = document.querySelector('#ink')
  const sakuraBtn = document.querySelector('#sakura')
  const purpleBtn = document.querySelector('#purple')
  const cyanBtn = document.querySelector('#cyan')
  const body = document.body
  const lastTheme = localStorage.getItem('theme')
  body.classList.remove(String(lastTheme))
  body.classList.add(theme)
  localStorage.setItem('theme', theme)
  console.info(`[INFO]:主题设置成功,当前主题为${theme}`)
  if (blueBtn && inkBtn && sakuraBtn && purpleBtn && cyanBtn) {
    if (lastTheme === 'blue') blueBtn.classList.remove('btn-on')
    if (lastTheme === 'ink') inkBtn.classList.remove('btn-on')
    if (lastTheme === 'sakura') sakuraBtn.classList.remove('btn-on')
    if (lastTheme === 'purple') purpleBtn.classList.remove('btn-on')
    if (lastTheme === 'cyan') cyanBtn.classList.remove('btn-on')
    if (theme === 'blue') blueBtn.classList.add('btn-on')
    if (theme === 'ink') inkBtn.classList.add('btn-on')
    if (theme === 'sakura') sakuraBtn.classList.add('btn-on')
    if (theme === 'purple') purpleBtn.classList.add('btn-on')
    if (theme === 'cyan') cyanBtn.classList.add('btn-on')
  }
}

/*
 * fn:将布局改为默认
 * des:
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
 * fn:将布局改为默认
 * des:
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
 * fn:将布局改为默认
 * des:
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
 * fn:将布局改为默认
 * des:
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
 * fn:将布局改为默认
 * des:
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
 * fn:将布局改为默认
 * des:
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
/*
 * fn:设置布局
 * des:
 * type:private
 * param:无
 * return：无
 */
const layout = (layoutMode: string) => {
  const defaultBtn = document.querySelector('#default')
  const cardBtn = document.querySelector('#card')
  const body = document.body
  body.classList.remove('card', 'default')
  body.classList.add(layoutMode)
  localStorage.setItem('layout', layoutMode)
  console.info(`[INFO]:布局设置成功,当前布局为${layoutMode}`)
  if (defaultBtn && cardBtn) {
    if (layoutMode === 'default') {
      cardBtn.classList.remove('btn-on')
      defaultBtn.classList.add('btn-on')
    } else if (layoutMode === 'card') {
      defaultBtn.classList.remove('btn-on')
      cardBtn.classList.add('btn-on')
    }
  }
}

/*
 * fn:将布局改为默认
 * des:
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
 * fn:将布局改为card
 * des:
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
 * des:
 * type:public
 * param:无
 * return：无
 */
export const initLayout = () => {
  const store = localStorage.getItem('layout') ?? DEFAULT_LAYOUT
  layout(String(store))
  console.info('[INFO]:布局初始化成功')
}

/* ====================<bg>==================== */

/*
 * fn:将背景改为图片
 * des:
 * type:private
 * param:无
 * return：无
 */
const bg = (bg: string) => {
  const imgBtn = document.querySelector<HTMLButtonElement>('#img')
  const videoBtn = document.querySelector('#video')
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
  if (imgBtn && videoBtn) {
    if (bg === 'img') {
      videoBtn.classList.remove('btn-on')
      imgBtn.classList.add('btn-on')
    } else if (bg === 'video') {
      imgBtn.classList.remove('btn-on')
      videoBtn.classList.add('btn-on')
    }
  }
}

/*
 * fn:给切换背景为图片的按钮绑定事件
 * des:
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
 * fn:设置视频背景
 * des:
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
 * fn:背景初始化
 * des:
 * type:public
 * param:无
 * return：无
 */
export const initBg = () => {
  const store = localStorage.getItem('bg') ?? DEFAULT_BG
  bg(store)
}

/* ====================<opacity>==================== */
/*
 * fn:透明度修改
 * des:
 * type:private
 * param:无
 * return：无
 */
const opacity = () => {
  const opacityInput = document.querySelector<HTMLInputElement>('.opacity-input')
  if (opacityInput) {
    document.documentElement.style.setProperty('--glass-opacity', String(opacityInput.value))
    localStorage.setItem('opacity', String(opacityInput.value))
    console.info('[INFO]:透明度修改成功')
  }
}
/*
 * fn:透明度设置
 * des:
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
 * fn:透明度初始化
 * des:
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
