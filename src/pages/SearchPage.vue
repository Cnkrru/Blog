<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useArticlesStore } from '../stores'

const store = useArticlesStore()
const route = useRoute()

useHead({
  title: '搜索 - Cnkrru\'s Blog',
  link: [{ rel: 'canonical', href: 'https://cnkrru.top/search' }]
})

const query = ref('')
const articles = ref<any[]>([])
const loading = ref(false)

const results = computed(() => {
  if (!query.value.trim()) return articles.value
  const q = query.value.toLowerCase()
  return articles.value.filter((a: any) =>
    a.title?.toLowerCase().includes(q) ||
    a.description?.toLowerCase().includes(q) ||
    (a.tags || []).some((t: string) => t.toLowerCase().includes(q)) ||
    a.category?.toLowerCase().includes(q)
  )
})

function highlightMatch(text: string): string {
  if (!query.value.trim()) return text
  const q = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>')
}

onMounted(async () => {
  loading.value = true
  const data = await store.fetchArticles()
  articles.value = data.filter((a: any) => a.id !== 'terminal')
  const q = route.query.q as string
  if (q) query.value = q
  loading.value = false
})
</script>

<template>
  <div class="center-head-card">
    <h2>搜索</h2>
  </div>
  <hr>
  <div class="center-card-content">
    <div class="search-input-wrap">
      <input
        v-model="query"
        type="search"
        placeholder="搜索文章标题、描述、标签..."
        class="search-field"
        autofocus
      />
      <span class="result-count" v-if="query">{{ results.length }} 个结果</span>
    </div>

    <div v-if="loading" class="search-loading">加载中...</div>

    <template v-else-if="results.length > 0">
      <RouterLink
        v-for="a in results"
        :key="a.id"
        :to="`/post/${a.id}`"
        class="search-result"
      >
        <h3 class="sr-title" v-html="highlightMatch(a.title)"></h3>
        <p class="sr-desc" v-if="a.description" v-html="highlightMatch(a.description.slice(0, 120))"></p>
        <div class="sr-meta">
          <span v-if="a.category" class="sr-cat">{{ a.category }}</span>
          <span v-for="t in (a.tags || []).slice(0, 3)" :key="t" class="sr-tag">{{ t }}</span>
          <span class="sr-date">{{ a.date }}</span>
        </div>
      </RouterLink>
    </template>

    <div v-else-if="query" class="search-empty">
      没有找到匹配的文章
    </div>

    <div v-else class="search-hint">
      输入关键词开始搜索
    </div>
  </div>
</template>

<style scoped>
.center-head-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-field {
  flex: 1;
  padding: 12px 18px;
  border-radius: 10px;
  border: 2px solid var(--common-color-1);
  background: var(--common-bg);
  color: var(--common-text);
  font-size: 15px;
  transition: border-color 0.2s;
}

.search-field:focus {
  outline: none;
  border-color: var(--common-hover);
}

.result-count {
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.5;
  white-space: nowrap;
}

.search-loading,
.search-empty,
.search-hint {
  text-align: center;
  padding: 60px 20px;
  color: var(--common-text);
  opacity: 0.4;
  font-size: 15px;
}

.search-result {
  display: block;
  padding: 14px 16px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--common-text);
  border: 1px solid var(--common-color-1);
  margin-bottom: 10px;
  transition: all 0.2s;
}

.search-result:hover {
  transform: translateX(4px);
  border-color: var(--common-hover);
}

.sr-title {
  margin: 0 0 6px;
  font-size: 16px;
}

.sr-desc {
  margin: 0 0 8px;
  font-size: 13px;
  opacity: 0.6;
}

.sr-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.sr-cat {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--common-color-1);
  color: var(--common-content);
}

.sr-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--common-color-1);
}

.sr-date {
  font-size: 11px;
  opacity: 0.4;
  margin-left: auto;
}

:deep(mark) {
  background: var(--common-color-1);
  color: var(--common-content);
  padding: 0 2px;
  border-radius: 2px;
}
</style>
