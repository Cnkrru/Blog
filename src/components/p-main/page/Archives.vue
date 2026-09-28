<script setup>
// [AI实现] 归档页：前端取全表 → post().clean 清洗 → 交 category 管线 render(写响应式) → 三视图切换 + 组展开收起
import { ref, onMounted, watch, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { post } from '@/composables/pmain/post.js'
import { category } from '@/composables/pmain/category.js'

// [AI迁移] 去内层 computer/render 壳：保留 category(posts) 工厂（每页专属实例），方法平铺解构
const posts = []   // 共用清洗数组：管线闭包持有同一引用，load里就地填充
const { viewTurner, groupTurner, category_mode_groups, category_expand_group } = category(posts)

// [AI实现] 局部镜像当前视图，仅用于tab高亮（viewTurner已不返回view_mode，改由本地维护）
const view_mode = ref(0)                   // 0分类 | 1年份 | 2月份

// [AI编写] 滑块指示器：blog-map 方案，JS按active tab的left/width定位，贴合tab全宽
const tabs_ref = ref(null)
const indicator_left = ref(0)
const indicator_width = ref(0)
const update_indicator = () => {
    nextTick(() => {
        const tabs = tabs_ref.value
        const active = tabs && tabs.querySelector('.view-tab.tab-on')
        if (!active) return
        indicator_left.value = active.getBoundingClientRect().left - tabs.getBoundingClientRect().left
        indicator_width.value = active.getBoundingClientRect().width
    })
}
watch(view_mode, update_indicator)

const load = async () => {
    const cleaned = post().clean(await post().data())    // 清洗返回文章数组
    posts.splice(0, posts.length, ...cleaned)   // 就地填充，保持管线引用
    viewTurner(0)                            // 默认分类视图 → 写 category_mode_groups
}

const change_view = (mode) => {
    view_mode.value = mode
    viewTurner(mode)                         // 0/1/2 切视图
}

const toggle_group = (name) => {
    groupTurner(name)                        // 组展开/收起 → 写 category_expand_group
}

const is_expanded = (name) => category_expand_group.value === name

onMounted(() => {
    load()
    update_indicator() // [AI编写] 初始定位第一个tab的滑块
})
</script>

<template>
    <div class="archive-list">
        <!-- 工具栏：视图切换 [AI实现] -->
        <div class="tool-area">
            <div class="view-tabs" ref="tabs_ref">
                <!-- [AI编写] 滑块指示器：独立子元素，left/width由JS按active tab定位，贴合tab全宽 -->
                <div class="tabs-indicator" :style="{ left: indicator_left + 'px', width: indicator_width + 'px' }"></div>
                <button class="view-tab" :class="{ 'tab-on': view_mode === 0 }" @click="change_view(0)">分类</button>
                <button class="view-tab" :class="{ 'tab-on': view_mode === 1 }" @click="change_view(1)">年份</button>
                <button class="view-tab" :class="{ 'tab-on': view_mode === 2 }" @click="change_view(2)">月份</button>
            </div>
        </div>

        <!-- 列表div [AI实现]：高度固定，超出滚动 -->
        <div class="list-area">
            <div v-for="g in category_mode_groups" :key="g.name" class="arch-group">
                <a href="#" class="group-header" :class="{ 'header-on': is_expanded(g.name) }" @click.prevent="toggle_group(g.name)">
                    <span class="group-name">{{ g.name }}</span>
                    <span class="group-count">{{ g.items.length }} 篇</span>
                    <span class="group-arrow" :class="{ 'arrow-open': is_expanded(g.name) }">▾</span>
                </a>

                <!-- [AI编写] v-show改为class.open：配合grid-template-rows实现平滑展开动画 -->
                <div class="group-body" :class="{ 'open': is_expanded(g.name) }">
                    <div class="group-list">
                        <RouterLink
                            v-for="a in g.items"
                            :key="a.key"
                            class="group-item"
                            :to="`/post/${a.key}`"
                        >
                            <span class="item-title">{{ a.title }}</span>
                            <span class="item-tags" v-if="a.tags && a.tags.length">
                                <span v-for="t in a.tags.slice(0, 2)" :key="t" class="item-tag">{{ t }}</span>
                            </span>
                            <span class="item-date">{{ a.date }}</span>
                        </RouterLink>
                    </div>
                </div>
            </div>

            <div v-if="!category_mode_groups.length" class="arch-empty">暂无文章</div>
        </div>
    </div>
</template>

<style scoped>
.archive-list {
    display: flex;
    flex-direction: column;
    height: 100%; /* [AI实现] 吃满main-body可视高度 */
}

/* 工具栏 [AI实现]：仅剩view-tabs一个子元素，flex定位属性冗余已删 */
.tool-area {
    flex-shrink: 0; /* 防list-area挤压工具栏 */
    margin-bottom: var(--space-lg);
}

/* [AI编写] tabs容器玻璃底+紧凑gap对齐blog-map；position:relative作indicator定位基准 */
.view-tabs {
    width: fit-content; /* [AI修复] 外层容器贴合内容宽，不撑满整行（blog-map同款） */
    display: flex;
    gap: 4px;
    padding: 3px;
    border-radius: var(--radius-full);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    background-color: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5); /* [AI修复] 原color-mix吃数字变量是无效CSS，玻璃底色从未显示 */
    position: relative;
}

