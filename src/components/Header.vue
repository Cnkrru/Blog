<script setup>
import Logo from '@/components/p-header/Logo.vue';
import SearchPanel from '@/components/p-header/SearchPanel.vue';
import Buttons from '@/components/p-header/Buttons.vue';
import Music from '@/components/p-header/Music.vue';
</script>

<template>
    <div class="header-area">
        <Logo/>
        <SearchPanel/>
        <Buttons/>
        <Music/>
    </div>
</template>

<style scoped>
.header-area {
    width: 100%;
    height: 64px;

    display: flex;
    justify-content:space-between ;
    align-items: center;
    flex-direction: row;
    gap: var(--space-md);

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