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
import ArticleNav from '../../components/p-center/ArticleNav.vue'

import Comment from '../../components/api/Comment.vue'
import RelatedArticles from '../../components/p-center/RelatedArticles.vue'
import SiteStats from '../../components/p-center/SiteStats.vue'
import ShareButton from '../../components/api/ShareButton.vue'
import Sponsor from '../../components/api/Sponsor.vue'

const route = useRoute()
const router = useRouter()
const postId = computed(() => route.params.id)
const showToc = ref(false)
const showPostMenu = ref(false)
const prevPost = ref(null)
const nextPost = ref(null)
const post = ref(null)
const loading = ref(true)
const error = ref(null)
const contentCard = ref(null)

useHead({
  title: computed(() => post.value ? (post.value.seoTitle || `${post.value.title} - 我的博客`) : '文章详情 - 我的博客'),
  meta: computed(() => [
    {
      name: 'description',
      content: post.value ? (post.value.description || `${post.value.title} - 我的博客文章`) : '文章详情'
    },
    {
      name: 'keywords',
      content: post.value ? (post.value.keywords || (post.value.tags ? post.value.tags.join(', ') : '')) : '文章,博客'
    },
    {
      name: 'author',
      content: post.value ? (post.value.author || 'Cnkrru') : 'Cnkrru'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    {
      property: 'og:title',
      content: post.value ? (post.value.seoTitle || post.value.title) : '文章详情 - 我的博客'
    },
    {
      property: 'og:description',
      content: post.value ? (post.value.description || `${post.value.title} - 我的博客文章`) : '文章详情'
    },
    {
      property: 'og:url',
      content: `https://cnkrru.top/post/${postId.value}`
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'og:image',
      content: post.value ? `https://cnkrru.top/og/post-${post.value.id}.svg` : 'https://cnkrru.top/og/default.svg'
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
      content: `https://cnkrru.top/post/${postId.value}`
    },
    {
      name: 'twitter:title',
      content: post.value ? (post.value.seoTitle || post.value.title) : '文章详情 - 我的博客'
    },
    {
      name: 'twitter:description',
      content: post.value ? (post.value.description || `${post.value.title} - 我的博客文章`) : '文章详情' 
    },
    {
      name: 'twitter:image',
      content: post.value ? `https://cnkrru.top/og/post-${post.value.id}.svg` : 'https://cnkrru.top/og/default.svg'
    },
    {
      name: 'twitter:site',
      content: '@Cnkrru'
    }
  ]),
  link: computed(() => [
    {
      rel: 'canonical',
      href: `https://cnkrru.top/post/${postId.value}`
    }
  ]),
  script: computed(() => post.value ? [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.value.title,
        'description': post.value.description || `${post.value.title} - 我的博客文章`,
        'datePublished': post.value.date,
        'author': {
          '@type': 'Person',
          'name': post.value.author || '作者名'
        },
        'image': `https://cnkrru.top/og/post-${post.value.id}.svg`,
        'url': `https://cnkrru.top/post/${postId.value}`
      })
    }
  ] : [])
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



const handleArticleNav = (post) => {
    if (post && post.id) {
        router.push(`/post/${post.id}`)
    }
}

watch(() => route.params.id, () => {
    setTimeout(() => {
        scrollToTop()
    }, 500)
})

onMounted(() => {
    scrollToTop()
})
</script>

<template>
    <div id="site-stats-container"></div>
    <div class="center-head-card">
        <h2>{{ post?.title || '文章详情' }}</h2>
        <div class="center-head-card-tools">
            <BackToTop />
            <PostMenu v-model:show="showPostMenu" />
            <TocButton v-model:show="showToc" />
        </div>
    </div>
    
    <Toc v-model:show="showToc" />
    
    <hr>

    <div class="center-card-content" ref="contentCard">
        <!-- 文章封面图 -->
        <div class="post-cover" v-if="!loading && !error && post">
          <img :src="`/og/post-${post.id}.svg`" :alt="post.title" class="cover-image" />
        </div>

        <ReadingTime v-if="!loading && !error" />
        <ContentRender 
            :key="postId"
            :id="postId" 
            type="post"
            @content-loaded="handlePostLoaded"
            @loading="handleLoading"
            @error="handleError"
            @prev-next-posts="handlePrevNextPosts"
        />
        
        <hr v-if="!loading && !error">
        
        <ArticleNav :prev-post="prevPost" :next-post="nextPost" @navigate="handleArticleNav" v-if="!loading && !error" />
        
        <RelatedArticles 
            :current-article-id="postId" 
            :current-article-category="post?.category || ''" 
            v-if="!loading && !error && post" 
        />
        
        <hr v-if="!loading && !error">

        <div class="read-center-card-footer" v-if="!loading && !error">
            <p>© 2026 Cnkrru's Blog. All rights reserved.</p>
        </div>

        <ShareButton
            v-if="!loading && !error && post"
            :title="post?.title || ''"
            :url="`https://cnkrru.top/post/${postId}`"
            :description="post?.description || ''"
        />

        <Sponsor v-if="!loading && !error && post" />

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
    flex-shrink: 0;
    gap: 6px;
}

/* 移动端：按钮一行在上，标题一行在下 */
@media (max-width: 639px) {
    :deep(.center-head-card) {
        flex-direction: column-reverse;
        align-items: flex-start;
        gap: 6px;
    }

    :deep(.center-head-card h2) {
        width: 100%;
        height: auto;
        font-size: 16px;
        line-height: 1.4;
        white-space: normal;
    }

    .center-head-card-tools {
        width: 100%;
        justify-content: flex-start;
    }
}
</style>

<style scoped>
/* 封面图 */
.post-cover {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    border: 3px solid var(--common-color-1);
    margin-bottom: 10px;
}

.cover-image {
    width: 100%;
    display: block;
}

/* 颜色样式 */
.loading-message,
.error-message {
    color: #666;
}
</style>

<style scoped>
/* 响应式设计媒体查询 */
</style>
