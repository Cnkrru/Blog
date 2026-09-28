<script setup>
/*
* ====================<文章目录·移动端工具条>====================
* —— 桌面躺在 PostToc 常驻侧栏，移动端(≤768)用本组件：正文顶部"目录"胶囊按钮 + 下拉浮层
* —— 直接用组件挂在 .post-main 顶部，不走 Teleport（规避 Vue3.5 Teleport 在 async 正文下不注入的坑）
* 数据：与桌面栏共用 toc 单例（pmain/post.js），一份扫描/高亮/跳转
* 挂载：Post.vue .post-main 顶部；桌面默认 display:none，仅 ≤768 显示
*/
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { toc } from '@/composables/pmain/post.js'

// 顶层解包：模板只对顶层 ref 自动解包，嵌套在对象里的 ref(toc.headings) 不会，需先提到顶层
const headings = toc.headings
const active = toc.active
const jump = toc.jump

const isOpen = ref(false)

const jumpAndClose = (id) => {
    jump(id)
    isOpen.value = false
}

onMounted(() => { toc.mount() })
onBeforeUnmount(() => { toc.unmount() })
</script>

<template>
    <div v-if="headings.length" class="mobile-toc">
        <button class="mobile-toc-btn" @click="isOpen = !isOpen" aria-label="目录">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="5" cy="6" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="5" cy="18" r="1"/></svg>
        </button>
    </div>

    <Transition name="toc-fade">
        <div v-if="isOpen" class="toc-mask" @click.self="isOpen = false">
            <div class="toc-panel">
                <div class="toc-panel-head">
                    <span>目录</span>
                </div>
                <div class="toc-panel-list">
                    <p
                        v-for="h in headings"
                        :key="h.id"
                        class="toc-panel-item"
                        :class="{ 'toc-item-on': active === h.id }"
                        :style="{ paddingLeft: (6 + (h.level - 1) * 12) + 'px' }"
                        @click="jumpAndClose(h.id)"
                    >{{ h.text }}</p>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
/* 桌面默认隐藏，仅 ≤768 显示 */
.mobile-toc,
.toc-mask {
    display: none;
}

/* 浮层淡入淡出 */
.toc-fade-enter-active,
.toc-fade-leave-active {
    transition: opacity 0.25s ease;
}
.toc-fade-enter-from,
.toc-fade-leave-to {
    opacity: 0;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机：右下角悬浮圆钮（与返回顶部按钮同款，错开叠在其上方），点开居中弹窗 */
    .mobile-toc {
        position: fixed;
        right: 40px;
        bottom: 96px;               /* 叠在返回顶部按钮(40+40+16)正上方，成列不重叠 */
        z-index: 999;

        display: flex;
    }
    .mobile-toc-btn {
        width: 40px;
        height: 40px;

        display: flex;
        justify-content: center;
        align-items: center;

        color: white;

        border-radius: var(--radius-full);
        border: var(--border-width) solid var(--g-color);
        background-color: var(--g-color);
        cursor: pointer;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 30%, transparent);
        transition:
            transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.2s ease;
    }
    .mobile-toc-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 14px color-mix(in srgb, var(--g-color) 40%, transparent);
    }

    /* 弹窗：全屏遮罩 + 居中面板 */
    .toc-mask {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--space-md);

        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.45);
    }
    .toc-panel {
        width: min(420px, 100%);
        max-height: 70vh;
        overflow-y: auto;

        padding: var(--space-md);
        border-radius: var(--radius-md);
        border: var(--border-width) solid color-mix(in srgb, var(--g-color) 20%, transparent);
        background: var(--g-bg);
    }
    .toc-panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--space-sm);
        font-size: 14px;
        font-weight: 600;
        color: var(--g-text);
    }
    .toc-panel-list {
        display: flex;
        flex-direction: column;
    }
    .toc-panel-item {
        margin: 2px 0;
        padding: 8px var(--space-sm);
        font-size: 13px;
        line-height: 1.5;
        color: var(--g-text);
        border-left: 2px solid transparent;
        border-radius: var(--radius-sm);

        cursor: pointer;
        transition: color 0.15s ease, background 0.15s ease;
    }
    .toc-panel-item:hover {
        color: var(--g-color);
        background: color-mix(in srgb, var(--g-color) 8%, transparent);
    }
    .toc-panel-item.toc-item-on,
    .toc-panel-item.toc-item-on:hover {
        color: var(--g-color);
        background: color-mix(in srgb, var(--g-color) 10%, transparent);
        border-left-color: var(--g-color);
        font-weight: 600;
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>