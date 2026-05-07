<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useArticlesStore } from '../../stores'

const store = useArticlesStore()

const articleCount = computed(() => store.totalArticles.toString())

onMounted(async () => {
  await store.fetchArticles()
})
</script>

<template>
  <button class="article-count-btn">
    <span>共 {{ articleCount }} 篇文章</span>
  </button>
</template>

<!-- 布局样式 -->
<style scoped>
.article-count-btn {
  font-size: 14px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  transition: all 0.3s ease;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.article-count-btn {
  background-color: var(--common-color-1);
  border: 2px solid var(--common-color-1);
  color: var(--common-content);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
