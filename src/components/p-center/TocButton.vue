<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
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
      class="v-btn-primary v-btn-round toc-btn"
      style="height:38px;min-width:38px"
      :class="{ active: tocStore.show }"
      :title="tocStore.show ? '关闭目录' : '打开目录'"
      aria-label="切换目录"
      @click="toggleToc"
    ><VIcon :src="tocStore.show ? 'x.svg' : 'list.svg'" :size="24" /></VButton>
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