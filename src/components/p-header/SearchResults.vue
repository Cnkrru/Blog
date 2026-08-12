<script setup lang="ts">
import { escapeHtml, highlightMatch } from '../../utils/helpers'

const props = defineProps<{
  searchText: string;
   results?: any[];
   show?: boolean 
}>()

const emit = defineEmits<{ 'result-click': [item: any] }>()

const handleResultClick = (item) => {
  emit('result-click', item)
}
</script>

<template>
  <Transition name="search-fade">
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
  </Transition>
</template>

<style scoped>
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  max-height: 400px;
  min-width: 280px;
  overflow-y: auto;
  z-index: 10000;
  border-radius: 12px;
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
  border-radius: 8px;
  margin: 2px 4px;
  transition: background-color 0.15s ease, transform 0.15s ease;
  cursor: pointer;
}

.search-result-item:first-child {
  border-radius: 10px 10px 8px 8px;
}

.search-result-item:last-child {
  border-radius: 8px 8px 10px 10px;
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
  border-radius: 8px;
  font-size: 11px;
  margin-right: 4px;
  display: inline-block;
}
</style>

<style scoped>
.search-results {
  background-color: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-alpha));
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid color-mix(in srgb, var(--common-color-1) 12%, transparent);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.10);
}

.search-empty {
  color: var(--common-text);
}

.search-counter {
  color: var(--common-text);
  border-bottom: 1px solid var(--common-color-1);
}

.search-result-item {
  background-color: transparent;
  color: var(--common-text);
}

.search-result-item:hover {
  background-color: color-mix(in srgb, var(--common-color-1) 15%, transparent);
}

.result-title {
  color: var(--common-text);
}

.result-meta {
  color: var(--common-text);
}

.tag {
  background-color: color-mix(in srgb, var(--common-color-1) 25%, transparent);
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

<!-- 搜索结果显示动画 — 非 scoped，因为 Transition 的 class 需作用于 .search-results 根元素 -->
<style>
.search-fade-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.search-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.search-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.search-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
