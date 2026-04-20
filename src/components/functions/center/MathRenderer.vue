<template>
  <div class="math-container">
    <div ref="mathRef" class="math-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  latex: {
    type: String,
    required: true
  },
  displayMode: {
    type: Boolean,
    default: false
  }
})

const mathRef = ref(null)
const lastRenderedContent = ref('')
let isLoaded = ref(false)

// 加载 KaTeX CDN
const loadKaTeX = () => {
  return new Promise((resolve, reject) => {
    if (window.katex) {
      isLoaded.value = true
      resolve()
      return
    }

    // 加载 CSS（包含字体）
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
    document.head.appendChild(cssLink)

    // 加载 JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'
    script.onload = () => {
      isLoaded.value = true
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 渲染数学公式
const renderMath = async () => {
  if (!mathRef.value) return
  
  if (!isLoaded.value) {
    try {
      await loadKaTeX()
    } catch (error) {
      return
    }
  }
  
  const contentKey = `${props.latex}-${props.displayMode}`
  
  // 避免重复渲染相同的代码
  if (lastRenderedContent.value === contentKey) return
  
  try {
    // 使用 renderToString 方法
    const html = window.katex.renderToString(props.latex, {
      throwOnError: false,
      displayMode: props.displayMode,
      fleqn: false,
      leqno: false,
      trust: true,
      macros: {
        '\\RR': '\\mathbb{R}',
        '\\ZZ': '\\mathbb{Z}',
        '\\QQ': '\\mathbb{Q}',
        '\\CC': '\\mathbb{C}',
        '\\NN': '\\mathbb{N}'
      }
    })
    mathRef.value.innerHTML = html
    lastRenderedContent.value = contentKey
  } catch (error) {
    mathRef.value.innerHTML = `<span style="color: #cc0000;">Error: ${error.message}</span>`
  }
}

// 防抖渲染
const debouncedRenderMath = debounce(renderMath, 300)

onMounted(() => {
  renderMath()
})

watch(() => [props.latex, props.displayMode], () => {
  nextTick(() => {
    debouncedRenderMath()
  })
})
</script>

<style scoped>
.math-container {
  width: 100%;
  margin: 16px 0;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.math-content {
  font-size: 1.2em;
  line-height: 1.5;
}

/* KaTeX 样式 */
:deep(.katex) {
  font-size: 1.2em;
}

:deep(.katex-display) {
  margin: 16px 0;
  overflow-x: auto;
}
</style>