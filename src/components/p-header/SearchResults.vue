<script setup lang="ts">
import { escapeHtml, highlightMatch } from '../../utils/helpers'

const props = defineProps<{ searchText: string; results?: any[]; show?: boolean }>()

const emit = defineEmits<{ 'result-click': [item: any] }>()

const handleResultClick = (item) => {
  emit('result-click', item)
}
</script>

<template>
  <div v-if="show" class="search-results">
    <div v-if="results.length === 0" class="search-empty">
      搜索: "{{ escapeHtml(searchText) }}" - 未找到结果
    </div>

    <template v-else>
      <div class="search-counter">
        {{ results.length }} 个结果
      </div>

      <div
        v-for="item in results"
        :key="item.id"
        class="search-result-item"
        @click="handleResultClick(item)"
      >
        <div class="result-title" v-html="highlightMatch(escapeHtml(item.title), searchText)"></div>
        <div class="result-meta">
          分类: <span v-html="highlightMatch(escapeHtml(item.category || ''), searchText)"></span> |
          ID: <span v-html="highlightMatch(escapeHtml(item.id), searchText)"></span>
        </div>
        <div class="result-tags" v-if="item.tags && item.tags.length > 0">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;
  border-radius: 8px;
}

.search-empty {
  padding: 16px;
  text-align: center;
}

.search-counter {
  padding: 8px 16px;
  font-size: 12px;
}

.search-result-item {
  padding: 12px 16px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.result-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.result-meta {
  font-size: 13px;
  margin-bottom: 4px;
}

.result-tags {
  font-size: 12px;
  margin-top: 4px;
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  margin-right: 4px;
  display: inline-block;
}
</style>

<style scoped>
.search-results {
  background-color: var(--common-bg);
  border: 2px solid var(--common-color-1);
}

.search-empty {
  color: var(--common-text);
}

.search-counter {
  color: var(--common-text);
  border-bottom: 1px solid var(--common-color-1);
}

.search-result-item {
  background-color: var(--common-bg);
  color: var(--common-text);
}

.search-result-item:hover {
  background-color: var(--common-hover);
}

.result-title {
  color: var(--common-text);
}

.result-meta {
  color: var(--common-text);
}

.tag {
  background-color: var(--common-color-1);
  color: var(--common-text);
}
</style>

<style scoped>
@media (max-width: 768px) {
  .search-results {
    max-height: 60vh;
  }
}
</style>
