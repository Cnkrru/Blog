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
    <img class="count-icon" src="../../assets/imgs/svg/file-text.svg" alt="">
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
  background: rgba(255, 192, 203, 0.2);
  color: var(--common-text);
  border: 1px solid rgba(255, 192, 203, 0.3);
}

body.dark-theme .article-count-btn {
  background: rgba(58, 170, 231, 0.15);
  border: 1px solid rgba(58, 170, 231, 0.25);
}

.count-icon {
  color: var(--common-color-1);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
