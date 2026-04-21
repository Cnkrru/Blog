<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import PageNav from '../components/p-center/PageNav.vue'

// SEO 配置
useHead({
  title: '友链 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog推荐的有趣网站和资源链接，包括技术博客、工具网站和其他优秀项目' },
    { name: 'keywords', content: '友链,链接,推荐,资源网站,技术博客' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/links' },
    { property: 'og:title', content: '友链 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru\'s Blog推荐的有趣网站和资源链接' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/links' },
    { name: 'twitter:title', content: '友链 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru\'s Blog推荐的有趣网站和资源链接' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/links' }
  ]
})

const links = ref([])
const categories = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

const loadLinks = async () => {
    try {
        // 从links.json获取链接数据
        const response = await fetch('/config/links.json')
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        links.value = data
        categorizeLinks()
    } catch (error) {
        console.error('加载链接失败:', error)
        links.value = []
    }
}

const categorizeLinks = () => {
    // 按分类分组
    const categoryMap = {}
    
    links.value.forEach(link => {
        const category = link.category
        if (!categoryMap[category]) {
            categoryMap[category] = []
        }
        categoryMap[category].push(link)
    })
    
    // 转换为数组并按分类名称排序，每个分类下的链接按id降序排序
    categories.value = Object.keys(categoryMap).map(category => {
        return {
            name: category,
            links: categoryMap[category].sort((a, b) => {
                return parseInt(b.id) - parseInt(a.id)
            })
        }
    }).sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
    
    // 计算总页数（按分类分页）
    totalPages.value = categories.value.length
}

const getCurrentCategory = () => {
    return categories.value[currentPage.value - 1]
}

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

onMounted(() => {
    loadLinks()
})
</script>

<template>
    <div id="site-stats-container"></div>
    <!-- 中心卡片头部区域 -->
    <div class="center-head-card">
        <h2>友情链接</h2>
    </div>
    <hr>
    <!-- 中心卡片内容 -->
    <div class="center-card-content">
        <template v-if="getCurrentCategory()">
            <!-- 分类标题 -->
            <div class="category-title">
                <h3>{{ getCurrentCategory().name }}</h3>
            </div>
            <hr>
            <!-- 分类链接列表 -->
            <div class="links-content">
                <a v-for="link in getCurrentCategory().links" :key="link.id" :href="link.url" target="_blank" class="link-card">
                    <div class="link-name">{{ link.name }}</div>
                    <div class="link-description">{{ link.description }}</div>
                </a>
            </div>
        </template>
    </div>
    <hr>
    <PageNav
      type="links"
      :current-page="currentPage"
      :total-pages="totalPages"
      :categories="categories"
      :current-category="getCurrentCategory()?.name || ''"
      @change="changePage"
    />
</template>

<style scoped>
.links-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.link-card {
    display: block;
    padding: 20px;
    border-radius: 8px;
    border: 3px solid var(--center-card-border-color);
    background-color: var(--card-bg);
    text-decoration: none;
    color: var(--text-color);
    transition: all 0.3s ease;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.link-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-width: 4px;
}

.link-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
    color: var(--center-card-title-color);
}

.link-description {
    font-size: 0.9rem;
    color: var(--text-color);
    opacity: 0.8;
    flex: 1;
}

/* 分类标题样式 */
.category-title {
    margin: 20px 0 10px 0;
}

.category-title h3 {
    font-size: 24px;
    color: var(--center-card-title-color);
    margin: 0;
}

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

/*==============================响应式设计媒体查询=============================*/
/* 超小屏手机(576px) */
@media (max-width: 575.98px) {
    .links-content {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
    }
    
    .link-card {
        height: 120px;
        padding: 12px;
    }
    
    .link-name {
        font-size: 1rem;
    }
    
    .link-description {
        font-size: 0.8rem;
    }
    
    .category-title h3 {
        font-size: 20px;
    }
    
    .pagination a {
        padding: 5px 8px;
        font-size: 13px;
    }
    
    .pagination li {
        margin: 0 2px;
    }
}

/* 小屏手机横屏(576px) */
@media (min-width: 576px) {
    .links-content {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }
    
    .link-card {
        height: 130px;
        padding: 15px;
    }
    
    .link-name {
        font-size: 1.1rem;
    }
    
    .link-description {
        font-size: 0.85rem;
    }
    
    .category-title h3 {
        font-size: 22px;
    }
    
    .pagination a {
        padding: 6px 10px;
        font-size: 14px;
    }
    
    .pagination li {
        margin: 0 3px;
    }
}

/* 平板及横屏(768px) */
@media (min-width: 768px) {
    /* 恢复桌面布局 */
    .links-content {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .link-card {
        height: 150px;
        padding: 20px;
    }
    
    .link-name {
        font-size: 1.2rem;
    }
    
    .link-description {
        font-size: 0.9rem;
    }
    
    .category-title h3 {
        font-size: 24px;
    }
    
    .pagination a {
        padding: 8px 12px;
        font-size: 16px;
    }
    
    .pagination li {
        margin: 0 5px;
    }
}


/* 桌面及横屏(1024px) */
@media (min-width: 1024px) {
    /* 标准桌面布局 */
    .links-content {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
}

/* 大屏桌面及横屏(1200px) */
@media (min-width: 1200px) {
    /* 宽屏布局 */
    .links-content {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* 超大屏及以上 (1440px) */
@media (min-width: 1440px) {
    /* 超大屏优化 */
    .links-content {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>