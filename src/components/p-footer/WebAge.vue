<script setup>
import Clock from '../icon/Clock.vue';
import { onMounted, ref } from 'vue';
const webage = ref('')

const get_webage = () => {
    const init_date = new Date('2023-01-01');
    const current_date = new Date();
    const diff_time = current_date - init_date;
    const year = Date.prototype.getFullYear.call(new Date(diff_time))-1970;
    const month = Date.prototype.getMonth.call(new Date(diff_time));
    const day = Date.prototype.getDate.call(new Date(diff_time)) - 1;
    const hours = Date.prototype.getHours.call(new Date(diff_time));
    const minutes = Date.prototype.getMinutes.call(new Date(diff_time));
    const seconds = Date.prototype.getSeconds.call(new Date(diff_time));

    webage.value = `${year} 年 ${month} 月 ${day} 天 ${hours} 时 ${minutes} 分 ${seconds}秒` 
}

onMounted (() => {
get_webage;
setInterval(get_webage, 1000)
}) 

</script>

<template>
    <div class="webage"><Clock class="icon"/>{{ webage }}</div>
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
}

</style>