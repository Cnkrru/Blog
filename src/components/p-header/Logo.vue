<script setup>
</script>

<template>
    <router-link class="logo" to="/"><p>Cnkrru</p> </router-link>
</template>

<style scoped>
.logo {
    width: fit-content;
    height: 100%;

    margin-left: var(--space-md);

    display: flex;
    justify-content: center;
    align-items: center;
}

.logo p {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.3px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Microsoft YaHei", sans-serif;
    white-space: nowrap;
    transition: opacity 0.2s ease;
    color: var(--g-color);
}

.logo p:hover {
    opacity: 0.8;
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
    .logo { margin-left: var(--space-sm); }
    .logo p { font-size: 22px; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    .logo { margin-left: var(--space-xs); }
    .logo p { font-size: 20px; }
}

</style>