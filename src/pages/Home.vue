<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import Announcement from '../components/p-center/Announcement.vue'
import ArticleCount from '../components/p-center/ArticleCount.vue'
import Pagination from '../components/p-center/Pagination.vue'
import { useArticlesStore } from '../stores/index.js'

const { t } = useI18n()
const store = useArticlesStore()

// SEO 配置
useHead({
  title: '首页 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: '欢迎来到Cnkrru\'s Blog，分享技术和生活的个人空间，包含最新技术文章、实用工具和项目展示' },
    { name: 'keywords', content: '博客,技术,生活,分享,前端开发,Vue,JavaScript' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/home' },
    { property: 'og:title', content: '首页 - Cnkrru\'s Blog' },
    { property: 'og:description', content: '欢迎来到Cnkrru\'s Blog，分享技术和生活的个人空间，包含最新技术文章、实用工具和项目展示' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/home' },
    { name: 'twitter:title', content: '首页 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: '欢迎来到Cnkrru\'s Blog，分享技术和生活的个人空间，包含最新技术文章、实用工具和项目展示' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/home' }
  ]
})

const articles = ref([])
const currentPage = ref(1)
const pageSize = ref(5) // 一页显示五篇文章
const totalPages = ref(1) // 总页数根据实际文章数计算
const loading = ref(true)
const error = ref(null)

const loadArticles = async () => {
    try {
        loading.value = true
        error.value = null
        const data = await store.fetchArticles()
        articles.value = data.filter(article => article.id !== 'terminal' && article.id !== 'changelog')
        calculateTotalPages()
    } catch (err) {
        error.value = '加载文章失败'
        articles.value = []
    } finally {
        loading.value = false
    }
}

const calculateTotalPages = () => {
    const otherArticles = articles.value.filter(article => article.id !== '0')
    totalPages.value = Math.ceil((otherArticles.length + 1) / pageSize.value)
}

const getPaginatedArticles = () => {
    const welcomeArticle = articles.value.find(article => article.id === '0') || {
        id: '0',
        title: '欢迎来到我的博客',
        category: '公告',
        tags: ['欢迎'],
        date: '2026-03-29',
        path: './html/posts/post-0.html'
    }
    
    const otherArticles = articles.value.filter(article => article.id !== '0').sort((a, b) => {
        return parseInt(b.id) - parseInt(a.id)
    })
    
    if (currentPage.value === 1) {
        const remainingSlots = pageSize.value - 1
        return [welcomeArticle, ...otherArticles.slice(0, remainingSlots)]
    } else {
        const startIndex = (currentPage.value - 1) * pageSize.value - 1
        const endIndex = startIndex + pageSize.value
        return otherArticles.slice(startIndex, endIndex)
    }
}

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
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
        <h2>{{ t('recentPosts') }}</h2>
        <ArticleCount />
        <Announcement />
    </div>
    <hr>
    <!-- 中心卡片列表卡片 -->
    <div class="center-card-content">
        <div v-if="loading" class="loading-message">
            <p>Loading...</p>
        </div>
        <div v-else-if="error" class="error-message">
            <p>{{ error }}</p>
        </div>
        <template v-else-if="getPaginatedArticles().length > 0">
            <template v-for="(article, index) in getPaginatedArticles()" :key="article.id">
                <hr v-if="currentPage === 1 && index === 1" style="margin: 10px 0">
                <RouterLink :to="`/post/${article.id}`">
                        <div class="index-center-list-card">
                            <div class="index-center-list-card-header">
                                {{ article.title }}
                            </div>
                            <hr>
                            <div class="index-center-list-card-content">
                                <div class="article-meta-info">
                                    <span>ID: {{ article.id }}</span>
                                    <span v-if="article.category">{{ t('categories') }}: {{ article.category }}</span>
                                    <span v-if="article.tags && article.tags.length > 0">{{ t('tags') }}: {{ article.tags.join(', ') }}</span>
                                    <span>Date: {{ article.date }}</span>
                                </div>
                            </div>
                        </div>
                    </RouterLink>
            </template>
        </template>
        <div v-else class="empty-message">
            <p>No articles found</p>
        </div>
    </div>
    <hr>
    <Pagination
      v-if="!loading && !error"
      :current-page="currentPage"
      :total-pages="totalPages"
      :prev-label="t('previous')"
      :next-label="t('next')"
      @change="changePage"
    />
</template>

<style scoped>
    /* 中心卡片头部样式 */
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
    transition: all 0.3s ease;
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
    color: var(--text-color);
    opacity: 0.8;
}

.article-meta-info span {
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
}

/* 加载和错误提示样式 */
.loading-message,
.error-message,
.empty-message {
    text-align: center;
    padding: 50px 0;
    color: var(--text-color);
}

/* 响应式设计媒体查询 */
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

/*===================================分页控件设计================================*/

/* 分页样式 */
.pagination-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
}

.pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}

.pagination li {
    margin: 0 5px;
}

.pagination a {
    display: inline-block;
    padding: 8px 12px;
    text-decoration: none;
    color: var(--text-color);
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.pagination a:hover {
    background-color: var(--hover-bg);
    transform: none;
}

.pagination .active a {
    background-color: var(--button-bg);
    color: var(--button-text);
    border-color: var(--button-bg);
}

.pagination .disabled a {
    background-color: var(--card-bg);
    color: var(--text-color);
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination .disabled a:hover {
    transform: none;
    background-color: var(--card-bg);
}

/* 响应式设计媒体查询 */
@media (max-width: 768px) {
    .pagination a {
        padding: 6px 10px;
        font-size: 14px;
    }
    
    .pagination li {
        margin: 0 3px;
    }
}
</style>
