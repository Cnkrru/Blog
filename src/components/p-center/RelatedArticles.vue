<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useArticlesStore, useThemeStore } from '../../stores'

const props = defineProps<{ currentArticleId: string; currentArticleCategory: string }>()

const articlesStore = useArticlesStore()
const themeStore = useThemeStore()

const relatedArticles = ref([])

const isDarkTheme = computed(() => themeStore.isDark)

let debounceTimer = null

const fetchRelatedArticles = async () => {
  try {
    const articles = await articlesStore.fetchArticles()
    
    const currentIndex = articles.findIndex(article => article.id === props.currentArticleId)
    
    if (currentIndex === -1) {
      return
    }
    
    const articlePositionMap = new Map()
    articles.forEach((article, index) => {
      articlePositionMap.set(article.id, index)
    })
    
    const sameCategoryArticles = articles.filter(article => 
      article.category === props.currentArticleCategory && 
      article.id !== props.currentArticleId
    )
    
    if (sameCategoryArticles.length === 0) {
      const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null
      const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null
      
      const nearbyArticles = []
      if (prevArticle) nearbyArticles.push(prevArticle)
      if (nextArticle) nearbyArticles.push(nextArticle)
      
      relatedArticles.value = nearbyArticles
    } else {
      const articlesWithDistance = sameCategoryArticles.map(article => {
        const articleIndex = articlePositionMap.get(article.id)
        return {
          ...article,
          distance: Math.abs(articleIndex - currentIndex)
        }
      })
      
      articlesWithDistance.sort((a, b) => a.distance - b.distance)
      relatedArticles.value = articlesWithDistance.slice(0, 3)
    }
    
  } catch (err) {
    console.error('Failed to fetch related articles:', err)
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
    <div class="related-articles-container" :class="{ 'dark-theme': isDarkTheme }">
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
.related-articles-wrapper {
    width: 100%;
    margin: 20px 0;
}

.related-articles-container {
    width: 100%;
    padding: 15px;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.related-articles-title {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: bold;
}

.related-articles-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

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

.related-article-link {
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.related-article-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
}

.related-article-category {
    display: inline-block;
    padding: 2px 8px;
    color: white;
    font-size: 11px;
    font-weight: bold;
    border-radius: 4px;
    width: fit-content;
}

.related-article-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    transition: color 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.related-article-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
}

.related-article-date {
    flex-shrink: 0;
}

.related-article-tags {
    display: flex;
    gap: 4px;
}

.tag {
    padding: 1px 6px;
    font-size: 10px;
    border-radius: 3px;
    transition: all 0.3s ease;
}

.related-article-arrow {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.related-article-arrow svg {
    width: 100%;
    height: 100%;
}

.related-article-link:hover .related-article-arrow {
    transform: translateX(4px);
}
</style>

<style scoped>
.related-articles-container {
    background-color: var(--common-bg);
    border: 2px solid var(--common-color-1);
}

.related-articles-title {
    color: var(--common-text);
}

.related-article-item:hover {
    background-color: var(--common-hover);
}

.related-article-link {
    color: var(--common-text);
}

.related-article-link:hover {
    background-color: var(--common-hover);
}

.related-article-category {
    background-color: var(--common-color-1);
}

.related-article-link:hover .related-article-title {
    color: var(--common-text);
}

.related-article-meta {
    color: var(--common-text);
}

.tag {
    background-color: var(--common-bg);
    color: var(--common-text);
}

.related-article-link:hover .tag {
    background-color: var(--common-color-1);
    color: white;
}

.related-article-arrow {
    color: var(--common-text);
}

.related-article-link:hover .related-article-arrow {
    color: var(--common-text);
}
</style>

<style scoped>
@media (max-width: 639px) {
    .related-articles-container {
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
}

@media (max-width: 640px) {
    .related-articles-container {
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
}

@media (max-width: 768px) {
    .related-articles-container {
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
}
</style>
