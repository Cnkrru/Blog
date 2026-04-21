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
/* 目录按钮容器 */
.toc-btn-container {
    display: flex;
    align-items: center;
}

/* 目录按钮 */
.toc-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    background-color: var(--button-bg);
    border: 2px solid var(--button-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--button-text);
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 8px var(--shadow-color);
    position: relative;
    overflow: hidden;
}

.toc-btn:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
}

/* 活跃状态样式 - 适配主题 */
.toc-btn.active {
    border-color: var(--accent-fg);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.toc-btn.active:hover {
    background-color: var(--accent-hover);
    border-color: var(--accent-hover);
}

.toc-btn svg {
    width: 18px;
    height: 18px;
    margin-right: 6px;
    transition: all 0.3s ease;
}

.toc-btn.active svg {
    transform: rotate(90deg);
}

.btn-text {
    transition: all 0.3s ease;
}

.toc-count {
    background-color: var(--accent-fg);
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    margin-left: 6px;
    transition: all 0.3s ease;
}

.toc-btn.active .toc-count {
    background-color: white;
    color: var(--accent-fg);
}

/* 响应式设计 */
@media (max-width: 768px) {
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

@media (max-width: 480px) {
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