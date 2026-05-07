<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useArticlesStore } from '../stores'
import ArticleCount from '../components/p-center/ArticleCount.vue'
import TagCloud from '../components/p-center/TagCloud.vue'

const store = useArticlesStore()

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

const articles = ref<any[]>([])
const categories = ref<any[]>([])
const expandedCategory = ref<string | null>(null)
const currentPage = ref(1)
const itemsPerPage = 5

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
    const categoryMap: Record<string, any[]> = {}

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

const totalPages = computed(() => {
    return Math.ceil(categories.value.length / itemsPerPage)
})

const currentCategories = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    return categories.value.slice(startIndex, startIndex + itemsPerPage)
})

const toggleCategory = (categoryName: string) => {
    if (expandedCategory.value === categoryName) {
        expandedCategory.value = null
    } else {
        expandedCategory.value = categoryName
    }
}

const changePage = (page: number) => {
    currentPage.value = page
    expandedCategory.value = null
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
        <template v-for="category in currentCategories" :key="category.name">
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
    <div class="simple-pagination">
        <button
            class="nav-btn prev-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
        >
            &lt; 上一页
        </button>

        <span class="page-info">
            第 {{ currentPage }} / {{ totalPages }} 页
        </span>

        <button
            class="nav-btn next-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
        >
            下一页 &gt;
        </button>
    </div>
</template>

<!-- 布局样式 -->
<style scoped>
.center-head-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    gap: 10px;
}

.article-meta-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.category-posts {
    display: flex;
    flex-direction: column;
    padding: 0 0 8px 0;
}

.post-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.2s ease;
    border-bottom: 1px solid;
}

.post-item:last-child {
    border-bottom: none;
}

.post-title {
    font-size: 14px;
}

.post-date {
    font-size: 12px;
    opacity: 0.7;
    white-space: nowrap;
    margin-left: 16px;
}

.simple-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 16px;
}

.simple-pagination .nav-btn {
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid var(--common-color-1);
    background: var(--common-color-1);
    color: var(--common-content);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.simple-pagination .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.simple-pagination .page-info {
    color: var(--common-content);
    font-size: 14px;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.category-posts {
    background: var(--common-bg);
}

.post-item {
    border-bottom-color: var(--common-color-1);
    color: var(--common-text);
}

.post-item:hover {
    background: var(--common-hover);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
@media (max-width: var(--sm)) {
    .simple-pagination {
        gap: 10px;
        padding: 12px;
    }

    .simple-pagination .nav-btn {
        padding: 6px 12px;
        font-size: 13px;
    }

    .simple-pagination .page-info {
        font-size: 13px;
    }

    .post-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }

    .post-date {
        margin-left: 0;
    }
}
</style>
