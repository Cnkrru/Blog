<template>
  <div class="json-tree-node" :style="{ paddingLeft: depth > 0 ? '20px' : '0' }">
    <!-- 对象 / 数组 -->
    <div v-if="isObject(data)" class="tree-branch">
      <div
        class="branch-header"
        :class="{
          collapsed: !expanded,
          highlighted: isHighlighted,
          filtered: searchQuery && !isVisible
        }"
        @click="toggle"
      >
        <span class="toggle-icon" :class="{ expanded }">
          <span class="svg-icon" :style="{ width: '10px', height: '10px' }" v-html="chevronRightSvg"></span>
        </span>
        <span v-if="keyName" class="key-name">{{ keyName }}</span>
        <span class="type-info">
          <span class="type-badge" :class="typeBadgeClass">
            {{ Array.isArray(data) ? 'Array' : 'Object' }}
          </span>
          <span class="size-info">
            ({{ Array.isArray(data) ? data.length : Object.keys(data).length }})
          </span>
        </span>
        <span class="branch-preview" v-if="!expanded">
          {{ previewText }}
        </span>
      </div>
      <div v-if="expanded" class="branch-children">
        <template v-for="(value, key) in processedEntries" :key="key">
          <JsonTree
            :data="value"
            :key-name="String(key)"
            :depth="depth + 1"
            :max-depth="maxDepth"
            :search-query="searchQuery"
            :search-path="searchPath ? `${searchPath}.${key}` : String(key)"
            @expand-all="onExpandAll"
            @collapse-all="onCollapseAll"
          />
        </template>
      </div>
    </div>
    <!-- 原始值 -->
    <div v-else class="tree-leaf">
      <span class="leaf-key" v-if="keyName">{{ keyName }}: </span>
      <span class="leaf-value" :class="valueClass">{{ formatValue(data) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, inject, watch } from 'vue'
import chevronRightSvg from '@/assets/svg/chevron-right.svg?raw'

const props = withDefaults(defineProps<{
  data: any
  keyName?: string
  depth?: number
  maxDepth?: number
  searchQuery?: string
  searchPath?: string
}>(), {
  depth: 0,
  maxDepth: 3,
  searchQuery: '',
  searchPath: ''
})

const emit = defineEmits<{
  'expand-all': []
  'collapse-all': []
}>()

/* ========== 递归展开/折叠 状态 ========== */
const isExpanded = ref(props.depth < props.maxDepth)

// 从父组件接收展开/折叠指令
interface ExpandState {
  expanded: boolean
  version: number
}
const expandState = inject<ExpandState>('expandState', { expanded: true, version: 0 })
watch(() => expandState.value.version, () => {
  isExpanded.value = expandState.value.expanded
})

// 从父组件接收搜索高亮
const highlightPath = inject<string>('highlightPath', '')
const isHighlighted = computed(() => {
  return highlightPath && props.searchPath && props.searchPath === highlightPath
})

const expanded = computed(() => {
  if (props.searchQuery) return true // 搜索时展开所有
  return isExpanded.value
})

/* ========== 工具函数 ========== */
function isObject(val: any): boolean {
  return val !== null && typeof val === 'object'
}

function isArray(val: any): boolean {
  return Array.isArray(val)
}

const typeBadgeClass = computed(() => {
  if (Array.isArray(props.data)) return 'type-array'
  return 'type-object'
})

const valueClass = computed(() => {
  const val = props.data
  if (val === null || val === undefined) return 'value-null'
  if (typeof val === 'boolean') return 'value-boolean'
  if (typeof val === 'number') return 'value-number'
  if (typeof val === 'string') return 'value-string'
  return 'value-other'
})

function formatValue(val: any): string {
  if (val === null) return 'null'
  if (val === undefined) return 'undefined'
  if (typeof val === 'string') {
    // 对长字符串截断
    if (val.length > 200) return `"${val.substring(0, 200)}..."`
    return `"${val}"`
  }
  return String(val)
}

const previewText = computed(() => {
  if (Array.isArray(props.data)) {
    if (props.data.length === 0) return '[]'
    return `[${props.data.length} items]`
  }
  const keys = Object.keys(props.data)
  if (keys.length === 0) return '{}'
  return `{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ', ...' : ''}}`
})

// 处理 entries，过滤掉非自身属性
const processedEntries = computed(() => {
  if (Array.isArray(props.data)) {
    return props.data.map((v: any, i: number) => v)
  }
  // 对象按 key 排序
  const keys = Object.keys(props.data).sort()
  return keys.reduce((acc: any[], key: string) => {
    acc[key] = props.data[key]
    return acc
  }, {} as any)
})

// 搜索可见性过滤
const isVisible = computed(() => {
  if (!props.searchQuery) return true
  const q = props.searchQuery.toLowerCase()
  // 搜索当前节点
  if (keyName && String(keyName).toLowerCase().includes(q)) return true
  if (typeof props.data === 'string' && props.data.toLowerCase().includes(q)) return true
  if (typeof props.data === 'number' && String(props.data).includes(q)) return true
  // 递归检查子节点匹配（只对容器节点有效）
  return false
})

function toggle() {
  isExpanded.value = !isExpanded.value
}

function onExpandAll() {
  emit('expand-all')
}

function onCollapseAll() {
  emit('collapse-all')
}
</script>

<style scoped>
.json-tree-node {
  font-family: 'Fira Code', 'Consolas', 'SF Mono', monospace;
  font-size: 13px;
  line-height: 1.7;
}

/* ---- 分支节点（对象/数组） ---- */
.branch-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s ease;
  user-select: none;
}

