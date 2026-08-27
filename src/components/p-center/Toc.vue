<script setup>
import VIcon from '@/components/common/VIcon.vue'
import VButton from '@/components/common/VButton.vue'
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useTocStore } from '../../stores'
import TocTreeItem from './TocTreeItem.vue'

const props = defineProps(['show'])
const emit = defineEmits(['update:show'])

const tocStore = useTocStore()

const tocContentRef = ref(null)
const toc = ref([])
const collapsedSet = ref(new Set())
const expandedAll = ref(true)
const activeId = ref('')

// 生成标题编号
function genNum(_index, level, counters) {
  counters[level] = (counters[level] || 0) + 1
  for (let i = level + 1; i <= 6; i++) counters[i] = 0
  let n = ''
  for (let i = 1; i <= level; i++) {
    if (counters[i]) n += counters[i] + '.'
  }
  return n.slice(0, -1)
}

// 扁平 → 嵌套树
function buildTree(flat) {
  const root = []
  const stack = [{ level: 0, children: root }]
  for (const item of flat) {
    const node = { ...item, children: [] }
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) stack.pop()
    stack[stack.length - 1].children.push(node)
    stack.push(node)
  }
  return root
}

const treeToc = computed(() => buildTree(toc.value))

function toggleCollapse(id) {
  const s = new Set(collapsedSet.value)
  s.has(id) ? s.delete(id) : s.add(id)
  collapsedSet.value = s
}

function collapseAll() {
  collapsedSet.value = new Set(toc.value.filter(i => i.level <= 2).map(i => i.id))
  expandedAll.value = false
}

function expandAll() {
  collapsedSet.value = new Set()
  expandedAll.value = true
}

function onTreeClick(id) {
  const el = document.getElementById(id)
  if (!el) return
  const container = document.querySelector('.center-card-content')
  if (container && container.contains(el)) {
    const rect = el.getBoundingClientRect()
    const cr = container.getBoundingClientRect()
    container.scrollTo({ top: container.scrollTop + rect.top - cr.top - 20, behavior: 'smooth' })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 扫描标题
function scanHeadings() {
  const ct = document.querySelector('.center-card-content') ||
    document.querySelector('.post-content') ||
    document.querySelector('.markdown-content')
  if (!ct) return
  const hds = ct.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const nv = []
  const cnt = {}
  hds.forEach((h, i) => {
    const lv = parseInt(h.tagName.substring(1))
    const tx = h.textContent?.trim() || ''
    // 保留已有 id（如 Markdown 锚点链接设置的 id），无 id 时才分配 th-{i}
    const id = h.id || `th-${i}`
    if (!h.id) h.id = id
    nv.push({ id, level: lv, text: tx, numbering: genNum(i, lv, cnt) })
  })
  toc.value = nv
  tocStore.setToc(nv)
}

// IntersectionObserver
let obs = null
function setupObs() {
  if (obs) obs.disconnect()
  const ct = document.querySelector('.center-card-content')
  if (!ct) return
  obs = new IntersectionObserver((es) => {
    const vs = es.filter(e => e.isIntersecting).map(e => e.target.id).filter(Boolean)
    if (!vs.length) return
    for (const item of toc.value) {
      if (vs.includes(item.id)) {
        if (item.id !== activeId.value) {
          activeId.value = item.id
          tocStore.setActiveId(item.id)
          unCollapseParents(item.id)
        }
        return
      }
    }
  }, { root: ct, rootMargin: '-10% 0px -70% 0px', threshold: 0 })
  toc.value.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) obs.observe(el)
  })
}

function unCollapseParents(id) {
  const idx = toc.value.findIndex(i => i.id === id)
  if (idx <= 0) return
  const item = toc.value[idx]
  const s = new Set(collapsedSet.value)
  let changed = false
  for (let i = idx - 1; i >= 0; i--) {
    if (toc.value[i].level < item.level) {
      if (s.has(toc.value[i].id)) { s.delete(toc.value[i].id); changed = true }
      break
    }
  }
  if (changed) collapsedSet.value = s
}

function scrollActiveIntoView() {
  if (!tocContentRef.value) return
  const ae = tocContentRef.value.querySelector('.toc-item.active')
  if (ae) {
    const tr = tocContentRef.value.getBoundingClientRect()
    const ar = ae.getBoundingClientRect()
    tocContentRef.value.scrollTop += ar.top - tr.top - tr.height / 2
  }
}

const toggleToc = () => {
  emit('update:show', !props.show)
  tocStore.toggleToc()
}

