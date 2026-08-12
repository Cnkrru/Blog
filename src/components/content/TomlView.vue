<template>
  <div class="toml-view-container" :class="{ 'has-error': parseError }">
    <!-- 头部栏 -->
    <div class="tv-header">
      <span class="tv-badge">
        <span class="tv-dot"></span>
        <span class="tv-lang">toml</span>
      </span>
      <div class="tv-header-actions">
        <CodeRender :code="code" />
        <button
          class="tv-toggle-btn"
          :class="{ active: viewMode === 'preview' }"
          @click="viewMode = 'preview'"
          title="查看结构化视图"
        >
          <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="usersSvg"></span>
          结构化
        </button>
        <button
          class="tv-toggle-btn"
          :class="{ active: viewMode === 'source' }"
          @click="viewMode = 'source'"
          title="查看源码"
        >
          <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="codeSvg"></span>
          源码
        </button>
        <span class="tv-stats">{{ statsText }}</span>
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-if="viewMode === 'preview'" class="tv-preview">
      <div v-if="parseError" class="tv-error">
        <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="alertTriangleSvg"></span>
        <span>{{ parseError }}</span>
      </div>
      <div v-else class="tv-tree-wrapper">
        <JsonTree :data="parsedData" />
      </div>
    </div>

    <!-- 源码模式 -->
    <pre v-else class="tv-source"><code ref="codeRef" class="language-toml">{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide, nextTick, onMounted } from 'vue'
import usersSvg from '@/assets/svg/users.svg?raw'
import codeSvg from '@/assets/svg/code.svg?raw'
import alertTriangleSvg from '@/assets/svg/alert-triangle.svg?raw'
import JsonTree from './JsonTree.vue'
import CodeRender from './CodeRender.vue'
import { useCodeStore } from '../../stores'

const props = defineProps<{
  code: string
}>()

const codeStore = useCodeStore()
const viewMode = ref<'preview' | 'source'>('preview')
const parseError = ref<string | null>(null)
const parsedData = ref<any>(null)
const codeRef = ref<HTMLElement | null>(null)

// 为 JsonTree 提供默认展开状态
const expandState = ref({ expanded: true, version: 0 })
provide('expandState', expandState)
provide('highlightPath', '')

/* ========== 手写 TOML 解析器 ========== */
function parseToml(input: string): Record<string, any> {
  const result: Record<string, any> = {}
  let currentTable = result
  const lines = input.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // 空行 / 注释
    if (!line || line.startsWith('#')) continue

    // [table] 或 [table.subtable]
    if (line.startsWith('[') && !line.startsWith('[[')) {
      const m = line.match(/^\[([^\]]+)\]$/)
      if (!m) continue
      currentTable = navigateTo(result, m[1].split('.'), true)
      continue
    }

    // [[array-of-tables]]
    if (line.startsWith('[[')) {
      const m = line.match(/^\[\[([^\]]+)\]\]$/)
      if (!m) continue
      const keys = m[1].split('.')
      const parentKeys = keys.slice(0, -1)
      const lastKey = keys[keys.length - 1]
      const parent = parentKeys.length ? navigateTo(result, parentKeys, true) : result
      if (!Array.isArray(parent[lastKey])) parent[lastKey] = []
      const arr = parent[lastKey] as any[]
      arr.push({})
      currentTable = arr[arr.length - 1]
      continue
    }

    // key = value
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.substring(0, eqIdx).trim()
    const valStr = line.substring(eqIdx + 1).trim()
    currentTable[key] = parseTomlValue(valStr)
  }

  return result
}

function navigateTo(root: any, keys: string[], create: boolean): any {
  let curr = root
  for (const k of keys) {
    if (!(k in curr)) {
      if (!create) return undefined
      curr[k] = {}
    }
    curr = curr[k]
  }
  return curr
}

