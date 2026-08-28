<template>
  <div class="mermaid-container" :class="{ 'mermaid-dark': isDarkTheme }">
    <div v-if="loading" class="mermaid-loading">
      <div class="loading-spinner"></div>
      <span>加载图表中...</span>
    </div>
    <div v-else-if="error" class="mermaid-error">
      <span>{{ error }}</span>
      <button @click="retryRender" class="retry-button" aria-label="重试">重试</button>
    </div>
    <div ref="containerRef" v-show="!loading && !error"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useThemeStore } from '../../stores'

const props = defineProps(['code'])

const emit = defineEmits(['render-success', 'render-error'])

const containerRef = ref(null)
const lastRenderedCode = ref('')
const mermaidId = ref('mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000))

const themeStore = useThemeStore()

const isDarkTheme = computed(() => themeStore.isDark)

// ---- 原 mermaid store 逻辑内联（仅本组件消费）----
const mermaidLoaded = ref(false)
const loading = ref(false)
const error = ref(null)
const setMermaidLoaded = (loaded) => { mermaidLoaded.value = loaded }
const setLoading = (isLoading) => { loading.value = isLoading }
const setError = (err) => { error.value = err }
const resetError = () => { error.value = null }

// 加载 Mermaid（本地依赖，动态 import 避免进入 SSR 关键路径）
let mermaidLib = null
const loadMermaid = async () => {
  if (!mermaidLib) {
    mermaidLib = (await import('mermaid')).default
    mermaidLoaded.value = true
    initializeMermaid()
  }
  return mermaidLib
}

// 初始化 Mermaid
const initializeMermaid = () => {
  if (!mermaidLib) return
  const theme = isDarkTheme.value ? 'dark' : 'default'
  mermaidLib.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: theme,
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      nodeSpacing: 100,
      rankSpacing: 100
    }
  })
}

// 渲染 Mermaid 图表
const renderMermaid = async () => {
  if (!containerRef.value) return
  
  setLoading(true)
  resetError()
  
  if (!mermaidLoaded.value) {
    try {
      await loadMermaid()
    } catch (error) {
      setLoading(false)
      emit('render-error', error)
      return
    }
  } else {
    // 确保主题正确
    initializeMermaid()
  }
  
  // 避免重复渲染相同的代码
  if (lastRenderedCode.value === props.code) {
    setLoading(false)
    return
  }
  
  try {
    // 清空容器
    containerRef.value.innerHTML = ''
    
    // 生成新的ID，确保每次代码变化时都重新渲染
    mermaidId.value = 'mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000)
    
    // 使用 render 方法渲染
    const { svg } = await mermaidLib.render(mermaidId.value, props.code)
    
    // 插入 SVG
    containerRef.value.innerHTML = svg
    
    lastRenderedCode.value = props.code
    emit('render-success', props.code)
  } catch (error) {
    const errorMessage = `图表渲染错误: ${error.message}`
    setError(errorMessage)
    containerRef.value.innerHTML = `<span style="color: var(--color-error);">${errorMessage}</span>`
    emit('render-error', error)
  } finally {
    setLoading(false)
  }
}

// 重试渲染
const retryRender = () => {
  resetError()
  renderMermaid()
}

onMounted(() => {
  renderMermaid()
})

watch(() => props.code, () => {
  nextTick(() => {
    renderMermaid()
  })
})

// 监听主题变化，重新渲染以适配主题
watch(() => isDarkTheme.value, () => {
  nextTick(() => {
    renderMermaid()
  })
})
</script>

<style scoped>
.mermaid-container {
  width: 100%;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
  position: relative;
  clear: both;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

.mermaid-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 300px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.mermaid-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 300px;
}

/* 颜色样式 */
.mermaid-container {
  background-color: var(--common-bg);
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 1px solid var(--common-color-1);
}

.mermaid-dark {
  background-color: var(--common-bg);
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 1px solid var(--common-color-1);
  --mermaid-filter: brightness(0.9);
}

.loading-spinner {
  border: 3px solid color-mix(in srgb, var(--common-color-1) 30%, transparent);
  border-top: 3px solid var(--common-color-1);
}

.mermaid-error {
  color: var(--color-error);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mermaid-container {
    padding: 15px;
  }
  
  .mermaid-loading,
  .mermaid-error {
    padding: 30px 15px;
  }
}

@media (max-width: 640px) {
  .mermaid-container {
    padding: 12px;
    margin: 15px 0;
  }
  
  .loading-spinner {
    width: 24px;
    height: 24px;
  }
}
</style>

<style>
/* mermaid 库渲染的 DOM，需非 scoped 命中 */
.mermaid {
  font-family: 'Fira Code', 'Consolas', monospace;
  min-height: 300px;
  width: 100%;
  filter: var(--mermaid-filter, none);
}

.mermaid svg {
  max-width: 100%;
  height: auto;
}
</style>
