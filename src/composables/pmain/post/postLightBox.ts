/* ====================<lightbox>==================== */
let lightbox: HTMLDialogElement | null = null

/*
 * id:打开灯箱
 * fn:命中正文图片后把图片地址填入大图并打开，带链接的图片保持原跳转
 */
const onLightboxOpen = (e: MouseEvent) => {
  const img = (e.target as HTMLElement).closest<HTMLImageElement>('.content img')
  if (!img || img.closest('a') || !lightbox) return
  const image = lightbox.querySelector<HTMLImageElement>('.lightbox-img')
  if (!image) return
  image.src = img.src
  image.alt = img.alt
  lightbox.showModal()
}

/*
 * id:关闭灯箱
 * fn:点击大图或遮罩时关闭，Esc 由 dialog 原生处理
 */
const onLightboxClose = () => {
  lightbox?.close()
}

/*
 * id:绑定灯箱
 * fn:首次调用时创建 dialog 挂到 body，并给 document 与 dialog 分别绑定打开、关闭事件
 */
let lightboxReady = false
export const lightboxBind = () => {
  if (lightboxReady) return
  lightboxReady = true

  lightbox = document.createElement('dialog')
  lightbox.className = 'lightbox'
  lightbox.setAttribute('aria-label', '图片预览')
  const image = document.createElement('img')
  image.className = 'lightbox-img'
  lightbox.appendChild(image)
  document.body.appendChild(lightbox)

  document.addEventListener('click', onLightboxOpen)
  lightbox.addEventListener('click', onLightboxClose)
}
