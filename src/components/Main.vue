<script setup>
import MainHeader from './p-main/MainHeader.vue';
import MainBody from './p-main/MainBody.vue';
</script>

<template>
    <div class="main-area">
        <MainHeader>
        </MainHeader>
        <MainBody/>
    </div>
</template>

<style scoped>
.main-area {
    width:85%;
    height: 680px;

    display: flex;
    flex-direction: column;
    gap: var(--space-sm);

    padding: var(--space-md);

    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-opacity, 0.6));
    border: var(--border-width) solid color-mix(in srgb, var(--g-text) 10%, transparent);
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