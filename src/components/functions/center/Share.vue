<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const qrUrl = ref('')

const getShareInfo = () => {
  const title = document.querySelector('.center-head-card h2')?.textContent || document.title
  const url = window.location.href
  const description = '来看看这篇文章吧'
  return { title, url, description }
}

const showToast = (message) => {
  const toast = document.createElement('div')
  toast.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--card-bg);
    color: var(--text-color);
    padding: 16px 32px;
    border-radius: 8px;
    box-shadow: 0 4px 12px var(--shadow-color);
    z-index: 10000;
    font-size: 14px;
    border: 2px solid var(--button-border);
  `
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease'
    toast.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 2000)
}

// 生成二维码（使用API，不依赖CDN）
const generateQRCode = async () => {
  try {
    const url = window.location.href
    // 使用API生成二维码
    qrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  } catch (error) {
    // 静默处理错误
  }
}

const shareToWechat = async () => {
  const { title, url } = getShareInfo()
  
  // 生成二维码
  await generateQRCode()
  
  // 创建微信分享弹窗
  const wechatShare = document.createElement('div')
  wechatShare.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `
  wechatShare.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; max-width: 90%;">
      <h3 style="margin-top: 0; color: #333;">微信分享</h3>
      <p style="color: #666; margin: 10px 0;">扫描二维码分享到微信</p>
      ${qrUrl.value ? `<img src="${qrUrl.value}" alt="分享二维码" style="margin: 20px 0;" />` : '<div style="width: 200px; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; margin: 20px 0;">生成二维码...</div>'}
      <p style="color: #666; margin: 10px 0;">标题：${title}</p>
      <button id="close-wechat-share" style="margin-top: 20px; padding: 10px 30px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer;">关闭</button>
    </div>
  `
  document.body.appendChild(wechatShare)
  
  document.getElementById('close-wechat-share').addEventListener('click', () => {
    document.body.removeChild(wechatShare)
  })
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
    showToast('链接已复制到剪贴板！')
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = url
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast('链接已复制到剪贴板！')
  }
}


</script>

<template>
  <div class="share-container">
    <div class="share-btn wechat" title="分享到微信" @click="shareToWechat">
      <img src="../../../assets/imgs/svg/wechat.svg" alt="微信">
    </div>
    <div class="share-btn qq" title="分享到QQ" @click="shareToQQ">
      <img src="../../../assets/imgs/svg/QQ.svg" alt="QQ">
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
