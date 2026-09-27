<script setup>
// [AI实现] 搜索面板（独立组件，与手写的 Search.vue 分开）
// 输入用 store/search.js 检索，结果交给 SearchResults 下拉展示
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { search } from '@/modules/search.js'
import SearchIcon from '../icon/SearchIcon.vue';
import SearchResults from './SearchResults.vue';

const store = search
const router = useRouter()

const keyword = ref('')     // 输入词（UI 状态）
const open = ref(false)     // 下拉显隐（UI 状态，与数据分离）

const go = (result) => {
    router.push(`/post/${result.id}`)
    keyword.value = ''
    open.value = false
    store.clear()
}

watch(keyword, (v) => {
    const q = v.trim()
    if (!q) { store.clear(); open.value = false; return }
    store.doSearch(q)
    open.value = true
})

const onEnter = () => { if (store.results.length) go(store.results[0]) }
const onFocus = () => { if (keyword.value.trim()) open.value = true }
const onClickOutside = (e) => { if (!e.target.closest('.search-pane')) open.value = false }

onMounted(async () => {
    await store.initIndex()
    document.addEventListener('click', onClickOutside)
})
onUnmounted(() => document.removeEventListener('click', onClickOutside))
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

        <SearchResults
            :search-text="keyword"
            :results="store.results"
            :show="open"
            @result-click="go"
        />
    </div>
</template>

<style scoped>
.search-pane {
    width: 600px;
    height: 80%;
    position: relative;
    z-index: 10000;     /* [AI修复] 建立独立层级，避免绝对定位的下拉被 .main-area 玻璃背景盖住 */
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