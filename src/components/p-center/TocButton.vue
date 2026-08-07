<script setup lang="ts">
import { computed } from 'vue'
import { useTocStore, useThemeStore } from '../../stores'

const props = defineProps<{ show?: boolean }>()

const emit = defineEmits<{ 'update:show': [show: boolean] }>()

const tocStore = useTocStore()
const themeStore = useThemeStore()

const isDarkTheme = computed(() => themeStore.isDark)
const hasToc = computed(() => tocStore.toc.length > 0)

const toggleToc = () => {
  tocStore.toggleToc()
  emit('update:show', tocStore.show)
}
</script>

<template>
  <div class="toc-btn-container" :class="{ 'dark-theme': isDarkTheme }">
    <button
      class="toc-btn"
      @click="toggleToc"
      :class="{ active: tocStore.show }"
      :title="tocStore.show ? '关闭目录' : '打开目录'"
      aria-label="切换目录"
    >
      <!-- 列表图标（默认） -->
      <svg
        v-if="!tocStore.show"
        class="toc-btn-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <!-- 关闭图标（展开时） -->
      <svg
        v-else
        class="toc-btn-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.toc-btn-container {
  display: flex;
  align-items: center;
}

.toc-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--common-color-1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  background: var(--common-color-1);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease;
  position: relative;
}

.toc-btn-icon {
  color: #fff;
  transition: transform 0.25s ease;
}

.toc-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

.toc-btn:active {
  transform: scale(0.95);
}

.toc-btn.active {
  background: color-mix(in srgb, var(--common-color-1) 85%, var(--common-text));
  border-color: transparent;
}

/* 响应式 */
@media (max-width: 640px) {
  .toc-btn {
    width: 32px;
    height: 32px;
  }
  .toc-btn-icon {
    width: 14px;
    height: 14px;
  }
}
</style>