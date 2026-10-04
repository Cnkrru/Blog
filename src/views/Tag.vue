<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSeo } from '../composables/seo'
import { tagClean, tagToggle, tagItem, tagSet, tagList, tags } from '../composables/pamin/tags.ts'

useSeo({
  title: '标签',
  description: '按标签浏览博客的全部文章。',
  path: '/tag',
})

onMounted(tagClean)
</script>

<template>
  <div class="tag-list">
    <!-- 标签云 -->
    <div class="cloud-area">
      <button
        v-for="t in tagSet"
        :key="t"
        class="cloud-tag"
        :class="{ 'tag-on': t === tagItem }"
        @click="tagToggle(t, tags)"
      >
        {{ t }}
      </button>
    </div>

    <!-- 选中标签的文章列表 -->
    <div class="timeline-area" v-if="tagItem">
      <div class="tl-bar">
        <span class="tl-title">「{{ tagItem }}」下的文章</span>
      </div>

      <div class="tl-body">
        <RouterLink v-for="a in tagList" :key="a.key" class="tl-item" :to="`/post/${a.key}`">
          <span class="tl-dot"></span>
          <span class="tl-item-title">{{ a.title }}</span>
          <span class="tl-item-date">{{ a.date }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

/* 标签云 */
.cloud-area {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
  padding-bottom: var(--space-lg);
  border-bottom: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
}

.cloud-tag {
  padding: 4px 14px;
  border-radius: var(--radius-full);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
  background-color: transparent;
  color: var(--g-text);
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.cloud-tag:hover {
  transform: translateY(-2px);
  border-color: var(--g-color);
  color: var(--g-color);
}

.cloud-tag.tag-on {
  background-color: var(--g-color);
  border-color: var(--g-color);
  color: #fff;
  transform: translateY(-2px);
}

/* 选中标签文章列表 */
.timeline-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: var(--space-lg);
}

.tl-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
}

.tl-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--g-color);
}

.tl-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.tl-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xs) var(--space-md);
  text-decoration: none;
  border-radius: var(--space-sm);
  transition:
    background-color 0.2s ease,
    padding-left 0.2s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tl-item:hover {
  background-color: color-mix(in srgb, var(--g-color) 8%, transparent);
  transform: translateX(4px);
}

.tl-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--g-color);
  flex-shrink: 0;
}

.tl-item-title {
  flex: 1;
  font-size: 14px;
  color: var(--g-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tl-item-date {
  font-size: 12px;
  opacity: 0.6;
  color: var(--g-text);
}
</style>
