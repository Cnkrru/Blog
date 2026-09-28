<script setup>
// [AI迁移] 去壳：原 page().link() 工厂（computer/render 双层）已提升为模块顶层导出
// 数据层 data/clean 平铺导出：data 拉取/缓存 links.json，clean 分桶写 link_page_* 响应式ref
// UI层 render(page)：切页，同步当前桶 link_page_items → 组件直接读模块级 ref
import { onMounted, ref, computed } from 'vue'
import { data, clean, render, link_page_names, link_now_page, link_page_items, link_page_num } from '@/composables/pmain/link.js'

const load = async () => {
    const raw = await data()
    clean(raw)         // 分桶 → 写模块级 link_page_* 响应式ref
}

const change_page = (p) => {
    render(p)             // 切页 → 更新 link_now_page 并同步 link_page_items
    close_dropdown()      // [AI编写] 切页后收起分类下拉
}

// [AI编写] 窗口页码（跟随blog-map PageNav）：当前分类上下各2，凑满最多5个，分类多时不铺满一长串
const display_pages = computed(() => {
    const pages = []
    let start = Math.max(1, link_now_page.value - 2)
    let end = Math.min(link_page_num.value, start + 4)
    if (end - start < 4) {
        start = Math.max(1, end - 4)
    }
    for (let p = start; p <= end; p++) pages.push(p)
    return pages
})

// [AI编写] 页码label：分类存在显示分类名，兜底"第N页"
const page_label = (p) => link_page_names.value[p - 1] || '第 ' + p + ' 页'

// [AI编写] 分类快速跳转下拉（跟随blog-map：分类多时用下拉补全）
const dropdown_open = ref(false)
const toggle_dropdown = () => { dropdown_open.value = !dropdown_open.value }
const close_dropdown = () => { dropdown_open.value = false }

onMounted(load)
</script>

<template>
    <div class="link-list">
        <!-- 列表div [AI实现]：高度固定，超出滚动 -->
        <div class="list-area">
            <!-- 当前分类的链接 [AI实现] -->
            <div class="link-grid">
                <a
                    v-for="link in link_page_items.links"
                    :key="link.id"
                    class="link-card"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div class="link-name">{{ link.name }}</div>
                    <div class="link-des">{{ link.description }}</div>
                </a>
            </div>
        </div>
        <!-- 分页div [AI编写] 嵌套：上=切页组件(窗口页码+分类下拉)，下=第N/total页·当前分类 -->
        <div class="btn-area" @click="close_dropdown">
            <div class="pager-nav">
                <button class="page-side" :disabled="link_now_page === 1" @click="change_page(link_now_page - 1)">上一页</button>
                <button
                    v-for="p in display_pages"
                    :key="p"
                    class="page-num"
                    :class="{ 'page-on': p === link_now_page }"
                    @click="change_page(p)"
                >{{ page_label(p) }}</button>
                <button class="page-side" :disabled="link_now_page === link_page_num" @click="change_page(link_now_page + 1)">下一页</button>
                <div class="category-wrap">
                    <button class="page-side category-btn" @click.stop="toggle_dropdown">分类 ▾</button>
                    <div class="dropdown-card" v-if="dropdown_open" @click.stop>
                        <button
                            v-for="(name, i) in link_page_names"
                            :key="name"
                            class="dropdown-item"
                            :class="{ 'dropdown-on': i + 1 === link_now_page }"
                            @click="change_page(i + 1)"
                        >{{ name }}</button>
                    </div>
                </div>
            </div>
            <div class="pager-info">第 {{ link_now_page }} / {{ link_page_num }} 页 · 当前分类：{{ link_page_names[link_now_page - 1] }}</div>
        </div>
    </div>
</template>

<style scoped>
.link-list {
    display: flex;
    flex-direction: column;
    height: 100%; /* [AI实现] 页面根吃满main-body可视高度，list-area才有固定高度可滚 */
}

/* [AI实现] 列表div：高度固定撑满剩余空间，一桶链接过多时自身滚动（不撑破页面） */
.list-area {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

/* [AI编写] 分页容器div：外容器竖直列 + 相对定位（供分类下拉绝对悬浮） */
.btn-area {
    position: relative;
    flex-shrink: 0;
    margin-top: var(--space-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-xs);
}

/* [AI编写] 切页组件div：上一页/窗口页码/下一页/分类按钮横向排列 */
.pager-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
}

