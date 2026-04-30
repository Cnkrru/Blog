<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useArticlesStore } from '../stores'
import ArticleCount from '../components/p-center/ArticleCount.vue'
import TagCloud from '../components/p-center/TagCloud.vue'

const store = useArticlesStore()

// SEO 配置
useHead({
  title: '归档 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog的所有文章归档，按分类和时间顺序整理，方便查找和阅读' },
    { name: 'keywords', content: '归档,文章列表,历史文章,博客归档' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/archives' },
    { property: 'og:title', content: '归档 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru\'s Blog的所有文章归档，按分类和时间顺序整理，方便查找和阅读' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/archives' },
    { name: 'twitter:title', content: '归档 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru\'s Blog的所有文章归档，按分类和时间顺序整理，方便查找和阅读' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/archives' }
  ]
})

const articles = ref([])
const categories = ref([])
const expandedCategory = ref(null)

const loadArticles = async () => {
    try {
        const data = await store.fetchArticles()
        articles.value = data
        categorizeArticles()
    } catch (error) {
        articles.value = []
    }
}

const categorizeArticles = () => {
    const categoryMap = {}
    
    articles.value.forEach(article => {
        const category = article.category
        if (category) {
            if (!categoryMap[category]) {
                categoryMap[category] = []
            }
            categoryMap[category].push(article)
        }
    })
    
    categories.value = Object.keys(categoryMap).map(category => {
        return {
            name: category,
            posts: categoryMap[category].sort((a, b) => {
                return parseInt(b.id) - parseInt(a.id)
            })
        }
    }).sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
}

const toggleCategory = (categoryName) => {
    if (expandedCategory.value === categoryName) {
        expandedCategory.value = null
    } else {
        expandedCategory.value = categoryName
    }
}

onMounted(() => {
    loadArticles()
})
</script>

<template>
    <div id="site-stats-container"></div>
    <div class="center-head-card">
        <h2>归档</h2>
        <ArticleCount />
        <TagCloud :articles="articles" />
    </div>
    <hr>
    <div class="center-card-content">
        <template v-for="category in categories" :key="category.name">
            <a href="#" @click.prevent="toggleCategory(category.name)">
                <div class="index-center-list-card">
                    <div class="index-center-list-card-header">
                        {{ category.name }}
                    </div>
                    <hr>
                    <div class="index-center-list-card-content">
                        <div class="article-meta-info">
                            <span>文章数量: {{ category.posts.length }}</span>
                            <span>{{ expandedCategory === category.name ? '收起' : '展开' }}</span>
                        </div>
                    </div>
                </div>
            </a>
            
            <div v-if="expandedCategory === category.name" class="category-posts">
                <template v-for="article in category.posts" :key="article.id">
                    <RouterLink :to="`/post/${article.id}`" class="post-item">
                        <span class="post-title">{{ article.title }}</span>
                        <span class="post-date">{{ article.date }}</span>
                    </RouterLink>
                </template>
            </div>
        </template>
    </div>
    <hr>
</template>

<style scoped>
/* 布局样式 */
.center-head-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
}

.index-center-list-card {
    width: 100%;
    height: 120px;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    border: 3px solid;
    transition: border-color 0.3s ease;
}

.index-center-list-card:hover {
    transform: translateY(-5px);
    border-width: 4px;
}

.index-center-list-card-header {
    width: 100%;
    height: 30px;
    font-size: 20px;
    margin-bottom: 10px;
}

.index-center-list-card-content {
    width: 100%;
    height: 30px;
    font-size: 16px;
    line-height: 1.5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.article-meta-info {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.article-meta-info span {
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
}

.category-posts {
    margin: 10px 0 20px 20px;
    border-left: 3px solid;
    padding-left: 20px;
}

.post-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    text-decoration: none;
    border-bottom: 1px solid;
    transition: all 0.3s ease;
}

.post-item:hover {
    padding-left: 10px;
}

.post-title {
    flex: 1;
}

.post-date {
    font-size: 0.875rem;
    opacity: 0.7;
    margin-left: 20px;
}
</style>

<style scoped>
/* 颜色样式 */
.index-center-list-card {
    border-color: var(--common-color-1);
    background-color: var(--common-bg);
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.index-center-list-card:hover {
    box-shadow: 0 4px 8px var(--common-shadow);
}

.index-center-list-card-header {
    color: var(--common-text);
}

.index-center-list-card-content {
    color: var(--common-text);
}

.article-meta-info span {
    color: var(--common-text);
}

.category-posts {
    border-left-color: var(--common-color-1);
}

.post-item {
    color: var(--common-text);
    border-bottom-color: var(--common-color-1);
}

.post-item:hover {
    color: var(--common-hover);
}

.post-date {
    color: var(--common-text);
}
</style>

<style scoped>
/* 响应式设计媒体查询 */
@media (max-width: calc(var(--sm) - 1px)) {
    .index-center-list-card {
        height: auto;
        min-height: 120px;
        padding: 15px;
    }
    
    .index-center-list-card-header {
        font-size: 16px;
        height: auto;
        margin-bottom: 8px;
    }
    
    .index-center-list-card-content {
        font-size: 14px;
        height: auto;
        margin-bottom: 8px;
    }
    
    .article-meta-info {
        flex-direction: column;
        align-items: flex-start;
        height: auto;
        gap: 5px;
    }
    
    .article-meta-info span {
        height: auto;
        line-height: 1.2;
        margin-bottom: 5px;
    }
    
    .category-posts {
        margin: 10px 0 15px 10px;
        padding-left: 10px;
    }
    
    .post-item {
        padding: 6px 0;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
    }
    
    .post-date {
        margin-left: 0;
        font-size: 0.8rem;
    }
}

@media (max-width: var(--sm)) {
    .index-center-list-card {
        height: 130px;
        padding: 12px;
    }
    
    .index-center-list-card-header {
        font-size: 18px;
    }
    
    .index-center-list-card-content {
        font-size: 15px;
    }
    
    .category-posts {
        margin: 10px 0 18px 15px;
        padding-left: 15px;
    }
    
    .post-item {
        padding: 7px 0;
    }
    
    .post-date {
        font-size: 0.85rem;
    }
}

@media (max-width: var(--md)) {
    .index-center-list-card {
        height: 120px;
        padding: 10px;
    }
    
    .index-center-list-card-header {
        font-size: 20px;
    }
    
    .index-center-list-card-content {
        font-size: 16px;
    }
    
    .article-meta-info {
        flex-direction: row;
        align-items: center;
        height: 30px;
    }
    
    .article-meta-info span {
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
    }
    
    .category-posts {
        margin: 10px 0 20px 20px;
        padding-left: 20px;
    }
    
    .post-item {
        padding: 8px 0;
        flex-direction: row;
        align-items: center;
        gap: 0;
    }
    
    .post-date {
        margin-left: 20px;
        font-size: 0.875rem;
    }
}

@media (max-width: var(--lg)) {
    .index-center-list-card {
        height: 125px;
    }
}

@media (max-width: var(--xl)) {
    .index-center-list-card {
        height: 130px;
    }
}

@media (max-width: var(--2xl)) {
    .index-center-list-card {
        height: 135px;
    }
}
</style>
