<script setup>
// [AI实现] 列表页：前端取全表 → 交post管线（computer算总页数 + updater切片渲染），列表/页码/总页数直接用store响应式ref
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import ArticleCover from '@/components/p-main/content/ArticleCover.vue'
import { data } from '@/modules/data.js'
import { page } from '@/modules/page.js'

const maker = page.post_factory()   // [接入手写工厂] 文章大工厂
const post = maker.post_line()            // post管线

const load = async () => {
    const table = await data.post_raw_getter()   // 前端转运：先取全表
    maker.cleaner(table)                        // 清洗入缓存
    post.computer()                              // [新接口] 算总页数 → store.post_page_num(ref)
    post.updater(init_page())                    // [AI实现] 从 URL ?page= 读初始页渲染，无/非法回退第 1 页
}

// [AI实现] 从 URL 读页码：?page= 缺失或越界一律回退 1（首页即默认页）
const init_page = () => {
    const p = Number(new URLSearchParams(location.search).get('page'))
    if (p >= 1 && p <= page.post_page_num) return p
    return 1
}

const change_page = (p) => {
    post.updater(p)                              // [新接口] 切片+设置页码，一步到位
    sync_url(p)                                  // [AI实现] 页码写回 URL，刷新/分享可直达
}

// [AI实现] URL 同步：replaceState 只改地址不触发刷新；第 1 页不挂 ?page=（首页即第 1 页）
const sync_url = (p) => {
    const url = new URL(location.href)
    if (p === 1) {
        url.searchParams.delete('page')
    }
    else {
        url.searchParams.set('page', String(p))
    }
    history.replaceState(null, '', url)
}

onMounted(load)
</script>

<template>
    <div class="post-list">
        <!-- 列表div [AI实现] -->
        <div class="list-area">
            <!-- 卡片网格 [AI实现] -->
            <div class="card-grid">
                <RouterLink
                    v-for="item in page.post_list"
                    :key="item.key"
                    class="post-card"
                    :to="`/post/${item.key}`"
                >
                    <ArticleCover :article="item" />
                </RouterLink>
            </div>
        </div>
        <!-- 分页div [AI编写] 嵌套：上=切页组件(上一页/页码/下一页)，下=共N页 -->
        <div class="btn-area">
            <div class="pager-nav">
                <button class="page-side" :disabled="page.post_now_page === 1" @click="change_page(page.post_now_page - 1)">上一页</button>
                <button
                    v-for="p in page.post_page_list"
                    :key="p"
                    class="page-num"
                    :class="{ 'page-on': p === page.post_now_page }"
                    :disabled="typeof p === 'string'"      
                    @click="change_page(p)"
                >{{ p }}</button>
                <button class="page-side" :disabled="page.post_now_page === page.post_page_num" @click="change_page(page.post_now_page + 1)">下一页</button>
            </div>
            <div class="pager-info">共 {{ page.post_page_num }} 页</div>
        </div>
    </div>
</template>

<style scoped>
.post-list {
    display: flex;
    flex-direction: column;
    height: 100%; /* [AI实现] 页面根吃满main-body可视高度，list-area才有固定高度可撑 */
    margin-top: var(--space-lg); /* [AI编写] 仅顶部外边距，列表与页头拉开间距 */
}

/* [AI实现] 列表div：高度固定，撑满剩余空间，内容超出布局自然换页（不滚动） */
.post-list .list-area {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

/* [AI编写] 分页容器div：外容器竖直列，上=切页组件，下=共N页 */
.post-list .btn-area {
    flex-shrink: 0;
    width: 90%;
    max-width: 90%;
    margin: var(--space-lg) auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-xs);
}

/* [AI编写] 切页组件div：横向排列页码按钮，页多时不溢出可横滚 */
.post-list .pager-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    max-width: 100%;
    overflow-x: auto;
    padding: var(--space-xs);
}

/* [AI实现] 上一页/下一页 [AI实现] */
.page-side {
    flex-shrink: 0;
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

/* [AI实现] 数字页码 */
.page-num {
    min-width: 36px;
    height: 36px;
    padding: 0 var(--space-sm);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--radius-full);
    background-color: transparent;
    color: var(--g-text);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.page-num:hover:not(:disabled) {
    border-color: var(--g-color);
    color: var(--g-color);
}

/* [AI编写] 省略号占位项：不显示边框点击态，只做分隔 */
.page-num:disabled {
    border-color: transparent;
    background: transparent;
    cursor: default;
}

.page-num.page-on {
    background-color: var(--g-color);
    border-color: var(--g-color);
    color: #fff;
}

/* [AI编写] 共N页提示 */
.pager-info {
    font-size: 13px;
    color: var(--g-text);
    opacity: 0.6;
}

/* [AI编写] 卡片网格：gap/弹性对齐blog-map Home.vue（16px，flex:1 1 拉伸填满行） */
.card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.card-grid > * {
    flex: 1 1 calc(33.333% - 11px); /* [AI编写] gap=16px×2÷3≈11px/卡 */
    min-width: 260px;
    max-width: calc((100% - 32px) / 3); /* [AI编写] 单卡上限=三列时一张普通卡宽，卡片不足/仅一张时不撑满整行 */
}

/* [AI编写] 玻璃拟态卡片：描边+毛玻璃+双层阴影对齐blog-map Home.vue */
.post-card {
    display: flex;
    flex-direction: column;
    border: 1px solid color-mix(in srgb, var(--g-color) 12%, transparent);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04);
    border-radius: var(--space-lg);
    overflow: hidden;
    text-decoration: none;
    transition:
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.3s ease;
}

.post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06), 0 8px 20px rgba(0, 0, 0, 0.10), 0 0 0 1px color-mix(in srgb, var(--g-color) 30%, transparent);
    border-color: color-mix(in srgb, var(--g-color) 40%, transparent);
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
