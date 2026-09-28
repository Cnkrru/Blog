<script setup>
import Clock from '../icon/Clock.vue';
import { onMounted } from 'vue';
import { webAge } from '@/composables/pfooter';

// [AI迁移] webAge 已成全局单例，去掉了 footer 壳层，直接取单例上的 ref 与 start
const { ref_webAge, start } = webAge;

onMounted(() => {
    start();
});
</script>

<template>
    <div class="webage"><Clock class="icon"/>{{ ref_webAge }}</div>
</template>

<style scoped>
.webage {
    width: 80%;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);

    border-radius: var(--radius-full);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 25%, transparent); 
    padding:var(--space-sm);

    background: color-mix(in srgb, var(--g-color) 15%, transparent);     
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
    .webage { width: 90%; font-size: 0.9em; }
}

</style>