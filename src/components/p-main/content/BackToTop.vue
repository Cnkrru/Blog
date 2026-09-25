<script setup>
import BackToTop from '@/components/icon/BackToTop.vue';
import { content } from '@/modules/content.js';
import { onMounted } from 'vue';

onMounted(() => {
    content.reading_progress()
})
</script>

<template>
    <button class="back-top-btn" @click="[content.scroll_to_top()]">
        <span class="progress"></span>
        <BackToTop class="back-icon"/>
    </button>
</template>

<style scoped>
.back-top-btn {
    position: fixed;
    right: 40px;
    bottom: 40px;
    z-index: 999;

    width: 40px;
    height: 40px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: var(--radius-full);
    background-color: var(--g-color);
}

.back-icon {
    color: white;
}

.progress {
    position: absolute;
    inset: -4px;
    border-radius: var(--radius-full);
    z-index: -1;
    background: conic-gradient(var(--g-color) var(--progress), transparent 0);
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