/* [AI编写] 滑块指示器：blog-map方案，独立子元素，left/width由JS贴合active tab，left+width双过渡 */
.tabs-indicator {
    position: absolute;
    top: 3px;
    height: calc(100% - 6px);
    border-radius: var(--radius-full);
    background-color: var(--g-color);
    transition:
        left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
        width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
    z-index: 0;
}

.view-tab {
    padding: 4px 16px; /* [AI修复] 移除flex:1/text-align:center：blog-map的tab按内容自适应宽，滑块宽度由JS取实际clientWidth */
    border-radius: var(--radius-full);
    border: none;
    background-color: transparent;
    color: var(--g-text);
    cursor: pointer;
    font-size: 13px; /* [AI编写] 对齐blog-map 13px */
    transition: color 0.25s ease;
    position: relative;
    z-index: 1;
}

/* [AI编写] 选中态：背景由指示器提供，tab只变反色文字，对齐blog-map */
.view-tab.tab-on {
    color: #fff;
}

/* 列表div [AI实现]：固定高度自身滚动 */
.list-area {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

/* [AI编写] 卡片hover浮起+阴影加深，动画曲线/阴影规格对齐PostList卡片 */
.arch-group {
    margin-bottom: var(--space-md);
    border-radius: var(--space-lg);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    background-color: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
    overflow: hidden;
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.3s ease;
}

.arch-group:hover {
    transform: translateY(-4px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06), 0 8px 20px rgba(0, 0, 0, 0.10), 0 0 0 1px color-mix(in srgb, var(--g-color) 30%, transparent);
}

.group-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s ease; /* [AI编写] 对齐blog-map 0.2s */
}

.group-header:hover,
.group-header.header-on {
    background-color: color-mix(in srgb, var(--g-color) 8%, transparent);
}

.group-name {
    font-size: 15px; /* [AI编写] 对齐blog-map 15px */
    font-weight: 600;
    color: var(--g-text);
}

/* [AI编写] 计数淡灰+margin-right:auto推箭头到最右，对齐blog-map */
.group-count {
    font-size: 13px;
    color: var(--g-text);
    opacity: 0.45;
    margin-right: auto;
}

/* [AI编写] 箭头透明度对齐blog-map，旋转用项目弹性曲线（PostList卡片同款） */
.group-arrow {
    font-size: 12px;
    color: var(--g-text);
    opacity: 0.4;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.group-arrow.arrow-open {
    transform: rotate(180deg);
}

/* 组内文章行 [AI实现] */
/* [AI编写] 展开动画grid 0fr→1fr对齐blog-map；.group-list的min-height:0是轨道压缩前提 */
.group-body {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    border-top: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
}

.group-body.open {
    grid-template-rows: 1fr;
}

/* [AI编写] 内容包裹层：overflow裁剪0fr轨道内容，min-height:0允许轨道压缩（动画前提） */
.group-list {
    overflow: hidden;
    min-height: 0;
}

.group-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-sm) var(--space-lg) var(--space-sm) 20px;
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--g-color) 30%, transparent);
    /* [AI编写] bg 0.15s + padding-left 0.2s 对齐blog-map，配合hover微左移 */
    transition: background-color 0.15s ease, padding-left 0.2s ease;
}

.group-item:hover {
    background-color: color-mix(in srgb, var(--g-color) 8%, transparent);
    padding-left: 24px;
}

.group-item:last-child {
    border-bottom: none;
}

.item-title {
    flex: 1;
    min-width: 0; /* [AI修复] 缺此行长标题不收缩（flex默认min-width:auto），省略号失效并挤压tags/date，对齐blog-map */
    font-size: 14px;
    font-weight: 500; /* [AI编写] 对齐blog-map */
    color: var(--g-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-tags {
    display: flex;
    gap: var(--space-xs);
    flex-shrink: 0; /* [AI编写] 防长标题压缩标签，对齐blog-map */
}

/* [AI编写] 标签浅底无描边+更低透明，对齐blog-map */
.item-tag {
    padding: 1px 7px;
    font-size: 11px;
    border-radius: var(--radius-full);
    background-color: color-mix(in srgb, var(--g-color) 15%, transparent);
    color: var(--g-text);
    opacity: 0.7;
}

/* [AI编写] 日期透明0.4+禁止换行压缩，对齐blog-map */
.item-date {
    font-size: 12px;
    opacity: 0.4;
    color: var(--g-text);
    white-space: nowrap;
    flex-shrink: 0;
}

.arch-empty {
    padding: var(--space-xl);
    text-align: center;
    color: var(--g-text);
    opacity: 0.5; /* [AI编写] 对齐blog-map 0.5 */
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
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>