function parseTomlValue(raw: string): any {
  const v = raw.trim()

  // 数组
  if (v.startsWith('[') && v.endsWith(']')) {
    return parseTomlArray(v)
  }

  // 字符串
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    const inner = v.slice(1, -1)
    if (v.startsWith('"')) {
      return inner.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\')
    }
    return inner
  }

  // 布尔
  if (v === 'true') return true
  if (v === 'false') return false

  // 数字
  const num = Number(v)
  if (!isNaN(num) && v !== '') return num

  // 日期时间 —— 原样返回字符串
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v

  return v
}

function parseTomlArray(raw: string): any[] {
  const inner = raw.slice(1, -1).trim()
  if (!inner) return []
  const result: any[] = []
  let buf = ''
  let depth = 0
  let inStr = false
  let quote = ''

  for (const ch of inner) {
    if (inStr) {
      buf += ch
      if (ch === quote) inStr = false
    } else if (ch === '"' || ch === "'") {
      buf += ch
      inStr = true
      quote = ch
    } else if (ch === '[' || ch === '{') {
      buf += ch
      depth++
    } else if (ch === ']' || ch === '}') {
      buf += ch
      depth--
    } else if (ch === ',' && depth === 0) {
      result.push(parseTomlValue(buf.trim()))
      buf = ''
    } else {
      buf += ch
    }
  }
  if (buf.trim()) result.push(parseTomlValue(buf.trim()))
  return result
}

/* ========== 解析 ========== */
function parseData() {
  parseError.value = null
  parsedData.value = null

  const trimmed = props.code.trim()
  if (!trimmed) {
    parseError.value = '输入为空'
    viewMode.value = 'source'
    return
  }

  try {
    parsedData.value = parseToml(trimmed)
    viewMode.value = 'preview'
  } catch (err: any) {
    parseError.value = `解析失败: ${err.message || '语法错误'}`
    viewMode.value = 'source'
  }
}

/* ========== 统计 ========== */
const statsText = computed(() => {
  if (parseError.value) return '解析失败'
  const lines = props.code.split('\n').length
  const nodes = countNodes(parsedData.value)
  return `${lines} 行 · ${nodes} 节点`
})

function countNodes(data: any): number {
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
  await codeStore.ensureLanguageLoaded('toml')
  if (window.Prism) {
    nextTick(() => {
      try { window.Prism.highlightElement(codeRef.value!) } catch { }
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
})
</script>

<style scoped>
.toml-view-container {
  margin: 12px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  box-shadow: 0 1px 3px var(--common-shadow);
}
.toml-view-container.has-error {
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
}
.tv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
  border-bottom: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}
.tv-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.tv-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 6px;
  background: #4479a1;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-transform: lowercase;
}
.tv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
  flex-shrink: 0;
}
.tv-lang { font-size: 12px; font-weight: 600; }
.tv-toggle-btn {
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
.tv-toggle-btn:hover {
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  border-color: var(--common-color-1);
}
.tv-toggle-btn.active {
  background: var(--common-color-1);
  border-color: var(--common-color-1);
  color: var(--common-content);
}
.tv-stats {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
}
.tv-preview { max-height: 600px; overflow: auto; }
.tv-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 12px;
  color: #ef4444;
  background: color-mix(in srgb, #ef4444 8%, transparent);
}
.tv-tree-wrapper { padding: 8px 12px; }
.tv-source {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 5%, transparent);
}
.tv-source code {
  font-family: inherit;
  font-size: inherit;
  background: none;
  padding: 0;
  color: inherit;
}
@media (max-width: 768px) {
  .tv-header { padding: 6px 12px; }
  .tv-badge { padding: 2px 6px; font-size: 10px; }
  .tv-toggle-btn { padding: 2px 8px; font-size: 11px; }
  .tv-source { padding: 12px; font-size: 12px; }
  .tv-stats { font-size: 8px; padding: 1px 4px; }
  .tv-tree-wrapper { padding: 6px 8px; }
}
</style>