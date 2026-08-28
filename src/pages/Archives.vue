<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useArticlesStore } from '../stores'
import VIcon from '@/components/__common/VIcon.vue'
import ArticleCount from '../components/p-center/ArticleCount.vue'

const store = useArticlesStore()

useHead({
  title: '归档 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog的所有文章归档' },
    { name: 'keywords', content: '归档,文章列表,历史文章' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:url', content: 'https://cnkrru.top/archives' },
    { property: 'og:title', content: '归档 - Cnkrru\'s Blog' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/archives' }
  ],
  link: [{ rel: 'canonical', href: 'https://cnkrru.top/archives' }]
})

const articles = ref([])
const viewMode = ref('category')
const expandedKey = ref(null)
const expandAll = ref(false)

const loadArticles = async () => {
  try {
    const data = await store.fetchArticles()
    articles.value = data.sort((a, b) => parseInt(b.id) - parseInt(a.id))
  } catch (e) { console.error('加载文章列表失败:', e); articles.value = [] }
}

const categoryGroups = computed(() => {
  const map = {}
  articles.value.forEach(a => {
    const c = a.category || '未分类'
    if (!map[c]) map[c] = []
    map[c].push(a)
  })
  return Object.keys(map).sort().map(k => ({ name: k, items: map[k] }))
})

const yearGroups = computed(() => {
  const map = {}
  articles.value.forEach(a => {
    const y = new Date(a.date).getFullYear().toString()
    if (!map[y]) map[y] = []
    map[y].push(a)
  })
  return Object.keys(map).sort().reverse().map(k => ({ name: k, items: map[k] }))
})

const monthGroups = computed(() => {
  const map = {}
  articles.value.forEach(a => {
    const d = new Date(a.date)
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!map[k]) map[k] = []
    map[k].push(a)
  })
  return Object.keys(map).sort().reverse().map(k => ({ name: k, items: map[k] }))
})

const groups = computed(() => {
  if (viewMode.value === 'year') return yearGroups.value
  if (viewMode.value === 'month') return monthGroups.value
  return categoryGroups.value
})

const isTimeline = computed(() => viewMode.value !== 'category')

function toggleGroup(name) {
  expandedKey.value = expandedKey.value === name ? null : name
}

function toggleExpandAll() {
  expandAll.value = !expandAll.value
  expandedKey.value = expandAll.value ? '_all' : null
}

const isExpanded = (name) => expandedKey.value === name || expandedKey.value === '_all'

const tabsRef = ref(null)
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

function updateIndicator() {
  nextTick(() => {
    if (!tabsRef.value) return
    const active = tabsRef.value.querySelector('.view-tab.active')
    if (!active) return
    const containerRect = tabsRef.value.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    indicatorLeft.value = activeRect.left - containerRect.left
    indicatorWidth.value = activeRect.width
  })
}

watch(viewMode, updateIndicator)

onMounted(() => {
  loadArticles()
  nextTick(updateIndicator)
})
</script>

<template>
  <div id="site-stats-container"></div>
  <div class="center-head-card">
    <h2>归档</h2>
    <ArticleCount />
  </div>
  <hr>
  <div class="center-card-content">
    <!-- 模式切换 + 操作 -->
    <div class="arch-toolbar">
      <div class="view-tabs" ref="tabsRef">
      <div class="tabs-indicator" :style="{ left: indicatorLeft + 'px', width: indicatorWidth + 'px' }"></div>
      <button
        :class="['view-tab', { active: viewMode === 'category' }]"
        @click="viewMode = 'category'"
        aria-label="按分类查看"
      >分类</button>
      <button
        :class="['view-tab', { active: viewMode === 'year' }]"
        @click="viewMode = 'year'"
        aria-label="按年查看"
      >年份</button>
      <button
        :class="['view-tab', { active: viewMode === 'month' }]"
        @click="viewMode = 'month'"
        aria-label="按月查看"
      >月份</button>
    </div>
      <button class="expand-btn" @click="toggleExpandAll">
        {{ expandedKey === '_all' ? '全部收起' : '全部展开' }}
      </button>
    </div>

    <div v-for="g in groups" :key="g.name" class="arch-group" :class="{ timeline: isTimeline }">
      <a
        href="#"
        class="arch-header"
        :class="{ expanded: isExpanded(g.name) }"
        @click.prevent="toggleGroup(g.name)"
      >
        <span v-if="isTimeline" class="timeline-dot"></span>
        <span class="arch-name">{{ g.name }}</span>
        <span class="arch-count">{{ g.items.length }} 篇</span>
        <span class="arch-arrow" :class="{ open: isExpanded(g.name) }">
          <VIcon :src="'chevron-down.svg'" :size="12" />
        </span>
      </a>

      <div class="arch-body" :class="{ open: isExpanded(g.name) }">
        <div class="arch-list">
          <RouterLink
            v-for="a in g.items"
            :key="a.id"
            :to="`/post/${a.id}`"
            class="arch-item"
            :class="{ 'has-timeline': isTimeline }"
          >
            <span v-if="isTimeline" class="item-dot"></span>
            <span class="item-title">{{ a.title }}</span>
            <span class="item-tags" v-if="a.tags && a.tags.length">
              <span v-for="t in a.tags.slice(0, 2)" :key="t" class="item-tag">{{ t }}</span>
            </span>
            <span class="item-date">{{ a.date }}</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <div v-if="!groups.length" class="arch-empty">
      <p>暂无文章</p>
    </div>
  </div>
