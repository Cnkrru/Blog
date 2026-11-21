import type { Level } from '../../common/type'
/* ====================<toast>==================== */
const toastIconMap: Record<Level, string> = {
  success:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4 9.4 24.6 9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
  warning:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
  error:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4-9.4-24.6-9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>',
}
// 关闭图标
const xIcon: string =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
let toastTimer: ReturnType<typeof setTimeout> | null = null

export const toastOpen = (level: Level, mes: string) => {
  let toast = document.querySelector<HTMLElement>('.toast-box')
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
    closeButton.title = '关闭提示'
    closeButton.innerHTML = xIcon
    closeButton.addEventListener('click', () => toastClose())

    toast.append(icon, message, closeButton)
    document.body.appendChild(toast)
  }

  icon.innerHTML = toastIconMap[level]
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
