<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import SearchIcon from '../icon/SearchIcon.vue'
import {
  RefKeyword,
  RefSearchRes,
  RefSearchPos,
  searchOpen,
  searchHl,
  buildIndex,
  go,
  onEnter,
  onFocus,
  mountSearch,
  unmountSearch,
} from '@/composables/pheader.ts'

onMounted(() => {
  buildIndex()
  mountSearch()
})

onUnmounted(() => {
  unmountSearch()
})
</script>

<template>
  <div class="search">
    <SearchIcon class="search-icon" />
    <input
      type="text"
      placeholder="搜索"
      v-model="RefKeyword"
      @keypress.enter="onEnter"
      @focus="onFocus"
    />

    <Teleport to="body">
      <Transition name="search-fade">
        <div
          v-if="searchOpen"
          class="search-results"
          :style="{
            left: RefSearchPos.left + 'px',
            top: RefSearchPos.top + 'px',
            width: RefSearchPos.width + 'px',
          }"
        >
          <div v-if="RefSearchRes.length === 0" class="search-empty">
            搜索 "{{ RefKeyword }}"：未找到结果
          </div>

          <template v-else>
            <div class="search-counter">{{ RefSearchRes.length }} 个结果</div>
            <div class="search-list">
              <div v-for="r in RefSearchRes" :key="r.id" class="search-item" @click="go(r.id)">
                <div class="search-item-title" v-html="searchHl(r.title, RefKeyword)"></div>
                <div class="search-item-meta">
                  分类: <span v-html="searchHl(r.category, RefKeyword)"></span>
                  <span class="search-item-date" v-html="searchHl(r.date, RefKeyword)"></span>
                </div>
                <div class="search-item-tags" v-if="r.tags && r.tags.length">
                  <span v-for="t in r.tags" :key="t" class="search-tag">{{ t }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.search {
  width: 600px;
  height: 80%;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);

  border-radius: var(--radius-full);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
  padding: 0 var(--space-md);

  background: rgba(
    var(--glass-r),
    var(--glass-g),
    var(--glass-b),
    calc(var(--glass-opacity) * 0.6)
  );
  backdrop-filter: blur(12px);

  transition: border-color 0.2s ease;
}

.search-icon {
  color: var(--g-text);
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.search:focus-within .search-icon {
  opacity: 0.8;
}

.search:focus-within {
  border-color: var(--g-color);
}

.search input {
  height: 100%;
  width: 100%;

  color: var(--g-text);
  background: transparent;
  outline: none;
}

.search input::placeholder {
  color: var(--g-text);
  opacity: 0.4;
}

/* ============================== 结果下拉 ============================== */
.search-results {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  max-height: 60vh;
  overflow-y: auto;
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 12%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-opacity));
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

.search-empty {
  padding: 16px;
  text-align: center;
  color: var(--g-text);
}

.search-counter {
  padding: 8px 16px;
  font-size: 12px;
  color: var(--g-text);
  border-bottom: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
}

.search-item {
  padding: 12px 16px;
  margin: 2px 6px;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--g-text);
  transition: background-color 0.15s ease;
}

.search-item:hover {
  background-color: color-mix(in srgb, var(--g-color) 15%, transparent);
}

.search-item-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.search-item-meta {
  font-size: 13px;
  opacity: 0.7;
}

.search-item-date {
  margin-left: 8px;
}

.search-item-tags {
  font-size: 12px;
  margin-top: 6px;
}

.search-hit {
  color: var(--g-color);
}

.search-tag {
  display: inline-block;
  margin-right: 4px;
  padding: 2px 6px;
  font-size: 11px;
  border-radius: var(--radius-sm);
  background-color: color-mix(in srgb, var(--g-color) 25%, transparent);
  color: var(--g-text);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
  /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机 */
  .search {
    width: 60%;
    max-width: 480px;
    height: 44px;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .search {
    width: 60%;
    max-width: 480px;
    height: 44px;
  }
}
</style>

<!-- Transition 的 class 需作用于 Teleport 出的 .search-results，非 scoped -->
<style>
.search-fade-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.search-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
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
