<script setup>
// [AI实现] 搜索结果下拉面板（独立组件，对应 blog-map 的 SearchResults.vue）
// 接收 searchText + results + show，命中词高亮，点击项 emit result-click
// [AI修复] Teleport 到 body：脱离 header/内容树的 stacking context，避免被 .main-area 内容盖住
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    searchText: { type: String, default: '' },
    results: { type: Array, default: () => [] },
    show: { type: Boolean, default: false },
})
const emit = defineEmits(['result-click'])

const onPick = (item) => emit('result-click', item)

// 用 fixed 把下拉对到 .search-pane 正下方，随滚动/缩放重定位
const pos = ref({ left: 0, top: 0, width: 0 })
const sync_pos = () => {
    const pane = document.querySelector('.search-pane')
    if (!pane) return
    const r = pane.getBoundingClientRect()
    pos.value = { left: r.left, top: r.top + r.height + 8, width: r.width }
}
watch(() => props.show, (v) => { if (v) sync_pos() })
onMounted(() => {
    document.addEventListener('scroll', sync_pos, true)
    window.addEventListener('resize', sync_pos)
    sync_pos()
})
onBeforeUnmount(() => {
    document.removeEventListener('scroll', sync_pos, true)
    window.removeEventListener('resize', sync_pos)
})

// 转义 + 高亮命中片段（keyword 前后内容分别转义后回填高亮标签）
const hl = (text, kw) => {
    const s = String(text ?? '')
    const k = (kw || '').trim()
    const esc = (str) => str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
    if (!k) return esc(s)
    const i = s.toLowerCase().indexOf(k.toLowerCase())
    if (i === -1) return esc(s)
    return esc(s.slice(0, i)) + '<b class="search-hit">' + esc(s.slice(i, i + k.length)) + '</b>' + esc(s.slice(i + k.length))
}
</script>

<template>
    <Teleport to="body">
        <Transition name="search-fade">
            <div v-if="show" class="search-results" :style="{ left: pos.left + 'px', top: pos.top + 'px', width: pos.width + 'px' }">
                <div v-if="results.length === 0" class="search-empty">
                    搜索 "{{ searchText }}"：未找到结果
                </div>

                <template v-else>
                    <div class="search-counter">{{ results.length }} 个结果</div>
                    <div class="search-list">
                        <div
                            v-for="r in results"
                            :key="r.id"
                            class="search-item"
                            @click="onPick(r)"
                        >
                            <div class="search-item-title" v-html="hl(r.title, searchText)"></div>
                            <div class="search-item-meta">
                                分类: <span v-html="hl(r.category, searchText)"></span>
                                <span class="search-item-date" v-html="hl(r.date, searchText)"></span>
                            </div>
                            <div class="search-item-tags" v-if="r.tags && r.tags.length">
                                <span v-for="t in r.tags" :key="t" class="search-tag">{{ t }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.search-results {
    position: fixed;            /* [AI修复] Teleport 到 body 后 fixed 定位，脱离 header/内容层级，置于最上层 */
    top: 0;
    left: 0;
    z-index: 10000;             /* [AI修复] 高于播放器/toast 等浮层，固定在最上 */
    max-height: 400px;
    overflow-y: auto;    /* [AI修复] 结果多了内部滚动，不撑出面板 */
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 12%, transparent);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-opacity));
    backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.10);
}

.search-empty {
    padding: 16px;
    text-align: center;
    color: var(--g-text);
}

.search-counter {
    padding: 8px 16px;
    font-size: 12px;
    color: var(--g-text);
    border-bottom: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
}

.search-item {
    padding: 12px 16px;
    margin: 2px 6px;
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--g-text);
    transition: background-color 0.15s ease;
}

.search-item:hover { background-color: color-mix(in srgb, var(--g-color) 15%, transparent); }

.search-item-title {
    font-weight: 600;
    margin-bottom: 4px;
}

.search-item-meta {
    font-size: 13px;
    opacity: 0.7;
}

.search-item-date { margin-left: 8px; }

.search-item-tags {
    font-size: 12px;
    margin-top: 6px;
}

.search-hit { color: var(--g-color); }

.search-tag {
    display: inline-block;
    margin-right: 4px;
    padding: 2px 6px;
    font-size: 11px;
    border-radius: var(--radius-sm);
    background-color: color-mix(in srgb, var(--g-color) 25%, transparent);
    color: var(--g-text);
}

@media (max-width: 768px) {
    .search-results { max-height: 60vh; }
}
</style>

<!-- Transition 的 class 需作用于 .search-results 根元素，非 scoped -->
<style>
.search-fade-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.search-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.search-fade-enter-from { opacity: 0; transform: translateY(-8px); }
.search-fade-leave-to { opacity: 0; transform: translateY(-4px); }

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>