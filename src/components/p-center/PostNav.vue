<script setup>
import { defineProps, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useScrollStore } from '../../stores'

const { t } = useI18n()

const props = defineProps({
  prevPost: {
    type: Object,
    default: null
  },
  nextPost: {
    type: Object,
    default: null
  }
})

const router = useRouter()
const scrollStore = useScrollStore()
const loading = ref(false)
const scrollProgress = ref(0)

const isScrollTopVisible = computed(() => scrollStore.isScrollTopVisible)

const navigateToPost = async (postId) => {
  if (loading.value) return
  
  loading.value = true
  try {
    await router.push(`/post/${postId}`)
  } finally {
    loading.value = false
  }
}

const handleScrollToTop = () => {
  scrollStore.scrollToTop()
}

const updateScrollProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = (scrollTop / docHeight) * 100
  scrollProgress.value = Math.min(100, Math.max(0, progress))
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft' && props.prevPost) {
    navigateToPost(props.prevPost.id)
  } else if (e.key === 'ArrowRight' && props.nextPost) {
    navigateToPost(props.nextPost.id)
  } else if (e.key === 'Home') {
    e.preventDefault()
    handleScrollToTop()
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress)
  window.addEventListener('keydown', handleKeydown)
  updateScrollProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="post-nav-container">
    <!-- 回到顶部按钮 -->
    <button 
      v-if="isScrollTopVisible" 
      @click="handleScrollToTop" 
      class="scroll-top-btn"
      aria-label="回到顶部"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20">
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
    </button>
    
    <!-- 文章进度条 -->
    <div class="scroll-progress-bar" :style="{ width: `${scrollProgress}%` }"></div>
    
    <!-- 上一篇导航 -->
    <div 
      @click="navigateToPost(prevPost.id)" 
      v-if="prevPost" 
      class="post-nav-btn prev"
      :class="{ loading: loading }"
      tabindex="0"
      @keydown.enter="navigateToPost(prevPost.id)"
      @keydown.space="navigateToPost(prevPost.id)"
    >
      <div class="post-nav-btn-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </div>
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">{{ t('previous') }}</span>
        <span class="post-nav-btn-title">{{ prevPost?.title || '暂无' }}</span>
      </div>
      <div v-if="loading" class="post-nav-loading"></div>
    </div>
    <div v-else class="post-nav-btn prev disabled">
      <div class="post-nav-btn-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </div>
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">{{ t('previous') }}</span>
        <span class="post-nav-btn-title">暂无</span>
      </div>
    </div>
    
    <!-- 下一篇导航 -->
    <div 
      @click="navigateToPost(nextPost.id)" 
      v-if="nextPost" 
      class="post-nav-btn next"
      :class="{ loading: loading }"
      tabindex="0"
      @keydown.enter="navigateToPost(nextPost.id)"
      @keydown.space="navigateToPost(nextPost.id)"
    >
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">{{ t('next') }}</span>
        <span class="post-nav-btn-title">{{ nextPost?.title || '暂无' }}</span>
      </div>
      <div class="post-nav-btn-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </div>
      <div v-if="loading" class="post-nav-loading"></div>
    </div>
    <div v-else class="post-nav-btn next disabled">
      <div class="post-nav-btn-text">
        <span class="post-nav-btn-label">{{ t('next') }}</span>
        <span class="post-nav-btn-title">暂无</span>
      </div>
      <div class="post-nav-btn-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 上下篇导航按钮 */
.post-nav-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin: 30px 0;
}

/* 滚动进度条 */
.scroll-progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background-color: var(--accent-fg);
    z-index: 9999;
    transition: width 0.1s ease;
}

/* 回到顶部按钮 */
.scroll-top-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--button-bg);
    border: 2px solid var(--button-border);
    color: var(--button-text);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 2px 8px var(--shadow-color);
}

.scroll-top-btn:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-4px);
    box-shadow: 0 4px 12px var(--shadow-color);
}

/* 导航按钮 */
.post-nav-btn {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-border-color);
    border-radius: 8px;
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    user-select: none;
}

.post-nav-btn:hover {
    border-color: var(--accent-fg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
}

.post-nav-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.post-nav-btn.disabled:hover {
    border-color: var(--center-card-border-color);
    transform: none;
    box-shadow: none;
}

.post-nav-btn.prev {
    justify-content: flex-start;
    gap: 12px;
}

.post-nav-btn.next {
    justify-content: flex-end;
    gap: 12px;
}

.post-nav-btn-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.post-nav-btn-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
}

.post-nav-btn-label {
    font-size: 12px;
    opacity: 0.8;
    transition: all 0.3s ease;
}

.post-nav-btn-title {
    font-size: 14px;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.3s ease;
}

.post-nav-btn:hover .post-nav-btn-title {
    color: var(--accent-fg);
}

/* 加载状态 */
.post-nav-btn.loading {
    cursor: wait;
}

.post-nav-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* 键盘焦点样式 */
.post-nav-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.3);
}

/*==============================响应式设计查询=============================*/
/* 超小屏手机76px) */
@media (max-width: 575.98px) {
    /* 调整上下篇导航按钮 */
    .post-nav-container {
        flex-direction: column;
        gap: 10px;
    }
    
    .post-nav-btn {
        padding: 12px 15px;
    }
    
    .post-nav-btn-label {
        font-size: 11px;
    }
    
    .post-nav-btn-title {
        font-size: 13px;
    }
    
    .scroll-top-btn {
        bottom: 20px;
        right: 20px;
        width: 36px;
        height: 36px;
    }
}

/* 小屏手机横屏及以上 (76px) */
@media (min-width: 576px) {
    /* 调整上下篇导航按钮 */
    .post-nav-container {
        flex-direction: column;
        gap: 12px;
    }
    
    .post-nav-btn {
        padding: 13px 17px;
    }
    
    .post-nav-btn-label {
        font-size: 11.5px;
    }
    
    .post-nav-btn-title {
        font-size: 13.5px;
    }
}

/* 平板及以上 (768px) */
@media (min-width: 768px) {
    /* 恢复桌面布局 */
    .post-nav-container {
        flex-direction: row;
        gap: 20px;
    }
    
    .post-nav-btn {
        padding: 15px 20px;
    }
    
    .post-nav-btn-label {
        font-size: 12px;
    }
    
    .post-nav-btn-title {
        font-size: 14px;
    }
}

/* 桌面及以上 (1024px) */
@media (min-width: 1024px) {
    .post-nav-btn {
        padding: 16px 24px;
    }
    
    .post-nav-btn-title {
        font-size: 15px;
    }
}
</style>
