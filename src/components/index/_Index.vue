<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import i_Logo from './i_Logo.vue';
import i_Nav from './i_Nav.vue';
import i_Welcome from './i_Welcome.vue';
import i_HeatMap from './i_HeatMap.vue';
import { particles } from '@/composables/index.js';

// draft 工厂：particles() 提供 { start, stop }，与正式 effect 的 start/cleaner 对齐
const particle = particles()
const canvas_el = ref(null)

onMounted(() => {
    particle.start(canvas_el.value)
})
onUnmounted(() => {
    particle.stop()
})
</script>

<template>
    <canvas ref="canvas_el" class="particle-canvas"></canvas>
    <div class="index-page">
        <div class="index-head">
            <i_Logo/>
            <i_Nav/>
        </div>
        <div class="index-body">
            <i_Welcome/>
            <div class="btn-list">
                <router-link to="/posts" class="btn btn-read">开始阅读</router-link>
                <router-link to="/about" class="btn btn-about">关于我</router-link>
            </div>
            <div class="glass-card">
                <i_HeatMap/>
            </div>
        </div>
    </div>
</template>

<style scoped>
.particle-canvas {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
}

/* index 内容整体容器（相对粒子画布浮于其上；移动端作为独立纵向滚动视口） */
.index-page {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
}

.index-head {
    width: 100%;
    height: 64px;

    position: relative;
    z-index: 1;

    display: flex;
    justify-content:start ;
    align-items: center;
    flex-direction: row;

    padding: var(--space-sm);
}

.index-body {
    width: 100%;
    height: fit-content;

    position: relative;
    z-index: 1;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: var(--space-lg);
}

.btn-list {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: var(--space-lg);
}

.btn {
    padding: 12px 32px;
    font-size: 15px;
    font-weight: 600;
    border-radius: 28px;
    border: none;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, opacity 0.2s ease;
}

.btn-read {
    background: var(--g-color);
    color:#fff;
    box-shadow: 0 4px 16px var(--g-shadow);
}

.btn-read:hover {
    box-shadow: 0 8px 24px var(--g-shadow);
}

.btn-about {
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
    color: var(--g-text);
    border: 1px solid color-mix(in srgb, var(--g-text) 10%, transparent);
    backdrop-filter: blur(8px);
}

.btn-about:hover {
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
}

.glass-card {
    width: 100%;
    max-width: 720px;
    border-radius: var(--radius-xl);
    padding: 24px;
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid color-mix(in srgb, var(--g-text) 8%, transparent);
    display: flex;
    justify-content: center;
}

/* ====================<响应式>==================== */
@media (max-width: 1280px) {
    /* [响应式-lg] 大屏 */
    .index-body { gap: var(--space-md); }
}

@media (max-width: 1024px) {
    /* [响应式-md] 平板 */
    .btn-list { gap: var(--space-md); }
}

@media (max-width: 768px) {
    /* [响应式-sm] 手机 */
    .index-page {
        height: 100dvh;
        overflow-y: auto;
    }
    .glass-card { padding: 16px; }
    .btn { padding: 10px 24px; font-size: 14px; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    .index-body { gap: var(--space-md); }
    .btn-list {
        flex-direction: column;
        align-items: center;
        gap: var(--space-md);
        padding: 0 var(--space-lg);
        box-sizing: border-box;
    }
    .btn { width: fit-content; }
    .glass-card { padding: 14px; }
}

</style>
