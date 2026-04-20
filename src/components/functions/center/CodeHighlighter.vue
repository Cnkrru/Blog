<template>
  <div class="code-container">
    <div class="code-header" v-if="language">
      <span class="language">{{ language }}</span>
      <CodeCopier :code="code" />
    </div>
    <pre class="code-content">
      <code ref="codeRef" :class="`language-${language}`">{{ code }}</code>
    </pre>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import CodeCopier from './CodeCopier.vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'plaintext'
  }
})

const codeRef = ref(null)
let isLoaded = ref(false)

// 加载 Prism.js CDN
const loadPrism = () => {
  return new Promise((resolve, reject) => {
    if (window.Prism) {
      isLoaded.value = true
      resolve()
      return
    }

    // 加载 CSS
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css'
    document.head.appendChild(cssLink)

    // 加载 JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js'
    script.onload = () => {
      // 加载常用语言
      const languages = ['javascript', 'typescript', 'css', 'html', 'json', 'python', 'bash', 'vue']
      let loadedCount = 0
      
      languages.forEach(lang => {
        const langScript = document.createElement('script')
        langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`
        langScript.onload = () => {
          loadedCount++
          if (loadedCount === languages.length) {
            isLoaded.value = true
            resolve()
          }
        }
        document.head.appendChild(langScript)
      })
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 高亮代码
const highlightCode = async () => {
  if (!codeRef.value) return
  
  if (!isLoaded.value) {
    try {
      await loadPrism()
    } catch (error) {
      return
    }
  }
  
  // 使用 Prism.highlightElement
  window.Prism.highlightElement(codeRef.value)
}

onMounted(() => {
  highlightCode()
})

watch(() => [props.code, props.language], () => {
  nextTick(() => {
    highlightCode()
  })
})
</script>

<style scoped>
.code-container {
  width: 100%;
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 3px solid var(--center-card-border-color);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.language {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.code-content {
  margin: 0;
  padding: 16px;
  background-color: #f8f8f8;
  color: #333333;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 代码高亮样式 */
:deep(.hljs) {
  background: transparent;
  padding: 0;
  margin: 0;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>