<script setup>
// 搜索面板（合并 SearchResults 于一体）：接入 draft search() 工厂，
// computer/render 双层已去壳，init/assembler/_cleaner 直接挂在 store 上
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { search } from '@/composables/pheader.js'
import SearchIcon from '../icon/SearchIcon.vue';

const store = search()     // 工厂实例（含 search_res/is_ready/is_loading + init/assembler/_cleaner）
const router = useRouter()

const keyword = ref('')     // 输入词（UI 状态）
const open = ref(false)     // 下拉显隐（UI 状态，与数据分离）

const go = (result) => {
    router.push(`/post/${result.id}`)
    keyword.value = ''
    open.value = false
    store._cleaner()
}

watch(keyword, (v) => {
    const q = v.trim()
    if (!q) { store._cleaner(); open.value = false; return }
    store.assembler(q)
    open.value = true
})

const onEnter = () => { if (store.search_res.value.length) go(store.search_res.value[0]) }
const onFocus = () => { if (keyword.value.trim()) open.value = true }
const onClickOutside = (e) => { if (!e.target.closest('.search-pane')) open.value = false }

onMounted(async () => {
    await store.init()
    document.addEventListener('click', onClickOutside)
})
onUnmounted(() => document.removeEventListener('click', onClickOutside))

/* ====================<结果下拉定位 + 高亮>==================== */
// 用 fixed 把下拉对到 .search-pane 正下方，随滚动/缩放重定位
const pos = ref({ left: 0, top: 0, width: 0 })
const sync_pos = () => {
    const pane = document.querySelector('.search-pane')
    if (!pane) return
    const r = pane.getBoundingClientRect()
    pos.value = { left: r.left, top: r.top + r.height + 8, width: r.width }
}
watch(open, (v) => { if (v) sync_pos() })
onMounted(() => {
    document.addEventListener('scroll', sync_pos, true)
    window.addEventListener('resize', sync_pos)
    sync_pos()
})
onUnmounted(() => {
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
    <div class="search-pane">
        <SearchIcon class="search-pane-icon"/>
        <input
            type="text"
            placeholder="搜索"
            v-model="keyword"
            @keypress.enter="onEnter"
            @focus="onFocus"
        >

        <Teleport to="body">
            <Transition name="search-fade">
                <div v-if="open" class="search-results" :style="{ left: pos.left + 'px', top: pos.top + 'px', width: pos.width + 'px' }">
                    <div v-if="store.search_res.value.length === 0" class="search-empty">
                        搜索 "{{ keyword }}"：未找到结果
                    </div>

                    <template v-else>
                        <div class="search-counter">{{ store.search_res.value.length }} 个结果</div>
                        <div class="search-list">
                            <div
                                v-for="r in store.search_res.value"
                                :key="r.id"
                                class="search-item"
                                @click="go(r)"
                            >
                                <div class="search-item-title" v-html="hl(r.title, keyword)"></div>
                                <div class="search-item-meta">
                                    分类: <span v-html="hl(r.category, keyword)"></span>
                                    <span class="search-item-date" v-html="hl(r.date, keyword)"></span>
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
    </div>
</template>

<style scoped>
.search-pane {
    width: 600px;
    height: 80%;
    position: relative;
    z-index: 10000;     /* 建立独立层级，避免绝对定位的下拉被 .main-area 玻璃背景盖住 */
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);
    border-radius: var(--radius-full);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
    padding: 0 var(--space-md);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-opacity) * 0.6));
    backdrop-filter: blur(12px);
    transition: border-color 0.2s ease;
}

.search-pane-icon {
    color: var(--g-text);
    opacity: 0.5;
    transition: opacity 0.2s ease;
}

.search-pane:focus-within .search-pane-icon { opacity: 0.8; }
.search-pane:focus-within { border-color: var(--g-color); }

.search-pane input {
    height: 100%;
    width: 100%;
    color: var(--g-text);
    background: transparent;
    outline: none;
}

.search-pane input::placeholder {
    color: var(--g-text);
    opacity: 0.4;
}

/* ====================<结果下拉>==================== */
.search-results {
    position: fixed;            /* Teleport 到 body 后 fixed 定位，脱离 header/内容层级，置于最上层 */
    top: 0;
    left: 0;
    z-index: 10000;             /* 高于播放器/toast 等浮层，固定在最上 */
    max-height: 400px;
    overflow-y: auto;           /* 结果多了内部滚动，不撑出面板 */
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

.search-results {
    max-height: 60vh;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
    .search-pane { width: 60%; max-width: 480px; height: 44px; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    .search-pane { width: 60%; max-width: 480px; height: 44px; }
}

</style>

<!-- Transition 的 class 需作用于 .search-results 根元素，非 scoped -->
<style>
.search-fade-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.search-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.search-fade-enter-from { opacity: 0; transform: translateY(-8px); }
.search-fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>