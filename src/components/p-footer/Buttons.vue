<script setup>
import Github from '../icon/Github.vue';
import Bilibili from '../icon/Bilibili.vue';
import Printer from '../icon/Printer.vue';
import Rss from '../icon/Rss.vue';
import { printPdf } from '@/composables/pfooter';
</script>

<template>
    <div class="btn-list">
        <button class="btn-element"><a href="https://github.com/Cnkrru"><Github class="icon"/>github</a></button>
        <button class="btn-element"><a href="https://space.bilibili.com/452778044?spm_id_from=333.1007.0.0"><Bilibili class="icon"/>B站</a></button>
        <button class="btn-element" @click="printPdf"><Printer class="icon"/>PDF</button>
        <button class="btn-element"><a href="/feed.xml"><Rss class="icon"/>RSS</a></button>
    </div>
</template>

<style scoped>
.btn-list {
    width:100% ;
    height: fit-content;

    display: flex;
    justify-content: center;
    align-items: center;
    gap:var(--space-md);
}

.btn-element {
    width: fit-content;
    height: 100%;
    min-width: 80px;
    min-height: 40px;    

    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);

    border-radius: var(--radius-full);
    border: var(--border-width) solid transparent; 
    padding:var(--space-sm);

    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-opacity) * 0.3)); 

    color: var(--g-text);
    opacity: 0.7;
    transition:
        opacity 0.2s ease,
        background-color 0.2s ease,
        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-element a {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-sm);

    color: var(--g-text);
}

.btn-element:hover,
.btn-element:hover a {
    opacity: 1;
    color: var(--g-color);
    border-color: var(--g-color);
    transform: translateY(-1px);
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
    .btn-list { gap: var(--space-sm); }
    .btn-element { min-width: 64px; min-height: 36px; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    .btn-list { flex-wrap: wrap; }
    .btn-element {
        width: calc(50% - var(--space-sm) / 2);
        min-width: 0;
    }
}

</style>