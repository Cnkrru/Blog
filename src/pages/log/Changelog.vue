<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import BackToTop from '../../components/p-center/BackToTop.vue'
import ContentRender from '../../components/content/ContentRender.vue'
import ReadingTime from '../../components/p-center/ReadingTime.vue'
import Toc from '../../components/p-center/Toc.vue'
import TocButton from '../../components/p-center/TocButton.vue'
import PostMenu from '../../components/p-center/PostMenu.vue'


import Comment from '../../components/api/Comment.vue'

const route = useRoute()
const router = useRouter()
const postId = computed(() => 'changelog')
const showToc = ref(false)
const showPostMenu = ref(false)
const prevPost = ref(null)
const nextPost = ref(null)
const post = ref(null)
const loading = ref(true)
const error = ref(null)
const toc = ref([])
const contentCard = ref(null)

// 在组件顶层调用 useHead，使用响应式数据
useHead({
  title: computed(() => '网站更新日志 - Cnkrru\'s Blog'),
  meta: computed(() => [
    {
      name: 'description',
      content: 'Cnkrru\'s Blog网站更新日志，记录网站的更新历史和功能变更'
    },
    {
      name: 'keywords',
      content: '更新日志,网站更新,功能变更,Cnkrru'
    },
    {
      name: 'author',
      content: 'Cnkrru'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/changelog' },
    { property: 'og:title', content: '网站更新日志 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru\'s Blog网站更新日志，记录网站的更新历史和功能变更' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/changelog' },
    { name: 'twitter:title', content: '网站更新日志 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru\'s Blog网站更新日志' }
  ]),
  link: computed(() => [
    {
      rel: 'canonical',
      href: 'https://cnkrru.top/changelog'
    }
  ])
})

const toggleToc = () => {
    showToc.value = !showToc.value
}

const scrollToTop = () => {
    const centerCardContent = document.querySelector('.center-card-content');
    if (centerCardContent) {
        centerCardContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

const handlePostLoaded = (loadedPost) => {
    post.value = loadedPost
    setTimeout(() => {
        scrollToTop()
    }, 100)
}

const handleLoading = (isLoading) => {
    loading.value = isLoading
}

const handleError = (err) => {
    error.value = err
}

const handlePrevNextPosts = (data) => {
    prevPost.value = data.prevPost
    nextPost.value = data.nextPost
}

const handleTocUpdate = (newToc) => {
    toc.value = newToc
}

onMounted(() => {
    scrollToTop()
})
</script>

<template>
    <div id="site-stats-container"></div>
    <div class="center-head-card">
        <h2>{{ post?.title || '网站更新日志' }}</h2>
        <div class="center-head-card-tools">
            <BackToTop />
            <PostMenu v-model:show="showPostMenu" />
            <TocButton v-model:show="showToc" />
        </div>
    </div>
    
    <Toc v-model:show="showToc" :toc="toc" />
    
    <hr>
    
    <div class="center-card-content" ref="contentCard">
        <ReadingTime v-if="!loading && !error" />
        <ContentRender 
            :id="postId" 
            type="post"
            @content-loaded="handlePostLoaded"
            @loading="handleLoading"
            @error="handleError"
            @prev-next-posts="handlePrevNextPosts"
            @update:toc="handleTocUpdate"
        />
        
        <hr v-if="!loading && !error">
        
        <Share v-if="!loading && !error" />
        
        <hr v-if="!loading && !error">
        
        <div class="read-center-card-footer" v-if="!loading && !error">
            <p>© 2026 Cnkrru's Blog. All rights reserved.</p>
        </div>
        
        <Comment v-if="!loading && !error" />
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
