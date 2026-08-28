<script setup>
import VButton from '@/components/__common/VButton.vue'
import { computed } from 'vue'
import { useTocStore, useThemeStore } from '../../stores'

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
    <VButton
      class="toc-btn"
      :class="{ active: tocStore.show }"
      :icon="tocStore.show ? 'x.svg' : 'list.svg'"
      icon-size="24"
      variant="primary"
      shape="round"
      size="38"
      :title="tocStore.show ? '关闭目录' : '打开目录'"
      aria-label="切换目录"
      @click="toggleToc"
    />
  </div>
</template>

<style scoped>
.toc-wrap {
  display: flex;
  align-items: center;
}

.toc-btn {
  box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
}

.toc-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

.toc-btn.active {
  --v-btn-bg: color-mix(in srgb, var(--common-color-1) 85%, var(--common-text));
  --v-btn-border: transparent;
}
</style>