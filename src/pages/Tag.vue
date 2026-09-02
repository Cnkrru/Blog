<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useArticlesStore } from '../stores'
import ArticleCount from '../components/p-center/ArticleCount.vue'

const store = useArticlesStore()

// ---- 原 tag store 逻辑内联（仅本组件消费）----
const tags = ref([])
const tagStats = ref([])
const allArticles = ref([])
const sortBy = ref('frequency')
const tagLoading = ref(false)
const tagError = ref(null)
const lastLoaded = ref(null)
const tagCache = ref(new Map())
const hasTags = computed(() => tags.value.length > 0)

const loadTags = async (articles) => {
  tagLoading.value = true
  tagError.value = null
  try {
    const tagCounts = new Map()
    const tagLastUsed = new Map()
    articles.forEach(article => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          const currentDate = new Date(article.date).getTime()
          const lastDate = tagLastUsed.get(tag) || 0
          if (currentDate > lastDate) tagLastUsed.set(tag, currentDate)
        })
      }
    })
    const stats = []
    tagCounts.forEach((count, tag) => {
      stats.push({ tag, count, frequency: count / articles.length, lastUsed: tagLastUsed.get(tag) || Date.now() })
    })
    stats.sort((a, b) => {
      switch (sortBy.value) {
        case 'frequency': return b.frequency - a.frequency
        case 'count': return b.count - a.count
        case 'recent': return b.lastUsed - a.lastUsed
        case 'trending': {
          const aTrend = a.count * (Date.now() - a.lastUsed) / 1000000
          const bTrend = b.count * (Date.now() - b.lastUsed) / 1000000
          return bTrend - aTrend
        }
        default: return b.count - a.count
      }
    })
    tagStats.value = stats.slice(0, 50)
    tags.value = tagStats.value.map(item => item.tag)
    allArticles.value = articles
    lastLoaded.value = new Date()
  } catch (err) {
    console.error('[tag] 加载标签失败:', err)
    tagError.value = '加载标签失败'
  } finally {
    tagLoading.value = false
  }
}

const getTagArticles = async (tag, articles) => {
  const cacheKey = `tag_articles_${tag}`
  const cachedArticles = tagCache.value.get(cacheKey)
  if (cachedArticles) return cachedArticles
  const filteredArticles = articles.filter(article =>
    article.tags && article.tags.includes(tag)
  )
  if (filteredArticles.length > 0) tagCache.value.set(cacheKey, filteredArticles)
  return filteredArticles
}

const setSortBy = (newSortBy) => {
  sortBy.value = newSortBy
  try {
    localStorage.setItem('tag_sort_preference', newSortBy)
  } catch (e) {
    console.warn('[tag] 无法保存标签排序偏好:', e)
  }
}

