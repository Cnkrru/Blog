<script setup lang="ts">
import SidebarAvator from './psidebar/Avator.vue'
import SidebarWelcome from './psidebar/Welcome.vue'
import SidebarWeather from './psidebar/Weather.vue'
import SidebarNav from './psidebar/Nav.vue'
import SidebarBuSuanZi from './psidebar/BuSuanZi.vue'
import { refSidebar, toggleSidebar } from '../composables/psidebar.ts'
</script>

<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar-open': refSidebar }"
  >
    <SidebarAvator />
    <SidebarWelcome />
    <SidebarWeather />
    <SidebarNav />
    <SidebarBuSuanZi />
  </aside>
  <div
    class="sidebar-overlay"
    v-show="refSidebar"
    @click="toggleSidebar"
  ></div>
</template>

<style scoped>
.sidebar {
  width: 15%;
  max-height: 600px;

  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  gap: var(--space-lg);

  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);

  overflow-y: auto;
}

/* 遮盖层 */
.sidebar-overlay {
  display: none;
}

/* ====================<响应式>==================== */

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
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
