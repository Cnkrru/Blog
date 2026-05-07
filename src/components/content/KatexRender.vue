<template>
  <div class="math-container" :class="{ 'math-container-dark': isDarkTheme }">
    <div v-if="loading" class="math-loading">
      <div class="loading-spinner"></div>
      <span>加载数学公式中...</span>
    </div>
    <div v-else-if="error" class="math-error">
      <span>{{ error }}</span>
      <button @click="retryRender" class="retry-button">重试</button>
    </div>
    <div ref="mathRef" class="math-content" v-show="!loading && !error"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useMathStore, useThemeStore } from '../../stores'

const props = defineProps<{
  latex: string
}>()

const emit = defineEmits<{
  'render-success': []
  'render-error': [error: any]
}>()

const mathRef = ref(null)
const lastRenderedLatex = ref('')

const mathStore = useMathStore()
const themeStore = useThemeStore()

const isDarkTheme = computed(() => themeStore.isDark)
const loading = computed(() => mathStore.loading)
const error = computed(() => mathStore.error)

// KaTeX CDN 链接列表（主链接 + 备用链接）
const katexCdnLinks = {
  css: [
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css',
    'https://unpkg.com/katex@0.16.8/dist/katex.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.css'
  ],
  js: [
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js',
    'https://unpkg.com/katex@0.16.8/dist/katex.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.js'
  ],
  autoRender: [
    'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js',
    'https://unpkg.com/katex@0.16.8/dist/contrib/auto-render.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/contrib/auto-render.min.js'
  ]
}

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
      let element

      if (type === 'css') {
        element = document.createElement('link')
        element.rel = 'stylesheet'
        element.href = url
      } else if (type === 'js') {
        element = document.createElement('script')
        element.src = url
      }

      element.crossOrigin = 'anonymous'
      element.onload = () => resolve()
      element.onerror = () => {
        console.warn(`CDN 加载失败: ${url}，尝试备用链接`)
        currentIndex++
        tryLoad()
      }

      if (type === 'css') {
        document.head.appendChild(element)
      } else if (type === 'js') {
        document.head.appendChild(element)
      }
    }

    tryLoad()
  })
}

// 加载 KaTeX 库
const loadKaTeX = () => {
  return new Promise(async (resolve, reject) => {
    if (window.katex) {
      mathStore.setKaTeXLoaded(true)
      resolve()
      return
    }

    try {
      // 加载 KaTeX CSS
      await loadResource(katexCdnLinks.css, 'css')
      
      // 加载 KaTeX JS
      await loadResource(katexCdnLinks.js, 'js')
      
      // 加载自动渲染插件（可选）
      await loadResource(katexCdnLinks.autoRender, 'js')
      
      mathStore.setKaTeXLoaded(true)
      resolve()
    } catch (error) {
      mathStore.setError('KaTeX 加载失败')
      reject(error)
    }
  })
}

// 渲染数学公式
const renderMath = async () => {
  if (!mathRef.value) return
  
  mathStore.setLoading(true)
  mathStore.resetError()
  
  if (!mathStore.katexLoaded) {
    try {
      await loadKaTeX()
    } catch (error) {
      mathStore.setLoading(false)
      emit('render-error', error)
      return
    }
  }
  
  // 避免重复渲染相同的公式
  if (lastRenderedLatex.value === props.latex) {
    mathStore.setLoading(false)
    return
  }
  
  try {
    // 清空容器
    mathRef.value.innerHTML = ''
    
    // 渲染公式
    if (window.katex) {
      window.katex.render(props.latex, mathRef.value, {
        throwOnError: false,
        displayMode: true,
        fleqn: false,
        errorColor: '#cc0000',
        strict: 'ignore',
        trust: true
      })
      
      lastRenderedLatex.value = props.latex
      mathStore.incrementRenderedCount()
      emit('render-success', props.latex)
    } else {
      throw new Error('KaTeX 库未加载')
    }
  } catch (error) {
    console.error('渲染数学公式失败:', error)
    mathStore.setError('公式渲染错误: ' + error.message)
    mathRef.value.innerHTML = `<span style="color: #cc0000;">公式渲染错误: ${error.message}</span>`
    emit('render-error', error)
  } finally {
    mathStore.setLoading(false)
  }
}

// 重试渲染
const retryRender = () => {
  mathStore.resetError()
  renderMath()
}

onMounted(() => {
  renderMath()
})

watch(() => props.latex, () => {
  nextTick(() => {
    renderMath()
  })
})

onUnmounted(() => {
  // 清理资源
  // 不再直接设置mathRef.value为null，因为可能会在异步操作中访问到
  // 让Vue的响应式系统自动处理清理
})
</script>

<style scoped>
.math-container {
  width: 100%;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
  position: relative;
  clear: both;
  transition: all 0.3s ease;
}

.math-container-dark {
}

.math-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 150px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.math-container-dark .loading-spinner {
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.math-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 150px;
}

.retry-button {
  margin-top: 12px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
}

.math-content {
  padding: 10px 0;
  min-height: 100px;
  transition: opacity 0.3s ease;
}

/* 暗色主题适配 */
.math-container-dark :deep(.katex) {
}

.math-container-dark :deep(.katex-display) {
}
</style>

<style scoped>
/* 颜色样式 */
.math-container {
  background-color: var(--common-bg);
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 1px solid var(--common-color-1);
}

.math-container-dark {
  background-color: var(--common-bg);
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 1px solid var(--common-color-1);
}

.loading-spinner {
  border: 3px solid rgba(255, 192, 203, 0.3);
  border-top: 3px solid var(--common-color-1);
}

.math-container-dark .loading-spinner {
  border: 3px solid rgba(58, 170, 231, 0.3);
  border-top: 3px solid var(--common-color-1);
}

/* 错误状态 */
.math-error {
  color: #cc0000;
}

/* 重试按钮 */
.retry-button {
  background-color: var(--common-color-1);
  color: var(--common-content);
}

.retry-button:hover {
  background-color: var(--common-hover);
}

/* 暗色主题适配 */
.math-container-dark :deep(.katex) {
  color: var(--common-text);
}

.math-container-dark :deep(.katex-display) {
  border-color: var(--common-color-1);
}
</style>

<style scoped>
/* 响应式设计 */
@media (max-width: var(--md)) {
  .math-container {
    padding: 15px;
  }
  
  .math-loading,
  .math-error {
    padding: 30px 15px;
  }
  
  .math-content {
    padding: 8px 0;
  }
}

@media (max-width: var(--sm)) {
  .math-container {
    padding: 12px;
    margin: 15px 0;
  }
  
  .math-loading,
  .math-error {
    padding: 20px 10px;
  }
  
  .loading-spinner {
    width: 20px;
    height: 20px;
  }
  
  .retry-button {
    padding: 5px 10px;
    font-size: 12px;
  }
}
</style>
