<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useTocStore, useThemeStore } from '../../stores'

const props = defineProps<{ show?: boolean }>()
const emit = defineEmits<{ 'update:show': [show: boolean] }>()

const tocStore = useTocStore()
const themeStore = useThemeStore()

const tocContentRef = ref(null)
const toc = ref<any[]>([])
const collapsedSet = ref<Set<string>>(new Set())
const expandedAll = ref(true)
const activeId = ref('')
const isDarkTheme = computed(() => themeStore.isDark)

// 生成标题编号
function genNum(index: number, level: number, counters: Record<number, number>): string {
  counters[level] = (counters[level] || 0) + 1
  for (let i = level + 1; i <= 6; i++) counters[i] = 0
  let n = ''
  for (let i = 1; i <= level; i++) {
    if (counters[i]) n += counters[i] + '.'
  }
  return n.slice(0, -1)
}

// 扁平 → 嵌套树
function buildTree(flat: any[]): any[] {
  const root: any[] = []
  const stack: any[] = [{ level: 0, children: root }]
  for (const item of flat) {
    const node = { ...item, children: [] as any[] }
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) stack.pop()
    stack[stack.length - 1].children.push(node)
    stack.push(node)
  }
  return root
}

const treeToc = computed(() => buildTree(toc.value))

function isVisible(node: any): boolean {
  // 检查是否有任何一个祖先被折叠
  const idx = toc.value.findIndex(i => i.id === node.id)
  if (idx <= 0) return true
  for (let i = idx - 1; i >= 0; i--) {
    const p = toc.value[i]
    if (p.level < node.level) {
      if (collapsedSet.value.has(p.id)) return false
      break
    }
  }
  return true
}

function isChildActive(node: any): boolean {
  if (node.id === activeId.value) return true
  for (const c of node.children) {
    if (isChildActive(c)) return true
  }
  return false
}

function toggleCollapse(id: string) {
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

// 遍历树递归渲染 TOC
// 由于需要递归组件，改用动态渲染
const renderedTree = computed(() => {
  return renderNodes(treeToc.value, 0)
})

function renderNodes(nodes: any[], _depth: number): any[] {
  const result: any[] = []
  for (const node of nodes) {
    const hasCh = node.children && node.children.length > 0
    const col = collapsedSet.value.has(node.id)
    const active = activeId.value === node.id

    // 递归渲染子节点（包含 transition wrapper）
    let childrenHtml = null
    if (hasCh && !col) {
      childrenHtml = renderNodes(node.children, _depth + 1)
    }

    result.push({
      id: node.id,
      level: node.level,
      text: node.text,
      numbering: node.numbering,
      hasChildren: hasCh,
      collapsed: col,
      active,
      childrenHtml
    })
  }
  return result
}

function onTreeClick(id: string) {
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
  const nv: any[] = []
  const cnt: Record<number, number> = {}
  hds.forEach((h, i) => {
    const lv = parseInt(h.tagName.substring(1))
    const tx = h.textContent?.trim() || ''
    const id = `th-${i}`
    h.id = id
    nv.push({ id, level: lv, text: tx, numbering: genNum(i, lv, cnt) })
  })
  toc.value = nv
  tocStore.setToc(nv)
}

// IntersectionObserver
let obs: IntersectionObserver | null = null
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
    if (el) obs!.observe(el)
  })
}

