<template>
  <div class="code-container" :class="{ 'with-line-numbers': showLineNumbers }">
    <div class="code-header" v-if="language && codeStore.showLanguageBadge">
      <span class="language-badge" :data-lang="language.toLowerCase()">
        <span class="lang-dot"></span>
        <span class="lang-text">{{ language }}</span>
      </span>
      <div class="header-actions">
        <CodeRender v-if="showCopyButton" :code="code" />
        <CodePreview v-if="language && (language.toLowerCase() === 'html' || language.toLowerCase() === 'htmlembedded')" :code="code" />
        <span class="line-count" v-if="showLineNumbers">{{ code.split('\n').length }} lines</span>
      </div>
    </div>
    <div class="code-content-wrapper" :class="{ 'loading': !isLoaded }">
      <div v-if="showLineNumbers" class="line-numbers">
        <span v-for="line in generateLineNumbers()" :key="line" class="line-number">{{ line }}</span>
      </div>
      <pre class="code-content"><code ref="codeRef" :class="`language-${normalizedLanguage}`">{{ code }}</code></pre>
      <!-- 行号高亮的 overlay 层 -->
      <div v-if="showLineNumbers" class="line-highlight-overlay" ref="lineOverlayRef">
        <div
          v-for="(_, i) in generateLineNumbers()"
          :key="i"
          class="line-highlight-row"
          @mouseenter="highlightLine(i + 1)"
          @mouseleave="highlightLine(0)"
        ></div>
      </div>
      <div v-if="!isLoaded" class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Loading syntax highlighting...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import CodeRender from './CodeRender.vue'
import CodePreview from './CodePreview.vue'
import { useCodeStore } from '../../stores'
import { CDN_VERSIONS } from '../../utils/constants'

const props = withDefaults(defineProps<{
  code: string
  language?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
}>(), {
  language: 'plaintext',
  showLineNumbers: true,
  showCopyButton: true
})

const codeRef = ref(null)
const lineOverlayRef = ref(null)
const highlightedLine = ref(0)
const codeStore = useCodeStore()

function highlightLine(n: number) {
  highlightedLine.value = n
}
const isLoaded = computed(() => codeStore.isPrismLoaded)
const showLineNumbers = computed(() => props.showLineNumbers && codeStore.lineNumbersEnabled)
const showCopyButton = computed(() => props.showCopyButton && codeStore.copyEnabled)

