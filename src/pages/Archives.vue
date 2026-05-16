<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useArticlesStore } from '../stores'
import ArticleCount from '../components/p-center/ArticleCount.vue'
import TagCloud from '../components/p-center/TagCloud.vue'

const store = useArticlesStore()

useHead({
  title: '归档 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Cnkrru\'s Blog的所有文章归档' },
    { name: 'keywords', content: '归档,文章列表,历史文章' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/archives' },
    { property: 'og:title', content: '归档 - Cnkrru\'s Blog' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/archives' }
  ],
  link: [{ rel: 'canonical', href: 'https://cnkrru.top/archives' }]
})

const articles = ref<any[]>([])
const viewMode = ref<'category' | 'year' | 'month'>('category')
const expandedKey = ref<string | null>(null)

const loadArticles = async () => {
  try {
    const data = await store.fetchArticles()
    articles.value = data.sort((a, b) => parseInt(b.id) - parseInt(a.id))
  } catch { articles.value = [] }
}

// 按分类
const categoryGroups = computed(() => {
  const map: Record<string, any[]> = {}
  articles.value.forEach(a => {
    const c = a.category || '未分类'
    if (!map[c]) map[c] = []
    map[c].push(a)
  })
  return Object.keys(map).sort().map(k => ({ name: k, items: map[k] }))
})

// 按年
const yearGroups = computed(() => {
  const map: Record<string, any[]> = {}
  articles.value.forEach(a => {
    const y = new Date(a.date).getFullYear().toString()
    if (!map[y]) map[y] = []
    map[y].push(a)
  })
  return Object.keys(map).sort().reverse().map(k => ({ name: k, items: map[k] }))
})

// 按月
const monthGroups = computed(() => {
  const map: Record<string, any[]> = {}
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

function toggleGroup(name: string) {
  expandedKey.value = expandedKey.value === name ? null : name
}

onMounted(loadArticles)
</script>

<template>
  <div id="site-stats-container"></div>
  <div class="center-head-card">
    <h2>归档</h2>
    <ArticleCount />
    <TagCloud :articles="articles" />
  </div>
  <hr>
  <div class="center-card-content">
    <!-- 模式切换 -->
    <div class="view-tabs">
      <button
        :class="['view-tab', { active: viewMode === 'category' }]"
        @click="viewMode = 'category'"
      >按分类</button>
      <button
        :class="['view-tab', { active: viewMode === 'year' }]"
        @click="viewMode = 'year'"
      >按年</button>
      <button
        :class="['view-tab', { active: viewMode === 'month' }]"
        @click="viewMode = 'month'"
      >按月</button>
    </div>

    <div v-for="g in groups" :key="g.name" class="arch-group">
      <a href="#" class="arch-header" @click.prevent="toggleGroup(g.name)">
        <span class="arch-name">{{ g.name }}</span>
        <span class="arch-count">{{ g.items.length }} 篇</span>
        <span class="arch-arrow">{{ expandedKey === g.name ? '▾' : '▸' }}</span>
      </a>

      <Transition name="fold">
        <div v-if="expandedKey === g.name" class="arch-list">
          <RouterLink
            v-for="a in g.items"
            :key="a.id"
            :to="`/post/${a.id}`"
            class="arch-item"
          >
            <span class="arch-title">{{ a.title }}</span>
            <span class="arch-date">{{ a.date }}</span>
          </RouterLink>
        </div>
      </Transition>
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

.view-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.view-tab {
  padding: 5px 16px;
  border-radius: 16px;
  border: 1.5px solid var(--common-color-1);
  background: transparent;
  color: var(--common-text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-tab.active {
  background: var(--common-color-1);
  color: var(--common-content);
}

.arch-group {
  margin-bottom: 2px;
}

.arch-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--common-text);
  background: var(--common-bg);
  border: 1px solid var(--common-color-1);
  transition: all 0.2s;
}

.arch-header:hover {
  background: var(--common-hover);
}

.arch-name {
  font-size: 15px;
  font-weight: 600;
}

.arch-count {
  font-size: 12px;
  color: var(--common-text);
  opacity: 0.5;
  margin-right: auto;
}

.arch-arrow {
  font-size: 12px;
  color: var(--common-text);
  opacity: 0.4;
}

.arch-list {
  padding: 4px 0 8px 0;
}

.arch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  text-decoration: none;
  color: var(--common-text);
  border-bottom: 1px solid var(--common-color-1);
  opacity: 0.8;
  transition: all 0.15s;
}

.arch-item:hover {
  opacity: 1;
  background: var(--common-bg);
}

.arch-title {
  font-size: 14px;
}

.arch-date {
  font-size: 12px;
  opacity: 0.5;
  white-space: nowrap;
  margin-left: 16px;
}

/* 展开动画 */
.fold-enter-active,
.fold-leave-active {
  transition: all 0.2s ease;
}

.fold-enter-from,
.fold-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
