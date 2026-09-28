<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { head_title, page_titles } from '@/composables/pmain/_head.js';
const route = useRoute()
// 优先读 head_title（Post页fetch后写入文章标题），否则按 route.name 读 page_titles，再兜底'未知'
const title = computed(()=> head_title.value || page_titles[route.name] || '未知')
</script>

<template>
    <div class="main-head">
        <div class="head-card">
            {{ title }}
        <slot></slot>         
        </div>      
    </div>
</template>

<style scoped>
.main-head {
    width: 100%;
    height: 50px;

    display: flex;
    justify-content: center;
    align-items: center;
}

.head-card {
    width: 100%;
    height: 90%;

    border-radius: var(--radius-md);
    border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent); 
    padding:var(--space-sm);
    border-bottom: var(--border-width-lg) solid var(--g-color);

    color: var(--g-text);
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-opacity) * 0.6)); 

    display: flex;
    flex-direction: row;
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
