<script setup>
import SearchIcon from '../icon/SearchIcon.vue';
</script>

<template>
    <div class="search">
        <SearchIcon class="search-icon"/>
        <input type="text" placeholder="搜索">
    </div>
</template>

<style scoped>
.search {
    width: 600px;
    height: 80%;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);

    border-radius: var(--radius-full);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent); 
    padding: 0 var(--space-md);

    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-opacity) * 0.6));
    backdrop-filter: blur(12px);

    transition: border-color 0.2s ease;
}


.search-icon {
    color: var(--g-text);
    opacity: 0.5;
    transition: opacity 0.2s ease;
}

.search:focus-within .search-icon {
    opacity: 0.8;
}

.search:focus-within {
    border-color: var(--g-color);
}

.search input {
    height: 100%;
    width: 100%;

    color: var(--g-text);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-opacity) * 0.6));
}

.search input::placeholder {
    color: var(--g-text);
    opacity: 0.4;
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