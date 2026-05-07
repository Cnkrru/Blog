<template>
  <div class="mermaid-container" :class="{ 'mermaid-container-dark': isDarkTheme }">
    <div v-if="loading" class="mermaid-loading">
      <div class="loading-spinner"></div>
      <span>加载图表中...</span>
    </div>
    <div v-else-if="error" class="mermaid-error">
      <span>{{ error }}</span>
      <button @click="retryRender" class="retry-button">重试</button>
    </div>
    <div ref="containerRef" v-show="!loading && !error"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useMermaidStore, useThemeStore } from '../../stores'

const props = defineProps<{
  code: string
}>()

const emit = defineEmits<{
  'render-success': []
  'render-error': [error: any]
}>()

const containerRef = ref(null)
const lastRenderedCode = ref('')
const mermaidId = ref('mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000))

const mermaidStore = useMermaidStore()
const themeStore = useThemeStore()

const isDarkTheme = computed(() => themeStore.isDark)
const loading = computed(() => mermaidStore.loading)
const error = computed(() => mermaidStore.error)

// Mermaid CDN 链接列表（主链接 + 备用链接）
const mermaidCdnLinks = [
  'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js',
  'https://unpkg.com/mermaid@10.6.1/dist/mermaid.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js'
]

// 加载资源函数，支持备用链接
const loadResource = (urls, type) => {
  return new Promise((resolve, reject) => {
    let currentIndex = 0

    const tryLoad = () => {
      if (currentIndex >= urls.length) {
        reject(new Error(`${type} 加载失败，所有 CDN 链接都不可用`))
        return
      }

      const url = urls[currentIndex]
      const element = document.createElement('script')
      element.src = url
      element.crossOrigin = 'anonymous'
      element.onload = () => resolve()
      element.onerror = () => {
        console.warn(`CDN 加载失败: ${url}，尝试备用链接`)
        currentIndex++
        tryLoad()
      }

      document.head.appendChild(element)
    }

    tryLoad()
  })
}

// 加载 Mermaid CDN
const loadMermaid = () => {
  return new Promise((resolve, reject) => {
    if (window.mermaid) {
      mermaidStore.setMermaidLoaded(true)
      if (!window.mermaidInitialized) {
        initializeMermaid()
      }
      resolve()
      return
    }

    loadResource(mermaidCdnLinks, 'Mermaid JS')
      .then(() => {
        mermaidStore.setMermaidLoaded(true)
        initializeMermaid()
        resolve()
      })
      .catch((err) => {
        mermaidStore.setError('Mermaid 加载失败')
        reject(err)
      })
  })
}

// 初始化 Mermaid
const initializeMermaid = () => {
  const theme = isDarkTheme.value ? 'dark' : 'default'
  window.mermaid.initialize({
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
  window.mermaidInitialized = true
}

// 渲染 Mermaid 图表
const renderMermaid = async () => {
  if (!containerRef.value) return
  
  mermaidStore.setLoading(true)
  mermaidStore.resetError()
  
  if (!mermaidStore.mermaidLoaded) {
    try {
      await loadMermaid()
    } catch (error) {
      mermaidStore.setLoading(false)
      emit('render-error', error)
      return
    }
  } else {
    // 确保主题正确
    initializeMermaid()
  }
  
  // 避免重复渲染相同的代码
  if (lastRenderedCode.value === props.code) {
    mermaidStore.setLoading(false)
    return
  }
  
  try {
    // 清空容器
    containerRef.value.innerHTML = ''
    
    // 生成新的ID，确保每次代码变化时都重新渲染
    mermaidId.value = 'mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000)
    
    // 使用 render 方法渲染
    const { svg } = await window.mermaid.render(mermaidId.value, props.code)
    
    // 插入 SVG
    containerRef.value.innerHTML = svg
    
    lastRenderedCode.value = props.code
    mermaidStore.incrementRenderedCount()
    emit('render-success', props.code)
  } catch (error) {
    const errorMessage = `图表渲染错误: ${error.message}`
    mermaidStore.setError(errorMessage)
    containerRef.value.innerHTML = `<span style="color: #cc0000;">${errorMessage}</span>`
    emit('render-error', error)
  } finally {
    mermaidStore.setLoading(false)
  }
}

// 重试渲染
const retryRender = () => {
  mermaidStore.resetError()
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
  transition: all 0.3s ease;
}

.mermaid-container-dark {
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
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.mermaid-container-dark .loading-spinner {
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mermaid-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 300px;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
}

/* Mermaid 样式 */
:deep(.mermaid) {
  font-family: 'Fira Code', 'Consolas', monospace;
  min-height: 300px;
  width: 100%;
}

:deep(.mermaid svg) {
  max-width: 100%;
  height: auto;
}

/* 暗色主题适配 */
.mermaid-container-dark :deep(.mermaid) {
}
</style>

<style scoped>
/* 颜色样式 */
.mermaid-container {
  background-color: var(--common-bg);
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 1px solid var(--common-color-1);
}

.mermaid-container-dark {
  background-color: var(--common-bg);
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 1px solid var(--common-color-1);
}

.loading-spinner {
  border: 3px solid rgba(255, 192, 203, 0.3);
  border-top: 3px solid var(--common-color-1);
}

.mermaid-container-dark .loading-spinner {
  border: 3px solid rgba(58, 170, 231, 0.3);
  border-top: 3px solid var(--common-color-1);
}

.mermaid-error {
  color: #cc0000;
}

.retry-button {
  background-color: var(--common-color-1);
  color: var(--common-content);
}

.retry-button:hover {
  background-color: var(--common-hover);
}

/* 暗色主题适配 */
.mermaid-container-dark :deep(.mermaid) {
  filter: brightness(0.9);
}
</style>

<style scoped>
/* 响应式设计 */
@media (max-width: var(--md)) {
  .mermaid-container {
    padding: 15px;
  }
  
  .mermaid-loading,
  .mermaid-error {
    padding: 30px 15px;
  }
}

@media (max-width: var(--sm)) {
  .mermaid-container {
    padding: 12px;
    margin: 15px 0;
  }
  
  .loading-spinner {
    width: 24px;
    height: 24px;
  }
  
  .retry-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
