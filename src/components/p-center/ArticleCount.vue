<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useArticlesStore } from '../../stores'

const store = useArticlesStore()

const articleCount = computed(() => store.totalArticles.toString())

onMounted(async () => {
  try {
    await store.fetchArticles()
  } catch (e) {
    console.error('加载文章数量失败:', e)
  }
})
</script>

<template>
  <button class="article-count-btn">
    <svg class="count-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    <span>共 {{ articleCount }} 篇文章</span>
  </button>
</template>

<!-- 布局样式 -->
<style scoped>
.article-count-btn {
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 20px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: default;
}

.count-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.article-count-btn {
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  color: var(--common-text);
  border: 1px solid color-mix(in srgb, var(--common-color-1) 30%, transparent);
}

.count-icon {
  color: var(--common-color-1);
}
</style>


