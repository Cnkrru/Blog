<script setup>
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useCommentStore, useThemeStore } from '../../stores'

const commentStore = useCommentStore()
const themeStore = useThemeStore()

const isLoading = computed(() => commentStore.isLoading)
const isLoaded = computed(() => commentStore.isLoaded)
const error = computed(() => commentStore.error)
const commentCount = computed(() => commentStore.commentCount)

// 清理函数
let cleanupObserver = null

// 监听主题变化
watch(() => themeStore.isDark, (isDark) => {
  commentStore.setTheme(isDark)
})

onMounted(() => {
  // 初始化评论系统
  commentStore.initCommentSystem()
  
  // 初始化主题监听
  cleanupObserver = commentStore.init()
  
  // 暴露全局方法
  if (typeof window !== 'undefined') {
    window.updateGiscusTheme = commentStore.updateGiscusTheme
    window.refreshComments = commentStore.refreshComments
  }
  
  // 初始主题设置
  const isDark = themeStore.isDark
  commentStore.setTheme(isDark)
})

onUnmounted(() => {
  // 清理全局方法
  if (typeof window !== 'undefined') {
    delete window.updateGiscusTheme
    delete window.refreshComments
  }
  
  // 清理主题监听
  if (cleanupObserver) {
    cleanupObserver()
  }
})
</script>

<template>
    <div class="comment-section">
        <div class="comment-header">
            <h3>评论</h3>
            <span v-if="commentCount > 0" class="comment-count">{{ commentCount }} 条评论</span>
        </div>
        <div class="comment-content">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <span class="loading-text">加载评论中...</span>
            </div>
            
            <!-- 错误状态 -->
            <div v-else-if="error" class="error-state">
                <div class="error-icon">⚠️</div>
                <span class="error-text">{{ error }}</span>
                <button class="retry-button" @click="commentStore.initCommentSystem">重试</button>
            </div>
            
            <!-- 评论容器 -->
            <div v-else class="comment-container"></div>
        </div>
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.comment-section:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

/* 评论标题 */
.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
}

.comment-header h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.2rem;
    font-weight: 600;
    background: linear-gradient(45deg, var(--accent-color), var(--accent-color-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.comment-count {
    font-size: 0.9rem;
    color: var(--text-color-muted);
    font-weight: 500;
    background: var(--card-bg-secondary);
    padding: 2px 8px;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.comment-count:hover {
    background: var(--accent-color-light);
    color: var(--text-color);
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
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 14px;
    color: var(--text-color-muted);
    font-weight: 500;
}

/* 错误状态 */
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 12px;
    animation: fadeIn 0.3s ease;
    text-align: center;
    padding: 0 20px;
}

.error-icon {
    font-size: 32px;
    margin-bottom: 8px;
}

.error-text {
    font-size: 14px;
    color: var(--error-color);
    font-weight: 500;
    margin-bottom: 16px;
}

.retry-button {
    background-color: var(--button-bg);
    border: 2px solid var(--button-border);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    color: var(--button-text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.retry-button:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--shadow-color);
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
    transition: all 0.3s ease;
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

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* 暗色主题适配 */
:deep(html.dark) .loading-spinner {
    border-color: rgba(255, 255, 255, 0.1);
    border-top-color: var(--accent-color);
}

:deep(html.dark) .error-text {
    color: var(--error-color);
}

/*==============================响应式设计查询=============================*/
/* 超小屏手机76px) */
@media (max-width: 575.98px) {
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
    
    .loading-state,
    .error-state {
        min-height: 250px;
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
    
    .comment-header h3 {
        font-size: 1.2rem;
    }
    
    .comment-container iframe {
        min-height: 400px;
    }
    
    .loading-state,
    .error-state {
        min-height: 300px;
    }
}
</style>
