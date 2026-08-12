<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useArticlesStore } from '../../stores'
import fileTextSvg from '@/assets/svg/file-text.svg?raw'

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
    <span class="svg-icon count-icon" :style="{ width: '24px', height: '24px' }" v-html="fileTextSvg"></span>
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