useHead({
  title: '标签 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog 标签云与文章时间线，按标签和发布时间浏览所有文章' },
    { name: 'keywords', content: '标签云,时间线,文章时间轴,博客标签' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/tag' },
    { property: 'og:title', content: '标签 - Cnkrru\'s Blog' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/tag' },
    { name: 'twitter:title', content: '标签 - Cnkrru\'s Blog' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/tag' }
  ]
})

const articles = ref([])
const loading = ref(true)
const selectedTag = ref(null)
const tagArticles = ref([])
const searchQuery = ref('')
const zoomLevel = ref(1) // 0=年, 1=月

const filteredTags = computed(() => {
  if (!searchQuery.value) return tagStats.value
  const q = searchQuery.value.toLowerCase()
  return tagStats.value.filter((s) => s.tag.toLowerCase().includes(q))
})

const filteredArticles = computed(() => {
  let list = articles.value
  if (selectedTag.value) {
    return tagArticles.value
  }
  return list
})

const timelineGroups = computed(() => {
  const sorted = [...filteredArticles.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const groups = []
  let currentGroup = null

  sorted.forEach(article => {
    const d = new Date(article.date)
    let label
    if (zoomLevel.value === 0) {
      label = d.getFullYear().toString()
    } else {
      label = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    }

    if (!currentGroup || currentGroup.label !== label) {
      currentGroup = { label, articles: [] }
      groups.push(currentGroup)
    }
    currentGroup.articles.push(article)
  })

  return groups
})

async function selectTag(tag) {
  if (selectedTag.value === tag) {
    selectedTag.value = null
    tagArticles.value = []
    return
  }
  selectedTag.value = tag
  try {
    tagArticles.value = await getTagArticles(tag, articles.value)
  } catch (err) {
    console.error('获取标签文章失败:', err)
    tagArticles.value = []
  }
}

function changeSortBy(newSortBy) {
  setSortBy(newSortBy)
  loadTags(articles.value)
}

function clearSearch() {
  searchQuery.value = ''
}

onMounted(async () => {
  try {
    const data = await store.fetchArticles()
    articles.value = data.filter((a) => a.id !== 'terminal')
    await loadTags(articles.value)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="center-head-card">
    <h2>标签</h2>
    <ArticleCount />
  </div>
  <hr>

  <div class="center-card-content">
    <!-- 标签云区域 -->
    <div class="tag-section">
      <div class="tag-controls">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索标签..."
            class="search-input text-input"
          >
          <VButton v-if="searchQuery" class="v-btn-round v-btn-ghost clear-btn" style="height:20px;min-width:20px" @click="clearSearch" aria-label="清除搜索"><VIcon :src="'x.svg'" :size="11" /></VButton>
        </div>
        <div class="sort-options">
          <span class="sort-label">排序:</span>
          <button
            v-for="s in [{k:'frequency',l:'频率'},{k:'count',l:'数量'},{k:'recent',l:'最近'},{k:'trending',l:'趋势'}]"
            :key="s.k"
            @click="changeSortBy(s.k)"
            :class="['sort-btn', { active: sortBy === s.k }]"
          >{{ s.l }}</button>
        </div>
      </div>

      <div class="tag-cloud">
        <span
          v-for="stat in filteredTags"
          :key="stat.tag"
          @click="selectTag(stat.tag)"
          :class="['tag-item', { active: selectedTag === stat.tag }]"
          :style="{
            fontSize: `${13 + Math.min(stat.count / 2, 8)}px`,
            opacity: 0.55 + Math.min(stat.count / Math.max(...tagStats.map((s) => s.count), 1), 1) * 0.45,
          }"
          :title="`频率: ${(stat).frequency?.toFixed(2)}, 数量: ${stat.count}`"
        >
          {{ stat.tag }} <span class="tag-num">{{ stat.count }}</span>
        </span>
        <div v-if="filteredTags.length === 0 && !loading" class="tag-empty">
          没有匹配的标签
        </div>
      </div>

    </div>

    <hr>

    <!-- 时间线区域 -->
    <div class="timeline-bar">
      <div class="zoom-controls">
        <button
          :class="['zoom-btn', { active: zoomLevel === 0 }]"
          @click="zoomLevel = 0"
        >年</button>
        <button
          :class="['zoom-btn', { active: zoomLevel === 1 }]"
          @click="zoomLevel = 1"
        >月</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-container">
      <div v-for="n in 4" :key="n" class="tl-skel">
        <div class="dot-skel"></div>
        <div class="card-skel"></div>
      </div>
    </div>

    <!-- 时间线 -->
    <div v-else class="timeline">
      <div class="timeline-line"></div>

      <div v-for="group in timelineGroups" :key="group.label" class="tl-group">
        <div class="group-label">
          <div class="tl-dot"></div>
          <span class="label-text">{{ group.label }}</span>
          <span class="tl-count">{{ group.articles.length }} 篇</span>
        </div>
        <div class="tl-cards">
          <RouterLink
            v-for="article in group.articles"
            :key="article.id"
            :to="`/post/${article.id}`"
            class="tl-card"
          >
            <div class="tl-connector"></div>
            <div class="tl-card-body">
              <div class="tl-header">
                <span class="tl-title">{{ article.title }}</span>
                <span class="tl-date">{{ article.date }}</span>
              </div>
              <div class="tl-meta">
                <span v-if="article.category" class="tl-cat">{{ article.category }}</span>
                <span v-for="tag in (article.tags || []).slice(0, 3)" :key="tag" class="tl-tag">{{ tag }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>

      <div v-if="timelineGroups.length === 0 && !loading" class="empty-tl">
        没有找到文章
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 头部 ===== */
.center-head-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

/* ===== 标签区域 ===== */
.tag-section {
  padding: 12px 0;
}

.tag-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 160px;
}

.search-input {
  width: 100%;
  padding: 8px 36px 8px 12px;
  border-radius: 12px;
  border: 1px solid var(--common-shadow);
  font-size: 13px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.2));
  color: var(--common-text);
}

.search-input:focus {
  outline: none;
  border-color: var(--common-color-1);
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  --v-btn-hover-bg: transparent;
}

.clear-btn:hover {
  opacity: 1;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sort-label {
  font-size: 12px;
}

.sort-btn {
  padding: 4px 12px;
  border-radius: 14px;
  border: 1px solid var(--common-shadow);
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.15s ease;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.2));
  color: var(--common-text);
}

.sort-btn:hover {
  border-color: var(--common-color-1);
  color: var(--common-color-1);
}

.sort-btn.active {
  background: var(--common-color-1);
  color: var(--common-content);
  border-color: var(--common-color-1);
}

/* ===== 标签云 ===== */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--common-shadow);
  min-height: 60px;
  align-items: flex-start;
  align-content: flex-start;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.25));
}

