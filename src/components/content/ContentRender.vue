<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import MarkdownRender from './MarkdownRender.vue'
import { useContentLoader } from '../../utils/useContentLoader'
import { useArticlesStore } from '../../stores'

const props = defineProps<{
  id: string
  type: 'post' | 'project'
}>()

const emit = defineEmits<{
  'content-loaded': [content: any]
  'loading': [loading: boolean]
  'error': [error: string]
  'prev-next-posts': [prev: any, next: any]
  'update:toc': [toc: any]
}>()

// 使用 content loader
const { content, markdownContent, loading, error: hasError, isLoaded, loadContent, retry } = useContentLoader(props.type, props.id)

const articlesStore = useArticlesStore()
const loadedContent = computed(() => content.value)
const error = computed(() => hasError.value ? hasError.value : null)

// 加载上下篇（仅文章需要）
const loadPrevNextPosts = async () => {
  if (props.type === 'post') {
    try {
      const searchData = await articlesStore.fetchArticles()
      // 先按 ID 排序，排除 changelog
      const sortedPosts = searchData
        .filter(item => item.id !== 'changelog')
        .sort((a, b) => {
          const idA = isNaN(parseInt(a.id)) ? a.id : parseInt(a.id)
          const idB = isNaN(parseInt(b.id)) ? b.id : parseInt(b.id)
          if (typeof idA === 'number' && typeof idB === 'number') {
            return idA - idB
          } else {
            return String(a.id).localeCompare(String(b.id))
          }
        })
      const postIndex = sortedPosts.findIndex(item => item.id === props.id)
      const prevPost = postIndex > 0 ? sortedPosts[postIndex - 1] : null
      const nextPost = postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : null
      emit('prev-next-posts', { prevPost, nextPost })
    } catch (err) {
      console.error('Failed to load prev/next posts:', err)
    }
  }
}

const loadContentData = async () => {
  emit('loading', true)
  await loadContent()
  if (isLoaded.value) {
    emit('content-loaded', loadedContent.value)
    if (props.type === 'post') {
      await loadPrevNextPosts()
    }
  } else if (error.value) {
    emit('error', error.value)
  }
  emit('loading', false)
}

onMounted(() => loadContentData())

// 监听 ID 变化
watch(() => props.id, () => loadContentData())

// 监听类型变化
watch(() => props.type, () => loadContentData())
</script>

<template>
  <div class="content-loader">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-message">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button class="retry-button" @click="retry">重试</button>
    </div>
    
    <!-- 内容状态 -->
    <div v-else-if="loadedContent" class="content-container">
      <div class="text-style">
        <!-- 项目信息（仅项目需要） -->
        <template v-if="type === 'project'">
          <p>项目名称：{{ loadedContent.name }}</p>
          <p>分类：{{ loadedContent.category }}</p>
          <p>编号：{{ loadedContent.id }}</p>
          <hr>
          <p>项目描述：{{ loadedContent.description }}</p>
          <hr>
        </template>
        
        <!-- Markdown 内容 -->
        <MarkdownRender 
          :content="markdownContent" 
          @update:toc="(toc) => emit('update:toc', toc)" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-loader {
  width: 100%;
  min-height: 300px;
}

/* 加载状态 */
.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px 20px;
  min-height: 300px;
  gap: 16px;
  animation: fadeIn 0.3s ease;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-message p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

/* 错误状态 */
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px 20px;
  min-height: 300px;
  gap: 16px;
  animation: fadeIn 0.3s ease;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.error-message p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  max-width: 400px;
}

.retry-button {
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  margin-top: 8px;
}

.retry-button:hover {
  transform: translateY(-2px);
}

/* 内容状态 */
.content-container {
  width: 100%;
  animation: fadeIn 0.3s ease;
}

.content-container p {
  margin: 8px 0;
  line-height: 1.5;
}

.content-container hr {
  margin: 16px 0;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
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
/* 颜色样式 */
.loading-message {
  color: var(--common-text);
}

.loading-spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--common-color-1);
}

/* 错误状态颜色 */
.error-message {
  color: var(--common-color-1);
}

/* 重试按钮颜色 */
.retry-button {
  background-color: var(--common-color-1);
  border: 2px solid var(--common-color-2);
  color: var(--common-content);
}

.retry-button:hover {
  background-color: var(--common-hover);
  box-shadow: 0 4px 8px var(--common-shadow);
}

/* 分隔线颜色 */
.content-container hr {
  border: 1px solid var(--common-color-2);
}

/* 暗色主题适配 */
:deep(html.dark) .loading-spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: var(--common-color-1);
}
</style>

<style scoped>
/* 响应式设计 */
@media (max-width: var(--md)) {
  .loading-message,
  .error-message {
    padding: 30px 16px;
    min-height: 200px;
  }
  
  .loading-spinner {
    width: 24px;
    height: 24px;
  }
  
  .error-icon {
    font-size: 32px;
  }
  
  .loading-message p,
  .error-message p {
    font-size: 14px;
  }
  
  .retry-button {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .content-container p {
    font-size: 14px;
  }
}
</style>
