<template>
  <VCard class="csv-container">
    <!-- 头部栏 -->
    <div class="csv-header">
      <span class="csv-badge">
        <span class="csv-dot"></span>
        <span class="csv-lang">csv</span>
      </span>
      <div class="csv-actions">
        <CodeRender :code="code" />
        <VButton
          class="v-btn-rect v-btn-ghost csv-toggle"
          :class="{ active: viewMode === 'source' }"
          title="查看源码"
          @click="viewMode = 'source'"
        ><VIcon :src="'code.svg'" :size="14" />源码</VButton>
        <VButton
          class="v-btn-rect v-btn-ghost csv-toggle"
          :class="{ active: viewMode === 'preview' }"
          title="查看表格"
          @click="viewMode = 'preview'"
        ><VIcon :src="'table.svg'" :size="14" />预览</VButton>
        <span class="csv-stats">{{ rows }} 行 &times; {{ cols }} 列</span>
      </div>
    </div>

    <!-- 预览模式：表格 -->
    <div v-if="viewMode === 'preview'" class="csv-scroll">
      <table class="csv-table">
        <thead v-if="hasHeader">
          <tr>
            <th v-for="(col, ci) in header" :key="'h-' + ci">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in body" :key="'r-' + ri">
            <td v-for="(cell, ci) in row" :key="'c-' + ri + '-' + ci">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 源码模式：原始 CSV -->
    <pre v-else class="csv-source"><code>{{ code }}</code></pre>
  </VCard>
</template>

<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
import { ref, computed } from 'vue'
import CodeRender from './CodeRender.vue'
import VCard from '../__common/VCard.vue'

const props = defineProps(['code'])

const viewMode = ref('preview')

/* ========== CSV 解析器 ========== */
function parseCsv(raw) {
  const lines = raw.trim().split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length === 0) return { header: [], body: [], rows: 0, cols: 0 }

  const result = []
  for (const line of lines) {
    const row = []
    let cell = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            cell += '"'
            i++
          } else {
            inQuotes = false
          }
        } else {
          cell += ch
        }
      } else {
        if (ch === '"') {
          inQuotes = true
        } else if (ch === ',') {
          row.push(cell.trim())
          cell = ''
        } else {
          cell += ch
        }
      }
    }
    row.push(cell.trim())
    result.push(row)
  }

  if (result.length === 0) return { header: [], body: [], rows: 0, cols: 0 }

  const cols = result[0].length
  const hasHeader = result.length > 1
  const header = hasHeader ? result[0] : []
  const body = hasHeader ? result.slice(1) : result

  return { header, body, rows: result.length, cols }
}

const parsed = computed(() => parseCsv(props.code))

const header = computed(() => parsed.value.header)
const body = computed(() => parsed.value.body)
const rows = computed(() => parsed.value.rows)
const cols = computed(() => parsed.value.cols)
const hasHeader = computed(() => header.value.length > 0)
</script>

<style scoped>
.csv-container {
  margin: 12px 0;
  overflow: hidden;
  box-shadow: 0 1px 3px var(--common-shadow);
  /* 玻璃表面由 VCard 提供；此处仅对齐原视觉 */
  --v-card-alpha: 0.4;
  --v-card-pad: 0;
  --v-card-radius: 10px;
  --v-card-border: color-mix(in srgb, var(--common-text) 8%, transparent);
}

/* ---- 头部栏 ---- */
.csv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
  border-bottom: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

.csv-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ---- 语言标签 ---- */
.csv-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 6px;
  background: #16a34a;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  text-transform: lowercase;
}

.csv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
  flex-shrink: 0;
}

/* ---- 切换按钮 ---- */
.csv-toggle {
  --v-btn-pad: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  gap: 4px;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  --v-btn-border: color-mix(in srgb, var(--common-text) 8%, transparent);
  --v-btn-bg: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  --v-btn-hover-bg: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  cursor: pointer;
}

.csv-toggle:hover {
  --v-btn-border: var(--common-color-1);
}

.csv-toggle.active {
  --v-btn-bg: var(--common-color-1);
  --v-btn-border: var(--common-color-1);
  --v-btn-color: var(--common-content);
}

/* ---- 统计 ---- */
.csv-stats {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
}

/* ---- 表格预览 ---- */
.csv-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.csv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
  line-height: 1.6;
  color: var(--common-text);
}

.csv-table thead {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
}

.csv-table th {
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--common-color-1);
  color: var(--common-color-1);
  white-space: nowrap;
}

.csv-table td {
  padding: 8px 14px;
  border-bottom: 1px solid rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.2);
  color: var(--common-content);
}

.csv-table tbody tr:hover {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.2);
}

.csv-table tbody tr:nth-child(even) {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.08);
}

.csv-table tbody tr:nth-child(even):hover {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.22);
}

/* ---- 源码模式 ---- */
.csv-source {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--common-text);
  background: color-mix(in srgb, var(--common-color-1) 5%, transparent);
}

.csv-source code {
  font-family: inherit;
  font-size: inherit;
  background: none;
  padding: 0;
  color: inherit;
}

/* 响应式 */
@media (max-width: 768px) {
  .csv-header {
    padding: 6px 12px;
  }

  .csv-badge {
    padding: 2px 6px;
    font-size: 10px;
  }

  .csv-toggle {
    --v-btn-pad: 2px 8px;
    font-size: 11px;
  }

  .csv-source {
    padding: 12px;
    font-size: 12px;
  }

  .csv-stats {
    font-size: 8px;
    padding: 1px 4px;
  }
}
</style>