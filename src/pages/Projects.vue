<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useHead } from '@vueuse/head'
import PageNav from '../components/p-center/PageNav.vue'
import arrowRightSvg from '@/assets/svg/arrow-right.svg?raw'

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
        const { data } = await axios.get('/config/projects.json')
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
                    <div class="card-accent"></div>
                    <div class="card-body">
                        <div class="card-meta">
                            <span class="card-category">{{ project.category }}</span>
                            <span class="card-date">{{ project.date }}</span>
                        </div>
                        <h3 class="card-title">{{ project.title }}</h3>
                        <p class="card-desc">{{ project.description }}</p>
                        <div class="card-footer">
                            <div class="card-tags" v-if="project.tags && project.tags.length">
                                <span v-for="t in project.tags.slice(0, 3)" :key="t" class="card-tag">{{ t }}</span>
                            </div>
                            <span class="card-arrow">
                                <span class="svg-icon" :style="{ width: '16px', height: '16px' }" v-html="arrowRightSvg"></span>
                            </span>
                        </div>
                    </div>
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
/* ========== 布局 ========== */
.projects-content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
.projects-content > * {
    flex: 1 1 300px;
    max-width: 100%;
}

/* ========== 卡片容器 ========== */
.project-card {
    display: flex;
    flex-direction: column;
    border-radius: 14px;
    text-decoration: none;
    min-height: 180px;
    position: relative;
    overflow: hidden;
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.35s ease,
        border-color 0.3s ease;
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.45);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid color-mix(in srgb, var(--common-text) 6%, transparent);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 顶部装饰条 */
.card-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--common-color-1), color-mix(in srgb, var(--common-color-1) 40%, transparent));
    opacity: 0;
    transform: scaleX(0.4);
    transform-origin: left;
    transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 8px 28px rgba(0, 0, 0, 0.08);
    border-color: color-mix(in srgb, var(--common-color-1) 35%, transparent);
}

.project-card:hover .card-accent {
    opacity: 1;
    transform: scaleX(1);
}

/* ========== 卡片主体 ========== */
.card-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 22px 24px;
}

/* ========== 元信息行：分类 + 日期 ========== */
.card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.card-category {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
    color: var(--common-color-1);
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.card-date {
    font-size: 11px;
    color: var(--common-text);
    opacity: 0.35;
    font-variant-numeric: tabular-nums;
}

/* ========== 卡片标题 ========== */
.card-title {
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0 0 10px;
    line-height: 1.4;
    color: var(--common-text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.25s ease;
}

.project-card:hover .card-title {
    color: var(--common-color-1);
}

/* ========== 卡片描述 ========== */
.card-desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--common-text);
    opacity: 0.55;
    flex: 1;
    margin: 0 0 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* ========== 卡片底部：标签 + 箭头 ========== */
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 22px;
}

.card-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.card-tag {
    font-size: 10px;
    padding: 3px 9px;
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--common-color-1) 20%, transparent);
    color: var(--common-color-1);
    opacity: 0.7;
    transition: opacity 0.2s ease, border-color 0.2s ease;
}

.project-card:hover .card-tag {
    opacity: 0.9;
    border-color: color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

.card-arrow {
    display: flex;
    align-items: center;
    color: var(--common-color-1);
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    flex-shrink: 0;
    margin-left: auto;
}

.project-card:hover .card-arrow {
    opacity: 1;
    transform: translateX(0);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
    .projects-content { gap: 14px; }
    .project-card { min-height: 160px; }
    .card-body { padding: 18px 20px; }
    .card-title { font-size: 1.05rem; }
    .card-desc { font-size: 0.82rem; }
}

@media (max-width: 640px) {
    .projects-content { gap: 10px; }
    .projects-content > * { flex: 1 1 100%; }
    .project-card { min-height: 140px; }
    .card-body { padding: 14px 16px; }
    .card-title { font-size: 0.95rem; }
    .card-desc { font-size: 0.78rem; }
    .card-meta { margin-bottom: 8px; }
    .card-desc { margin-bottom: 10px; }
}
</style>
