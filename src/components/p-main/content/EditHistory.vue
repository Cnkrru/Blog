<script setup>
import Calendar from '@/components/icon/Calendar.vue';
import RefreshCw from '@/components/icon/RefreshCw.vue';

import { content } from '@/modules/content';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
// 用vue-router拿文章key
const route = useRoute()
const post_key = computed(() => String(route.params.id) )
// 给上下篇标题准备的响应式数据
const date = ref('')
const update = ref('')

onMounted(async () => {
    // 用 nav 接返回值再挂载，避免解构出的 pre_post 等与外层 ref 同名遮蔽
    const edit = await content.frontmatter_parser().edit_history_maker(post_key.value)
    date.value = edit?._date ?? null
    update.value = edit?._update ?? ''
})
</script>

<template>
    <div class="edit-area">
        <!-- 发布时间 -->
        <div class="publish-time">
            <Calendar class="calendar-icon"/>
            <div class="pulish-info">
                <span>发布</span>
                <span>{{ date }}</span>
            </div>
        </div>
        <!-- 更新时间 -->
        <div class="update-time">
            <RefreshCw class="refresh-icon"/>
            <div class="update-info">
                <span>更新于</span>
                <span>{{ update }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.edit-area {
    width: 100%;
    height: fit-content;

    display: flex;
    align-items: center;
    gap: var(--space-md);

    padding: var(--space-sm) var(--space-md);
    border: 1px solid color-mix(in srgb, var(--g-color) 30%, transparent);
    border-radius: var(--radius-md);
    margin: var(--space-sm) 0;
    box-sizing: border-box;

    background: color-mix(in srgb, var(--g-color) 20%, transparent);
    color: var(--g-text);
}

.publish-time, .update-time {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-shrink: 0;
}

.calendar-icon {
    width: 32px;
    height: 32px;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 8px;
    color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 12%, transparent);
}

.refresh-icon {
    width: 32px;
    height: 32px;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 8px;
    color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 8%, transparent);
}

.pulish-info, .update-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.pulish-info span:first-child, .update-info span:first-child {
    font-size: 11px;
    opacity: 0.5;
    line-height: 1;
}

.pulish-info span:last-child, .update-info span:last-child {
    font-size: 13px;
    font-weight: 600;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    color: var(--g-color);    /* [AI对齐] 日期数值改主色，对齐 status 统计数值配色 */
    line-height: 1;
}

.update-time {
    margin-left: auto;
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