<script setup> 
import { post } from '@/composables/pmain/post.js';   // [AI迁移] 原 @/composables/content
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
// 用vue-router拿文章key
const route = useRoute()
const post_key = computed(() => String(route.params.id) )
// 给上下篇标题准备的响应式数据
const pre_post = ref(null)
const next_post = ref(null)
const pre_title = ref('')
const next_title = ref('')

onMounted(async () => {
    // 用 nav 接返回值再挂载，避免解构出的 pre_post 等与外层 ref 同名遮蔽
    const nav = await post().postNav(post_key.value)   // [AI迁移] 改接 post.js（原 content.js maker）
    pre_post.value = nav?.pre_post ?? null
    pre_title.value = nav?.pre_title ?? ''
    next_post.value = nav?.next_post ?? null
    next_title.value = nav?.next_title ?? ''
})
</script>

<template>
    <div class="postnav-area">
        <!-- 上一篇的按钮 -->
        <a v-if="pre_post" :href="`/post/${pre_post}`" class="post-btn pre-post">
            <div class="post-label">上一篇</div>
            <div class="post-title">{{ pre_title }}</div>
        </a>
        <a v-else class="post-btn pre-post">
            <div class="post-label">上一篇</div>
            <div class="post-title">暂无</div>
        </a>

        <!-- 下一篇的按钮 -->
        <a v-if="next_post" :href="`/post/${next_post}`" class="post-btn next-post">
            <div class="post-label">下一篇</div>
            <div class="post-title">{{ next_title }}</div>
        </a>
        <a v-else class="post-btn next-post">
            <div class="post-label">下一篇</div>
            <div class="post-title">暂无</div>
        </a>
    </div>
</template>

<style scoped>
.postnav-area {
    width: 100%;
    height: fit-content;
    min-height: 100px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--space-md);
}

.post-btn {
    width: 50%;
    height: fit-content;

    padding: var(--space-md) var(--space-lg);
    /* [AI对齐] 边框 12% → 25%，提升可见度（12% 太浅不明显） */
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent);
    border-radius: var(--radius-lg);
    
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);

    transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

    text-decoration: none;
}

.post-btn:hover {
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.8);
    border-color: var(--g-color);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.pre-post {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-xs);    
}

.next-post {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-direction: column;
    gap: var(--space-xs);
}

.post-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: color-mix(in srgb, var(--g-text) 45%, transparent);    
}

.post-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--g-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;    
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机：两按钮保持并排，收紧边距与内边距 */
    .postnav-area {
        gap: var(--space-sm);
    }
    .post-btn {
        padding: var(--space-sm) var(--space-md);
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏：并排太挤，改纵向堆叠为全宽按钮 */
    .postnav-area {
        flex-direction: column;
        gap: var(--space-xs);
    }
    .post-btn {
        width: 100%;
    }
}

</style>