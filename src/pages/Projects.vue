<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import PageNav from '../components/p-center/PageNav.vue'

// SEO 配置
useHead({
  title: '项目 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru的个人项目展示，包含博客、前端开发、后端开发等各类项目的详细介绍' },
    { name: 'keywords', content: '项目,个人项目,博客,前端,后端,开发' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/projects' },
    { property: 'og:title', content: '项目 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru的个人项目展示' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/projects' },
    { name: 'twitter:title', content: '项目 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru的个人项目展示' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/projects' }
  ]
})

const projects = ref([])
const categories = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

const loadProjects = async () => {
    try {
        const response = await fetch('/config/projects.json')
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        projects.value = data
        categorizeProjects()
    } catch (error) {
        console.error('加载项目失败:', error)
        projects.value = []
    }
}

const categorizeProjects = () => {
    const categoryMap = {}
    
    projects.value.forEach(project => {
        const category = project.category
        if (!categoryMap[category]) {
            categoryMap[category] = []
        }
        categoryMap[category].push(project)
    })
    
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
        <template v-if="getCurrentCategory()">
            <!-- 项目列表 -->
            <div class="projects-content">
                <RouterLink v-for="project in getCurrentCategory().projects" :key="project.id" :to="`/project/${project.id}`" class="project-card">
                    <div class="project-name">{{ project.name }}</div>
                    <div class="project-description">{{ project.description }}</div>
                </RouterLink>
            </div>
        </template>
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
/* 布局样式 */
.projects-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.project-card {
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

.project-card:hover {
    transform: translateY(-5px);
    border-width: 4px;
}

.project-name {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 8px;
}

.project-description {
    font-size: 0.9rem;
    opacity: 0.8;
    flex: 1;
}


</style>

<style scoped>
/* 颜色样式 */
.project-card {
    border-color: var(--common-color-1);
    background-color: var(--common-bg);
    color: var(--common-text);
    transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
}

.project-card:hover {
    box-shadow: 0 4px 8px var(--common-shadow);
}

.project-name {
    color: var(--common-text);
}

.project-description {
    color: var(--common-text);
}


</style>

<style scoped>
/* 响应式设计媒体查询 */
@media (max-width: calc(var(--sm) - 1px)) {
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
}

@media (max-width: var(--sm)) {
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
}

@media (max-width: var(--md)) {
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
}

@media (max-width: var(--lg)) {
    .projects-content {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
}

@media (max-width: var(--xl)) {
    .projects-content {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: var(--2xl)) {
    .projects-content {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
