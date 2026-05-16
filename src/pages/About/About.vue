<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownRender from '../../components/content/MarkdownRender.vue'
import GitHub from '../../components/api/GitHub.vue'
import { useHead } from '@vueuse/head'

// SEO 配置
useHead({
  title: '关于 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: '关于Cnkrru和Cnkrru\'s Blog，了解作者的个人经历、技术技能和創作初衷' },
    { name: 'keywords', content: '关于,个人简介,技术经历,Cnkrru' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/about' },
    { property: 'og:title', content: '关于 - Cnkrru\'s Blog' },
    { property: 'og:description', content: '关于Cnkrru和Cnkrru\'s Blog，了解作者的个人经历、技术技能和創作初衷' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/about' },
    { name: 'twitter:title', content: '关于 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: '关于Cnkrru和Cnkrru\'s Blog，了解作者的个人经历、技术技能和创作初衷' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/about' }
  ]
})

// About页面标题
const AboutTitle = '关于'
const aboutContent = ref('')
const loading = ref(true)
const error = ref(null)

const loadAboutContent = async () => {
    try {
        loading.value = true
        error.value = null
        
        // 从src/pages/about.md读取Markdown文件
        const mdModule = await import('./about.md?raw')
        aboutContent.value = mdModule.default
    } catch (importError) {
        error.value = '加载关于页面内容失败'
        aboutContent.value = ''
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadAboutContent()
})
</script>


<template>
    <div class="center-head-card">
        <h2>{{ AboutTitle }}</h2>
    </div>
    <hr>
    <div class="center-card-content">
        <div class="about-center-card-body">
            <div v-if="loading" class="loading-message">
                <p>加载中...</p>
            </div>
            <div v-else-if="error" class="error-message">
                <p>{{ error }}</p>
            </div>
            <div v-else class="text-style">
                <MarkdownRender :content="aboutContent" />
            </div>
            
            <div class="github-section">
                <GitHub username="Cnkrru" />
            </div>
        </div>
    </div>
    <hr>
</template>

<style scoped>
/* 布局样式 */
.about-center-card-body {
    width: 100%;
    height: auto;
    overflow: visible;
}

.about-center-card-footer {
    width: 100%;
    height: 100px;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}

.github-section {
    margin: 30px 0;
    width: 100%;
}

.github-section :deep(.github-container) {
    margin: 0;
}
</style>

<style scoped>
/* 颜色样式 */
</style>

<style scoped>
/* 响应式设计媒体查询 */
@media (max-width: 639px) {
    .about-center-card-footer {
        height: 120px;
    }
}

@media (max-width: 640px) {
    /* 保持现有样式 */
}

@media (max-width: 768px) {
    .about-center-card-footer {
        height: 100px;
    }
}
</style>