</template>

<style scoped>
.center-head-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

/* ===== 工具栏 ===== */
.arch-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 10px;
}

.view-tabs {
  display: flex;
  gap: 4px;
  background: var(--common-bg);
  padding: 3px;
  border-radius: 24px;
  border: 1px solid var(--common-color-1);
  position: relative;
}

.tabs-indicator {
  position: absolute;
  top: 3px;
  height: calc(100% - 6px);
  border-radius: 20px;
  background: var(--common-color-1);
  transition: left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  z-index: 0;
}

.view-tab {
  padding: 4px 16px;
  border-radius: 20px;
  border: none;
  background: transparent;
  color: var(--common-text);
  font-size: 13px;
  cursor: pointer;
  transition: color 0.25s ease;
  position: relative;
  z-index: 1;
}

.view-tab.active {
  color: var(--common-content);
}

.expand-btn {
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid var(--common-color-1);
  background: transparent;
  color: var(--common-text);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.expand-btn:hover {
  background: var(--common-color-1);
  color: var(--common-content);
}

/* ===== 分组卡片 ===== */
.arch-group {
  margin-bottom: 10px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--common-color-1);
  background: var(--common-bg);
  transition: box-shadow 0.2s ease;
}

.arch-group:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.arch-group.timeline {
  padding-left: 0;
}

/* ===== 分组头部 ===== */
.arch-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  text-decoration: none;
  color: var(--common-text);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.arch-header:hover {
  background: color-mix(in srgb, var(--common-color-1) 8%, transparent);
}

.arch-header.expanded {
  background: color-mix(in srgb, var(--common-color-1) 5%, transparent);
  border-bottom: 1px solid var(--common-color-1);
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--common-color-1);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.arch-name {
  font-size: 15px;
  font-weight: 600;
}

.arch-count {
  font-size: 12px;
  color: var(--common-text);
  opacity: 0.45;
  margin-right: auto;
}

.arch-arrow {
  display: flex;
  align-items: center;
  color: var(--common-text);
  opacity: 0.4;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.arch-arrow.open {
  transform: rotate(90deg);
}

/* ===== 展开/收起主体 ===== */
.arch-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.arch-body.open {
  grid-template-rows: 1fr;
}

.arch-list {
  overflow: hidden;
  min-height: 0;
  padding: 0;
}

/* ===== 文章条目 ===== */
.arch-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 10px 20px;
  text-decoration: none;
  color: var(--common-text);
  border-bottom: 1px solid color-mix(in srgb, var(--common-color-1) 30%, transparent);
  transition: background-color 0.15s ease, padding-left 0.2s ease;
  position: relative;
}

.arch-item:last-child {
  border-bottom: none;
}

.arch-item:hover {
  background: color-mix(in srgb, var(--common-color-1) 8%, transparent);
  padding-left: 24px;
}

.arch-item.has-timeline {
  padding-left: 42px;
  position: relative;
}

.arch-item.has-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--common-color-1);
  opacity: 0.2;
}

.arch-item.has-timeline::after {
  content: '';
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--common-color-1);
  opacity: 0.3;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.arch-item.has-timeline:hover::after {
  opacity: 0.8;
  transform: translateY(-50%) scale(1.3);
}

.item-dot {
  display: none;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-tags {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.item-tag {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
  color: var(--common-text);
  opacity: 0.7;
}

.item-date {
  font-size: 12px;
  opacity: 0.4;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ===== 空状态 ===== */
.arch-empty {
  text-align: center;
  padding: 40px 0;
  opacity: 0.5;
}
</style>