/* [AI编写] 第N/total页·当前分类 提示 */
.pager-info {
    font-size: 13px;
    color: var(--g-text);
    opacity: 0.6;
}

/* [AI修复] 分类按钮锚点：相对定位，让下拉面板以其(按钮)为基准悬浮，右对齐按钮 */
.category-wrap {
    position: relative;
}

/* [AI编写] 分类下拉：悬浮分类按钮上方(相对category-wrap)，右对齐按钮，出现动画淡入+上移，点外部关闭 */
.dropdown-card {
    position: absolute;
    bottom: calc(100% + 8px);
    right: 0;
    min-width: 200px;
    max-height: 320px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    z-index: 100;
    border-radius: var(--radius-lg);
    background-color: var(--glass-r);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(16px);
    animation: dropdown-in 0.2s ease; /* [AI编写] 挂载时播放一次 */
}

@keyframes dropdown-in {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-item {
    padding: var(--space-sm) var(--space-md);
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    font-size: 14px;
    color: var(--g-text);
    transition: background-color 0.2s ease; /* [AI编写] hover背景平滑过渡 */
}

.dropdown-item:hover {
    background-color: color-mix(in srgb, var(--g-color) 10%, transparent);
}

.dropdown-item.dropdown-on {
    background-color: var(--g-color);
    color: #fff;
}

/* [AI实现] 上一页/下一页 */
.page-side {
    padding: var(--space-sm) var(--space-lg);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--radius-full);
    background-color: transparent;
    color: var(--g-text);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.page-side:hover:not(:disabled) {
    border-color: var(--g-color);
    color: var(--g-color);
}

.page-side:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* [AI实现] 分类名页码 */
.page-num {
    min-width: 36px;
    height: 36px;
    padding: 0 var(--space-md);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--radius-full);
    background-color: transparent;
    color: var(--g-text);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.page-num:hover {
    border-color: var(--g-color);
    color: var(--g-color);
}

.page-num.page-on {
    background-color: var(--g-color);
    border-color: var(--g-color);
    color: #fff;
}

.link-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
}

.link-grid > * {
    flex: 1 1 calc(50% - 8px); /* 一行两个 */
    min-width: 260px;
    max-width: calc((100% - var(--space-md)) / 2); /* [AI编写] 单卡上限=两列时一张卡片宽，卡片不足/仅一张时不撑满整行 */
}

.link-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 110px;
    padding: var(--space-md);

    border-radius: var(--space-lg);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    background-color: color-mix(in srgb, var(--glass-r), transparent);

    text-decoration: none;
    /* [AI编写] 对齐项目卡片规格：弹性浮起曲线 + 阴影/描边过渡 */
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.3s ease,
        border-color 0.3s ease;
}

.link-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06), 0 8px 20px rgba(0, 0, 0, 0.10), 0 0 0 1px color-mix(in srgb, var(--g-color) 30%, transparent);
    border-color: color-mix(in srgb, var(--g-color) 40%, transparent);
}

.link-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--g-text);
}

.link-des {
    font-size: 13px;
    opacity: 0.7;
    color: var(--g-text);
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏：仍两列，降低卡片最小宽，避免视口略窄时提前换列 */
    .link-grid > * {
        min-width: 240px;
    }
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板：保持两列 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机：保持两列，分页条收紧间距与内边距 */
    .pager-nav {
        gap: var(--space-xs);
    }
    .page-side {
        padding: var(--space-xs) var(--space-md);
        font-size: 13px;
    }
    .page-num {
        min-width: 32px;
        height: 32px;
        padding: 0 var(--space-sm);
        font-size: 13px;
    }
    .dropdown-card {
        min-width: 160px;
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏：单列全宽卡片（避免两列max-width把单列卡宽锁死在半行），分页条进一步收紧 */
    .link-grid > * {
        flex: 1 1 100%;
        min-width: 0;
        max-width: 100%;
    }
    .pager-nav {
        gap: 6px;
    }
    .page-side {
        padding: var(--space-xs) var(--space-sm);
        font-size: 12px;
    }
    .page-num {
        min-width: 28px;
        height: 28px;
        padding: 0 var(--space-xs);
        font-size: 12px;
    }
}

</style>
