<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import { useArticlesStore } from '../../../stores/articles'

const store = useArticlesStore()

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

const relatedArticles = ref([])

const fetchRelatedArticles = async () => {
  try {
    const articles = await store.fetchArticles()
    
    // 找到当前文章的索引
    const currentIndex = articles.findIndex(article => article.id === props.currentArticleId)
    
    if (currentIndex === -1) {
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
    
  } catch (error) {
    // 静默处理错误
  }
}

onMounted(() => {
  fetchRelatedArticles()
})
</script>

<template>
  <div v-if="relatedArticles.length > 0" class="related-articles-container">
    <h3 class="related-articles-title">相关文章推荐</h3>
    <div class="related-articles-list">
      <div v-for="article in relatedArticles" :key="article.id" class="related-article-item">
        <RouterLink :to="`/post/${article.id}`" class="related-article-link">
          <div class="related-article-title">{{ article.title }}</div>
          <div class="related-article-meta">
            <span class="related-article-date">{{ article.date }}</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 相关文章推荐容器 */
.related-articles-container {
    width: 100%;
    margin: 20px 0;
    padding: 15px;
    background-color: var(--card-bg);
    border: 2px solid var(--center-card-title-color);
    border-radius: 12px;
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
    padding: 10px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.related-article-item:hover {
    background-color: var(--hover-bg);
}

/* 相关文章链接 */
.related-article-link {
    text-decoration: none;
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    gap: 5px;
}

/* 相关文章标题 */
.related-article-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    transition: color 0.3s ease;
}

.related-article-link:hover .related-article-title {
    color: var(--accent-fg);
}

/* 相关文章元信息 */
.related-article-meta {
    font-size: 12px;
    color: var(--text-muted);
}

/* 响应式设计 */
@media (max-width: 575.98px) {
    .related-articles-container {
        padding: 12px;
        margin: 15px 0;
    }
    
    .related-articles-title {
        font-size: 14px;
        margin-bottom: 12px;
    }
    
    .related-article-item {
        padding: 8px;
    }
    
    .related-article-title {
        font-size: 13px;
    }
    
    .related-article-meta {
        font-size: 11px;
    }
}

@media (min-width: 576px) and (max-width: 767.98px) {
    .related-articles-container {
        padding: 13px;
        margin: 18px 0;
    }
    
    .related-articles-title {
        font-size: 15px;
        margin-bottom: 13px;
    }
    
    .related-article-item {
        padding: 9px;
    }
    
    .related-article-title {
        font-size: 13.5px;
    }
    
    .related-article-meta {
        font-size: 11.5px;
    }
}

@media (min-width: 768px) {
    .related-articles-container {
        padding: 15px;
        margin: 20px 0;
    }
    
    .related-articles-title {
        font-size: 16px;
        margin-bottom: 15px;
    }
    
    .related-article-item {
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