watch(() => props.show, (v) => {
  if (v) {
    nextTick(() => {
      scanHeadings()
      setTimeout(() => { setupObs() }, 100)
    })
  }
})

onMounted(() => {
  tocStore.loadUserPreference()
  setTimeout(() => { scanHeadings(); setupObs() }, 300)
  window.addEventListener('resize', () => { scanHeadings(); setupObs() }, { passive: true })
  const ct = document.querySelector('.center-card-content')
  if (ct) ct.addEventListener('scroll', () => requestAnimationFrame(scrollActiveIntoView), { passive: true })
})

onUnmounted(() => {
  if (obs) obs.disconnect()
  tocStore.reset()
})
</script>

<template>
  <Teleport to="body">
    <div class="toc-card" :class="{ active: show }">
      <!-- 头部 -->
      <div class="toc-header">
        <div class="toc-hleft">
          <VIcon :src="'list.svg'" :size="16" class="toc-hicon" />
          <h3 class="toc-title">目录</h3>
          <span v-if="toc.length" class="toc-count">{{ toc.length }}</span>
        </div>
        <div class="toc-hactn">
          <VButton
            class="toc-tbtn"
            :icon="expandedAll ? 'minus.svg' : 'plus.svg'"
            icon-size="14"
            variant="ghost"
            shape="rect"
            radius="6"
            size="26"
            :title="expandedAll ? '折叠全部' : '展开全部'"
            @click="expandedAll ? collapseAll() : expandAll()"
          />
          <VButton icon="x.svg" size="26" shape="rect" variant="ghost" class="toc-close" @click="toggleToc" title="关闭" />
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="toc-divider"></div>

      <!-- 目录内容 -->
      <div class="toc-content" ref="tocContentRef">
        <ul class="toc-list">
          <TocTreeItem
            v-for="node in treeToc"
            :key="node.id"
            :node="node"
            :active-id="activeId"
            :collapsed-set="collapsedSet"
            :depth="0"
            @click="onTreeClick"
            @toggle="toggleCollapse"
          />
        </ul>
        <div v-if="!toc.length" class="toc-empty">
          <VIcon :src="'file-text.svg'" :size="20" />
          <span>暂无目录</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ========== 卡片容器 - 文档站风格 ========== */
.toc-card {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translate(100%, -50%);
  width: 260px;
  max-height: 70vh;
  border-radius: 10px 0 0 10px;
  z-index: 999;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.92);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid var(--common-shadow);
  border-right: none;
  box-shadow: -3px 0 24px color-mix(in srgb, var(--common-shadow) 50%, transparent);
}

.toc-card.active {
  transform: translate(0, -50%);
}

/* ========== 头部 ========== */
.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 10px;
  user-select: none;
}

.toc-hleft {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toc-hicon {
  color: var(--common-text);
  opacity: 0.5;
  flex-shrink: 0;
}

.toc-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--common-text);
  letter-spacing: 0.3px;
}

.toc-count {
  font-size: 10px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 8px;
  color: var(--common-text);
  opacity: 0.5;
  background: color-mix(in srgb, var(--common-text) 8%, transparent);
  line-height: 1.5;
}

.toc-hactn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toc-tbtn {
  opacity: 0.45;
}

.toc-tbtn:hover {
  opacity: 0.8;
}

.toc-close {
  opacity: 0.45;
  --v-btn-hover-bg: color-mix(in srgb, var(--common-text) 6%, transparent);
  transition: opacity 0.15s ease;
}

.toc-close:hover {
  opacity: 0.8;
  transform: rotate(90deg);
}

/* ========== 分隔线 ========== */
.toc-divider {
  height: 1px;
  background: color-mix(in srgb, var(--common-text) 8%, transparent);
  margin: 0 14px;
}

/* ========== 目录内容 ========== */
.toc-content {
  padding: 6px 0;
  max-height: calc(70vh - 56px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--common-text) 12%, transparent) transparent;
}

.toc-content::-webkit-scrollbar {
  width: 4px;
}

.toc-content::-webkit-scrollbar-track {
  background: transparent;
}

.toc-content::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--common-text) 12%, transparent);
  border-radius: 2px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ========== 空状态 ========== */
.toc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 0;
  color: var(--common-text);
  opacity: 0.3;
  font-size: 13px;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .toc-card {
    width: 240px;
    max-height: 60vh;
  }
  .toc-content {
    max-height: calc(60vh - 56px);
  }
}

@media (max-width: 480px) {
  .toc-card {
    width: 220px;
  }
}
</style>