<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useArticlesStore, useThemeStore } from '../../stores'

const props = defineProps({
  currentArticleId: {
    type: String,
    required: true
  },
  currentArticleCategory: {
    type: String,
    required: true
  }
})

const articlesStore = useArticlesStore()
const themeStore = useThemeStore()

const relatedArticles = ref([])
const loading = ref(true)
const error = ref(null)
const isEmpty = ref(false)

const isDarkTheme = computed(() => themeStore.isDark)

let debounceTimer = null

const fetchRelatedArticles = async () => {
  loading.value = true
  error.value = null
  isEmpty.value = false
  
  try {
    const articles = await articlesStore.fetchArticles()
    
    // 找到当前文章的索引
    const currentIndex = articles.findIndex(article => article.id === props.currentArticleId)
    
    if (currentIndex === -1) {
      isEmpty.value = true
      loading.value = false
      return
    }
    
    // 预构建位置索引 - 将 O(n) 的 findIndex 转换为 O(1) 的 Map 查找
    const articlePositionMap = new Map()
    articles.forEach((article, index) => {
      articlePositionMap.set(article.id, index)
    })
    
    // 筛选相同分类的文章，排除当前文章
    const sameCategoryArticles = articles.filter(article => 
      article.category === props.currentArticleCategory && 
      article.id !== props.currentArticleId
    )
    
    // 如果没有相同分类的文章，尝试获取同分类的前后文章
    if (sameCategoryArticles.length === 0) {
      // 获取当前文章前后的各一篇文章
      const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null
      const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null
      
      const nearbyArticles = []
      if (prevArticle) nearbyArticles.push(prevArticle)
      if (nextArticle) nearbyArticles.push(nextArticle)
      
      relatedArticles.value = nearbyArticles
    } else {
      // 计算每篇文章与当前文章的距离（索引差的绝对值）
      // 使用预建的索引 Map，O(1) 查找替代 O(n) 的 findIndex
      const articlesWithDistance = sameCategoryArticles.map(article => {
        const articleIndex = articlePositionMap.get(article.id)
        return {
          ...article,
          distance: Math.abs(articleIndex - currentIndex)
        }
      })
      
      // 按距离排序，取前3篇
      articlesWithDistance.sort((a, b) => a.distance - b.distance)
      relatedArticles.value = articlesWithDistance.slice(0, 3)
    }
    
    isEmpty.value = relatedArticles.value.length === 0
    loading.value = false
    
  } catch (err) {
    error.value = '加载相关文章失败'
    console.error('Failed to fetch related articles:', err)
    loading.value = false
  }
}

const retry = () => {
  fetchRelatedArticles()
}

const init = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = setTimeout(() => {
    fetchRelatedArticles()
  }, 200)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div class="related-articles-wrapper">
    <!-- 加载状态 -->
    <div v-if="loading" class="related-articles-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">正在加载相关文章...</span>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="related-articles-error">
      <span class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </span>
      <span class="error-text">{{ error }}</span>
      <button @click="retry" class="retry-btn">重试</button>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="isEmpty" class="related-articles-empty">
      <span class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </span>
      <span class="empty-text">暂无相关文章</span>
    </div>
    
    <!-- 相关文章推荐 -->
    <div v-else class="related-articles-container" :class="{ 'dark-theme': isDarkTheme }">
      <h3 class="related-articles-title">相关文章推荐</h3>
      <div class="related-articles-list">
        <div v-for="article in relatedArticles" :key="article.id" class="related-article-item">
          <RouterLink :to="`/post/${article.id}`" class="related-article-link">
            <div class="related-article-content">
              <span v-if="article.category" class="related-article-category">{{ article.category }}</span>
              <div class="related-article-title">{{ article.title }}</div>
              <div class="related-article-meta">
                <span class="related-article-date">{{ article.date }}</span>
                <span v-if="article.tags && article.tags.length > 0" class="related-article-tags">
                  <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
                </span>
              </div>
            </div>
            <span class="related-article-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 相关文章包装器 */
.related-articles-wrapper {
    width: 100%;
    margin: 20px 0;
}

/* 加载状态样式 */
.related-articles-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 30px 20px;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-border-color);
    border-radius: 12px;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--border-color);
    border-top-color: var(--accent-fg);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 14px;
    color: var(--text-secondary);
}

/* 错误状态样式 */
.related-articles-error {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 30px 20px;
    background-color: var(--card-bg);
    border: 2px solid var(--error-color);
    border-radius: 12px;
}

.error-icon {
    width: 20px;
    height: 20px;
    color: var(--error-color);
    flex-shrink: 0;
}

.error-icon svg {
    width: 100%;
    height: 100%;
}

.error-text {
    font-size: 14px;
    color: var(--error-color);
}

