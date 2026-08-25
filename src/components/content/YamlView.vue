<template>
  <div class="yaml-view-container" :class="{ 'has-error': parseError }">
    <!-- 头部栏 -->
    <div class="yv-header">
      <span class="yv-badge">
        <span class="yv-dot"></span>
        <span class="yv-lang">yaml</span>
      </span>
      <div class="yv-header-actions">
        <CodeRender :code="code" />
        <button
          class="yv-toggle-btn"
          :class="{ active: viewMode === 'preview' }"
          @click="viewMode = 'preview'"
          title="查看结构化视图"
        >
          <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="usersSvg"></span>
          结构化
        </button>
        <button
          class="yv-toggle-btn"
          :class="{ active: viewMode === 'source' }"
          @click="viewMode = 'source'"
          title="查看源码"
        >
          <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="codeSvg"></span>
          源码
        </button>
        <span class="yv-stats">{{ statsText }}</span>
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-if="viewMode === 'preview'" class="yv-preview">
      <div v-if="!yamlReady" class="yv-loading">
        <span class="svg-icon yv-spin" :style="{ width: '16px', height: '16px' }" v-html="loadingSvg"></span>
        <span>加载解析器…</span>
      </div>
      <div v-else-if="parseError" class="yv-error">
        <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="alertTriangleSvg"></span>
        <span>{{ parseError }}</span>
      </div>
      <div v-else class="yv-tree-wrapper">
        <JsonTree :data="parsedData" />
      </div>
    </div>

    <!-- 源码模式 -->
    <pre v-else class="yv-source"><code ref="codeRef" class="language-yaml">{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { ref, computed, watch, provide, nextTick, onMounted } from 'vue'
import usersSvg from '@/assets/svg/users.svg?raw'
import codeSvg from '@/assets/svg/code.svg?raw'
import alertTriangleSvg from '@/assets/svg/alert-triangle.svg?raw'
import loadingSvg from '@/assets/svg/loading.svg?raw'
import JsonTree from './JsonTree.vue'
import CodeRender from './CodeRender.vue'
import { useCodeStore } from '../../stores'

const props = defineProps(['code'])

const codeStore = useCodeStore()
const viewMode = ref('preview')
const parseError = ref(null)
const parsedData = ref(null)
const codeRef = ref(null)
const yamlReady = ref(false)

// 为 JsonTree 提供默认展开状态
const expandState = ref({ expanded: true, version: 0 })
provide('expandState', expandState)
provide('highlightPath', '')

/* ========== 本地加载 js-yaml ========== */
let yamlLib = null
async function loadJsYaml() {
  if (!yamlLib) {
    yamlLib = (await import('js-yaml')).default
    yamlReady.value = true
  }
  return yamlLib
}

/* ========== 解析 ========== */
async function parseData() {
  parseError.value = null
  parsedData.value = null

  const trimmed = props.code.trim()
  if (!trimmed) {
    parseError.value = '输入为空'
    viewMode.value = 'source'
    return
  }

  if (!yamlReady.value) {
    try {
      await loadJsYaml()
    } catch {
      return
    }
  }

  try {
    const result = yamlLib.load(trimmed)
    if (result === undefined || result === null) {
      parsedData.value = {}
    } else if (typeof result === 'object') {
      parsedData.value = result
    } else {
      parsedData.value = { value: result }
    }
    viewMode.value = 'preview'
  } catch (err) {
    parseError.value = `解析失败: ${err.message || '语法错误'}`
    viewMode.value = 'source'
  }
}

/* ========== 统计 ========== */
const statsText = computed(() => {
  if (parseError.value) return '解析失败'
  if (!yamlReady.value) return '加载中…'
  const lines = props.code.split('\n').length
  const nodes = countNodes(parsedData.value)
  return `${lines} 行 · ${nodes} 节点`
})

function countNodes(data) {
  if (data === null || data === undefined || typeof data !== 'object') return 1
  let count = 1
  if (Array.isArray(data)) {
    for (const item of data) count += countNodes(item)
  } else {
    for (const key of Object.keys(data)) count += countNodes(data[key])
  }
  return count
}

/* ========== Prism 高亮 ========== */
async function highlightSource() {
  if (viewMode.value !== 'source') return
  if (!codeRef.value) return
  try {
    await codeStore.ensurePrismLoaded()
  } catch { return }
  await codeStore.ensureLanguageLoaded('yaml')
  if (window.Prism) {
    nextTick(() => {
      try { window.Prism.highlightElement(codeRef.value) } catch { }
    })
  }
}

/* ========== 生命周期 ========== */
parseData()

onMounted(() => {
  if (viewMode.value === 'source') highlightSource()
})

watch(() => props.code, parseData)

watch(viewMode, () => {
  if (viewMode.value === 'source') highlightSource()
}, { flush: 'post' })
</script>

<style scoped>
.yaml-view-container {
  margin: 12px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  box-shadow: 0 1px 3px var(--common-shadow);
}
.yaml-view-container.has-error {
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
}
.yv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
  border-bottom: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}
.yv-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.yv-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 6px;
  background: #6b5b95;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-transform: lowercase;
}
.yv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
  flex-shrink: 0;
}
.yv-lang { font-size: 12px; font-weight: 600; }
.yv-toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  color: var(--common-text);
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.yv-toggle-btn:hover {
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  border-color: var(--common-color-1);
}
.yv-toggle-btn.active {
  background: var(--common-color-1);
  border-color: var(--common-color-1);
  color: var(--common-content);
}
.yv-stats {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
}
.yv-preview { max-height: 600px; overflow: auto; }
.yv-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 12px;
  color: #ef4444;
  background: color-mix(in srgb, #ef4444 8%, transparent);
}
.yv-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px;
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.5;
}
.yv-spin {
  animation: yv-spin 1s linear infinite;
}
@keyframes yv-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.yv-tree-wrapper { padding: 8px 12px; }
.yv-source {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 5%, transparent);
}
.yv-source code {
  font-family: inherit;
  font-size: inherit;
  background: none;
  padding: 0;
  color: inherit;
}
@media (max-width: 768px) {
  .yv-header { padding: 6px 12px; }
  .yv-badge { padding: 2px 6px; font-size: 10px; }
  .yv-toggle-btn { padding: 2px 8px; font-size: 11px; }
  .yv-source { padding: 12px; font-size: 12px; }
  .yv-stats { font-size: 8px; padding: 1px 4px; }
  .yv-tree-wrapper { padding: 6px 8px; }
}
</style>