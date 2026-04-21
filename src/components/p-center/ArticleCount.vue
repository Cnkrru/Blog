<script setup>
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useArticlesStore } from '../../stores'

const { t } = useI18n()
const store = useArticlesStore()

// 从store中获取状态
const articleCount = computed(() => store.articleCount.toString())
const isLoading = computed(() => store.loading)
const loaded = computed(() => store.loaded)

onMounted(async () => {
  if (!loaded.value) {
    await store.fetchArticles()
  }
})
</script>

<template>
  <button class="article-count-btn">
    <span v-if="isLoading" class="loading-container">
      <span class="loading-spinner"></span>
      <span class="loading-text">{{ t('loading') }}</span>
    </span>
    <span v-else>{{ t('articleCount', { count: articleCount }) }}</span>
  </button>
</template>

<style scoped>
.article-count-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: var(--button-bg);
  border: 2px solid var(--button-border);
  border-radius: 8px;
  cursor: default;
  transition: all 0.3s ease;
  color: var(--button-text);
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.article-count-btn:hover {
  background-color: var(--button-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

/* 加载动画样式 */
.loading-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--button-border);
  border-top-color: var(--button-text);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
