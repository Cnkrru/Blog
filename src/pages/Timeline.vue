<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useArticlesStore, useTagStore, useThemeStore } from '../stores'
import ArticleCount from '../components/p-center/ArticleCount.vue'

const store = useArticlesStore()
const tagStore = useTagStore()
const themeStore = useThemeStore()

useHead({
  title: '标签 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog 标签云与文章时间线，按标签和发布时间浏览所有文章' },
    { name: 'keywords', content: '标签云,时间线,文章时间轴,博客标签' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/timeline' },
    { property: 'og:title', content: '标签 - Cnkrru\'s Blog' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/timeline' },
    { name: 'twitter:title', content: '标签 - Cnkrru\'s Blog' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top/timeline' }
  ]
})

const articles = ref<any[]>([])
const loading = ref(true)
const selectedTag = ref<string | null>(null)
const tagArticles = ref<any[]>([])
const searchQuery = ref('')
const zoomLevel = ref(1) // 0=年, 1=月

const isDarkTheme = computed(() => themeStore.isDark)
const tagStats = computed(() => tagStore.tagStats)
const sortBy = computed(() => tagStore.sortBy)

const filteredTags = computed(() => {
  if (!searchQuery.value) return tagStats.value
  const q = searchQuery.value.toLowerCase()
  return tagStats.value.filter((s: any) => s.tag.toLowerCase().includes(q))
})

const getRelatedTags = (tag: string) => {
  return tagStore.getRelatedTags(tag, 5)
}

const getTagGradient = (stat: any) => {
  const maxCount = Math.max(...tagStats.value.map((s: any) => s.count), 1)
  const ratio = stat.count / maxCount
  const hue1 = isDarkTheme.value ? 270 : 330
  const hue2 = isDarkTheme.value ? 300 : 350
  const sat1 = 70 + ratio * 30
  const sat2 = 80 + ratio * 20
  const light1 = isDarkTheme.value ? 60 + ratio * 15 : 88 - ratio * 18
  const light2 = isDarkTheme.value ? 50 + ratio * 10 : 75 - ratio * 12
  return `linear-gradient(135deg, hsl(${hue1}, ${sat1}%, ${light1}%), hsl(${hue2}, ${sat2}%, ${light2}%))`
}

const filteredArticles = computed(() => {
  let list = articles.value
  if (selectedTag.value) {
    return tagArticles.value
  }
  return list
})

type TimelineGroup = {
  label: string
  articles: any[]
}

const timelineGroups = computed<TimelineGroup[]>(() => {
  const sorted = [...filteredArticles.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const groups: TimelineGroup[] = []
  let currentGroup: TimelineGroup | null = null

  sorted.forEach(article => {
    const d = new Date(article.date)
    let label: string
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

async function selectTag(tag: string) {
  if (selectedTag.value === tag) {
    selectedTag.value = null
    tagArticles.value = []
    return
  }
  selectedTag.value = tag
  try {
    tagArticles.value = await tagStore.getTagArticles(tag, articles.value)
  } catch (err) {
    console.error('获取标签文章失败:', err)
    tagArticles.value = []
  }
}

function changeSortBy(newSortBy: string) {
  tagStore.setSortBy(newSortBy)
  tagStore.loadTags(articles.value)
}

function clearSearch() {
  searchQuery.value = ''
}

// 文章统计数据面板
const chartData = computed(() => {
  const sorted = [...filteredArticles.value].sort((a, b) => parseInt(a.id) - parseInt(b.id))
  return sorted.map(a => ({
    id: a.id,
    title: a.title,
    tagsCount: Array.isArray(a.tags) ? a.tags.length : 0,
    descLen: a.description ? a.description.length : 0,
    hasCategory: !!a.category,
    tags: Array.isArray(a.tags) ? a.tags.slice(0, 2).join(', ') : ''
  }))
})

const statsSummary = computed(() => {
  const total = articles.value.length
  if (total === 0) return { total: 0, avgTags: 0, maxTags: 0, withCategory: 0 }
  const tagCounts = articles.value.map(a => Array.isArray(a.tags) ? a.tags.length : 0)
  const withCat = articles.value.filter(a => !!a.category).length
  return {
    total,
    avgTags: (tagCounts.reduce((s, c) => s + c, 0) / total).toFixed(1),
    maxTags: Math.max(...tagCounts),
    withCategory: withCat
  }
})

const maxDescLen = computed(() => Math.max(...chartData.value.map(d => d.descLen), 1))

onMounted(async () => {
  try {
    const data = await store.fetchArticles()
    articles.value = data.filter((a: any) => a.id !== 'terminal')
    await tagStore.loadTags(articles.value)
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
            class="search-input"
          >
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">x</button>
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
            opacity: 0.55 + Math.min(stat.count / Math.max(...tagStats.map((s: any) => s.count), 1), 1) * 0.45,
          }"
          :title="`频率: ${(stat as any).frequency?.toFixed(2)}, 数量: ${stat.count}`"
        >
          {{ stat.tag }} <span class="tag-num">{{ stat.count }}</span>
        </span>
        <div v-if="filteredTags.length === 0 && !loading" class="tag-empty">
          没有匹配的标签
        </div>
      </div>

      <!-- 选中标签 & 相关标签 -->
      <div v-if="selectedTag" class="selected-tag-info">
        <div class="selected-tag-header">
          <span class="sel-label">当前标签: <strong>{{ selectedTag }}</strong></span>
          <span class="sel-count">{{ tagArticles.length }} 篇文章</span>
          <button class="sel-clear" @click="selectTag(selectedTag)">x 清除</button>
        </div>
        <div v-if="getRelatedTags(selectedTag).length > 0" class="related-tags-row">
          <span class="related-label">相关标签:</span>
          <span
            v-for="r in getRelatedTags(selectedTag)"
            :key="r.tag"
            @click="selectTag(r.tag)"
            class="related-chip"
            :title="`相关性: ${(r as any).score?.toFixed(2)}`"
          >{{ r.tag }}</span>
        </div>
      </div>
    </div>

    <!-- 数据统计面板 -->
    <div v-if="!loading && articles.length > 0" class="stats-panel">
      <div class="stats-summary">
        <div class="stat-box">
          <span class="stat-num">{{ statsSummary.total }}</span>
          <span class="stat-label">文章总数</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ statsSummary.avgTags }}</span>
          <span class="stat-label">平均标签数</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ statsSummary.maxTags }}</span>
          <span class="stat-label">最多标签数</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">{{ statsSummary.withCategory }}</span>
          <span class="stat-label">有分类的文章</span>
        </div>
      </div>

      <div class="chart-title">文章标签分布</div>
      <div class="bar-chart">
        <div
          v-for="d in chartData"
          :key="d.id"
          class="bar-item"
          :title="`${d.title}: ${d.tagsCount} 标签 (${d.tags || '无'})`"
        >
          <div
            class="bar-fill"
            :style="{ height: `${(d.tagsCount / Math.max(statsSummary.maxTags, 1)) * 100}%` }"
          ></div>
          <span class="bar-label">{{ d.id }}</span>
        </div>
      </div>
    </div>

    <hr>

    <!-- 时间线区域 -->
    <div class="timeline-top-bar">
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
        <div class="tl-dot-skel"></div>
        <div class="tl-card-skel"></div>
      </div>
    </div>

    <!-- 时间线 -->
    <div v-else class="timeline">
      <div class="timeline-line"></div>

      <div v-for="group in timelineGroups" :key="group.label" class="tl-group">
        <div class="tl-group-label">
          <div class="tl-dot"></div>
          <span class="tl-label-text">{{ group.label }}</span>
          <span class="tl-count">{{ group.articles.length }} 篇</span>
        </div>
        <div class="tl-cards">
          <RouterLink
            v-for="article in group.articles"
            :key="article.id"
            :to="`/post/${article.id}`"
            class="tl-card"
          >
            <div class="tl-card-connector"></div>
            <div class="tl-card-body">
              <div class="tl-card-header">
                <span class="tl-card-title">{{ article.title }}</span>
                <span class="tl-card-date">{{ article.date }}</span>
              </div>
              <div class="tl-card-meta">
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

<!-- 布局样式 -->
<style scoped>
.center-head-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

/* 标签区域 */
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
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 13px;
}

body.dark-theme .search-input {
}

.search-input:focus {
  outline: none;
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
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
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.15s ease;
}

body.dark-theme .sort-btn {
}

.sort-btn.active {
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  min-height: 60px;
  align-items: flex-start;
  align-content: flex-start;
}

body.dark-theme .tag-cloud {
}

.tag-item {
  padding: 5px 14px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 500;
  border: 1px solid rgba(255, 192, 203, 0.2);
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
  animation: tagFadeIn 0.4s ease;
}

body.dark-theme .tag-item {
}

.tag-item:hover {
  transform: scale(1.06);
}

body.dark-theme .tag-item:hover {
}

.tag-item.active {
  font-weight: 700;
  transform: scale(1.06);
}

.tag-num {
  font-size: 0.75em;
}

.tag-empty {
  width: 100%;
  text-align: center;
  padding: 30px;
  font-style: italic;
}

@keyframes tagFadeIn {
}

/* 选中标签信息 */
.selected-tag-info {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

body.dark-theme .selected-tag-info {
}

.selected-tag-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.sel-label {
  font-size: 14px;
}

.sel-count {
  font-size: 12px;
}

.sel-clear {
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 12px;
  cursor: pointer;
}

body.dark-theme .sel-clear {
}

.sel-clear:hover {
}

.related-tags-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.related-label {
  font-size: 12px;
}

.related-chip {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  border: 1px solid rgba(255, 192, 203, 0.25);
}

body.dark-theme .related-chip {
}

.related-chip:hover {
}

/* 时间线上方 */
.timeline-top-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.zoom-btn {
  padding: 3px 14px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 12px;
  cursor: pointer;
}

body.dark-theme .zoom-btn {
}

.zoom-btn.active {
}

.zoom-controls {
  display: flex;
  gap: 6px;
}

/* 时间线 */
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
}

.tl-group {
  margin-bottom: 16px;
  position: relative;
}

.tl-group-label {
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
}

.tl-label-text {
  font-size: 16px;
  font-weight: 700;
}

.tl-count {
  font-size: 12px;
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
}

.tl-card-connector {
  width: 20px;
  height: 2px;
  flex-shrink: 0;
  margin-top: 20px;
  margin-right: 8px;
  margin-left: -28px;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.15s ease;
}

.tl-card:hover .tl-card-connector {
  width: 26px;
}

.tl-card-body {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

body.dark-theme .tl-card-body {
}

.tl-card:hover .tl-card-body {
}

body.dark-theme .tl-card:hover .tl-card-body {
}

.tl-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.tl-card-title {
  font-size: 14px;
  font-weight: 600;
}

.tl-card-date {
  font-size: 11px;
  white-space: nowrap;
  margin-left: 12px;
}

.tl-card-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tl-cat {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
}

.tl-tag {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 10px;
  border: 1px solid var(--common-color-1);
}

/* Skeleton */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tl-skel {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tl-dot-skel {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tl-card-skel {
  flex: 1;
  height: 56px;
  border-radius: 8px;
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-tl {
  text-align: center;
  padding: 40px;
}

/* 数据统计面板 */
.stats-panel {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  margin-top: 12px;
}

body.dark-theme .stats-panel {
}

.stats-summary {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.stat-box {
  flex: 1;
  min-width: 80px;
  text-align: center;
  padding: 12px 8px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

body.dark-theme .stat-box {
}

.stat-num {
  display: block;
  font-size: 24px;
  font-weight: 700;
}

.stat-label {
  display: block;
  font-size: 11px;
  margin-top: 4px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 120px;
  padding: 0 4px;
}

.bar-item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.bar-fill {
  width: 80%;
  max-width: 40px;
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
  min-height: 4px;
}

.bar-label {
  font-size: 10px;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.search-input {
  background: rgba(255, 255, 255, 0.4);
  color: var(--common-text);
}
body.dark-theme .search-input {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}
.sort-btn {
  background: rgba(255, 255, 255, 0.4);
  color: var(--common-text);
}
body.dark-theme .sort-btn {
  background: rgba(255, 255, 255, 0.04);
}
.sort-btn.active {
  background: var(--common-color-1);
  color: #fff;
  border-color: var(--common-color-1);
}
.tag-cloud {
  background: rgba(255, 255, 255, 0.35);
}
body.dark-theme .tag-cloud {
  background: rgba(255, 255, 255, 0.03);
}
.tag-item {
  color: var(--common-text);
  background: rgba(255, 192, 203, 0.12);
  border: 1px solid rgba(255, 192, 203, 0.2);
}
body.dark-theme .tag-item {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
}
.tag-item:hover {
  background: rgba(255, 192, 203, 0.25);
  border-color: var(--common-color-1);
}
body.dark-theme .tag-item:hover {
  background: rgba(255, 255, 255, 0.1);
}
.tag-item.active {
  background: var(--common-color-1);
  color: #fff;
  border-color: var(--common-color-1);
  box-shadow: 0 2px 12px var(--common-shadow);
}
.selected-tag-info {
  background: rgba(255, 255, 255, 0.35);
}
body.dark-theme .selected-tag-info {
  background: rgba(255, 255, 255, 0.03);
}
.sel-clear {
  background: rgba(255, 255, 255, 0.4);
  color: var(--common-text);
}
body.dark-theme .sel-clear {
  background: rgba(255, 255, 255, 0.04);
}
.sel-clear:hover {
  background: var(--common-color-1);
  color: #fff;
}
.related-chip {
  background: rgba(255, 192, 203, 0.2);
  color: var(--common-text);
  border: 1px solid rgba(255, 192, 203, 0.25);
}
body.dark-theme .related-chip {
  background: rgba(58, 170, 231, 0.15);
  border-color: rgba(58, 170, 231, 0.2);
}
.zoom-btn {
  background: rgba(255, 255, 255, 0.4);
  color: var(--common-text);
}
body.dark-theme .zoom-btn {
  background: rgba(255, 255, 255, 0.04);
}
.zoom-btn.active {
  background: var(--common-color-1);
  color: #fff;
  border-color: var(--common-color-1);
}
.tl-dot {
  background: var(--common-color-1);
  box-shadow: 0 0 6px var(--common-color-1);
}
.tl-card-body {
  background: rgba(255, 255, 255, 0.35);
}
body.dark-theme .tl-card-body {
  background: rgba(255, 255, 255, 0.03);
}
.tl-card:hover .tl-card-body {
  border-color: rgba(0, 0, 0, 0.12);
  box-shadow: 0 4px 12px var(--common-shadow);
}
body.dark-theme .tl-card:hover .tl-card-body {
  border-color: rgba(255, 255, 255, 0.12);
}
.stats-panel {
  background: rgba(255, 255, 255, 0.35);
}
body.dark-theme .stats-panel {
  background: rgba(255, 255, 255, 0.03);
}
.stat-box {
  background: rgba(255, 255, 255, 0.5);
}
body.dark-theme .stat-box {
  background: rgba(255, 255, 255, 0.04);
}
.stat-num {
  color: var(--common-color-1);
}
.tl-card-title {
  color: var(--common-text);
}
.tl-card-date {
  color: var(--common-text);
  opacity: 0.5;
}
.tl-cat {
  background: var(--common-color-1);
  color: var(--common-content);
}
.tl-tag {
  border: 1px solid var(--common-color-1);
  color: var(--common-text);
}
.tl-label-text {
  color: var(--common-text);
}
.bar-label {
  color: var(--common-text);
  opacity: 0.5;
}
</style>

<!-- 响应式 -->
<style scoped>
@media (max-width: 639px) {
  .timeline {
    padding-left: 20px;
  }

  .tl-group-label {
    left: -20px;
  }

  .tl-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .tl-card-date {
    margin-left: 0;
  }

  .tl-card-connector {
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
