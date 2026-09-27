<script setup>
import Light from '../icon/Light.vue';
import Dark from '../icon/Dark.vue';
import Immersive from '../icon/Immersive.vue';
import Music from '../icon/Music.vue';
import Menu from '../icon/Menu.vue';
import { theme } from '@/modules/theme.js';
import { music } from '@/modules/music.js';
import { page } from '@/modules/page.js';

// 移动端汉堡：抽屉开合（仅 ≤768 显示按钮，详见 CSS .menu-btn）
const toggle_sideber = () => { page.sidebar_open = !page.sidebar_open };
</script>

<template>
    <div class="button-list">
        <button class="h-button menu-btn" title="菜单" @click="toggle_sideber"><Menu class="icon"/></button>
        <button class="h-button" >
            <Light class="icon" v-if="theme.ref_light_dark" @click="theme.set_light_dark('dark')"/>
            <Dark  class="icon" v-else                      @click="theme.set_light_dark('light')"/>
        </button>
        <button class="h-button" @click="theme.ref_layout === 'default' ? theme.set_layout('immersive') : theme.set_layout('default')"><Immersive class="icon"/></button>
        <button class="h-button" @click="music.toggleOpen()"><Music class="icon"/></button>
    </div>
</template>

<style scoped>
.button-list {
    width: fit-content;
    height: 80%;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-sm);
}

.h-button {
    width: 40px;
    height: 40px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: var(--radius-full);
    background-color: var(--g-color);

    border: var(--border-width) solid var(--g-color);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 30%, transparent);
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s ease,
        background-color 0.2s ease;
}

.h-button:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 14px color-mix(in srgb, var(--g-color) 40%, transparent);
}

.icon {
    color:white;
}

/* 汉堡键：桌面隐藏，仅移动端(≤768)显示 */
.menu-btn {
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
    .menu-btn { display: flex; }
    .button-list { gap: var(--space-sm); }
    .h-button { width: 38px; height: 38px; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
    .button-list { gap: var(--space-sm); }
    .h-button { width: 36px; height: 36px; }
}

</style>