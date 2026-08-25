<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import ArticleCover from '../content/ArticleCover.vue'
import { useArticlesStore } from '../../stores'

const props = defineProps(['currentArticleId', 'currentArticleCategory'])

const articlesStore = useArticlesStore()

const relatedArticles = ref([])

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
    <div class="related-articles-container">
      <h3 class="related-articles-title">相关文章推荐</h3>
      <div class="related-articles-grid">
        <RouterLink
          v-for="(article, idx) in relatedArticles"
          :key="article.id"
          :to="`/post/${article.id}`"
          class="related-card"
          :style="{ animationDelay: `${idx * 0.08}s` }"
        >
          <div class="related-card-cover">
            <ArticleCover :article="article" />
          </div>
          <div class="related-card-body">
            <span v-if="article.category" class="related-card-category">{{ article.category }}</span>
            <div class="related-card-title">{{ article.title }}</div>
            <div class="related-card-meta">
              <span class="related-card-date">{{ article.date }}</span>
              <span v-if="article.tags && article.tags.length > 0" class="related-card-tags">
                <span v-for="tag in article.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
              </span>
            </div>
          </div>
        </RouterLink>
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
  padding: 14px;
  border-radius: 12px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.4));
  border: 1px solid color-mix(in srgb, var(--common-color-1) 10%, transparent);
}

.related-articles-title {
  margin: 0 0 14px 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--common-text);
}

.related-articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.related-card {
  text-decoration: none;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

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

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.10);
}

.related-card-cover {
  width: 100%;
  aspect-ratio: 1.91 / 1;
  overflow: hidden;
}

.related-card-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.related-card-category {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: bold;
  border-radius: 4px;
  width: fit-content;
}

.related-card-title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  margin-top: auto;
}

.related-card-date {
  flex-shrink: 0;
}

.related-card-tags {
  display: flex;
  gap: 4px;
}

.tag {
  padding: 1px 6px;
  font-size: 10px;
  border-radius: 3px;
}
</style>

<style scoped>
/* ========== 主题适配 — 使用 CSS 变量，无 body.dark-theme 硬编码 ========== */
.related-card {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.5));
  border: 1px solid color-mix(in srgb, var(--common-color-1) 10%, transparent);
  color: var(--common-text);
}

.related-card:hover {
  border-color: var(--common-color-1);
}

.related-card-category {
  background-color: var(--common-color-1);
  color: #fff;
}

.related-card-title {
  color: var(--common-text);
}

.related-card-meta {
  color: var(--common-text);
  opacity: 0.7;
}

.tag {
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
  color: var(--common-text);
}
</style>

<style scoped>
@media (max-width: 640px) {
  .related-articles-grid {
    grid-template-columns: 1fr;
  }

  .related-articles-container {
    padding: 12px;
    margin: 15px 0;
  }
  
  .related-articles-title {
    font-size: 14px;
    margin-bottom: 12px;
  }
  
  .related-card-title {
    font-size: 13px;
  }
  
  .related-card-meta {
    font-size: 11px;
    flex-wrap: wrap;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .related-articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>