function unCollapseParents(id: string) {
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
  <div class="toc-card" :class="{ active: show }">
    <div class="toc-card-header">
      <h3>文章目录</h3>
      <div class="header-actions">
        <span v-if="toc.length" class="toc-count">{{ toc.length }} 项</span>
        <button class="toc-close-btn" @click="toggleToc" title="关闭">x</button>
      </div>
    </div>
    <div class="toc-toolbar">
      <button v-if="expandedAll" class="toc-tb-btn" @click="collapseAll">折叠全部</button>
      <button v-else class="toc-tb-btn" @click="expandAll">展开全部</button>
    </div>
    <div class="toc-card-content" ref="tocContentRef">
      <ul class="toc-list">
        <template v-for="node in renderedTree" :key="node.id">
          <li
            class="toc-item"
            :class="[`lv-${node.level}`, { active: node.active }]"
          >
            <a href="#" class="toc-link" @click.prevent="onTreeClick(node.id)">
              <span
                v-if="node.hasChildren"
                class="toc-arrow"
                @click.prevent.stop="toggleCollapse(node.id)"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" :class="{ rot: !node.collapsed }">
                  <polygon points="8,4 16,12 8,20"/>
                </svg>
              </span>
              <span v-else class="toc-arrow-blank"></span>
              <span class="toc-num">{{ node.numbering }}</span>
              <span class="toc-text">{{ node.text }}</span>
            </a>
            <!-- 子节点 -->
            <div v-if="node.hasChildren && !node.collapsed" class="toc-children">
              <ul class="toc-list">
                <li
                  v-for="child in node.childrenHtml"
                  :key="child.id"
                  class="toc-item"
                  :class="[`lv-${child.level}`, { active: child.active }]"
                >
                  <a href="#" class="toc-link" @click.prevent="onTreeClick(child.id)">
                    <span
                      v-if="child.hasChildren"
                      class="toc-arrow"
                      @click.prevent.stop="toggleCollapse(child.id)"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" :class="{ rot: !child.collapsed }">
                        <polygon points="8,4 16,12 8,20"/>
                      </svg>
                    </span>
                    <span v-else class="toc-arrow-blank"></span>
                    <span class="toc-num">{{ child.numbering }}</span>
                    <span class="toc-text">{{ child.text }}</span>
                  </a>
                  <div v-if="child.hasChildren && !child.collapsed" class="toc-children">
                    <ul class="toc-list">
                      <li
                        v-for="gc in child.childrenHtml"
                        :key="gc.id"
                        class="toc-item"
                        :class="[`lv-${gc.level}`, { active: gc.active }]"
                      >
                        <a href="#" class="toc-link" @click.prevent="onTreeClick(gc.id)">
                          <span class="toc-arrow-blank"></span>
                          <span class="toc-num">{{ gc.numbering }}</span>
                          <span class="toc-text">{{ gc.text }}</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </template>
      </ul>
      <div v-if="!toc.length" class="toc-empty">暂无目录</div>
    </div>
  </div>
</template>

<style scoped>
.toc-card {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translate(100%, -50%);
  width: 280px;
  max-height: 70vh;
  border-radius: 12px 0 0 12px;
  z-index: 999;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: var(--common-bg);
  border: 2px solid var(--common-color-1);
  box-shadow: -4px 4px 12px var(--common-shadow);
}

.toc-card.active {
  transform: translate(0, -50%);
  box-shadow: -6px 6px 20px var(--common-shadow);
}

.toc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--common-color-1);
}

.toc-card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--common-text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toc-count {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--common-text);
  border: 1px solid var(--common-color-1);
}

.toc-close-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: none;
  color: var(--common-text);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.toc-close-btn:hover {
  background-color: var(--common-color-1);
  transform: rotate(90deg);
}

.toc-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 4px 16px;
  border-bottom: 1px solid var(--common-color-1);
}

.toc-tb-btn {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 10px;
  border: 1px solid var(--common-color-1);
  background: transparent;
  color: var(--common-text);
  cursor: pointer;
  transition: all 0.2s;
}

.toc-tb-btn:hover {
  background: var(--common-color-1);
}

.toc-card-content {
  padding: 8px 12px;
  max-height: calc(70vh - 80px);
  overflow-y: auto;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-children {
  margin: 0;
}

.toc-item {
  margin-bottom: 2px;
  border-radius: 4px;
  transition: all 0.2s;
}

.toc-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  text-decoration: none;
  border-radius: 4px;
  color: var(--common-text);
  font-size: 13px;
  line-height: 1.4;
  transition: all 0.15s;
  cursor: pointer;
}

.toc-link:hover {
  background-color: var(--common-bg);
  transform: translateX(3px);
}

.toc-item.active > .toc-link {
  background-color: var(--common-bg);
  color: var(--common-color-1);
  font-weight: 700;
  border-left: 3px solid var(--common-color-1);
}

/* 缩进 */
.lv-1 > .toc-link { padding-left: 8px; }
.lv-2 > .toc-link { padding-left: 12px; }
.lv-3 > .toc-link { padding-left: 16px; }

/* 箭头 */
.toc-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: var(--common-text);
  opacity: 0.5;
  transition: opacity 0.2s;
}

.toc-arrow:hover {
  opacity: 1;
}

.toc-arrow svg {
  transition: transform 0.2s ease;
}

.toc-arrow svg.rot {
  transform: rotate(90deg);
}

.toc-arrow-blank {
  width: 16px;
  flex-shrink: 0;
}

.toc-num {
  font-size: 11px;
  min-width: 24px;
  text-align: right;
  color: var(--common-text);
  opacity: 0.5;
  flex-shrink: 0;
}

.toc-item.active .toc-num {
  opacity: 1;
  color: var(--common-color-1);
}

.toc-text {
  flex: 1;
  word-break: break-word;
}

.toc-empty {
  text-align: center;
  padding: 24px 0;
  color: var(--common-text);
  opacity: 0.4;
  font-size: 13px;
}

@media (max-width: 768px) {
  .toc-card { width: 240px; max-height: 60vh; }
  .toc-card-content { max-height: calc(60vh - 80px); }
  .toc-link { font-size: 12px; padding: 4px 6px; }
}
</style>
