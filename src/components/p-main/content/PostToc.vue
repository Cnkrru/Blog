<script setup>
/*
* ====================<文章目录·桌面右侧栏>====================
* 数据/高亮/跳转全部交给 toc 单例（@/modules/toc.js），桌面栏与移动端工具条共用一份
* 挂载：Post.vue .post-layout 右侧，与正文横向 flex 并排；position: sticky 常驻
* 时机：toc.mount() 首扫 + MutationObserver 观察 .main-area，async 正文注入后自动重扫
*/
import { onMounted, onBeforeUnmount } from 'vue'
import { toc } from '@/modules/toc'

// 顶层解包：模板只对顶层 ref 自动解包，嵌套在对象里的 ref(toc.headings) 不会，需先提到顶层
const headings = toc.headings
const active = toc.active
const jump = toc.jump

onMounted(() => { toc.mount() })
onBeforeUnmount(() => { toc.unmount() })
</script>

<template>
    <aside class="toc-sidebar">
        <div v-if="headings.length" class="toc-box">
            <div class="toc-head">
                <span>目录</span>
                <span class="toc-count">{{ headings.length }}</span>
            </div>
            <div class="toc-list">
                <p
                    v-for="h in headings"
                    :key="h.id"
                    class="toc-item"
                    :class="{ 'toc-item-on': active === h.id }"
                    :style="{ paddingLeft: (6 + (h.level - 1) * 12) + 'px' }"
                    @click="jump(h.id)"
                >{{ h.text }}</p>
            </div>
        </div>
    </aside>
</template>

<style scoped>
/* 常驻侧栏：sticky 吸在 .main-body 顶部，正文滚动时目录固定在右侧可视区 */
.toc-sidebar {
    position: sticky;
    top: 0;
    align-self: flex-start;
    flex-shrink: 0;
    width: 220px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    margin-top: var(--space-sm);
}

.toc-box {
    border-left: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
}

.toc-head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 6px var(--space-sm);
    font-size: 13px;
    font-weight: 600;
    color: var(--g-text);
}

.toc-count {
    font-size: 11px;
    font-weight: 500;
    padding: 0 6px;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--g-color) 12%, transparent);
    color: var(--g-text);
    opacity: 0.7;
}

.toc-list {
    display: flex;
    flex-direction: column;
    padding: 0 var(--space-xs);
}

.toc-item {
    margin: 1px 0;
    padding: 4px var(--space-sm);
    font-size: 13px;
    line-height: 1.5;
    color: var(--g-text);
    border-left: 2px solid transparent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
}

.toc-item:hover {
    color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 8%, transparent);
}

/* 当前章节：左侧色条 + 高亮 */
.toc-item-on,
.toc-item-on:hover {
    color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 10%, transparent);
    border-left-color: var(--g-color);
    font-weight: 600;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
    .toc-sidebar {
        width: 200px;
    }
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
    .toc-sidebar {
        width: 180px;
    }
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机：关闭常驻侧栏，目录交给正文顶部的 MobileToc 工具条 */
    .toc-sidebar {
        display: none;
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>