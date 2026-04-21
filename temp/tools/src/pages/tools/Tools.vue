<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import BackToTop from '../../components/functions/center/BackToTop.vue'
import LoaderTool from '../../components/functions/center/LoaderTool.vue'
import ReadingTime from '../../components/functions/center/ReadingTime.vue'
import Toc from '../../components/functions/center/Toc.vue'
import TocButton from '../../components/functions/center/TocButton.vue'
import PostMenu from '../../components/functions/center/PostMenu.vue'
import Share from '../../components/functions/center/Share.vue'
import Comment from '../../components/functions/center/Comment.vue'
import SiteStats from '../../components/functions/center/SiteStats.vue'


const route = useRoute()
const toolId = computed(() => route.params.id)
const showToc = ref(false)
const showPostMenu = ref(false)
const tool = ref(null)
const loading = ref(true)
const error = ref(null)
const toc = ref([])
const prevTool = ref(null)
const nextTool = ref(null)

// 在组件顶层调用 useHead，使用响应式数据
useHead({
  title: computed(() => tool.value ? (tool.value.seoTitle || `${tool.value.name} - 工具分享`) : '工具详情 - 我的博客'),
  meta: computed(() => [
    {
      name: 'description',
      content: tool.value ? (tool.value.description || `${tool.value.name} - 实用工具`) : '工具详情'
    },
    {
      name: 'keywords',
      content: tool.value ? (tool.value.keywords || (tool.value.tags ? tool.value.tags.join(', ') : '')) : '工具,博客'
    },
    {
      name: 'author',
      content: tool.value ? (tool.value.author || 'Cnkrru') : 'Cnkrru'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    // Open Graph 标签
    {
      property: 'og:title',
      content: tool.value ? (tool.value.seoTitle || tool.value.name) : '工具详情 - 我的博客'
    },
    {
      property: 'og:description',
      content: tool.value ? (tool.value.description || `${tool.value.name} - 实用工具`) : '工具详情'
    },
    {
      property: 'og:url',
      content: `https://cnkrru.top/tools/${toolId.value}`
    },
    {
      property: 'og:type',
      content: 'website'
    },
    { 
      property: 'og:image',
      content: tool.value ? (tool.value.image || 'https://cnkrru.top/default-image.jpg') : 'https://cnkrru.top/default-image.jpg'
    },
    {
      property: 'og:site_name',
      content: 'Cnkrru\'s Blog'
    },
    {
      property: 'og:locale',
      content: 'zh_CN'
    },
    // Twitter Card 标签
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:url',
      content: `https://cnkrru.top/tools/${toolId.value}`
    },
    {
      name: 'twitter:title',
      content: tool.value ? (tool.value.seoTitle || tool.value.name) : '工具详情 - 我的博客'
    },
    {
      name: 'twitter:description',
      content: tool.value ? (tool.value.description || `${tool.value.name} - 实用工具`) : '工具详情'
    },
    {
      name: 'twitter:image',
      content: tool.value ? (tool.value.image || 'https://cnkrru.top/default-image.jpg') : 'https://cnkrru.top/default-image.jpg'
    },
    {
      name: 'twitter:site',
      content: '@Cnkrru'
    }
  ]),
  link: computed(() => [
    {
      rel: 'canonical',
      href: `https://cnkrru.top/tools/${toolId.value}`
    }
  ]),
  script: computed(() => tool.value ? [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': tool.value.name,
        'description': tool.value.description || `${tool.value.name} - 实用工具`,
        'dateCreated': tool.value.date,
        'creator': {
          '@type': 'Person',
          'name': tool.value.author || '作者名'
        },
        'image': tool.value.image || 'https://cnkrru.top/default-image.jpg',
        'url': `https://cnkrru.top/tools/${toolId.value}`
      })
    }
  ] : [])
})

const handleToolLoaded = (loadedTool) => {
    if (loadedTool) {
        tool.value = loadedTool
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
    <!-- 中心卡片头部区域 -->
    <div class="center-head-card">
        <h2>{{ tool?.name || '工具详情' }}</h2>
        <div class="center-head-card-tools">
            <BackToTop />
            <PostMenu v-model:show="showPostMenu" />
            <TocButton v-model:show="showToc" />
        </div>
    </div>
    
    <!-- 工具目录卡片 -->
    <Toc v-model:show="showToc" :toc="toc" />
    
    <hr>
    
    <div class="center-card-content">
        <!-- 阅读时间卡片 -->
        <ReadingTime v-if="!loading && !error" />
        <LoaderTool 
            :key="toolId"
            :tool-id="toolId" 
            @tool-loaded="handleToolLoaded"
            @loading="handleLoading"
            @error="handleError"
        />
        
        <hr v-if="!loading && !error">
        
        <!-- 分享按钮容器 -->
        <Share v-if="!loading && !error" />
        
        <hr v-if="!loading && !error">
        
        <!-- 二维数组容器 -->

        
        <hr v-if="!loading && !error">
        
        <div class="read-center-card-footer" v-if="!loading && !error">
            <p>© 2026 Cnkrru's Blog. All rights reserved.</p>
        </div>
        
        <!-- 评论区域 -->
        <Comment v-if="!loading && !error" />
        
        <hr v-if="!loading && !error">
        
        <!-- 站点统计 -->
        <SiteStats v-if="!loading && !error" />
    </div>
    <hr>
</template>

<style scoped>
/* 加载和错误提示样式 */
.loading-message,
.error-message {
    text-align: center;
    padding: 50px 0;
    color: #666;
}

.center-head-card-tools {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>