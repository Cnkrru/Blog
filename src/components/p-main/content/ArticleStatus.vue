<script setup>
import FileText from '@/components/icon/FileText.vue';
import Clock from '@/components/icon/Clock.vue';
import { useRoute } from 'vue-router';
import { content } from '@/modules/content';
import { ref,computed, onMounted } from 'vue';
const route = useRoute()
const post_key = computed(() => String(route.params.id) )

const word = ref('')
const time = ref('')

onMounted(async () => {
    const {_word,_time} = await content.frontmatter_parser().article_status_maker(post_key.value)
    word.value = _word;
    time.value = _time;
})
</script>

<template>
    <div class="status-area">
        <!-- 字数统计区域 -->
        <div class="word-count">
            <FileText class="file-icon"/>
            <div class="word-info">
                <span>{{ word }}</span>
                <span>总字数</span>
            </div>
        </div>
        <!-- 阅读时长区域 -->
        <div class="reading-time">
            <Clock class="clock-icon"/>
            <div class="reading-info">
                <span>{{ time }}分钟</span>
                <span>预计时间</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
/*=========== 统计卡片外壳：毛玻璃横条 ===========*/
.status-area {
    width: 100%;
    height: fit-content;

    display: flex;
    align-items: center;
    gap: var(--space-md);

    padding: var(--space-sm) var(--space-md);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 30%, transparent);
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--g-color) 20%, transparent);

    margin: var(--space-sm) 0;
    box-sizing: border-box;
}

/*=========== 字数 / 阅读时长：图标 + 文字行 ===========*/
.word-count,
.reading-time {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-shrink: 0;
}

.file-icon,
.clock-icon {
    width: 32px;
    height: 32px;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 8px;
    color: var(--g-color);
    background: color-mix(in srgb, var(--g-color) 12%, transparent);
}

/*=========== 文字两行：数值 + 标签 ===========*/
.word-info,
.reading-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.word-info span,
.reading-info span {
    line-height: 1;
}

.word-info span:first-child,
.reading-info span:first-child {
    font-size: 14px;
    font-weight: 700;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    color: var(--g-color);
}

.word-info span:last-child,
.reading-info span:last-child {
    font-size: 11px;
    color: var(--g-text);
    opacity: 0.45;
}

/*=========== 阅读时长靠右，形成左右对称 ===========*/
.reading-time {
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
    /* 收窄横条内边距与间距、缩小图标，两块信息保持并排紧凑 */
    .status-area {
        gap: var(--space-sm);
        padding: var(--space-sm);
    }
    .file-icon,
    .clock-icon {
        width: 28px;
        height: 28px;
        padding: 7px;
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    /* 进一步收紧间距与数值字号，避免窄屏拥挤 */
    .status-area {
        gap: var(--space-xs);
        padding: var(--space-xs) var(--space-sm);
    }
    .word-info span:first-child,
    .reading-info span:first-child {
        font-size: 13px;
    }
    .word-info span:last-child,
    .reading-info span:last-child {
        font-size: 10px;
    }
}

</style>