<script setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import Avator from './p-sidebar/Avator.vue';
import Welcome from './p-sidebar/Welcome.vue';
import Nav from './p-sidebar/Nav.vue';
import IpWeather from './p-sidebar/IpWeather.vue';
import Busuanzi from './p-sidebar/Busuanzi.vue';
import { sidebar_open } from '@/composables/psidebar.js';

const route = useRoute()
// 兜底：路由变化（点侧边栏导航跳转后）自动收起移动端抽屉
watch(() => route.fullPath, () => { sidebar_open.value = false })
</script>

<template>
    <div
        class="sidebar-area"
        :class="{ 'sidebar-open': sidebar_open }"
    >
        <Avator/>
        <Welcome/>
        <IpWeather/>
        <Nav/>
        <Busuanzi/>
    </div>
    <div class="sidebar-overlay" v-show="sidebar_open" @click="sidebar_open.value = false"></div>
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

/* 桌面端遮罩恒隐藏（仅移动端抽屉有效） */
.sidebar-overlay {
    display: none;
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
    .sidebar-area {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 240px;
        height: 100%;
        margin: 0;
        transform: translateX(-100%);
        transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        z-index: 9999;
    }
    .sidebar-area.sidebar-open {
        transform: translateX(0);
    }
    .sidebar-overlay {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 9998;
        background: rgba(0, 0, 0, 0.45);
    }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}

</style>