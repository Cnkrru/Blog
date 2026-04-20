<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import BackToTop from '../../components/functions/center/BackToTop.vue'
import LoaderPost from '../../components/functions/center/LoaderPost.vue'
import ReadingTime from '../../components/functions/center/ReadingTime.vue'
import Toc from '../../components/functions/center/Toc.vue'
import TocButton from '../../components/functions/center/TocButton.vue'
import PostMenu from '../../components/functions/center/PostMenu.vue'
import Share from '../../components/functions/center/Share.vue'

import Comment from '../../components/functions/center/Comment.vue'

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
    // 按照 BackToTop 组件的实现方法，使用 document.querySelector 获取中心卡片内容区域
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
    // 文章加载完成后滚动到顶部，添加延迟确保内容已完全渲染
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
    <!-- 中心卡片头部区域 -->
    <div class="center-head-card">
        <h2>{{ post?.title || '网站更新日志' }}</h2>
        <div class="center-head-card-tools">
            <BackToTop />
            <PostMenu v-model:show="showPostMenu" />
            <TocButton v-model:show="showToc" />
        </div>
    </div>
    
    <!-- 文章目录卡片 -->
    <Toc v-model:show="showToc" :toc="toc" />
    
    <hr>
    
    <div class="center-card-content" ref="contentCard">
        <!-- 阅读时间卡片 -->
        <ReadingTime v-if="!loading && !error" />
        <LoaderPost 
            :post-id="postId" 
            @post-loaded="handlePostLoaded"
            @loading="handleLoading"
            @error="handleError"
            @prev-next-posts="handlePrevNextPosts"
            @update:toc="handleTocUpdate"
        />
        
        
        <hr v-if="!loading && !error">
        
        <!-- 分享按钮容器 -->
        <Share v-if="!loading && !error" />
        
        <hr v-if="!loading && !error">
        
        <div class="read-center-card-footer" v-if="!loading && !error">
            <p>© 2026 Cnkrru's Blog. All rights reserved.</p>
        </div>
        
        <!-- 评论区域 -->
        <Comment v-if="!loading && !error" />
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