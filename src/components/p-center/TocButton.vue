<script setup>
import { computed } from 'vue'
import { useTocStore, useThemeStore } from '../../stores'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

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
  <div class="toc-btn-container" :class="{ 'dark-theme': isDarkTheme }">
    <button 
      class="toc-btn" 
      @click="toggleToc"
      :class="{ active: tocStore.show }"
      :title="tocStore.show ? '关闭目录' : '打开目录'"
    >
      <svg 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor"
        :class="{ active: tocStore.show }"
      >
        <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
      </svg>
      <span class="btn-text">目录</span>
      <span v-if="hasToc" class="toc-count">{{ tocStore.toc.length }}</span>
    </button>
  </div>
</template>

<style scoped>
.toc-btn-container {
    display: flex;
    align-items: center;
}

.toc-btn {
    font-size: 14px;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.toc-btn svg {
    width: 18px;
    height: 18px;
    margin-right: 6px;
    transition: all 0.3s ease;
}

.toc-count {
    min-width: 18px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 6px;
    transition: all 0.3s ease;
}
</style>

<style scoped>
.toc-btn {
    background-color: var(--common-color-1);
    color: var(--common-content); 
    border: 1px solid var(--common-color-1);
}

.toc-btn svg {
    fill: var(--common-content);
}

.toc-count {
    color: var(--common-text);
    border: 1px solid var(--common-color-1);
}
</style>

<style scoped>
@media (max-width: var(--md)) {
    .toc-btn {
        padding: 6px 12px;
        font-size: 13px;
    }
    
    .toc-btn svg {
        width: 16px;
        height: 16px;
        margin-right: 4px;
    }
    
    .toc-count {
        font-size: 10px;
        padding: 1px 4px;
        margin-left: 4px;
    }
}

@media (max-width: var(--sm)) {
    .toc-btn {
        padding: 5px 10px;
        font-size: 12px;
    }
    
    .toc-btn svg {
        width: 14px;
        height: 14px;
    }
    
    .btn-text {
        display: none;
    }
    
    .toc-count {
        margin-left: 2px;
    }
}
</style>
