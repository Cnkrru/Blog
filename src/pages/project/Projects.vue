<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import BackToTop from '../../components/p-center/BackToTop.vue'
import ContentRender from '../../components/content/ContentRender.vue'
import ReadingTime from '../../components/p-center/ReadingTime.vue'
import Toc from '../../components/p-center/Toc.vue'
import TocButton from '../../components/p-center/TocButton.vue'
import PostMenu from '../../components/p-center/PostMenu.vue'


import Comment from '../../components/api/Comment.vue'
import ArticleNav from '../../components/p-center/ArticleNav.vue'
import SiteStats from '../../components/p-center/SiteStats.vue'

const route = useRoute()
const projectId = computed(() => route.params.id)
const showToc = ref(false)
const showPostMenu = ref(false)
const project = ref(null)
const loading = ref(true)
const error = ref(null)
const toc = ref([])
const prevProject = ref(null)
const nextProject = ref(null)

useHead({
  title: computed(() => project.value ? (project.value.seoTitle || `${project.value.name} - 项目展示`) : '项目详情 - 我的博客'),
  meta: computed(() => [
    {
      name: 'description',
      content: project.value ? (project.value.description || `${project.value.name} - 我的项目`) : '项目详情'
    },
    {
      name: 'keywords',
      content: project.value ? (project.value.keywords || (project.value.tags ? project.value.tags.join(', ') : '')) : '项目,博客'
    },
    {
      name: 'author',
      content: project.value ? (project.value.author || 'Cnkrru') : 'Cnkrru'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      property: 'og:title',
      content: project.value ? (project.value.seoTitle || project.value.name) : '项目详情 - 我的博客'
    },
    {
      property: 'og:description',
      content: project.value ? (project.value.description || `${project.value.name} - 我的项目`) : '项目详情'
    },
    {
      property: 'og:url',
      content: `https://cnkrru.top/project/${projectId.value}`
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:image',
      content: project.value ? (project.value.image || 'https://cnkrru.top/default-image.jpg') : 'https://cnkrru.top/default-image.jpg'
    },
    {
      property: 'og:site_name',
      content: 'Cnkrru\'s Blog'
    },
    {
      property: 'og:locale',
      content: 'zh_CN'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:url',
      content: `https://cnkrru.top/project/${projectId.value}`
    },
    {
      name: 'twitter:title',
      content: project.value ? (project.value.seoTitle || project.value.name) : '项目详情 - 我的博客'
    },
    {
      name: 'twitter:description',
      content: project.value ? (project.value.description || `${project.value.name} - 我的项目`) : '项目详情'
    },
    {
      name: 'twitter:image',
      content: project.value ? (project.value.image || 'https://cnkrru.top/default-image.jpg') : 'https://cnkrru.top/default-image.jpg'
    },
    {
      name: 'twitter:site',
      content: '@Cnkrru'
    }
  ]),
  link: computed(() => [
    {
      rel: 'canonical',
      href: `https://cnkrru.top/project/${projectId.value}`
    }
  ]),
  script: computed(() => project.value ? [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        'name': project.value.name,
        'description': project.value.description || `${project.value.name} - 我的项目`,
        'dateCreated': project.value.date,
        'creator': {
          '@type': 'Person',
          'name': project.value.author || '作者名'
        },
        'image': project.value.image || 'https://cnkrru.top/default-image.jpg',
        'url': `https://cnkrru.top/project/${projectId.value}`
      })
    }
  ] : [])
})

const handleProjectLoaded = (loadedProject) => {
    if (loadedProject) {
        project.value = loadedProject
    }
}

const handleLoading = (isLoading) => {
    loading.value = isLoading
}

const handleError = (err) => {
    error.value = err
}
</script>

<template>
    <div id="site-stats-container"></div>
    <div class="center-head-card">
        <h2>{{ project?.name || '项目详情' }}</h2>
        <div class="center-head-card-tools">
            <BackToTop />
            <PostMenu v-model:show="showPostMenu" />
            <TocButton v-model:show="showToc" />
        </div>
    </div>
    
    <Toc v-model:show="showToc" :toc="toc" />
    
    <hr>
    
    <div class="center-card-content">
        <ReadingTime v-if="!loading && !error" />
        <ContentRender 
            :key="projectId"
            :id="projectId" 
            type="project"
            @content-loaded="handleProjectLoaded"
            @loading="handleLoading"
            @error="handleError"
        />
        
        <hr v-if="!loading && !error">
        
        <ArticleNav :prev-post="prevProject" :next-post="nextProject" v-if="!loading && !error" />
        
        <hr v-if="!loading && !error">
        
        <Share v-if="!loading && !error" /> 

        <hr v-if="!loading && !error">
        
        <div class="read-center-card-footer" v-if="!loading && !error">
            <p>© 2026 Cnkrru's Blog. All rights reserved.</p>
        </div>
        
        <Comment v-if="!loading && !error" />
        
        <hr v-if="!loading && !error">
        
        <SiteStats v-if="!loading && !error" />
    </div>
    <hr>
</template>

<style scoped>
/* 布局样式 */
.loading-message,
.error-message {
    text-align: center;
    padding: 50px 0;
}

.center-head-card-tools {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>

<style scoped>
/* 颜色样式 */
.loading-message,
.error-message {
    color: #666;
}
</style>

<style scoped>
/* 响应式设计媒体查询 */
</style>
