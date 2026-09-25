<script setup>
import { ref } from 'vue';
const logo = ref('Cnkrru')
</script>

<template>
    <div class="logo">
        <router-link to="/posts"><p>{{ logo }}</p> </router-link>
    </div>    
</template>

<style scoped>
.logo {
    width: fit-content;
    min-width: 20%;
    height: 100%;

    margin-left: var(--space-md);

    display: flex;
    justify-content: center;
    align-items: center;
}

.logo p {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.3px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Microsoft YaHei", sans-serif;
    white-space: nowrap;
    transition: opacity 0.2s ease;
    color: var(--g-color);
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