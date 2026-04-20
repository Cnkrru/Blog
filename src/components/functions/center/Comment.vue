<script setup>
import { onMounted, onUnmounted } from 'vue'

const getGiscusThemeUrl = () => {
  if (typeof document !== 'undefined') {
    const isDark = document.body.classList.contains('dark-theme')
    const baseUrl = 'https://pub-b8c25e855b194f5aa9d5e32789ca6f9d.r2.dev'
    return isDark 
      ? `${baseUrl}/comment-dark.css` 
      : `${baseUrl}/comment-light.css`
  }
  return 'https://pub-b8c25e855b194f5aa9d5e32789ca6f9d.r2.dev/comment-light.css'
}

const initCommentSystem = () => {
  if (typeof document !== 'undefined') {
    const commentContainers = document.querySelectorAll('.comment-container')
    
    commentContainers.forEach(container => {
      // 避免重复注入
      if (container.querySelector('script[src*="giscus"]')) return

      const giscusScript = document.createElement('script')
      giscusScript.src = 'https://giscus.app/client.js'
      giscusScript.setAttribute('data-repo', 'Cnkrru/Blog')
      giscusScript.setAttribute('data-repo-id', 'R_kgDORzTTCQ')
      giscusScript.setAttribute('data-category', 'Announcements')
      giscusScript.setAttribute('data-category-id', 'DIC_kwDORzTTCc4C5e-m')
      giscusScript.setAttribute('data-mapping', 'pathname')
      giscusScript.setAttribute('data-strict', '0')
      giscusScript.setAttribute('data-reactions-enabled', '1')
      giscusScript.setAttribute('data-emit-metadata', '0')
      giscusScript.setAttribute('data-input-position', 'bottom')
      giscusScript.setAttribute('data-theme', getGiscusThemeUrl())
      giscusScript.setAttribute('data-lang', 'zh-CN')
      giscusScript.setAttribute('crossorigin', 'anonymous')
      giscusScript.setAttribute('async', '')
      
      container.appendChild(giscusScript)
    })
  }
}

const updateGiscusTheme = () => {
  if (typeof document !== 'undefined') {
    const iframe = document.querySelector('iframe.giscus-frame')
    if (iframe) {
      const newThemeUrl = getGiscusThemeUrl()
      iframe.contentWindow.postMessage({
        giscus: {
          setConfig: {
            theme: newThemeUrl
          }
        }
      }, 'https://giscus.app')
    }
  }
}

onMounted(() => {
  initCommentSystem()
  if (typeof window !== 'undefined') {
    window.updateGiscusTheme = updateGiscusTheme
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    delete window.updateGiscusTheme
  }
})
</script>

<template>
    <div class="comment-section">
        <h3>评论</h3>
        <div class="comment-container"></div>
    </div>
</template>

<style scoped>
/*==============================评论区域样式==============================*/

/* 评论区域容器 */
.comment-section {
    margin-top: 2rem;
    padding: 1.5rem;
    background-color: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

/* 评论标题 */
.comment-section h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
    font-size: 1.2rem;
    font-weight: 600;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
}

/* 评论容器 */
.comment-container {
    width: 100%;
    min-height: 300px;
    border-radius: 6px;
    overflow: hidden;
    background-color: transparent;
}

/* 确保 Giscus iframe 自适应 */
.comment-container iframe {
    width: 100% !important;
    min-height: 400px;
    border: none;
}

/*==============================响应式设计查询=============================*/
/* 超小屏手机76px) */
@media (max-width: 575.98px) {
    .comment-section {
        margin-top: 1rem;
        padding: 1rem;
    }
    
    .comment-section h3 {
        font-size: 1.1rem;
    }
    
    .comment-container iframe {
        min-height: 300px;
    }
}

/* 小屏手机横屏及以上 (76px) */
@media (min-width: 576px) {
    /* 保持现有样式 */
}

/* 平板及以上 (768px) */
@media (min-width: 768px) {
    /* 恢复桌面布局 */
    .comment-section {
        margin-top: 2rem;
        padding: 1.5rem;
    }
    
    .comment-section h3 {
        font-size: 1.2rem;
    }
    
    .comment-container iframe {
        min-height: 400px;
    }
}
</style>
