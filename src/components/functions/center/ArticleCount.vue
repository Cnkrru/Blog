<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useArticlesStore } from '../../../stores/articles'

const { t } = useI18n()
const store = useArticlesStore()

const articleCount = ref('0')
const isLoading = ref(true)

onMounted(async () => {
  const data = await store.fetchArticles()
  articleCount.value = data
    .filter(item => item.id !== 'terminal' && item.id !== 'changelog')
    .length
    .toString()
  isLoading.value = false
})
</script>

<template>
  <button class="article-count-btn">
    {{ t('articleCount', { count: isLoading ? '...' : articleCount }) }}
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
</style>
