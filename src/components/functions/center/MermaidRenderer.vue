<template>
  <div class="mermaid-container">
    <div ref="containerRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const containerRef = ref(null)
const lastRenderedCode = ref('')
const mermaidId = ref('mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000))
let isLoaded = ref(false)

// 加载 Mermaid CDN
const loadMermaid = () => {
  return new Promise((resolve, reject) => {
    if (window.mermaid) {
      isLoaded.value = true
      if (!window.mermaidInitialized) {
        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'default',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            nodeSpacing: 100,
            rankSpacing: 100
          }
        })
        window.mermaidInitialized = true
      }
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js'
    script.onload = () => {
      isLoaded.value = true
      window.mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          nodeSpacing: 100,
          rankSpacing: 100
        }
      })
      window.mermaidInitialized = true
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 渲染 Mermaid 图表
const renderMermaid = async () => {
  if (!containerRef.value) return
  
  if (!isLoaded.value) {
    try {
      await loadMermaid()
    } catch (error) {
      return
    }
  }
  
  // 避免重复渲染相同的代码
  if (lastRenderedCode.value === props.code) return
  
  try {
    // 清空容器
    containerRef.value.innerHTML = ''
    
    // 使用 render 方法渲染
    const { svg } = await window.mermaid.render(mermaidId.value, props.code)
    
    // 插入 SVG
    containerRef.value.innerHTML = svg
    
    lastRenderedCode.value = props.code
  } catch (error) {
    containerRef.value.innerHTML = `<span style="color: #cc0000;">Error: ${error.message}</span>`
  }
}

onMounted(() => {
  renderMermaid()
})

watch(() => props.code, () => {
  // 生成新的ID，确保每次代码变化时都重新渲染
  mermaidId.value = 'mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000)
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
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: auto;
  position: relative;
  clear: both;
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
</style>