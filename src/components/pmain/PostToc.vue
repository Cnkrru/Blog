<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { headings, active, jump, mount, unmount } from '../../composables/pamin/post.ts'

onMounted(() => mount())
onUnmounted(() => unmount())
</script>

<template>
  <aside class="toc-sidebar">
    <div v-if="headings.length" class="toc-box">
      <div class="toc-head">
        <span>目录</span>
      </div>
      <div class="toc-list">
        <p
          v-for="h in headings"
          :key="h.id"
          class="toc-item"
          :class="{ 'toc-item-on': active === h.id }"
          :style="{ paddingLeft: 6 + (h.level - 1) * 12 + 'px' }"
          @click="jump(h.id)"
        >
          {{ h.text }}
        </p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* 常驻侧栏：sticky 吸在 .main-body 顶部，正文滚动时目录固定在右侧可视区 */
.toc-sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  flex-shrink: 0;
  width: 220px;
  /* 原 100vh-40px 超出 .main 的 600px 上限，目录底部被裁且滚不到；
     改按 .main 上限高度（600px - 内边距/间距）留 48px 余量，card 布局下也够用 */
  max-height: calc(600px - 48px);
  overflow-y: auto;
  margin-top: var(--space-sm);
}

.toc-box {
  border-left: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
}

.toc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 6px var(--space-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--g-text);
}

.toc-list {
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-xs);
}

.toc-item {
  margin: 1px 0;
  padding: 4px var(--space-sm);
  font-size: 13px;
  line-height: 1.5;
  color: var(--g-text);
  border-left: 2px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.toc-item:hover {
  color: var(--g-color);
  background: color-mix(in srgb, var(--g-color) 8%, transparent);
}

/* 当前章节：左侧色条 + 高亮 */
.toc-item-on,
.toc-item-on:hover {
  color: var(--g-color);
  background: color-mix(in srgb, var(--g-color) 10%, transparent);
  border-left-color: var(--g-color);
  font-weight: 600;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏 */
  .toc-sidebar {
    width: 200px;
  }
}

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
  .toc-sidebar {
    width: 180px;
  }
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机：关闭常驻侧栏，目录交给正文顶部的移动端工具条 */
  .toc-sidebar {
    display: none;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
}
</style>
