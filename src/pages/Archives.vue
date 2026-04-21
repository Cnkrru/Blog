<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import TagCloud from '../components/p-center/TagCloud.vue'
import ArticleCount from '../components/p-center/ArticleCount.vue'
import { useArticlesStore } from '../stores/index.js'

const { t } = useI18n()
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
    // 按分类分组
    const categoryMap = {}
    
    articles.value.forEach(article => {
        const category = article.category
        // 只有有分类的文章才显示
        if (category) {
            if (!categoryMap[category]) {
                categoryMap[category] = []
            }
            categoryMap[category].push(article)
        }
    })
    
    // 转换为数组并按分类名称排序
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
    <!-- 中心卡片头部区域 -->
    <div class="center-head-card">
        <h2>{{ t('archives') }}</h2>
        <ArticleCount />
        <TagCloud :articles="articles" />
    </div>
    <hr>
    <!-- 中心卡片内容 -->
    <div class="center-card-content">
        <template v-for="category in categories" :key="category.name">
            <!-- 分类卡片 -->
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
            
            <!-- 展开的文章列表 -->
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
    /* 中心卡片头部设计 */
    .center-head-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        gap: 10px;
    }
    
    /* 主体部分卡片列表设计 */
.index-center-list-card {
    width: 100%;
    height: 120px;
	padding: 10px;
	margin-bottom: 10px;
    border-radius: 8px;
    border: 3px solid var(--center-card-border-color);
    background-color: var(--card-bg);
    transition: border-color 0.3s ease;
    /* overflow-y: auto; */
}

    /* 主体部分卡片列表悬停设计 */
.index-center-list-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-width: 4px;
}

    /* 主体部分卡片列表标题设计 */
.index-center-list-card-header {
    width: 100%;
    height: 30px;
    font-size: 20px;
    margin-bottom: 10px;
    color: var(--center-card-title-color);
}

    /* 主体部分卡片列表内容设计 */
.index-center-list-card-content {
    width: 100%;
    height: 30px;
    font-size: 16px;
    line-height: 1.5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    color: var(--text-color);
}

    /* 元信息样式 */
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
    color: var(--text-color);
}

/* 分类文章列表样式 */
.category-posts {
    margin: 10px 0 20px 20px;
    border-left: 3px solid var(--border-color);
    padding-left: 20px;
}

.post-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    text-decoration: none;
    color: var(--text-color);
    border-bottom: 1px solid var(--border-color);
    transition: all 0.3s ease;
}

.post-item:hover {
    color: var(--accent-fg);
    padding-left: 10px;
}

.post-title {
    flex: 1;
}

.post-date {
    font-size: 0.875rem;
    color: var(--text-color);
    opacity: 0.7;
    margin-left: 20px;
}

/*==============================响应式设计媒体查询=============================*/
/* 超小屏手机(576px) */
@media (max-width: 575.98px) {
    /* 调整卡片大小 */
    .index-center-list-card {
        height: auto;
        min-height: 120px;
        padding: 15px;
    }
    
    /* 调整标题大小 */
    .index-center-list-card-header {
        font-size: 16px;
        height: auto;
        margin-bottom: 8px;
    }
    
    /* 调整内容大小 */
    .index-center-list-card-content {
        font-size: 14px;
        height: auto;
        margin-bottom: 8px;
    }
    
    /* 调整元信息样式 */
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
    
    /* 调整分类文章列表样式 */
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

/* 小屏手机横屏(576px) */
@media (min-width: 576px) {
    /* 调整卡片大小 */
    .index-center-list-card {
        height: 130px;
        padding: 12px;
    }
    
    /* 调整标题大小 */
    .index-center-list-card-header {
        font-size: 18px;
    }
    
    /* 调整内容大小 */
    .index-center-list-card-content {
        font-size: 15px;
    }
    
    /* 调整分类文章列表样式 */
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

/* 平板及横屏(768px) */
@media (min-width: 768px) {
    /* 恢复桌面布局 */
    .index-center-list-card {
        height: 120px;
        padding: 10px;
    }
    
    /* 调整标题大小 */
    .index-center-list-card-header {
        font-size: 20px;
    }
    
    /* 调整内容大小 */
    .index-center-list-card-content {
        font-size: 16px;
    }
    
    /* 调整元信息样式 */
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
    
    /* 调整分类文章列表样式 */
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

/* 桌面及横屏(1024px) */    
@media (min-width: 1024px) {
    /* 标准桌面布局 */
    .index-center-list-card {
        height: 125px;
    }
}

/* 大屏桌面及横屏(1200px) */    
@media (min-width: 1200px) {
    /* 宽屏布局 */
    .index-center-list-card {
        height: 130px;
    }
}

/* 超大屏及以上 (1440px) */
@media (min-width: 1440px) {
    /* 超大屏优化 */
    .index-center-list-card {
        height: 135px;
    }
}
</style>
