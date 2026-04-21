<template>
  <div class="code-container" :class="{ 'with-line-numbers': showLineNumbers }">
    <div class="code-header" v-if="language && codeStore.showLanguageBadge">
      <span class="language">{{ language }}</span>
      <div class="header-actions">
        <CodeCopier v-if="showCopyButton" :code="code" />
        <span class="line-count" v-if="showLineNumbers">{{ code.split('\n').length }} lines</span>
      </div>
    </div>
    <div class="code-content-wrapper" :class="{ 'loading': !isLoaded }">
      <div v-if="showLineNumbers" class="line-numbers">
        <span v-for="line in generateLineNumbers()" :key="line" class="line-number">{{ line }}</span>
      </div>
      <pre class="code-content">
        <code ref="codeRef" :class="`language-${language}`">{{ code }}</code>
      </pre>
      <div v-if="!isLoaded" class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Loading syntax highlighting...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import CodeCopier from './CodeCopier.vue'
import { useCodeStore } from '../../stores'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'plaintext'
  },
  showLineNumbers: {
    type: Boolean,
    default: true
  },
  showCopyButton: {
    type: Boolean,
    default: true
  }
})

const codeRef = ref(null)
const codeStore = useCodeStore()
const isLoaded = computed(() => codeStore.isPrismLoaded)
const showLineNumbers = computed(() => props.showLineNumbers && codeStore.lineNumbersEnabled)
const showCopyButton = computed(() => props.showCopyButton && codeStore.copyEnabled)

// 加载 Prism.js CDN
const loadPrism = () => {
  return new Promise((resolve, reject) => {
    if (window.Prism) {
      codeStore.setPrismLoaded(true)
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
      
      const checkComplete = () => {
        if (loadedCount >= languages.length) {
          codeStore.setPrismLoaded(true)
          resolve()
        }
      }
      
      languages.forEach(lang => {
        const langScript = document.createElement('script')
        langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`
        langScript.onload = () => {
          codeStore.addLoadedLanguage(lang)
          loadedCount++
          checkComplete()
        }
        langScript.onerror = () => {
          // 单个语言加载失败不影响其他语言
          loadedCount++
          checkComplete()
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
      console.error('加载 Prism.js 失败:', error)
      return
    }
  }
  
  // 计算代码统计信息
  const lines = props.code.split('\n').length
  const chars = props.code.length
  codeStore.updateCodeStats(lines, chars)
  codeStore.incrementHighlightCount()
  
  // 使用 Prism.highlightElement
  try {
    window.Prism.highlightElement(codeRef.value)
  } catch (error) {
    console.error('代码高亮失败:', error)
  }
}

// 生成行号
const generateLineNumbers = () => {
  const lines = props.code.split('\n').length
  return Array.from({ length: lines }, (_, i) => i + 1)
}

onMounted(() => {
  codeStore.init()
  highlightCode()
})

watch(() => [props.code, props.language], () => {
  nextTick(() => {
    highlightCode()
  })
})

watch(() => codeStore.lineNumbersEnabled, () => {
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.code-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, var(--accent-color), var(--accent-color-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.line-count {
  font-size: 10px;
  color: var(--text-color-muted);
  font-weight: 500;
  background: var(--card-bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
}

.code-content-wrapper {
  position: relative;
  display: flex;
  background-color: #f8f8f8;
  transition: all 0.3s ease;
}

.code-content-wrapper.loading {
  min-height: 100px;
}

.code-container.with-line-numbers .code-content {
  padding-left: 8px;
}

.line-numbers {
  background-color: #f0f0f0;
  border-right: 1px solid #e0e0e0;
  padding: 16px 8px;
  text-align: right;
  user-select: none;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #999999;
  transition: all 0.3s ease;
  position: sticky;
  left: 0;
  z-index: 10;
}

.line-number {
  display: block;
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.line-number:hover {
  opacity: 1;
  color: var(--accent-color);
}

.code-content {
  flex: 1;
  margin: 0;
  padding: 16px;
  color: #333333;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 248, 248, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: fadeIn 0.3s ease;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 12px;
  color: var(--text-color-muted);
  font-weight: 500;
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

/* 暗色主题适配 */
:deep(html.dark) .code-content-wrapper {
  background-color: #1e1e1e;
}

:deep(html.dark) .line-numbers {
  background-color: #252526;
  border-right-color: #3e3e42;
  color: #858585;
}

:deep(html.dark) .code-content {
  color: #d4d4d4;
}

:deep(html.dark) .loading-overlay {
  background: rgba(30, 30, 30, 0.9);
}

:deep(html.dark) .loading-spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-color);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-container {
    margin: 12px 0;
  }
  
  .code-header {
    padding: 6px 12px;
  }
  
  .language {
    font-size: 10px;
  }
  
  .code-content {
    padding: 12px;
    font-size: 12px;
  }
  
  .line-numbers {
    padding: 12px 6px;
    font-size: 12px;
  }
  
  .line-number {
    font-size: 10px;
  }
  
  .line-count {
    font-size: 8px;
    padding: 1px 4px;
  }
}
</style>