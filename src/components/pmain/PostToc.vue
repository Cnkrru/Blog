<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { headings, active, jump, tocMount, tocUnmount } from '../../composables/pamin/post.ts'
import { refText } from '../../composables/i18n.ts'
import List from '../icon/List.vue'
import X from '../icon/X.vue'

const tocDialog = ref<HTMLDialogElement>()

onMounted(() => tocMount())
onUnmounted(() => tocUnmount())

// 移动端目录入口：点开 dialog 弹层（打开/关闭是纯 UI 态，留在组件内）
const tocDialogOpen = () => tocDialog.value?.showModal()
const tocDialogClose = () => tocDialog.value?.close()
</script>

<template>
  <aside class="toc-sidebar">
    <div v-if="headings.length" class="toc-box">
      <div class="toc-head">
        <span>{{ refText.toc }}</span>
      </div>
      <div class="toc-list">
        <button
          v-for="h in headings"
          :key="h.id"
          type="button"
          class="toc-item"
          :class="{ 'toc-item-on': active === h.id }"
          :style="{ paddingLeft: 6 + (h.level - 1) * 12 + 'px' }"
          :title="h.text"
          @click="jump(h.id)"
        >
          {{ h.text }}
        </button>
      </div>
    </div>
  </aside>

  <!-- 移动端目录入口与弹层必须 Teleport 到 body。PostToc 挂在 .post-layout 里、即 .main 内部，
       而 .main 带 backdrop-filter（见 common.css 四区玻璃化），按规范会为 position:fixed 后代创建包含块，
       浮钮的 bottom 就变成相对 .main 盒子而非视口（实测 scrollY=0 时 rect.top≈8383、视口高仅 554，整个在屏幕外，
       只有滚到页面底部附近才出现）。Teleport 出去后与 App.vue 的 BackToTop 同以视口为参照 -->
  <Teleport to="body" v-if="headings.length">
    <button type="button" class="toc-fab" :aria-label="refText.tocOpen" @click="tocDialogOpen">
      <List />
    </button>

    <dialog ref="tocDialog" class="toc-dialog" :aria-label="refText.tocTitle">
      <div class="dialog-head">
        <span>{{ refText.toc }}</span>
        <button
          type="button"
          class="dialog-close"
          :aria-label="refText.tocClose"
          @click="tocDialogClose"
        >
          <X />
        </button>
      </div>
      <div class="toc-dialog-list">
        <button
          v-for="h in headings"
          :key="h.id"
          type="button"
          class="toc-item"
          :class="{ 'toc-item-on': active === h.id }"
          :style="{ paddingLeft: 6 + (h.level - 1) * 12 + 'px' }"
          :title="h.text"
          @click="tocDialogClose(); jump(h.id)"
        >
          {{ h.text }}
        </button>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
/* 常驻侧栏：sticky 吸在 .main-body 顶部，正文滚动时目录固定在右侧可视区 */
.toc-sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  flex-shrink: 0;
  width: 220px;
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
  display: block;
  width: 100%;

  margin: 1px 0;
  padding: 4px var(--space-sm);

  border: none;
  border-left: 2px solid transparent;
  background: transparent;

  font: inherit;
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  color: var(--g-text);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.toc-item:hover,
.toc-item:focus-visible {
  color: var(--g-color);
  background: color-mix(in srgb, var(--g-color) 8%, transparent);
}

.toc-item:focus-visible {
  outline: 2px solid var(--g-color);
  outline-offset: -2px;
}

/* 当前章节：左侧色条 + 高亮 */
.toc-item-on,
.toc-item-on:hover,
.toc-item-on:focus-visible {
  color: var(--g-color);
  background: color-mix(in srgb, var(--g-color) 10%, transparent);
  border-left-color: var(--g-color);
  font-weight: 600;
}

/* ==========<移动端目录>========== */
/* 浮钮默认隐藏，仅 sm 档显示（此时常驻侧栏已隐藏） */
.toc-fab {
  display: none;
}

.toc-dialog[open] {
  width: min(320px, 86vw);
  max-height: 70vh;
  padding: var(--space-md);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
  border-radius: var(--radius-md);
  background: var(--g-bg);

  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.dialog-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);

  font-size: 13px;
  font-weight: 600;
  color: var(--g-text);
}

.dialog-close {
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--g-text);
}

.toc-fab:focus-visible,
.dialog-close:focus-visible {
  outline: 2px solid var(--g-color);
  outline-offset: 2px;
}

.toc-dialog-list {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  padding: 0 var(--space-xs);
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
  /* [响应式-sm] 手机：关闭常驻侧栏，改由右下浮钮弹出 dialog 目录 */
  .toc-sidebar {
    display: none;
  }
  .toc-fab {
    display: flex;
    position: fixed;
    right: 40px;
    /* 40(返回顶部按钮高) + 40(其 bottom) + 12(间距) = 92px，压在返回顶部按钮正上方 */
    bottom: 92px;
    z-index: 999;

    width: 40px;
    height: 40px;
    color: white;

    justify-content: center;
    align-items: center;

    border-radius: var(--radius-full);
    background-color: var(--g-color);
  }
}

</style>