// 语言名标准化：Prism.js 只认小写，且有自己的命名规则
const langAlias: Record<string, string> = {
  cpp: 'cpp', Cpp: 'cpp', CPP: 'cpp', 'c++': 'cpp', 'C++': 'cpp',
  c: 'c', C: 'c',
  js: 'javascript', JS: 'javascript',
  ts: 'typescript', TS: 'typescript',
  py: 'python', PY: 'python',
  sh: 'bash', SH: 'bash',
  vue: 'vue', Vue: 'vue',
}
const normalizedLanguage = computed(() => langAlias[props.language] || props.language.toLowerCase())

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
    cssLink.href = `https://cdn.jsdelivr.net/npm/prismjs@${CDN_VERSIONS.prismjs}/themes/prism.min.css`
    document.head.appendChild(cssLink)

    // 加载 JS
    const script = document.createElement('script')
    script.src = `https://cdn.jsdelivr.net/npm/prismjs@${CDN_VERSIONS.prismjs}/prism.min.js`
    script.onload = () => {
      // 加载常用语言
      const languages = ['javascript', 'typescript', 'css', 'html', 'json', 'python', 'bash', 'vue', 'c', 'cpp']
      let loadedCount = 0

      const checkComplete = () => {
        if (loadedCount >= languages.length) {
          codeStore.setPrismLoaded(true)
          resolve()
        }
      }

      languages.forEach(lang => {
        const langScript = document.createElement('script')
        langScript.src = `https://cdn.jsdelivr.net/npm/prismjs@${CDN_VERSIONS.prismjs}/components/prism-${lang}.min.js`
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
  margin: 12px 0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.code-container:hover {
  border-color: rgba(0, 0, 0, 0.12);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 12px;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

.lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.lang-text {
  font-size: 12px;
  font-weight: 600;
  text-transform: lowercase;
  letter-spacing: 0.3px;
}

.line-count {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.code-content-wrapper {
  position: relative;
  display: flex;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

/* 行高亮 overlay */
.line-highlight-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  padding: 16px 0;
}

.line-highlight-row {
  height: 1.5em;
  pointer-events: auto;
  cursor: default;
}

.line-highlight-row:nth-child(1 of .line-highlight-row) {
  margin-top: 0;
}

.code-content-wrapper.loading {
  min-height: 100px;
}

.code-container.with-line-numbers .code-content {
  padding-left: 8px;
}

.line-numbers {
  padding: 16px 8px;
  text-align: right;
  user-select: none;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
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
}

.code-content {
  flex: 1;
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 12px;
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
</style>

<style scoped>
/* 颜色样式 */
.code-container {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  box-shadow: 0 1px 3px var(--common-shadow);
}

/* 代码头部 */
.code-header {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
  border-bottom: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

/* 语言标签 */
.language-badge {
  background: var(--common-color-1);
  color: var(--common-content);
  border-radius: 6px;
  padding: 2px 8px;
}

/* 不同语言颜色 */
.language-badge[data-lang="javascript"],
.language-badge[data-lang="js"] {
  background-color: #f0db4f;
   color: #1e1e2e;
   
}
.language-badge[data-lang="typescript"],
.language-badge[data-lang="ts"] {
  background-color: #3178c6;
   color: #fff;
   
}
.language-badge[data-lang="python"] {
  background-color: #3776ab;
   color: #fff;
   
}
.language-badge[data-lang="html"] {
  background-color: #e34f26;
   color: #fff;
   
}
.language-badge[data-lang="css"] {
  background-color: #563d7c;
   color: #fff;
   
}
.language-badge[data-lang="bash"],
.language-badge[data-lang="shell"],
.language-badge[data-lang="sh"] {
  background-color: #4eaa25;
   color: #fff;
   
}
.language-badge[data-lang="json"] {
  background-color: #b8b8b8;
   color: #1e1e2e;
   
}
.language-badge[data-lang="sql"] {
  background-color: #00618b;
   color: #fff;
   
}
.language-badge[data-lang="vue"] {
  background-color: #41b883;
   color: #1e1e2e;
   
}
.language-badge[data-lang="php"] {
  background-color: #787cb5;
   color: #fff;
   
}
.language-badge[data-lang="ruby"] {
  background-color: #cc342d;
   color: #fff;
   
}
.language-badge[data-lang="go"] {
  background-color: #00add8;
   color: #fff;
   
}
.language-badge[data-lang="rust"] {
  background-color: #dea584;
   color: #1e1e2e;
   
}

.lang-dot {
  background-color: currentColor;
  opacity: 0.6;
}

.lang-text {
  color: inherit;
}

/* 行数统计 */
.line-count {
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
}

/* 行高亮 */
.line-highlight-row:hover {
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
}

/* 代码内容区 */
.code-content-wrapper {
  background-color: color-mix(in srgb, var(--common-color-1) 5%, transparent);
}

/* 行号 */
.line-numbers {
  background-color: color-mix(in srgb, var(--common-color-1) 10%, transparent);
  border-right: 1px solid var(--common-color-1);
  color: var(--common-text);
  opacity: 0.7;
}

.line-number:hover {
  color: var(--common-color-1);
  opacity: 1;
}

/* 代码内容 */
.code-content {
  color: var(--common-text);
}

/* 加载遮罩 */
.loading-overlay {
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
}

.loading-spinner {
  border: 2px solid color-mix(in srgb, var(--common-color-1) 30%, transparent);
  border-top-color: var(--common-color-1);
}

.loading-text {
  color: var(--common-text);
}

</style>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .code-container {
    margin: 12px 0;
  }

  .code-header {
    padding: 6px 12px;
  }

  .language-badge {
    padding: 2px 8px;
  }

  .lang-text {
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
