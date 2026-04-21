<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeStore } from '../../stores'

const route = useRoute()
const themeStore = useThemeStore()
const qrUrl = ref('')
const isLoading = ref(false)
const isWechatShareOpen = ref(false)

const isDarkTheme = computed(() => themeStore.isDark)

const getShareInfo = () => {
  const title = document.querySelector('.center-head-card h2')?.textContent || document.title
  const url = window.location.href
  const description = '来看看这篇文章吧'
  return { title, url, description }
}

const showToast = (message, type = 'success') => {
  const toast = document.createElement('div')
  toast.className = `share-toast ${type}`
  toast.innerHTML = `
    <span class="toast-icon">
      ${type === 'success' 
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
      }
    </span>
    <span class="toast-message">${message}</span>
  `
  document.body.appendChild(toast)
  
  requestAnimationFrame(() => {
    toast.classList.add('show')
  })

  setTimeout(() => {
    toast.classList.remove('show')
    toast.classList.add('hide')
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 2000)
}

const generateQRCode = async () => {
  try {
    isLoading.value = true
    const url = window.location.href
    qrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
    await new Promise(resolve => setTimeout(resolve, 500))
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  } finally {
    isLoading.value = false
  }
}

const shareToWechat = async () => {
  if (isWechatShareOpen.value) return
  
  isWechatShareOpen.value = true
  const { title } = getShareInfo()
  
  await generateQRCode()
  
  const wechatShare = document.createElement('div')
  wechatShare.className = 'wechat-share-modal'
  wechatShare.innerHTML = `
    <div class="wechat-share-content">
      <h3 class="wechat-share-title">微信分享</h3>
      <p class="wechat-share-desc">扫描二维码分享到微信</p>
      <div class="wechat-share-qr">
        ${isLoading.value 
          ? '<div class="qr-loading"><div class="loading-spinner"></div><span>生成中...</span></div>' 
          : `<img src="${qrUrl.value}" alt="分享二维码" class="qr-image" />`
        }
      </div>
      <p class="wechat-share-article-title">文章：${title}</p>
      <button class="wechat-share-close">关闭</button>
    </div>
  `
  document.body.appendChild(wechatShare)
  
  requestAnimationFrame(() => {
    wechatShare.classList.add('show')
  })
  
  wechatShare.querySelector('.wechat-share-close').addEventListener('click', closeWechatShare)
  wechatShare.addEventListener('click', (e) => {
    if (e.target === wechatShare) {
      closeWechatShare()
    }
  })
}

const closeWechatShare = () => {
  const wechatShare = document.querySelector('.wechat-share-modal')
  if (wechatShare) {
    wechatShare.classList.remove('show')
    wechatShare.classList.add('hide')
    setTimeout(() => {
      if (document.body.contains(wechatShare)) {
        document.body.removeChild(wechatShare)
      }
      isWechatShareOpen.value = false
    }, 300)
  }
}

const shareToQQ = () => {
  const { title, url, description } = getShareInfo()
  const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}`
  window.open(shareUrl, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  const { url } = getShareInfo()
  try {
    await navigator.clipboard.writeText(url)
    showToast('链接已复制到剪贴板！', 'success')
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = url
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast(success ? '链接已复制到剪贴板！' : '复制失败，请手动复制', success ? 'success' : 'error')
  }
}

onMounted(() => {
  const style = document.createElement('style')
  style.id = 'share-toast-styles'
  style.textContent = `
    .share-toast {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      background-color: var(--card-bg);
      color: var(--text-color);
      padding: 16px 32px;
      border-radius: 12px;
      box-shadow: 0 8px 32px var(--shadow-color);
      z-index: 10000;
      font-size: 14px;
      border: 2px solid var(--center-card-border-color);
      display: flex;
      align-items: center;
      gap: 12px;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    .share-toast.show {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    .share-toast.hide {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    .share-toast.success {
      border-color: #10b981;
    }
    .share-toast.error {
      border-color: #ef4444;
    }
    .toast-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    .toast-icon svg {
      width: 100%;
      height: 100%;
    }
    .share-toast.success .toast-icon {
      color: #10b981;
    }
    .share-toast.error .toast-icon {
      color: #ef4444;
    }
    .wechat-share-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .wechat-share-modal.show {
      opacity: 1;
    }
    .wechat-share-modal.hide {
      opacity: 0;
    }
    .wechat-share-content {
      background: white;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      max-width: 90%;
      width: 320px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: scale(0.9);
      transition: transform 0.3s ease;
    }
    .wechat-share-modal.show .wechat-share-content {
      transform: scale(1);
    }
    .wechat-share-title {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 20px;
      font-weight: bold;
    }
    .wechat-share-desc {
      color: #666;
      margin: 0 0 20px 0;
      font-size: 14px;
    }
    .wechat-share-qr {
      margin: 0 auto 20px;
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f8f8;
      border-radius: 8px;
    }
    .qr-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: #666;
      font-size: 14px;
    }
    .qr-loading .loading-spinner {
      width: 30px;
      height: 30px;
      border: 3px solid #e0e0e0;
      border-top-color: #07c160;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .qr-image {
      width: 200px;
      height: 200px;
      border-radius: 8px;
    }
    .wechat-share-article-title {
      color: #333;
      font-size: 14px;
      margin: 0 0 20px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .wechat-share-close {
      padding: 12px 32px;
      background: #07c160;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .wechat-share-close:hover {
      background: #06a854;
      transform: translateY(-2px);
    }
    .dark-theme .wechat-share-content {
      background: #1f2937;
    }
    .dark-theme .wechat-share-title {
      color: #f9fafb;
    }
    .dark-theme .wechat-share-desc {
      color: #9ca3af;
    }
    .dark-theme .wechat-share-qr {
      background: #374151;
    }
    .dark-theme .qr-loading {
      color: #9ca3af;
    }
    .dark-theme .qr-loading .loading-spinner {
      border-color: #4b5563;
      border-top-color: #10b981;
    }
    .dark-theme .wechat-share-article-title {
      color: #f9fafb;
    }
    .dark-theme .wechat-share-modal {
      background-color: rgba(0, 0, 0, 0.9);
    }
  `
  document.head.appendChild(style)
})

onUnmounted(() => {
  const style = document.getElementById('share-toast-styles')
  if (style) {
    document.head.removeChild(style)
  }
})
</script>

<template>
  <div class="share-container">
    <div class="share-btn wechat" title="分享到微信" @click="shareToWechat">
      <img src="../../assets/imgs/svg/wechat.svg" alt="微信">
    </div>
    <div class="share-btn qq" title="分享到QQ" @click="shareToQQ">
      <img src="../../assets/imgs/svg/QQ.svg" alt="QQ">
    </div>
    
    <div class="share-btn copy" title="复制链接" @click="copyLink">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* 分享按钮 */
.share-container {
    display: flex;
    align-items: center;
    margin: 30px 0;
}

.share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-right: 15px;
    border-radius: 50%;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-border-color);
    cursor: pointer;
    transition: all 0.3s ease;
}

.share-btn:hover {
    border-color: var(--accent-fg);
    transform: translateY(-2px);
}

.share-btn img {
    width: 20px;
    height: 20px;
}

.share-btn.copy svg {
    width: 20px;
    height: 20px;
    fill: var(--text-color);
}

/*==============================响应式设计媒体查询=============================*/
/* 超小屏手机 (576px) */
@media (max-width: 575.98px) {
    /* 调整分享按钮 */
    .share-container {
        justify-content: center;
    }
    
    .share-btn {
        width: 36px;
        height: 36px;
        margin-right: 10px;
    }
    
    .share-btn img {
        width: 18px;
        height: 18px;
    }
    
    .share-btn.copy svg {
        width: 18px;
        height: 18px;
    }
}

/* 小屏手机横屏 (576px) */
@media (min-width: 576px) {
    /* 调整分享按钮 */
    .share-container {
        justify-content: center;
    }
    
    .share-btn {
        width: 38px;
        height: 38px;
        margin-right: 12px;
    }
    
    .share-btn img {
        width: 19px;
        height: 19px;
    }
    
    .share-btn.copy svg {
        width: 19px;
        height: 19px;
    }
}

/* 平板 (768px) */
@media (min-width: 768px) {
    /* 恢复桌面布局 */
    .share-container {
        justify-content: flex-start;
    }
    
    .share-btn {
        width: 40px;
        height: 40px;
        margin-right: 15px;
    }
    
    .share-btn img {
        width: 20px;
        height: 20px;
    }
    
    .share-btn.copy svg {
        width: 20px;
        height: 20px;
    }
}
</style>
