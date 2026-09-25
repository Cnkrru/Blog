<script setup>
/*
* ====================<相关文章推荐组件>====================
* —— AI 编写 2026-09 ——
* 本质：一组 a 标签，展示构建期 MiniSearch 算好的相关文章
* 数据流：构建期算好 related 数组写入 post.json → related_post_maker 只读 → 本组件按 id 查标题渲染
*/
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { content } from '@/modules/content'
import { data } from '@/modules/data'

const route = useRoute()
const current_id = computed(() => String(route.params.id))
const related_list = ref([])

const { post_data_getter } = data   // [AI修改] 单篇getter：按key拆解析字段

onMounted(async () => {
    // 用 nav 接返回值再取字段，避免解构变量与外层 ref 同名遮蔽
    const nav = await content.frontmatter_parser().related_post_maker(current_id.value)
    const ids = nav?._related ?? []

    // 按 id 逐个查标题和日期，组装成模板需要的结构
    related_list.value = await Promise.all(ids.map(async (id) => {
        const meta = await post_data_getter(id)
        return { id, title: meta?.post_title ?? id, date: meta?.post_date ?? '' }
    }))
})
</script>

<template>
    <div v-if="related_list.length" class="related">
        <p class="related-head">相关文章</p>
        <div class="related-list">
            <a v-for="post in related_list" :key="post.id" class="related-item" :href="`/post/${post.id}`">
                <span class="related-title">{{ post.title }}</span>
                <span class="related-date">{{ post.date }}</span>
            </a>
        </div>
    </div>
</template>

<style scoped>
.related {
    width: 100%;
    height: fit-content;

    display: flex;
    flex-direction: column;

    padding: var(--space-sm) var(--space-md);
    /* [AI对齐] 边框统一主色 25%，全站视觉一致 */
    border: 1px solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--radius-md);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);

    margin: var(--space-sm) 0;
    box-sizing: border-box;
}

.related-head {
    margin: 0;
    padding-bottom: var(--space-sm);
    /* [AI对齐] 分隔线统一主色 25%，全站视觉一致 */
    border-bottom: 1px solid color-mix(in srgb, var(--g-color) 25%, transparent);

    font-size: 13px;
    font-weight: 600;
    color: var(--g-color);
}

.related-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);

    padding-top: var(--space-sm);
}

.related-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-sm);

    padding: var(--space-xs) var(--space-sm);
    border: 1px solid transparent;
    border-radius: var(--radius-md);

    text-decoration: none;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.related-item:hover {
    border-color: color-mix(in srgb, var(--g-color) 30%, transparent);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
}

.related-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--g-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.related-date {
    flex-shrink: 0;
    font-size: 12px;
    color: color-mix(in srgb, var(--g-text) 45%, transparent);
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
