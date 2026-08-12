<template>
  <div class="json-view-container" :class="{ 'has-error': parseError }">
    <!-- 头部栏 -->
    <div class="jv-header">
      <span class="jv-badge">
        <span class="jv-dot"></span>
        <span class="jv-lang">json</span>
      </span>
      <div class="jv-header-actions">
        <CodeRender :code="code" />
        <button
          class="jv-toggle-btn"
          :class="{ active: viewMode === 'preview' }"
          @click="viewMode = 'preview'"
          title="查看结构化视图"
        >
          <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="usersSvg"></span>
          结构化
        </button>
        <button
          class="jv-toggle-btn"
          :class="{ active: viewMode === 'source' }"
          @click="viewMode = 'source'"
          title="查看源码"
        >
          <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="codeSvg"></span>
          源码
        </button>
        <span class="jv-stats">{{ statsText }}</span>
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-if="viewMode === 'preview'" class="jv-preview">
      <div v-if="parseError" class="jv-error">
        <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="alertTriangleSvg"></span>
        <span>{{ parseError }}</span>
      </div>
      <div v-else class="jv-tree-wrapper">
        <JsonTree :data="parsedData" />
      </div>
    </div>

    <!-- 源码模式 -->
    <pre v-else class="jv-source"><code ref="codeRef" class="language-json">{{ code }}</code></pre>
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

// 为 JsonTree 提供默认展开状态（必须用 ref 包裹，JsonTree 内部通过 .value 访问）
const expandState = ref({ expanded: true, version: 0 })
provide('expandState', expandState)
provide('highlightPath', '')

/* ========== 解析 ========== */
function parseJson() {
  parseError.value = null
  parsedData.value = null

  const trimmed = props.code.trim()
  if (!trimmed) {
    parseError.value = '输入为空'
    viewMode.value = 'source'
    return
  }

  try {
    parsedData.value = JSON.parse(trimmed)
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

/* ========== 生命周期 ========== */
parseJson()

// 挂载后如果处于源码模式（如解析失败），执行高亮
onMounted(() => {
  if (viewMode.value === 'source') {
    highlightSource()
  }
})

watch(() => props.code, parseJson)

/* ========== Prism 高亮（委托 codeStore 统一管理） ========== */
async function highlightSource() {
  if (viewMode.value !== 'source') return
  if (!codeRef.value) return

  try {
    await codeStore.ensurePrismLoaded()
  } catch {
    return
  }

  await codeStore.ensureLanguageLoaded('json')

  if (window.Prism) {
    nextTick(() => {
      try {
        window.Prism.highlightElement(codeRef.value!)
      } catch {
        // 高亮失败不影响显示
      }
    })
  }
}

watch(viewMode, () => {
  if (viewMode.value === 'source') {
    highlightSource()
  }
})
</script>

<style scoped>
.json-view-container {
  margin: 12px 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  box-shadow: 0 1px 3px var(--common-shadow);
}

.json-view-container.has-error {
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
}

/* ---- 头部栏 ---- */
.jv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
  border-bottom: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

.jv-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ---- 语言标签 ---- */
.jv-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 6px;
  background: #b8b8b8;
  color: #1e1e2e;
  font-size: 12px;
  font-weight: 600;
  text-transform: lowercase;
}

.jv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
  flex-shrink: 0;
}

.jv-lang {
  font-size: 12px;
  font-weight: 600;
}

/* ---- 切换按钮 ---- */
.jv-toggle-btn {
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

.jv-toggle-btn:hover {
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  border-color: var(--common-color-1);
}

.jv-toggle-btn.active {
  background: var(--common-color-1);
  border-color: var(--common-color-1);
  color: var(--common-content);
}

/* ---- 统计 ---- */
.jv-stats {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
}

/* ---- 预览模式 ---- */
.jv-preview {
  max-height: 600px;
  overflow: auto;
}

/* ---- 错误提示 ---- */
.jv-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 12px;
  color: #ef4444;
  background: color-mix(in srgb, #ef4444 8%, transparent);
}

/* ---- 树形内容 ---- */
.jv-tree-wrapper {
  padding: 8px 12px;
}

/* ---- 源码模式 ---- */
.jv-source {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 5%, transparent);
}

.jv-source code {
  font-family: inherit;
  font-size: inherit;
  background: none;
  padding: 0;
  color: inherit;
}
</style>

<style scoped>
/* 响应式 */
@media (max-width: 768px) {
  .jv-header {
    padding: 6px 12px;
  }

  .jv-badge {
    padding: 2px 6px;
    font-size: 10px;
  }

  .jv-toggle-btn {
    padding: 2px 8px;
    font-size: 11px;
  }

  .jv-source {
    padding: 12px;
    font-size: 12px;
  }

  .jv-stats {
    font-size: 8px;
    padding: 1px 4px;
  }

  .jv-tree-wrapper {
    padding: 6px 8px;
  }
}
</style>