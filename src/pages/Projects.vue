<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import PageNav from '../components/PageNav.vue'

// SEO 配置
useHead({
  title: '项目 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog的项目展示，涵盖前端开发、工具应用和个人作品' },
    { name: 'keywords', content: '项目,作品,展示,前端开发,个人项目' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/projects' },
    { property: 'og:title', content: '项目 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru\'s Blog的项目展示，涵盖前端开发、工具应用和个人作品' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: 'Cnkrru\'s Blog' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/projects' },
    { name: 'twitter:title', content: '项目 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru\'s Blog的项目展示，涵盖前端开发、工具应用和个人作品' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/projects' }
  ]
})

const projects = ref([])
const categories = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const error = ref(null)

const loadProjects = async () => {
    try {
        loading.value = true
        error.value = null
        // 从projects.json获取项目数据
        const response = await fetch('/config/projects.json')
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        projects.value = data
        categorizeProjects()
    } catch (err) {
        console.error('加载项目失败:', err)
        error.value = '加载项目失败'
        projects.value = []
    } finally {
        loading.value = false
    }
}

const categorizeProjects = () => {
    // 按分类分类项目
    const categoryMap = {}
    
    projects.value.forEach(project => {
        const category = project.category
        if (!categoryMap[category]) {
            categoryMap[category] = []
        }
        categoryMap[category].push(project)
    })
    
    // 转换为数组并按分类名称排序，每个分类下的项目按id降序排序
    categories.value = Object.keys(categoryMap).map(category => {
        return {
            name: category,
            projects: categoryMap[category].sort((a, b) => {
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
    loadProjects()
})
</script>

<template>
    <div id="site-stats-container"></div>
    <!-- 中心卡片头部区域 -->
    <div class="center-head-card">
        <h2>项目</h2>
    </div>
    <hr>
    <!-- 中心卡片内容 -->
    <div class="center-card-content">
        <div v-if="loading" class="loading-message">
            <p>加载中...</p>
        </div>
        <div v-else-if="error" class="error-message">
            <p>{{ error }}</p>
        </div>
        <template v-else-if="getCurrentCategory()">
            <!-- 分类标题 -->
            <div class="category-title">
                <h3>{{ getCurrentCategory().name }}</h3>
            </div>
            <hr>
            <!-- 分类项目列表 -->
            <div class="projects-content">
                <RouterLink v-for="project in getCurrentCategory().projects" :key="project.id" :to="`/project/${project.id}`" class="project-card">
                    <div class="project-name">{{ project.name }}</div>
                    <div class="project-description">{{ project.description }}</div>
                </RouterLink>
            </div>
        </template>
        <div v-else class="empty-message">
            <p>暂无项目数据</p>
        </div>
    </div>
    <hr>
    <PageNav
        type="projects"
        :current-page="currentPage"
        :total-pages="totalPages"
        :categories="categories"
        :current-category="getCurrentCategory()?.name || ''"
        @change="changePage"
    />
</template>

<style scoped>
.projects-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.project-card {
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

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-width: 4px;
}

.project-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
    color: var(--center-card-title-color);
}

.project-description {
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

/* 加载和错误提示样式 */
.loading-message,
.error-message,
.empty-message {
    text-align: center;
    padding: 50px 0;
    color: var(--text-color);
}

/*==============================响应式设计媒体查询=============================*/
/* 超小屏手机(576px) */
@media (max-width: 575.98px) {
    .projects-content {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
    }
    
    .project-card {
        height: 120px;
        padding: 12px;
    }
    
    .project-name {
        font-size: 1rem;
    }
    
    .project-description {
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
    .projects-content {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }
    
    .project-card {
        height: 130px;
        padding: 15px;
    }
    
    .project-name {
        font-size: 1.1rem;
    }
    
    .project-description {
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
    .projects-content {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .project-card {
        height: 150px;
        padding: 20px;
    }
    
    .project-name {
        font-size: 1.2rem;
    }
    
    .project-description {
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
    .projects-content {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
}

/* 大屏桌面及横屏(1200px) */
@media (min-width: 1200px) {
    /* 宽屏布局 */
    .projects-content {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* 超大屏及以上 (1440px) */
@media (min-width: 1440px) {
    /* 超大屏优化 */    
    .projects-content {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>