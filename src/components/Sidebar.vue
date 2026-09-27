<script setup>
import Avator from './p-sidebar/Avator.vue';
import Welcome from './p-sidebar/Welcome.vue';
import Nav from './p-sidebar/Nav.vue';
import IpWeather from './p-sidebar/IpWeather.vue';
import Busuanzi from './p-sidebar/Busuanzi.vue';
</script>

<template>
    <div class="sidebar-area">
        <Avator/>
        <Welcome/>
        <IpWeather/>
        <Nav/>
        <Busuanzi/>
    </div>
</template>

<style scoped>
.sidebar-area {
    width: 15%;
    height: 680px;

    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    gap: var(--space-lg);

    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);    
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