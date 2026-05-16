<template>
  <div class="code-container" :class="{ 'with-line-numbers': showLineNumbers }">
    <div class="code-header" v-if="language && codeStore.showLanguageBadge">
      <span class="language-badge" :data-lang="language.toLowerCase()">
        <span class="lang-dot"></span>
        <span class="lang-text">{{ language }}</span>
      </span>
      <div class="header-actions">
        <CodeRender v-if="showCopyButton" :code="code" />
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
import { useCodeStore } from '../../stores'

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
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.code-container::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 10px;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  z-index: -1;
}

.code-container:hover {
  transform: translateY(-3px) scale(1.01);
}

.code-container:hover::after {
  opacity: 1;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
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
}

.code-content {
  flex: 1;
  margin: 0;
  padding: 16px;
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
  box-shadow: 0 2px 4px var(--common-shadow);
  border: 3px solid var(--common-color-1);
}

.code-container::after {
  box-shadow: 0 0 20px var(--common-color-1), 0 0 40px var(--common-shadow);
}

.code-container:hover {
  box-shadow: 0 8px 24px var(--common-shadow);
  border-color: var(--common-hover);
}

/* 代码头部 */
.code-header {
  background-color: var(--common-bg);
  border-bottom: 1px solid var(--common-color-1);
}

/* 语言标签 */
.language-badge {
  background-color: var(--common-color-1);
  color: var(--common-content);
}

/* 不同语言颜色 */
.language-badge[data-lang="javascript"],
.language-badge[data-lang="js"] { background-color: #f0db4f; color: #1e1e2e; }
.language-badge[data-lang="typescript"],
.language-badge[data-lang="ts"] { background-color: #3178c6; color: #fff; }
.language-badge[data-lang="python"] { background-color: #3776ab; color: #fff; }
.language-badge[data-lang="html"] { background-color: #e34f26; color: #fff; }
.language-badge[data-lang="css"] { background-color: #563d7c; color: #fff; }
.language-badge[data-lang="bash"],
.language-badge[data-lang="shell"],
.language-badge[data-lang="sh"] { background-color: #4eaa25; color: #fff; }
.language-badge[data-lang="json"] { background-color: #b8b8b8; color: #1e1e2e; }
.language-badge[data-lang="sql"] { background-color: #00618b; color: #fff; }
.language-badge[data-lang="vue"] { background-color: #41b883; color: #1e1e2e; }
.language-badge[data-lang="php"] { background-color: #787cb5; color: #fff; }
.language-badge[data-lang="ruby"] { background-color: #cc342d; color: #fff; }
.language-badge[data-lang="go"] { background-color: #00add8; color: #fff; }
.language-badge[data-lang="rust"] { background-color: #dea584; color: #1e1e2e; }

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
  background: rgba(255, 192, 203, 0.2);
}

/* 行高亮 */
.line-highlight-row:hover {
  background: rgba(255, 192, 203, 0.15);
}

/* 代码内容区 */
.code-content-wrapper {
  background-color: rgba(255, 192, 203, 0.05);
}

/* 行号 */
.line-numbers {
  background-color: rgba(255, 192, 203, 0.1);
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
  background: rgba(255, 192, 203, 0.1);
}

.loading-spinner {
  border: 2px solid rgba(255, 192, 203, 0.3);
  border-top-color: var(--common-color-1);
}

.loading-text {
  color: var(--common-text);
}

/* 暗色主题适配 */
:deep(body.dark-theme) .line-highlight-row:hover {
  background: rgba(58, 170, 231, 0.15);
}

:deep(body.dark-theme) .code-content-wrapper {
  background-color: rgba(58, 170, 231, 0.1);
}

:deep(body.dark-theme) .line-numbers {
  background-color: rgba(58, 170, 231, 0.15);
  border-right-color: var(--common-color-1);
  color: var(--common-text);
}

:deep(body.dark-theme) .code-content {
  color: var(--common-text);
}

:deep(body.dark-theme) .loading-overlay {
  background: rgba(58, 170, 231, 0.1);
}

:deep(body.dark-theme) .loading-spinner {
  border-color: rgba(58, 170, 231, 0.3);
  border-top-color: var(--common-color-1);
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
