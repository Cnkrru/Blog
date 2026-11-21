import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'
import type { Platform } from '../../common/type'
import { toastOpen } from './postToast'
/* ====================<share>==================== */
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
    toastOpen('success', `已成功复制${text}`)
    console.info('[INFO]:已复制指定内容')
  } else {
    console.error('[ERR]:复制指定内容失败')
  }
}
