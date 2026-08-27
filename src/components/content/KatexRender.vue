<template>
  <div class="math-container" :class="{ 'math-dark': isDarkTheme }">
    <div v-if="loading" class="math-loading">
      <div class="loading-spinner"></div>
      <span>加载数学公式中...</span>
    </div>
    <div v-else-if="error" class="math-error">
      <span>{{ error }}</span>
      <button @click="retryRender" class="retry-button" aria-label="重试">重试</button>
    </div>
    <div ref="mathRef" class="math-content" v-show="!loading && !error"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useMathStore, useThemeStore } from '../../stores'
import 'katex/dist/katex.min.css'

const props = defineProps(['latex'])

const emit = defineEmits(['render-success', 'render-error'])

const mathRef = ref(null)
const lastRenderedLatex = ref('')

const mathStore = useMathStore()
const themeStore = useThemeStore()

const isDarkTheme = computed(() => themeStore.isDark)
const loading = computed(() => mathStore.loading)
const error = computed(() => mathStore.error)

// KaTeX（本地依赖，动态 import 避免进入 SSR 关键路径；CSS 已在上方静态引入）
let katexLib = null
const loadKaTeX = async () => {
  if (!katexLib) {
    katexLib = (await import('katex')).default
    mathStore.setKaTeXLoaded(true)
  }
  return katexLib
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
    
    // 使用本地 KaTeX 渲染公式
    katexLib.render(props.latex, mathRef.value, {
      throwOnError: false,
      displayMode: true,
      fleqn: false,
      errorColor: 'var(--color-error)',
      strict: 'ignore',
      trust: true
    })
    
    lastRenderedLatex.value = props.latex
    mathStore.incrementRenderedCount()
    emit('render-success', props.latex)
  } catch (error) {
    console.error('渲染数学公式失败:', error)
    mathStore.setError('公式渲染错误: ' + error.message)
    mathRef.value.innerHTML = `<span style="color: var(--color-error);">公式渲染错误: ${error.message}</span>`
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
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

.math-dark {
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
  margin-bottom: 12px;
}

.math-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 150px;
}

.math-content {
  padding: 10px 0;
  min-height: 100px;
  transition: opacity 0.3s ease;
}
</style>

<style scoped>
/* 颜色样式 */
.math-container {
  background-color: var(--common-bg);
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 1px solid var(--common-color-1);
}

.math-dark {
  background-color: var(--common-bg);
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 1px solid var(--common-color-1);
  --katex-color: var(--common-text);
  --katex-display-border-color: var(--common-color-1);
}

.loading-spinner {
  border: 3px solid color-mix(in srgb, var(--common-color-1) 30%, transparent);
  border-top: 3px solid var(--common-color-1);
}

/* 错误状态 */
.math-error {
  color: var(--color-error);
}
</style>

<style>
/* katex 库渲染的 DOM，需非 scoped 命中 */
.katex {
  color: var(--katex-color, inherit);
}

.katex-display {
  border-color: var(--katex-display-border-color, inherit);
}
</style>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
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

@media (max-width: 640px) {
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
  
  }
</style>
