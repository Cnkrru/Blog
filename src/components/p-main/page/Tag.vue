<script setup>
// [AI实现] 标签页：前端取全表 → 交tag管线（computer收集标签集合 + updater筛选） → 标签云 + 选中标签文章列表
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { data } from '@/modules/data.js'
import { page } from '@/modules/page.js'

const maker = page.post_factory()   // [接入手写工厂] 文章大工厂
const tag = maker.tag_line()              // 标签管线

const load = async () => {
    const table = await data.post_raw_getter()
    maker.cleaner(table)                  // 清洗入缓存
    tag.computer()                         // [新接口] 收集所有标签 → store.tag_set
}

const select_tag = (t) => {
    tag.updater(t)                         // [新接口] 选中/取消 → 写store.tag_now_item + tag_posts_list
}

onMounted(load)
</script>

<template>
    <div class="tag-list">
        <!-- 标签云 [AI实现]：等级平等，统一字号，不做数量差异化 -->
        <div class="cloud-area">
            <button
                v-for="t in page.tag_set"
                :key="t"
                class="cloud-tag"
                :class="{ 'tag-on': t === page.tag_now_item }"
                @click="select_tag(t)"
            >{{ t }}</button>
        </div>

        <!-- 选中标签的文章列表 [AI实现] -->
        <div class="timeline-area" v-if="page.tag_now_item">
            <div class="tl-bar">
                <span class="tl-title">「{{ page.tag_now_item }}」下的文章</span>
            </div>

            <div class="tl-body">
                <RouterLink
                    v-for="a in page.tag_posts_list"
                    :key="a.key"
                    class="tl-item"
                    :to="`/post/${a.key}`"
                >
                    <span class="tl-dot"></span>
                    <span class="tl-item-title">{{ a.title }}</span>
                    <span class="tl-item-date">{{ a.date }}</span>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tag-list {
    display: flex;
    flex-direction: column;
    height: 100%; /* [AI实现] 吃满main-body可视高度 */
    overflow-y: auto;
}

/* 标签云 [AI实现] */
.cloud-area {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-md);
    padding-bottom: var(--space-lg);
    border-bottom: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
}

.cloud-tag {
    padding: 4px 14px;
    border-radius: var(--radius-full);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    background-color: transparent;
    color: var(--g-text);
    cursor: pointer;
    /* [AI编写] 对齐项目交互规格：浮起曲线 + 背景/描边过渡（改掉全量 all 减少无谓过渡） */
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}

.cloud-tag:hover {
    transform: translateY(-2px);
    border-color: var(--g-color);
    color: var(--g-color);
}

.cloud-tag.tag-on {
    background-color: var(--g-color);
    border-color: var(--g-color);
    color: #fff;
    transform: translateY(-2px); /* [AI编写] 选中态同步浮起，与hover一致 */
}

/* 选中标签文章列表 [AI实现] */
.timeline-area {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding-top: var(--space-lg);
}

.tl-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-md);
    flex-wrap: wrap;
}

.tl-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--g-color);
}

.tl-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.tl-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-xs) var(--space-md);
    text-decoration: none;
    border-radius: var(--space-sm);
    /* [AI编写] 对齐blog-map时间线：hover背景过渡 + 微左移补返弹曲线 */
    transition:
        background-color 0.2s ease,
        padding-left 0.2s ease,
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tl-item:hover {
    background-color: color-mix(in srgb, var(--g-color) 8%, transparent);
    transform: translateX(4px); /* [AI编写] 右滑微移增强反馈，点圆点伴随 */
}

.tl-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--radius-full);
    background-color: var(--g-color);
    flex-shrink: 0;
}

.tl-item-title {
    flex: 1;
    font-size: 14px;
    color: var(--g-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tl-item-date {
    font-size: 12px;
    opacity: 0.6;
    color: var(--g-text);
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
