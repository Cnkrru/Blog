<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import Announcement from './announcement/Announcement.vue'
import ArticleCount from '../components/p-center/ArticleCount.vue'
import PageNav from '../components/p-center/PageNav.vue'
import { useArticlesStore } from '../stores/index'

const store = useArticlesStore()

useHead({
  title: '首页 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: '欢迎来到Cnkrru\'s Blog，分享技术和生活的个人空间' },
    { name: 'keywords', content: '博客,技术,生活,分享,前端开发,Vue,JavaScript' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/home' },
    { property: 'og:title', content: '首页 - Cnkrru\'s Blog' },
    { property: 'og:description', content: '欢迎来到Cnkrru\'s Blog，分享技术和生活的个人空间' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/home' },
    { name: 'twitter:title', content: '首页 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: '欢迎来到Cnkrru\'s Blog，分享技术和生活的个人空间' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/home' }
  ]
})

const articles = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(6)
const totalPages = ref(1)
const loading = ref(true)
const error = ref<null | string>(null)

const pinnedPosts = ref<any[]>([])
const hasPinned = ref(false)

const loadArticles = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await store.fetchArticles()
    articles.value = data.filter(a => a.id !== 'terminal' && a.id !== 'changelog')
    pinnedPosts.value = articles.value.filter(a => a.pinned === true)
    hasPinned.value = pinnedPosts.value.length > 0
    calculateTotalPages()
  } catch (err) {
    error.value = '加载文章失败'
    articles.value = []
  } finally {
    loading.value = false
  }
}

const calculateTotalPages = () => {
  const others = articles.value.filter(a => !a.pinned)
  totalPages.value = Math.ceil((others.length) / pageSize.value) || 1
}

const getPaginatedArticles = () => {
  const others = articles.value
    .filter(a => !a.pinned)
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))

  const start = (currentPage.value - 1) * pageSize.value
  return others.slice(start, start + pageSize.value)
}

const changePage = (p: number) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

onMounted(() => loadArticles())
</script>

<template>
  <div id="site-stats-container"></div>
  <div class="center-head-card">
    <h2>最新文章</h2>
    <ArticleCount />
    <Announcement />
  </div>
  <hr>
  <div class="center-card-content">
    <!-- Loading -->
    <div v-if="loading" class="skel-grid">
      <div v-for="n in 6" :key="n" class="skel-card">
        <div class="skel-img"></div>
        <div class="skel-body">
          <div class="skel-line w60"></div>
          <div class="skel-line w40"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="err-msg"><p>{{ error }}</p></div>

    <template v-else>
      <!-- 置顶区 -->
      <div v-if="hasPinned && currentPage === 1" class="pinned-section">
        <div class="pinned-label">📌 置顶</div>
        <div class="card-grid">
          <RouterLink
            v-for="a in pinnedPosts"
            :key="a.id"
            :to="`/post/${a.id}`"
            class="post-card pinned"
          >
            <div class="card-cover">
              <img :src="`/og/post-${a.id}.svg`" :alt="a.title" />
              <span class="pin-badge">📌</span>
            </div>
            <div class="card-info">
              <h3 class="card-title">{{ a.title }}</h3>
              <p class="card-date">{{ a.date }}</p>
              <div class="card-tags">
                <span v-for="t in (a.tags || []).slice(0, 3)" :key="t" class="card-tag">{{ t }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
        <hr class="section-divider" v-if="getPaginatedArticles().length > 0">
      </div>

      <!-- 文章网格 -->
      <div class="card-grid" v-if="getPaginatedArticles().length > 0">
        <RouterLink
          v-for="a in getPaginatedArticles()"
          :key="a.id"
          :to="`/post/${a.id}`"
          class="post-card"
        >
          <div class="card-cover">
            <img :src="`/og/post-${a.id}.svg`" :alt="a.title" />
          </div>
          <div class="card-info">
            <h3 class="card-title">{{ a.title }}</h3>
            <p class="card-date">{{ a.date }}</p>
            <div class="card-tags">
              <span v-if="a.category" class="card-cat">{{ a.category }}</span>
              <span v-for="t in (a.tags || []).slice(0, 3)" :key="t" class="card-tag">{{ t }}</span>
            </div>
          </div>
        </RouterLink>
      </div>

      <div v-else class="empty-msg"><p>暂无文章</p></div>
    </template>
  </div>
  <hr>
  <PageNav
    v-if="!loading && !error"
    type="posts"
    :current-page="currentPage"
    :total-pages="totalPages"
    :categories="[]"
    @change="changePage"
  />
</template>

<!-- 布局样式 -->
<style scoped>
.center-head-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

/* 文章卡片网格 */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card-grid > * {
  flex: 1 1 calc(33.333% - 11px);
  min-width: 260px;
}

.post-card {
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
}

.post-card.pinned {
  border-width: 1px;
}

.card-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1.91 / 1;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pin-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 18px;
}

.card-info {
  padding: 12px 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-date {
  margin: 0;
  font-size: 12px;
  opacity: 0.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: auto;
}

.card-cat {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
}

.card-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 置顶 */
.pinned-section {
  margin-bottom: 0;
}

.pinned-label {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.6;
  margin-bottom: 10px;
}

.section-divider {
  margin: 16px 0;
  border: none;
  height: 1px;
}

/* Skeleton */
.skel-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.skel-grid > * {
  flex: 1 1 calc(33.333% - 11px);
  min-width: 260px;
}

.skel-card {
  border-radius: 10px;
  overflow: hidden;
  opacity: 0.3;
}

.skel-img {
  width: 100%;
  aspect-ratio: 1.91 / 1;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skel-body {
  padding: 12px;
}

.skel-line {
  height: 14px;
  border-radius: 4px;
  animation: shimmer 1.5s ease-in-out infinite;
  margin-bottom: 8px;
}

.skel-line.w60 { width: 60%; }
.skel-line.w40 { width: 40%; }

@keyframes shimmer {
  0% { opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { opacity: 0.3; }
}

.err-msg,
.empty-msg {
  text-align: center;
  padding: 50px 0;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.post-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.04);
  color: inherit;
}
body.dark-theme .post-card {
  background: rgba(21, 7, 60, 0.5);
  border-color: rgba(255, 255, 255, 0.06);
}
.post-card:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,192,203,0.15);
  border-color: rgba(255, 192, 203, 0.3);
}
.post-card.pinned { border-color: rgba(255, 192, 203, 0.4); }
.card-cover { background: var(--common-bg); }
.card-title { color: var(--common-text); }
.card-date { color: var(--common-text); }
.card-cat {
  background: var(--common-color-1);
  color: var(--common-content);
}
.card-tag {
  border: 1px solid var(--common-color-1);
  color: var(--common-text);
}
.pinned-label { color: var(--common-text); }
.section-divider {
  background: var(--common-color-1);
  opacity: 0.3;
}
.skel-card { border: 1px solid var(--common-color-1); }
.skel-img { background: var(--common-color-1); }
.skel-line { background: var(--common-color-1); }
.err-msg, .empty-msg { color: var(--common-text); }
</style>

<!-- 响应式 -->
<style scoped>
@media (max-width: 768px) {
  .card-grid > *,
  .skel-grid > * {
    flex: 1 1 calc(50% - 6px);
  }
  .card-title { font-size: 14px; }
}

@media (max-width: 639px) {
  .card-grid > *,
  .skel-grid > * {
    flex: 1 1 100%;
  }
  .card-cover {
    aspect-ratio: 2 / 1;
  }
}
</style>
