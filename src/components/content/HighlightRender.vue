<template>
  <div class="code-container" :class="{ 'show-lines': showLineNumbers }">
    <div class="code-header" v-if="language && codeStore.showLanguageBadge">
      <span class="language-badge" :class="`lang-${normalizedLanguage}`" :data-lang="language.toLowerCase()">
        <span class="lang-dot"></span>
        <span class="lang-text">{{ language }}</span>
      </span>
      <div class="header-actions">
        <CodeRender v-if="showCopyButton" :code="code" />
        <CodePreview v-if="language && (language.toLowerCase() === 'html' || language.toLowerCase() === 'htmlembedded')" :code="code" />
        <VueReplPreview v-if="language && language.toLowerCase() === 'vue'" :code="code" />
        <span class="line-count" v-if="showLineNumbers">{{ displayCode.split('\n').length }} lines</span>
      </div>
    </div>
    <div class="code-wrapper" :class="{ 'loading': !isLoaded, 'collapsed': collapsed && isCollapsible }">
      <div v-if="showLineNumbers" class="line-numbers">
        <span v-for="line in generateLineNumbers()" :key="line" class="line-number">{{ line }}</span>
      </div>
      <pre class="code-content"><code ref="codeRef" :class="`language-${normalizedLanguage}`">{{ displayCode }}</code></pre>
      <!-- 行号高亮的 overlay 层 -->
      <div v-if="showLineNumbers" class="line-overlay" ref="lineOverlayRef">
        <div
          v-for="(_, i) in generateLineNumbers()"
          :key="i"
          class="line-row"
          @mouseenter="highlightLine(i + 1)"
          @mouseleave="highlightLine(0)"
        ></div>
      </div>
      <div v-if="!isLoaded" class="loading-overlay">
        <div class="loading-spinner"></div>
        <span class="loading-text">Loading syntax highlighting...</span>
      </div>
      <!-- 折叠按钮 -->
      <div v-if="isCollapsible && collapsed" class="fold-overlay" @click="toggleCollapse">
        <div class="fold-gradient"></div>
        <VButton class="v-btn-pill v-btn-ghost fold-btn"><VIcon :src="'chevron-down.svg'" :size="16" />展开全部 ({{ lineCount }} 行)</VButton>
      </div>
      <VButton v-else-if="isCollapsible && !collapsed" class="v-btn-ghost fold-toggle" style="border-radius:6px" @click="toggleCollapse">
        <VIcon :src="'chevron-down.svg'" :size="14" class="fold-icon" />
        收起
      </VButton>
    </div>
  </div>
</template>

<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import CodeRender from './CodeRender.vue'
import CodePreview from './CodePreview.vue'
import VueReplPreview from './VueReplPreview.vue'
import { useCodeStore } from '../../stores'

const props = defineProps({
  code: null,
  language: { type: String, default: 'plaintext' },
  showLineNumbers: { type: Boolean, default: true },
  showCopyButton: { type: Boolean, default: true }
})

const codeRef = ref(null)
const lineOverlayRef = ref(null)
const highlightedLine = ref(0)
const codeStore = useCodeStore()
const collapsed = ref(true)

const FOLD_LINE_THRESHOLD = 15
const displayCode = computed(() => props.code.replace(/\n$/, ''))
const lineCount = computed(() => displayCode.value.split('\n').length)
const isCollapsible = computed(() => lineCount.value > FOLD_LINE_THRESHOLD)

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

function highlightLine(n) {
  highlightedLine.value = n
}
const isLoaded = computed(() => codeStore.isPrismLoaded)
const showLineNumbers = computed(() => props.showLineNumbers && codeStore.lineNumbersEnabled)
const showCopyButton = computed(() => props.showCopyButton && codeStore.copyEnabled)

// 语言名标准化：Prism.js 只认小写，且有自己的命名规则
const langAlias = {
  cpp: 'cpp', Cpp: 'cpp', CPP: 'cpp', 'c++': 'cpp', 'C++': 'cpp',
  c: 'c', C: 'c',
  js: 'javascript', JS: 'javascript',
  ts: 'typescript', TS: 'typescript',
  py: 'python', PY: 'python',
  sh: 'bash', SH: 'bash',
  vue: 'vue', Vue: 'vue',
  yaml: 'yaml', YAML: 'yaml', yml: 'yaml', YML: 'yaml',
  toml: 'toml', TOML: 'toml',
}
const normalizedLanguage = computed(() => langAlias[props.language] || props.language.toLowerCase())

