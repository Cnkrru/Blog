<script setup>
/*
* ====================<文章目录组件·重做>====================
* —— 2026-09 重做，形态为「右侧固定浮动面板」——
* 挂载：Main.vue 的 <MainHeader> slot，面板 fixed 浮在视口右侧
* 数据：运行期扫描 .content 内带锚点 id 的 h1~h6（anchor 插件编译期已生成 id）
* 时机：正文 defineAsyncComponent 异步注入，MutationObserver 只观察 .main-area 子树，
*       任一注入触发重扫（60ms 防抖）；标题 id 序列未变则跳过赋值（防观察自渲染循环）
* 滚动：正文在 .main-body（680px 卡片内 overflow-y:auto）滚动，非页面级滚动
*       —— scrollspy 的 IntersectionObserver root 必须是 .main-body，
*          跳转也走容器 scrollTo，否则观察目标错乱、滚动不生效
* 高亮：观察标题是否进入中带视口（rootMargin -10% ~ -80%），命中即置 toc-item-on
* 跳转：目标在容器内 → scrollTo 平滑滚动（-20px 补偿避免标题贴顶）；否则回退 scrollIntoView
*/
import { ref, onMounted, onBeforeUnmount } from 'vue';
import List from '@/components/icon/List.vue';
import X from '@/components/icon/X.vue';

const show = ref(false)
const headings = ref([])
const active = ref('')

let scroll_ctn = null       // 正文滚动容器（.main-body），scrollspy 的 root + 跳转目标
let mobs = null             // 正文注入观察器（挂在 .main-area 上）
let io = null               // scrollspy
let scan_timer = null
let last_key = ''           // 标题 id 序列，未变化则跳过赋值（防观察自身渲染循环）

const scan = () => {
    scroll_ctn = document.querySelector('.main-body')
    const ct = document.querySelector('.content')
    // 不在文章页 / 正文未注入：清空遗留目录，避免从文章切回其他页还残留旧列表
    if (!ct) {
        if (headings.value.length) {
            last_key = ''
            active.value = ''
            headings.value = []
        }
        return
    }
    const list = [...ct.querySelectorAll('h1, h2, h3, h4, h5, h6')]
        .map((h) => ({ id: h.id, text: h.textContent.trim(), level: Number(h.tagName[1]) }))
        .filter((h) => h.id)
    const key = list.map((h) => h.id).join('|')
    if (key === last_key) return
    last_key = key
    active.value = ''
    headings.value = list
    bind()
}

const scan_scheduled = () => {
    clearTimeout(scan_timer)
    scan_timer = setTimeout(scan, 60)
}

const toggle = () => { show.value = !show.value }

/* scrollspy：观察滚动容器里每个标题，命中中带视口的当前章节高亮（root 用 .main-body） */
const bind = () => {
    io?.disconnect()
    io = null
    if (!headings.value.length || !scroll_ctn) return
    const targets = scroll_ctn.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6')
    if (!targets.length) return
    io = new IntersectionObserver(
        (entries) => {
            const crossed = entries.filter((e) => e.isIntersecting)
            if (!crossed.length) return
            let best = crossed[0]
            for (const e of crossed) {
                if (e.boundingClientRect.top < best.boundingClientRect.top) best = e
            }
            active.value = best.target.id
        },
        { root: scroll_ctn, rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    )
    targets.forEach((el) => { if (el.id) io.observe(el) })
}

/* 跳转：目标在 .main-body 内走容器滚动（-20px 呼吸），否则回退 scrollIntoView */
const jump = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (scroll_ctn && scroll_ctn.contains(el)) {
        const top = el.getBoundingClientRect().top - scroll_ctn.getBoundingClientRect().top + scroll_ctn.scrollTop
        scroll_ctn.scrollTo({ top: top - 20, behavior: 'smooth' })
    } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    show.value = false
}

/* 点击外部关闭：面板与触发器类内算“内部” */
const on_doc_click = (e) => {
    if (show.value && !e.target.closest('.toc-panel') && !e.target.closest('.toc-btn')) show.value = false
}

onMounted(() => {
    scan()
    // 观察 .main-area：header 与正文都在其子树内，异步注入 / 路由切换均能触发重扫
    const area = document.querySelector('.main-area')
    if (area) {
        mobs = new MutationObserver(scan_scheduled)
        mobs.observe(area, { childList: true, subtree: true })
    }
    document.addEventListener('click', on_doc_click)
})

onBeforeUnmount(() => {
    clearTimeout(scan_timer)
    mobs?.disconnect()
    io?.disconnect()
    document.removeEventListener('click', on_doc_click)
})
</script>

<template>
    <div class="toc-wrap">
        <button v-if="headings.length" class="toc-btn" :class="{ 'toc-btn-on': show }" @click="toggle" :title="show ? '关闭目录' : '打开目录'">
            <List v-if="!show" class="icon" />
            <X v-else class="icon" />
        </button>

        <div v-if="headings.length" class="toc-panel" :class="{ 'toc-panel-on': show }">
            <p class="toc-head">目录<span class="toc-count">{{ headings.length }}</span></p>
            <div class="toc-list">
                <p
                    v-for="h in headings"
                    :key="h.id"
                    class="toc-item"
                    :class="{ 'toc-item-on': active === h.id }"
                    :style="{ paddingLeft: (8 + (h.level - 1) * 14) + 'px' }"
                    @click="jump(h.id)"
                >{{ h.text }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.toc-wrap {
    margin-left: auto;
    align-self: center;
    flex-shrink: 0;
}

.toc-btn {
    width: 38px;
    height: 38px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: var(--radius-full);
    background-color: var(--g-color);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 30%, transparent);

    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.toc-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--g-color) 40%, transparent);
}

.toc-btn-on {
    background: color-mix(in srgb, var(--g-color) 85%, var(--g-text));
}

.toc-panel {
    position: fixed;
    top: 50%;
    right: 12px;
    transform: translate(calc(100% + 12px), -50%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;

    width: 260px;
    max-height: 70vh;
    overflow-y: auto;

    display: flex;
    flex-direction: column;

    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
    border-radius: var(--radius-lg);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 8px 24px color-mix(in srgb, var(--g-shadow) 45%, transparent);
}

.toc-panel-on {
    transform: translate(0, -50%);
}

.toc-head {
    display: flex;
    align-items: center;
    gap: var(--space-sm);

    padding: var(--space-sm) var(--space-md);
    border-bottom: var(--border-width) solid color-mix(in srgb, var(--g-color) 10%, transparent);

    font-size: 14px;
    font-weight: 600;
    color: var(--g-text);
}

.toc-count {
    font-size: 11px;
    font-weight: 500;
    padding: 1px 6px;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--g-color) 12%, transparent);
    color: var(--g-text);
    opacity: 0.8;
}

.toc-list {
    display: flex;
    flex-direction: column;
    padding: var(--space-xs);
}

.toc-item {
    margin: 1px 0;
    padding: 6px var(--space-sm);
    font-size: 13px;
    line-height: 1.5;
    color: var(--g-text);
    border-radius: var(--radius-sm);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    cursor: pointer;
}

.toc-item:hover {
    color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 10%, transparent);
}

/* [AI优化] 滚动高亮当前章节 */
.toc-item-on,
.toc-item-on:hover {
    color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 14%, transparent);
    font-weight: 600;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
    .toc-panel {
        width: 220px;
    }
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
    .toc-panel {
        width: 200px;
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>