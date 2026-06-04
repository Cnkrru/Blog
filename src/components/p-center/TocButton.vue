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
    >
      <img src="../../assets/imgs/svg/toc-list.svg" alt="" width="18" height="18" class="toc-icon">
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
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
}

.toc-icon {
    width: 16px;
    height: 16px;
}

.toc-count {
    min-width: 18px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 6px;
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}
</style>

<style scoped>
.toc-btn {
    background: rgba(255, 192, 203, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

body.dark-theme .toc-btn {
    background: rgba(58, 170, 231, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.toc-icon {
    filter: brightness(0) invert(1);
}

body.dark-theme .toc-icon {
    filter: brightness(0) invert(1);
}

.toc-btn:hover {
    transform: scale(1.08);
}

.toc-count {
    display: none;
}
</style>

<style scoped>
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
