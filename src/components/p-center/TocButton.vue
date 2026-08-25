<script setup>
import { computed } from 'vue'
import { useTocStore, useThemeStore } from '../../stores'
import listSvg from '@/assets/svg/list.svg?raw'
import xSvg from '@/assets/svg/x.svg?raw'

const props = defineProps(['show'])

const emit = defineEmits(['update:show'])

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
  <div class="toc-wrap" :class="{ 'dark-theme': isDarkTheme }">
    <button
      class="toc-btn"
      @click="toggleToc"
      :class="{ active: tocStore.show }"
      :title="tocStore.show ? '关闭目录' : '打开目录'"
      aria-label="切换目录"
    >
      <!-- 列表图标（默认） -->
      <span
        v-if="!tocStore.show"
        class="svg-icon toc-icon"
        :style="{ width: '16px', height: '16px' }"
        v-html="listSvg"
      ></span>
      <!-- 关闭图标（展开时） -->
      <span
        v-else
        class="svg-icon toc-icon"
        :style="{ width: '14px', height: '14px' }"
        v-html="xSvg"
      ></span>
    </button>
  </div>
</template>

<style scoped>
.toc-wrap {
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

.toc-icon {
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
  .toc-icon {
    width: 14px;
    height: 14px;
  }
}
</style>