.branch-header:hover {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
}

.branch-header.highlighted {
  background: color-mix(in srgb, var(--common-color-1) 25%, transparent);
  border-radius: 4px;
}

.branch-header.filtered {
  opacity: 0.4;
}

/* 展开/折叠图标 */
.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: var(--common-text);
  opacity: 0.5;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.toggle-icon.expanded {
  transform: rotate(90deg);
}

/* key 名称 */
.key-name {
  color: var(--common-color-1);
  font-weight: 500;
  margin-right: 4px;
}

/* 类型信息 */
.type-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
}

.type-badge {
  padding: 0 6px;
  border-radius: 3px;
  font-weight: 600;
  font-size: 10px;
  line-height: 1.6;
}

.type-array {
  background: color-mix(in srgb, #3178c6 20%, transparent);
  color: #3178c6;
}

.type-object {
  background: color-mix(in srgb, #8b5cf6 20%, transparent);
  color: #8b5cf6;
}

.size-info {
  color: var(--common-text);
  opacity: 0.5;
  font-size: 11px;
}

.branch-preview {
  color: var(--common-text);
  opacity: 0.4;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.branch-children {
  border-left: 1px solid color-mix(in srgb, var(--common-text) 12%, transparent);
  margin-left: 6px;
}

/* ---- 叶子节点（原始值） ---- */
.tree-leaf {
  padding: 2px 4px;
  padding-left: 20px;
  border-radius: 4px;
  transition: background 0.15s ease;
}

.tree-leaf:hover {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.2);
}

.leaf-key {
  color: var(--common-color-1);
  font-weight: 500;
}

/* 值类型着色 */
.leaf-value {
  font-weight: 500;
}

.value-string {
  color: #16a34a;
}

.value-number {
  color: #2563eb;
}

.value-boolean {
  color: #d97706;
}

.value-null {
  color: #6b7280;
  font-style: italic;
}

.value-other {
  color: var(--common-text);
}

/* 暗色适配 */
:deep(html.dark) .value-string {
  color: #4ade80;
}

:deep(html.dark) .value-number {
  color: #60a5fa;
}

:deep(html.dark) .value-boolean {
  color: #fbbf24;
}

:deep(html.dark) .value-null {
  color: #9ca3af;
}
</style>

<style scoped>
@media (max-width: 768px) {
  .json-tree-node {
    font-size: 12px;
  }

  .tree-leaf {
    padding-left: 16px;
  }

  .branch-children {
    margin-left: 4px;
  }
}
</style>