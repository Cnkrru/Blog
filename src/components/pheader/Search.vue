<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SearchIcon from '../icon/SearchIcon.vue'
import {
  refKeyword,
  refSearchRes,
  refSearchPos,
  searchOpen,
  searchReady,
  searchLoading,
  searchFailed,
  searchHl,
  buildIndex,
  go,
  onEnter,
  onFocus,
  resetSearch,
  mountSearch,
  unmountSearch,
} from '@/composables/pheader.ts'
import { refText } from '@/composables/i18n.ts'

const inputEl = ref<HTMLInputElement | null>(null)
const resultsEl = ref<HTMLElement | null>(null)

// 收起面板并把焦点还给输入框
const closeSearch = () => {
  resetSearch()
  inputEl.value?.focus()
}

// 从输入框直接进入第一条结果
const focusFirstResult = () => {
  const first = resultsEl.value?.querySelector<HTMLButtonElement>('.search-item')
  if (first) first.focus()
}

// 在结果按钮之间循环移动焦点
const moveFocus = (step: number) => {
  const items = resultsEl.value?.querySelectorAll<HTMLButtonElement>('.search-item')
  if (!items?.length) return
  const list = Array.from(items)
  const current = list.indexOf(document.activeElement as HTMLButtonElement)
  const next = (current + step + list.length) % list.length
  list[next]?.focus()
}

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
      ref="inputEl"
      type="text"
      :placeholder="refText.searchPlaceholder"
      :aria-label="refText.searchAria"
      v-model="refKeyword"
      @keydown.enter="onEnter"
      @keydown.esc.prevent="closeSearch"
      @keydown.down.prevent="focusFirstResult"
      @focus="onFocus"
    />

    <Teleport to="body">
      <Transition name="search-fade">
        <div
          v-if="searchOpen"
          ref="resultsEl"
          class="search-results"
          :style="{
            left: refSearchPos.left + 'px',
            top: refSearchPos.top + 'px',
            width: refSearchPos.width + 'px',
          }"
        >
          <div v-if="searchLoading && !searchReady" class="search-empty" role="status">
            {{ refText.searchIndexing }}
          </div>
          <div v-else-if="searchFailed" class="search-empty" role="status">
            {{ refText.searchFailed }}
          </div>
          <div v-else-if="refSearchRes.length === 0" class="search-empty" role="status">
            {{ refText.searchNoResult(refKeyword) }}
          </div>

          <template v-else>
            <div class="search-counter" role="status">
              {{ refText.searchResults(refSearchRes.length) }}
            </div>
            <div
              class="search-list"
              @keydown.down.prevent="moveFocus(1)"
              @keydown.up.prevent="moveFocus(-1)"
              @keydown.esc.prevent="closeSearch"
            >
              <button
                v-for="r in refSearchRes"
                :key="r.id"
                type="button"
                class="search-item"
                @click="go(r.id)"
              >
                <span class="search-item-title" v-html="searchHl(r.title, refKeyword)"></span>
                <span class="search-item-meta">
                  {{ refText.searchCategory }} <span v-html="searchHl(r.category, refKeyword)"></span>
                  <span class="search-item-date" v-html="searchHl(r.date, refKeyword)"></span>
                </span>
                <span v-if="r.tags && r.tags.length" class="search-item-tags">
                  <span v-for="t in r.tags" :key="t" class="search-tag">{{ t }}</span>
                </span>
              </button>
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
  display: block;
  width: calc(100% - 12px);

  padding: 12px 16px;
  margin: 2px 6px;

  border: none;
  border-radius: var(--radius-md);

  font: inherit;
  text-align: left;
  color: var(--g-text);
  background: transparent;
  cursor: pointer;

  transition: background-color 0.15s ease;
}

.search-item:hover,
.search-item:focus-visible {
  background-color: color-mix(in srgb, var(--g-color) 15%, transparent);
}

.search-item:focus-visible {
  outline: 2px solid var(--g-color);
  outline-offset: -2px;
}

.search-item-title {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
}

.search-item-meta {
  display: block;
  font-size: 13px;
  opacity: 0.7;
}

.search-item-date {
  margin-left: 8px;
}

.search-item-tags {
  display: block;
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
