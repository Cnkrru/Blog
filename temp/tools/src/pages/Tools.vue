<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import PageNav from '../components/PageNav.vue'

// SEO 配置
useHead({
  title: '工具 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog精选的实用工具和资源，包括开发工具、效率工具和在线工具' },
    { name: 'keywords', content: '工具,资源,实用工具,在线工具,开发工具' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/tools' },
    { property: 'og:title', content: '工具 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru\'s Blog精选的实用工具和资源' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: 'Cnkrru\'s Blog' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/tools' },
    { name: 'twitter:title', content: '工具 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru\'s Blog精选的实用工具和资源' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/tools' }
  ]
})

const tools = ref([])
const categories = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const error = ref(null)

const loadTools = async () => {
    try {
        loading.value = true
        error.value = null
        // 从tools.json获取工具数据
        const response = await fetch('/config/tools.json')
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        tools.value = data
        categorizeTools()
    } catch (err) {
        console.error('加载工具失败:', err)
        error.value = '加载工具失败'
        tools.value = []
    } finally {
        loading.value = false
    }
}

const categorizeTools = () => {
    // 按分类分类工具
    const categoryMap = {}
    
    tools.value.forEach(tool => {
        const category = tool.category
        if (!categoryMap[category]) {
            categoryMap[category] = []
        }
        categoryMap[category].push(tool)
    })
    
    // 转换为数组并按分类名称排序，每个分类下的工具按id降序排序
    categories.value = Object.keys(categoryMap).map(category => {
        return {
            name: category,
            tools: categoryMap[category].sort((a, b) => {
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
    loadTools()
})
</script>

<template>
        <div id="site-stats-container"></div>
        <!-- 中心卡片头部区域 -->
        <div class="center-head-card">
            <h2>工具</h2>
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
                <!-- 分类工具列表 -->
                <div class="tools-content">
                    <RouterLink v-for="tool in getCurrentCategory().tools" :key="tool.id" :to="`/tool/${tool.id}`" class="tool-card">
                        <div class="tool-name">{{ tool.name }}</div>
                        <div class="tool-description">{{ tool.description }}</div>
                    </RouterLink>
                </div>
            </template>
            <div v-else class="empty-message">
                <p>暂无工具数据</p>
            </div>
        </div>
        <hr>
        <PageNav
            type="tools"
            :current-page="currentPage"
            :total-pages="totalPages"
            :categories="categories"
            :current-category="getCurrentCategory()?.name || ''"
            @change="changePage"
        />
</template>

<style scoped>
.tools-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.tool-card {
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

.tool-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-width: 4px;
}

.tool-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
    color: var(--center-card-title-color);
}

.tool-description {
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
    background-color: var(--hover-color);
    transform: none;
}

.pagination .active a {
    background-color: var(--active-color);
    color: white;
    border-color: var(--active-color);
}

.pagination .disabled a {
    background-color: var(--card-bg);   
    color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
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

/* 响应式设计媒体查询 */
@media (max-width: 768px) {
    .tools-content {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }
    
    .tool-card {
        height: 130px;
        padding: 15px;
    }
    
    .tool-name {
        font-size: 1.1rem;
    }
    
    .tool-description {
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

@media (min-width: 1200px) {
    .tools-content {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>