.tag-item {
  padding: 5px 14px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 500;
  border: 1px solid color-mix(in srgb, var(--common-color-1) 20%, transparent);
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  animation: tagFadeIn 0.4s ease;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 12%, transparent);
}

.tag-item:hover {
  transform: scale(1.06);
  background: color-mix(in srgb, var(--common-color-1) 25%, transparent);
  border-color: var(--common-color-1);
}

.tag-item.active {
  font-weight: 700;
  transform: scale(1.06);
  background: var(--common-color-1);
  color: var(--common-content);
  border-color: var(--common-color-1);
  box-shadow: 0 2px 12px var(--common-shadow);
  --active-num-color: var(--common-content);
  --active-num-opacity: 0.8;
}

.tag-num {
  font-size: 0.75em;
  color: var(--active-num-color, var(--common-color-1));
  opacity: var(--active-num-opacity, 0.7);
}

.tag-empty {
  width: 100%;
  text-align: center;
  padding: 30px;
  font-style: italic;
  color: var(--common-text);
  opacity: 0.4;
}

@keyframes tagFadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

/* ===== 时间线上方 ===== */
.timeline-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.zoom-btn {
  padding: 3px 14px;
  border-radius: 14px;
  border: 1px solid var(--common-shadow);
  font-size: 12px;
  cursor: pointer;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.2));
  color: var(--common-text);
}

.zoom-btn:hover {
  border-color: var(--common-color-1);
  color: var(--common-color-1);
}

.zoom-btn.active {
  background: var(--common-color-1);
  color: var(--common-content);
  border-color: var(--common-color-1);
}

.zoom-controls {
  display: flex;
  gap: 6px;
}

/* ===== 时间线 ===== */
.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline-line {
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 2px;
  background: var(--common-color-1);
  opacity: 0.3;
}

.tl-group {
  margin-bottom: 16px;
  position: relative;
}

.group-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  position: relative;
  left: -32px;
}

.tl-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid var(--common-bg);
  flex-shrink: 0;
  z-index: 2;
  background: var(--common-color-1);
  box-shadow: 0 0 6px var(--common-color-1);
}

.label-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--common-text);
}

.tl-count {
  font-size: 12px;
  color: var(--common-text);
  opacity: 0.5;
}

.tl-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tl-card {
  display: flex;
  align-items: stretch;
  text-decoration: none;
  transition: transform 0.2s;
}

.tl-card:hover {
  transform: translateX(6px);
  --connector-width: 26px;
  --card-body-border-color: var(--common-color-1);
  --card-body-shadow: 0 4px 12px var(--common-shadow);
}

.tl-connector {
  width: var(--connector-width, 20px);
  height: 2px;
  flex-shrink: 0;
  margin-top: 20px;
  margin-right: 8px;
  margin-left: -28px;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.15s ease;
  background: var(--common-color-1);
  opacity: 0.3;
}

.tl-card-body {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--common-shadow);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.25));
  border-color: var(--card-body-border-color, var(--common-shadow));
  box-shadow: var(--card-body-shadow, none);
}

.tl-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.tl-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--common-text);
}

.tl-date {
  font-size: 11px;
  white-space: nowrap;
  margin-left: 12px;
  color: var(--common-text);
  opacity: 0.5;
}

.tl-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tl-cat {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  background: var(--common-color-1);
  color: var(--common-content);
}

.tl-tag {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  border: 1px solid var(--common-color-1);
  color: var(--common-text);
}

/* ===== Skeleton ===== */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  --dot-skel-bg: var(--common-shadow);
  --card-skel-bg: linear-gradient(90deg, var(--common-shadow) 25%, color-mix(in srgb, var(--common-color-1) 15%, transparent) 50%, var(--common-shadow) 75%);
  --card-skel-size: 200% 100%;
}

.tl-skel {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot-skel {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--dot-skel-bg, none);
}

.card-skel {
  flex: 1;
  height: 56px;
  border-radius: 8px;
  background: var(--card-skel-bg, none);
  background-size: var(--card-skel-size, 200% 100%);
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-tl {
  text-align: center;
  padding: 40px;
  color: var(--common-text);
  opacity: 0.4;
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .timeline {
    padding-left: 20px;
  }

  .group-label {
    left: -20px;
  }

  .tl-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .tl-date {
    margin-left: 0;
  }

  .tl-connector {
    width: 10px;
    margin-left: -18px;
  }
}

@media (max-width: 768px) {
  .tag-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .tag-item {
    padding: 4px 10px;
  }
}
</style>