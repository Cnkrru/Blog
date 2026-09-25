<script setup>
import { ref } from 'vue';
const copyright = ref('Cnkrru·power by Vue,All rights reserved.')
</script>

<template>
    <div class="copyright">&copy {{ copyright }}</div>
</template>

<style scoped>
.copyright {
    width: 80%;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;

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
}

</style>