.retry-btn {
    margin-left: 8px;
    padding: 6px 14px;
    background-color: var(--error-color);
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.retry-btn:hover {
    background-color: var(--accent-hover);
    transform: translateY(-1px);
}

/* 空状态样式 */
.related-articles-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 30px 20px;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-border-color);
    border-radius: 12px;
}

.empty-icon {
    width: 20px;
    height: 20px;
    color: var(--text-secondary);
    flex-shrink: 0;
}

.empty-icon svg {
    width: 100%;
    height: 100%;
}

.empty-text {
    font-size: 14px;
    color: var(--text-secondary);
}

/* 相关文章推荐容器 */
.related-articles-container {
    width: 100%;
    padding: 15px;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-title-color);
    border-radius: 12px;
    box-shadow: 0 2px 8px var(--shadow-color);
    transition: all 0.3s ease;
}

.related-articles-container.dark-theme {
    background-color: var(--card-bg);
    border-color: var(--center-card-border-color);
    box-shadow: 0 2px 8px var(--shadow-color);
}

/* 相关文章标题 */
.related-articles-title {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: bold;
    color: var(--center-card-title-color);
}

/* 相关文章列表 */
.related-articles-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* 相关文章项 */
.related-article-item {
    border-radius: 8px;
    transition: all 0.3s ease;
    animation: fadeInUp 0.3s ease forwards;
    opacity: 0;
}

.related-article-item:nth-child(1) { animation-delay: 0.05s; }
.related-article-item:nth-child(2) { animation-delay: 0.1s; }
.related-article-item:nth-child(3) { animation-delay: 0.15s; }

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.related-article-item:hover {
    background-color: var(--hover-bg);
}

/* 相关文章链接 */
.related-article-link {
    text-decoration: none;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.related-article-link:hover {
    background-color: var(--hover-bg);
}

.related-article-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
}

/* 相关文章分类标签 */
.related-article-category {
    display: inline-block;
    padding: 2px 8px;
    background-color: var(--accent-fg);
    color: white;
    font-size: 11px;
    font-weight: bold;
    border-radius: 4px;
    width: fit-content;
}

/* 相关文章标题 */
.related-article-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    transition: color 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.related-article-link:hover .related-article-title {
    color: var(--accent-fg);
}

/* 相关文章元信息 */
.related-article-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: var(--text-muted);
}

.related-article-date {
    flex-shrink: 0;
}

/* 相关文章标签 */
.related-article-tags {
    display: flex;
    gap: 4px;
}

.tag {
    padding: 1px 6px;
    background-color: var(--tag-bg);
    color: var(--text-secondary);
    font-size: 10px;
    border-radius: 3px;
    transition: all 0.3s ease;
}

.related-article-link:hover .tag {
    background-color: var(--accent-fg);
    color: white;
}

/* 相关文章箭头 */
.related-article-arrow {
    width: 18px;
    height: 18px;
    color: var(--text-secondary);
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.related-article-arrow svg {
    width: 100%;
    height: 100%;
}

.related-article-link:hover .related-article-arrow {
    color: var(--accent-fg);
    transform: translateX(4px);
}

/* 响应式设计 */
@media (max-width: 575.98px) {
    .related-articles-container,
    .related-articles-loading,
    .related-articles-error,
    .related-articles-empty {
        padding: 12px;
        margin: 15px 0;
    }
    
    .related-articles-title {
        font-size: 14px;
        margin-bottom: 12px;
    }
    
    .related-article-link {
        padding: 8px;
    }
    
    .related-article-title {
        font-size: 13px;
    }
    
    .related-article-meta {
        font-size: 11px;
        flex-wrap: wrap;
    }
    
    .related-article-arrow {
        width: 16px;
        height: 16px;
    }
    
    .loading-text,
    .error-text,
    .empty-text {
        font-size: 13px;
    }
}

@media (min-width: 576px) and (max-width: 767.98px) {
    .related-articles-container,
    .related-articles-loading,
    .related-articles-error,
    .related-articles-empty {
        padding: 13px;
        margin: 18px 0;
    }
    
    .related-articles-title {
        font-size: 15px;
        margin-bottom: 13px;
    }
    
    .related-article-link {
        padding: 9px;
    }
    
    .related-article-title {
        font-size: 13.5px;
    }
    
    .related-article-meta {
        font-size: 11.5px;
    }
    
    .loading-text,
    .error-text,
    .empty-text {
        font-size: 13.5px;
    }
}

@media (min-width: 768px) {
    .related-articles-container,
    .related-articles-loading,
    .related-articles-error,
    .related-articles-empty {
        padding: 15px;
        margin: 20px 0;
    }
    
    .related-articles-title {
        font-size: 16px;
        margin-bottom: 15px;
    }
    
    .related-article-link {
        padding: 10px;
    }
    
    .related-article-title {
        font-size: 14px;
    }
    
    .related-article-meta {
        font-size: 12px;
    }
    
    .loading-text,
    .error-text,
    .empty-text {
        font-size: 14px;
    }
}
</style>
