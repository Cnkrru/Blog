<script setup>
import { onMounted, onUnmounted, computed, ref, watch } from 'vue'
import { useCommentStore, useThemeStore } from '../../stores'
import alertTriangleSvg from '@/assets/svg/alert-triangle.svg?raw'

const commentStore = useCommentStore()
const themeStore = useThemeStore()

const isLoading = ref(false)
const isLoaded = computed(() => commentStore.commentLoaded)
const error = ref(null)
const commentCount = computed(() => commentStore.commentCount)

// 监听主题和风格变化，同步更新 Giscus 评论样式
watch([() => themeStore.isDark, () => themeStore.currentStyle], () => {
  commentStore.updateGiscusTheme('')
})

onMounted(() => {
  commentStore.loadPreference()
  commentStore.initCommentSystem()

  if (typeof window !== 'undefined') {
    window.updateGiscusTheme = commentStore.updateGiscusTheme
  }

  setTimeout(() => {
    isLoading.value = false
    commentStore.setCommentLoaded(true)
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
            <span v-if="commentCount > 0" class="comment-count">{{ commentCount }} 条评论</span>
        </div>
        <p class="comment-hint"> 想说点什么呢……</p>
        <div class="comment-content">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <span class="loading-text">加载评论中...</span>
            </div>
            
            <!-- 错误状态 -->
            <div v-else-if="error" class="error-state">
                <div class="error-icon"><span class="svg-icon" :style="{ width: '32px', height: '32px' }" v-html="alertTriangleSvg"></span></div>
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
    margin-top: 1.5rem;
    padding: 16px;
    border-radius: 12px;
}

/* 评论标题 */
.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid;
}

.comment-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
}

.comment-count {
    font-size: 12px;
    font-weight: 500;
    padding: 2px 10px;
    border-radius: 12px;
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

</style>

<style scoped>
/* 评论区域颜色 */
.comment-section {
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
    border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

/* 评论标题 */
.comment-header {
    border-bottom-color: color-mix(in srgb, var(--common-text) 8%, transparent);
}

.comment-header h3 {
    color: var(--common-text);
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
