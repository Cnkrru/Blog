<script setup lang="ts">
import SidebarAvator from './psidebar/Avator.vue'
import SidebarWelcome from './psidebar/Welcome.vue'
import SidebarWeather from './psidebar/Weather.vue'
import SidebarNav from './psidebar/Nav.vue'
import SidebarBuSuanZi from './psidebar/BuSuanZi.vue'
import { refSidebar, toggleSidebar } from '../composables/psidebar.ts'
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': refSidebar }">
    <SidebarAvator />
    <SidebarWelcome />
    <SidebarWeather />
    <SidebarNav />
    <SidebarBuSuanZi />
  </aside>
  <div class="sidebar-overlay" v-show="refSidebar" @click="toggleSidebar"></div>
</template>

<style scoped>
.sidebar {
  width: 15%;
  /* 固定高度改为最大高度：短内容不再被撑满，超高时自身滚动，避免溢出压到页脚 */
  max-height: 600px;
  overflow-y: auto;

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

@media (max-width: 768px) {
  /* [响应式-sm] 手机：侧栏改为左侧抽屉(脱离文档流) */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    /* 固定定位下用 100dvh 贴合可视视口（原 height:100% 在 iOS 会被地址栏裁切），
       并解除基础样式的 max-height:600px，否则抽屉永远只有 600px 高 */
    height: 100dvh;
    max-height: none;
    margin: 0;
    transform: translateX(-100%);
    transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 9999;
  }
  .sidebar.sidebar-open {
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
</style>
