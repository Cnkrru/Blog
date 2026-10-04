<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSeo } from '../composables/seo'
import {
  turnView,
  turnGroup,
  categoryViewMode,
  categoryModeGroups,
  categoryExpandGroup,
} from '../composables/pamin/category.ts'

useSeo({
  title: '分类归档',
  description: '按分类、年份、月份归档浏览博客的全部文章。',
  path: '/category',
})

onMounted(() => turnView(0))
</script>

<template>
  <div class="archive-list">
    <!-- 工具栏：视图切换 -->
    <div class="tool-area">
      <div class="view-tabs">
        <button class="view-tab" :class="{ 'tab-on': categoryViewMode === 0 }" @click="turnView(0)">
          分类
        </button>
        <button class="view-tab" :class="{ 'tab-on': categoryViewMode === 1 }" @click="turnView(1)">
          年份
        </button>
        <button class="view-tab" :class="{ 'tab-on': categoryViewMode === 2 }" @click="turnView(2)">
          月份
        </button>
      </div>
    </div>

    <!-- 列表div：高度固定，超出滚动 -->
    <div class="list-area">
      <div v-for="g in categoryModeGroups" :key="g.name" class="arch-group">
        <a
          href="#"
          class="group-header"
          :class="{ 'header-on': categoryExpandGroup === g.name }"
          @click.prevent="turnGroup(g.name)"
        >
          <span class="group-name">{{ g.name }}</span>
          <span class="group-count">{{ g.items.length }} 篇</span>
          <span class="group-arrow" :class="{ 'arrow-open': categoryExpandGroup === g.name }"
            >▾</span
          >
        </a>

        <!-- v-show改为class.open：配合grid-template-rows实现平滑展开动画 -->
        <div class="group-body" :class="{ open: categoryExpandGroup === g.name }">
          <div class="group-list">
            <RouterLink v-for="a in g.items" :key="a.key" class="group-item" :to="`/post/${a.key}`">
              <span class="item-title">{{ a.title }}</span>
              <span class="item-tags" v-if="a.tags && a.tags.length">
                <span v-for="t in a.tags.slice(0, 2)" :key="t" class="item-tag">{{ t }}</span>
              </span>
              <span class="item-date">{{ a.date }}</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <div v-if="!categoryModeGroups.length" class="arch-empty">暂无文章</div>
    </div>
  </div>
</template>

<style scoped>
.archive-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tool-area {
  flex-shrink: 0;
  margin-bottom: var(--space-lg);
}

.view-tabs {
  width: fit-content;
  display: flex;
  gap: 4px;
  padding: 3px;
  border-radius: var(--radius-full);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  background-color: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
}

.view-tab {
  padding: 4px 16px;
  border-radius: var(--radius-full);
  border: none;
  background-color: transparent;
  color: var(--g-text);
  cursor: pointer;
  font-size: 13px;
  transition:
    color 0.25s ease,
    background-color 0.2s ease;
}

.view-tab.tab-on {
  background-color: var(--g-color);
  color: #fff;
}

.list-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.arch-group {
  margin-bottom: var(--space-md);
  border-radius: var(--space-lg);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  background-color: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
}

.arch-group:hover {
  transform: translateY(-4px);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.06),
    0 8px 20px rgba(0, 0, 0, 0.1),
    0 0 0 1px color-mix(in srgb, var(--g-color) 30%, transparent);
}

.group-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.group-header:hover,
.group-header.header-on {
  background-color: color-mix(in srgb, var(--g-color) 8%, transparent);
}

.group-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--g-text);
}

.group-count {
  font-size: 13px;
  color: var(--g-text);
  opacity: 0.45;
  margin-right: auto;
}

.group-arrow {
  font-size: 12px;
  color: var(--g-text);
  opacity: 0.4;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.group-arrow.arrow-open {
  transform: rotate(180deg);
}

.group-body {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
}

.group-body.open {
  grid-template-rows: 1fr;
}

.group-list {
  overflow: hidden;
  min-height: 0;
}

.group-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-lg) var(--space-sm) 20px;
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--g-color) 30%, transparent);
  transition:
    background-color 0.15s ease,
    padding-left 0.2s ease;
}

.group-item:hover {
  background-color: color-mix(in srgb, var(--g-color) 8%, transparent);
  padding-left: 24px;
}

.group-item:last-child {
  border-bottom: none;
}

.item-title {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--g-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-tags {
  display: flex;
  gap: var(--space-xs);
  flex-shrink: 0;
}

.item-tag {
  padding: 1px 7px;
  font-size: 11px;
  border-radius: var(--radius-full);
  background-color: color-mix(in srgb, var(--g-color) 15%, transparent);
  color: var(--g-text);
  opacity: 0.7;
}

.item-date {
  font-size: 12px;
  opacity: 0.4;
  color: var(--g-text);
  white-space: nowrap;
  flex-shrink: 0;
}

.arch-empty {
  padding: var(--space-xl);
  text-align: center;
  color: var(--g-text);
  opacity: 0.5;
}

/* ====================<响应式>==================== */
@media (max-width: 768px) {
  .tool-area {
    margin-bottom: var(--space-md);
  }
}

@media (max-width: 480px) {
  .view-tab {
    padding: 4px 12px;
    font-size: 12px;
  }
}
</style>