// 加载 Prism.js（委托 codeStore 统一管理，避免重复加载）
const loadPrism = () => {
  return codeStore.ensurePrismLoaded()
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
	  const lines = displayCode.value.split('\n').length
	  const chars = props.code.length
  codeStore.updateCodeStats(lines, chars)
  codeStore.incrementHighlightCount()

  // 确保语言组件已加载（非核心语言如 python/sql 需按需动态加载）
  await codeStore.ensureLanguageLoaded(normalizedLanguage.value)

  // 使用 Prism.highlightElement
  try {
    window.Prism.highlightElement(codeRef.value)
  } catch (error) {
    console.error('代码高亮失败:', error)
  }
}

// 生成行号
const generateLineNumbers = () => {
  const lines = displayCode.value.split('\n').length
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

.code-wrapper {
  position: relative;
  display: flex;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, opacity 0.2s ease;
}

/* 代码折叠 */
.code-wrapper.collapsed {
  max-height: 200px;
  overflow: hidden;
}

.fold-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  cursor: pointer;
  z-index: 5;
}

.fold-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
}

.fold-btn {
  position: relative;
  gap: 6px;
  z-index: 1;
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
  --v-btn-pad: 6px 16px;
  --v-btn-bg: var(--common-color-1);
  --v-btn-hover-bg: color-mix(in srgb, var(--common-color-1) 88%, transparent);
  --v-btn-color: var(--common-content);
}

.fold-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--common-color-1) 40%, transparent);
}

.fold-toggle {
  position: absolute;
  bottom: 8px;
  right: 12px;
  gap: 4px;
  z-index: 5;
  opacity: 0.6;
  font-size: 11px;
  font-weight: 500;
  transition: background-color 0.2s, opacity 0.2s;
  --v-btn-pad: 3px 10px;
  --v-btn-bg: var(--common-color-1);
  --v-btn-hover-bg: color-mix(in srgb, var(--common-color-1) 88%, transparent);
  --v-btn-color: var(--common-content);
}

.fold-toggle:hover {
  opacity: 1;
}

.fold-icon {
  display: flex;
  align-items: center;
  transform: rotate(180deg);
}

/* 行高亮 overlay */
.line-overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  padding: 16px 0;
}

.line-row {
  height: 1.5em;
  pointer-events: auto;
  cursor: default;
}

.line-row:nth-child(1 of .line-row) {
  margin-top: 0;
}

.code-wrapper.loading {
  min-height: 100px;
}

.code-container.show-lines {
  --code-content-padding-left: 8px;
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
  font-size: 14px;
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
  padding-left: var(--code-content-padding-left, 16px);
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
}

.loading-text {
  font-size: 12px;
  font-weight: 500;
}

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
.lang-javascript {
  background-color: #f0db4f;
  color: #1e1e2e;
}
.lang-typescript {
  background-color: #3178c6;
  color: #fff;
}
.lang-python {
  background-color: #3776ab;
  color: #fff;
}
.lang-html {
  background-color: #e34f26;
  color: #fff;
}
.lang-css {
  background-color: #563d7c;
  color: #fff;
}
.lang-bash {
  background-color: #4eaa25;
  color: #fff;
}
.lang-json {
  background-color: #b8b8b8;
  color: #1e1e2e;
}
.lang-sql {
  background-color: #00618b;
  color: #fff;
}
.lang-vue {
  background-color: #41b883;
  color: #1e1e2e;
}
.lang-php {
  background-color: #787cb5;
  color: #fff;
}
.lang-ruby {
  background-color: #cc342d;
  color: #fff;
}
.lang-go {
  background-color: #00add8;
  color: #fff;
}
.lang-rust {
  background-color: #dea584;
  color: #1e1e2e;
}
.lang-yaml {
  background-color: #6b5b95;
  color: #fff;
}
.lang-toml {
  background-color: #4479a1;
  color: #fff;
}
.lang-cmake {
  background-color: #064f8c;
  color: #fff;
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
.line-row:hover {
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
}

/* 代码内容区 */
.code-wrapper {
  background-color: color-mix(in srgb, var(--common-color-1) 5%, transparent);
}

/* 折叠渐变 */
.fold-gradient {
  background: linear-gradient(transparent, color-mix(in srgb, var(--common-color-1) 8%, transparent) 40%, color-mix(in srgb, var(--common-color-1) 12%, transparent) 100%);
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

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
    font-size: 12px;
  }

  .line-count {
    font-size: 8px;
    padding: 1px 4px;
  }
}
</style>

<style>
/* hljs 代码高亮库渲染的 DOM，需非 scoped 命中 */
.hljs {
  background: transparent;
  padding: 0;
  margin: 0;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
