<script setup lang="ts">
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
/* 布局样式 */
.links-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.link-card {
    display: block;
    padding: 20px;
    border-radius: 8px;
    border: 3px solid;
    text-decoration: none;
    transition: all 0.3s ease;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.link-card:hover {
    transform: translateY(-5px);
    border-width: 4px;
}

.link-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
}

.link-description {
    font-size: 0.9rem;
    opacity: 0.8;
    flex: 1;
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
    border: 1px solid;
    border-radius: 4px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.pagination a:hover {
    transform: none;
}

.pagination .active a {
    border-color: inherit;
}

.pagination .disabled a {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination .disabled a:hover {
    transform: none;
}
</style>

<style scoped>
/* 颜色样式 */
.link-card {
    border-color: var(--common-color-1);
    background-color: var(--common-bg);
    color: var(--common-text);
    transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
}

.link-card:hover {
    box-shadow: 0 4px 8px var(--common-shadow);
}

.link-name {
    color: var(--common-text);
}

.link-description {
    color: var(--common-text);
}

.pagination a {
    color: var(--common-text);
    background-color: var(--common-bg);
    border-color: var(--common-color-1);
}

.pagination a:hover {
    background-color: var(--common-hover);
}

.pagination .active a {
    background-color: var(--common-hover);
    color: var(--common-text);
    border-color: var(--common-hover);
}

.pagination .disabled a {
    background-color: var(--common-bg);
    color: var(--common-text);
}

.pagination .disabled a:hover {
    background-color: var(--common-bg);
}
</style>

<style scoped>
/* 响应式设计媒体查询 */
@media (max-width: calc(var(--sm) - 1px)) {
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
    
    .pagination a {
        padding: 5px 8px;
        font-size: 13px;
    }
    
    .pagination li {
        margin: 0 2px;
    }
}

@media (max-width: var(--md)) {
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
    
    .pagination a {
        padding: 6px 10px;
        font-size: 14px;
    }
    
    .pagination li {
        margin: 0 3px;
    }
}

@media (max-width: var(--lg)) {
    .links-content {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
}

@media (max-width: var(--xl)) {
    .links-content {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: var(--2xl)) {
    .links-content {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
