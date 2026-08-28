<script setup>
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useThemeStore } from '../../stores'
import giscusBaseCss from '@/assets/css/giscus-base.css?raw'
import inkDarkCss from '@/assets/css/comment/ink-dark.css?raw'
import inkLightCss from '@/assets/css/comment/ink-light.css?raw'
import sakuraDarkCss from '@/assets/css/comment/sakura-dark.css?raw'
import sakuraLightCss from '@/assets/css/comment/sakura-light.css?raw'
import purpleDarkCss from '@/assets/css/comment/purple-dark.css?raw'
import purpleLightCss from '@/assets/css/comment/purple-light.css?raw'
import cyanDarkCss from '@/assets/css/comment/cyan-dark.css?raw'
import cyanLightCss from '@/assets/css/comment/cyan-light.css?raw'

const themeStore = useThemeStore()

// ---- 原 comment store 逻辑内联（仅本组件消费 + giscus 主题映射）----
const themeCssMap = {
  'ink-dark': inkDarkCss,
  'ink-light': inkLightCss,
  'sakura-dark': sakuraDarkCss,
  'sakura-light': sakuraLightCss,
  'purple-dark': purpleDarkCss,
  'purple-light': purpleLightCss,
  'cyan-dark': cyanDarkCss,
  'cyan-light': cyanLightCss,
}

function getGiscusThemeUrl() {
  const isDark = themeStore.isDark
  const style = themeStore.currentStyle
  const key = `${style}-${isDark ? 'dark' : 'light'}`
  const vars = themeCssMap[key] || inkDarkCss
  const fullCss = `${vars}\n\n${giscusBaseCss}`
  return `data:text/css;charset=utf-8,${encodeURIComponent(fullCss)}`
}

const commentLoaded = ref(false)
const commentEnabled = ref(true)

const setCommentLoaded = (loaded) => { commentLoaded.value = loaded }

const updateGiscusTheme = (_theme) => {
  const themeUrl = getGiscusThemeUrl()
  const giscusFrame = document.querySelector('iframe.giscus-frame')
  if (giscusFrame?.contentWindow) {
    giscusFrame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: themeUrl } } },
      'https://giscus.app'
    )
  }
}

const initCommentSystem = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const existing = document.querySelector('.giscus, script[src*="giscus"]')
  if (existing) return

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'Cnkrru/Blog')
  script.setAttribute('data-repo-id', '')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', '')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', getGiscusThemeUrl())
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  const container = document.querySelector('.comment-container')
  if (container) container.appendChild(script)
}

const savePreference = () => {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem('comment_enabled', commentEnabled.value.toString())
  } catch (e) {
    console.warn('[comment] 保存评论偏好失败:', e)
  }
}

const loadPreference = () => {
  if (typeof localStorage === 'undefined') return
  try {
    const saved = localStorage.getItem('comment_enabled')
    if (saved !== null) commentEnabled.value = saved === 'true'
  } catch (e) {
    console.warn('[comment] 加载评论偏好失败:', e)
  }
}

const isLoading = ref(false)
const isLoaded = computed(() => commentLoaded)

// 监听主题和风格变化，同步更新 Giscus 评论样式
watch([() => themeStore.isDark, () => themeStore.currentStyle], () => {
  updateGiscusTheme('')
})

onMounted(() => {
  loadPreference()
  initCommentSystem()

  if (typeof window !== 'undefined') {
    window.updateGiscusTheme = updateGiscusTheme
  }

  setTimeout(() => {
    isLoading.value = false
    setCommentLoaded(true)
  }, 1500)
})

onUnmounted(() => {
  // 清理全局方法
  if (typeof window !== 'undefined') {
    delete window.updateGiscusTheme
  }
})
</script>

<template>
    <div class="comment-section">
        <div class="comment-header">
            <h3>评论</h3>
        </div>
        <p class="comment-hint"> 想说点什么呢……</p>
        <div class="comment-content">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <span class="loading-text">加载评论中...</span>
            </div>

            <!-- 评论容器 -->
            <div v-else class="comment-container"></div>
        </div>
    </div>
</template>

<style scoped>
/* ===== 评论区域容器 ===== */
.comment-section {
    margin-top: 1.5rem;
    padding: 16px;
    border-radius: 12px;
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
    border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

/* 评论标题 */
.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

.comment-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--common-text);
}

.comment-hint {
    text-align: center;
    font-size: 14px;
    color: var(--common-color-1);
    margin-bottom: 12px;
    font-style: italic;
}

/* 评论内容 */
.comment-content {
    position: relative;
    min-height: 300px;
}

/* 加载状态 */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 12px;
    animation: fadeIn 0.3s ease;
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid var(--common-hover);
    border-top-color: var(--common-color-1);
    border-radius: 50%;
}

.loading-text {
    font-size: 14px;
    font-weight: 500;
    color: var(--common-text);
}

/* 评论容器 */
.comment-container {
    width: 100%;
    min-height: 300px;
    border-radius: 6px;
    overflow: hidden;
    background-color: transparent;
    animation: fadeIn 0.3s ease;
}

/* 确保 Giscus iframe 自适应 */
.comment-container iframe {
    width: 100% !important;
    min-height: 400px;
    border: none;
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

/* 动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
    .comment-section {
        margin-top: 1rem;
        padding: 1rem;
    }

    .comment-header h3 {
        font-size: 1.1rem;
    }

    .comment-container iframe {
        min-height: 300px;
    }

    .loading-state {
        min-height: 250px;
    }
}

@media (max-width: 768px) {
    .comment-section {
        margin-top: 2rem;
        padding: 1.5rem;
    }

    .comment-header h3 {
        font-size: 1.2rem;
    }

    .comment-container iframe {
        min-height: 400px;
    }

    .loading-state {
        min-height: 300px;
    }
}
</style>