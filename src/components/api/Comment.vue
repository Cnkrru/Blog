<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useCommentStore, useThemeStore } from '../../stores'

const commentStore = useCommentStore()
const themeStore = useThemeStore()

const isLoading = ref(false)
const isLoaded = computed(() => commentStore.commentLoaded)
const error = ref<string | null>(null)
const commentCount = computed(() => commentStore.commentCount)

// 监听主题变化
watch(() => themeStore.isDark, (isDark) => {
  const theme = isDark ? 'dark' : 'light'
  commentStore.updateGiscusTheme(theme)
})

onMounted(() => {
  // 加载评论偏好设置
  commentStore.loadPreference()
  
  // 暴露全局方法
  if (typeof window !== 'undefined') {
    window.updateGiscusTheme = commentStore.updateGiscusTheme
  }
  
  // 初始主题设置
  const isDark = themeStore.isDark
  const theme = isDark ? 'dark' : 'light'
  commentStore.updateGiscusTheme(theme)
  
  // 标记评论已加载
  setTimeout(() => {
    isLoading.value = false
    commentStore.setCommentLoaded(true)
  }, 1000)
})

onUnmounted(() => {
  // 清理全局方法
  if (typeof window !== 'undefined') {
    delete window.updateGiscusTheme
  }
})</script>

<template>
    <div class="comment-section">
        <div class="comment-header">
            <h3>评论</h3>
            <span v-if="commentCount > 0" class="comment-count">{{ commentCount }} 条评论</span>
        </div>
        <p class="comment-hint">想说点什么呢 (´•ω•`)</p>
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
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.comment-section:hover {
    transform: translateY(-2px);
}

/* 评论标题 */
.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid;
}

.comment-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
}

.comment-count {
    font-size: 0.9rem;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    transition: all 0.3s ease;
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
    border: 2px solid;
    border-top-color: inherit;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 14px;
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
    font-weight: 500;
    margin-bottom: 16px;
}

.retry-button {
    border: 2px solid;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.retry-button:hover {
    transform: translateY(-2px);
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
</style>

<style scoped>
/* 评论区域颜色 */
.comment-section {
    background-color: var(--common-bg);
    border: 1px solid var(--common-color-1);
}

/* 评论标题 */
.comment-header {
    border-bottom: 1px solid var(--common-color-1);
}

.comment-header h3 {
    color: var(--common-text);
    background: linear-gradient(45deg, var(--common-color-1), var(--common-color-2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.comment-hint {
    text-align: center;
    font-size: 14px;
    color: var(--common-color-1);
    margin-bottom: 12px;
    font-style: italic;
}

.comment-count {
    color: var(--common-text);
    background: var(--common-hover);
}

.comment-count:hover {
    background: var(--common-color-2);
    color: var(--common-text);
}

/* 加载状态颜色 */
.loading-spinner {
    border-color: var(--common-hover);
    border-top-color: var(--common-color-1);
}

.loading-text {
    color: var(--common-text);
}

/* 错误状态颜色 */
.error-text {
    color: var(--common-color-1);
}

.retry-button {
    background-color: var(--common-bg);
    border-color: var(--common-color-1);
    color: var(--common-text);
}

.retry-button:hover {
    background-color: var(--common-hover);
    box-shadow: 0 4px 8px var(--common-shadow);
}

/* 暗色主题适配 */
:deep(html.dark) .loading-spinner {
    border-color: rgba(255, 255, 255, 0.1);
    border-top-color: var(--common-color-1);
}

:deep(html.dark) .error-text {
    color: var(--common-color-1);
}
</style>

<style scoped>
/*==============================响应式设计查询=============================*/
/* 超小屏手机 */
@media (max-width: 639px) {
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

/* 小屏手机横屏及以下 */
@media (max-width: 640px) {
    /* 保持现有样式 */
}

/* 平板及以下 */
@media (max-width: 768px) {
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
