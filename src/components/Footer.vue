<script setup>
import Buttons from './p-footer/Buttons.vue';
import WebAge from './p-footer/WebAge.vue';
import Copyright from './p-footer/Copyright.vue';
</script>

<template>
    <div class="footer-area">
        <Buttons/>
        <WebAge/>
        <Copyright/>
    </div>
</template>

<style scoped>
.footer-area {
    width: 100%;

    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    gap: var(--space-md);

    padding: var(--space-md);
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