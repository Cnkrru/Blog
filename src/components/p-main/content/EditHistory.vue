<script setup>
import Calendar from '@/components/icon/Calendar.vue';
import RefreshCw from '@/components/icon/RefreshCw.vue';
import Clock from '@/components/icon/Clock.vue';

import { content } from '@/modules/content';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
// 用vue-router拿文章key
const route = useRoute()
const post_key = computed(() => String(route.params.id) )
// 给上下篇标题准备的响应式数据
const date = ref('')
const update = ref('')
// 更新记录原始数组(字符串)，来自 post.json 的 frontmatter.history
const history = ref([])

// [AI改造] 更新记录从编译期改到运行期渲染：条目 "2026-08-07 新增xxx" 按第一个空格拆日期与说明，
// 拆不出日期整串当说明（复用原编译脚本 history_html 的解析规则）
const history_items = computed(() => {
    return (history.value || [])
        .map((item) => {
            const text = String(item).trim()
            if(!text) return null
            const match = text.match(/^(\S+)\s+(.*)$/)
            if(!match) return { date: '', text }
            return { date: match[1], text: match[2] }
        })
        .filter(Boolean)
})

onMounted(async () => {
    // 用 nav 接返回值再挂载，避免解构出的 pre_post 等与外层 ref 同名遮蔽
    const edit = await content.frontmatter_parser().edit_history_maker(post_key.value)
    date.value = edit?._date ?? null
    update.value = edit?._update ?? ''
    history.value = edit?._history ?? []   // [AI改造] 更新记录运行期注入
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

    <!-- [AI改造] 更新记录改运行期：有 history 才渲染，编译期不再追加到正文末尾 -->
    <div v-if="history_items.length" class="history-area">
        <div class="history-head">
            <Clock class="history-icon"/>
            <span>更新记录</span>
            <span class="history-count">{{ history_items.length }}</span>
        </div>
        <ul class="history-list">
            <li v-for="(h, i) in history_items" :key="i" class="history-item">
                <time v-if="h.date">{{ h.date }}</time>
                <span>{{ h.text }}</span>
            </li>
        </ul>
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

/* [AI改造] 更新记录(运行期)：与日期条同款毛玻璃卡片，放在其下方 */
.history-area {
    margin: var(--space-sm) 0;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid color-mix(in srgb, var(--g-color) 30%, transparent);
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--g-color) 20%, transparent);
    color: var(--g-text);
    box-sizing: border-box;
}

.history-head {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: 13px;
    font-weight: 600;
    color: var(--g-color);
}

.history-icon {
    width: 28px;
    height: 28px;
    padding: 6px;
    box-sizing: border-box;
    border-radius: 8px;
    color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 10%, transparent);
}

.history-count {
    margin-left: auto;
    font-size: 11px;
    font-weight: 600;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    opacity: 0.6;
}

.history-list {
    margin: var(--space-sm) 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.history-item {
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    font-size: 13px;
    line-height: 1.6;
}

.history-item time {
    flex-shrink: 0;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    color: var(--g-color);
    opacity: 0.7;
}

.history-item span {
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
    /* 日期条内边距与图标收紧，保持发布/更新并排 */
    .edit-area {
        gap: var(--space-sm);
        padding: var(--space-sm);
    }
    .calendar-icon,
    .refresh-icon {
        width: 28px;
        height: 28px;
        padding: 7px;
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    /* 发布与更新时间纵向堆叠，更新记录条目日期与说明换行，避免窄屏挤压 */
    .edit-area {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-xs);
    }
    .publish-time,
    .update-time {
        width: 100%;
    }
    .update-time {
        margin-left: 0;
    }
    .history-item {
        flex-direction: column;
        gap: 2px;
    }
}

</style>