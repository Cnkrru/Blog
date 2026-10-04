<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
// 页头区
import HeaderLogo from './components/pheader/Logo.vue'
import HeaderSearch from './components/pheader/Search.vue'
import HeaderButtons from './components/pheader/Buttons.vue'
import HeaderMusic from './components/pheader/Music.vue'
// 侧栏区
import SidebarAvator from './components/psidebar/Avator.vue'
import SidebarWelcome from './components/psidebar/Welcome.vue'
import SidebarNav from './components/psidebar/Nav.vue'
import SidebarWeather from './components/psidebar/Weather.vue'
import SidebarBuSuanZi from './components/psidebar/BuSuanZi.vue'
// 页脚区
import FooterWebAge from './components/pfooter/WebAge.vue'
import FooterCopyright from './components/pfooter/Copyright.vue'
// 全局
import BackToTop from './components/pmain/BackToTop.vue'
// ts
import { initTheme, initLayout, initBg, initOpacity } from './composables/pamin/setting.ts'
import { initLD } from './composables/pheader.ts'
import { refSidebar, toggleSidebar } from './composables/psidebar.ts'
import { useHead } from '@unhead/vue'

// 站点图标已固化在 index.html 静态 head（favicon 不依赖 JS 注入，首帧即可用），此处只留 feed 自动发现
// title 交给各页 useSeo（含首页），全局不再兜底，避免与页面级标题竞争
useHead({
  link: [
    { rel: 'alternate', type: 'application/rss+xml', title: 'RSS', href: '/feed.xml' },
    { rel: 'alternate', type: 'application/atom+xml', title: 'Atom', href: '/atom.xml' },
  ],
})

const route = useRoute()
const isIndex = computed(() => route.path === '/')

watch(
  () => route.fullPath,
  () => {
    refSidebar.value = false
    // 客户端跳转不重载文档，需手动把正文容器滚回顶部（否则会停在上一篇的滚动位置）
    document.querySelector<HTMLElement>('.main')?.scrollTo({ top: 0 })
  },
)

onMounted(() => {
  initTheme()
  initLayout()
  initBg()
  initOpacity()
  initLD()
})
</script>

<template>
  <template v-if="isIndex">
    <RouterView to="/"></RouterView>
  </template>

  <template v-else>
    <header class="header">
      <HeaderLogo />
      <HeaderSearch />
      <HeaderButtons />
      <HeaderMusic />
    </header>
    <div class="center">
      <aside class="sidebar" :class="{ 'sidebar-open': refSidebar }">
        <SidebarAvator />
        <SidebarWelcome />
        <SidebarWeather />
        <SidebarNav />
        <SidebarBuSuanZi />
      </aside>
      <div class="sidebar-overlay" v-show="refSidebar" @click="toggleSidebar"></div>

      <main class="main">
        <!-- 以 path 作 key：/post/:id 是同一条路由记录，不换 key 会复用组件实例、setup 不重跑，子组件残留上一篇数据 -->
        <RouterView :key="route.path" />
      </main>
    </div>

    <footer class="footer">
      <FooterWebAge />
      <FooterCopyright />
    </footer>

    <BackToTop />
  </template>
</template>

<style scoped>
.header {
  width: 100%;
  height: 64px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: var(--space-md);

  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
}

.center {
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: row;
}

.sidebar {
  width: 15%;
  /* [AI修复] 固定高度改为最大高度：短内容不再被撑满，超高时自身滚动，避免溢出压到页脚 */
  max-height: 600px;
  overflow-y: auto;

  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  gap: var(--space-lg);

  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
}

.main {
  width: 85%;
  /* [AI修复] 固定高度改为最大高度：正文最高 600px，超出部分在容器内滚动 */
  max-height: 600px;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: var(--space-sm);

  padding: var(--space-md);

  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-opacity, 0.6));
  border: var(--border-width) solid color-mix(in srgb, var(--g-text) 10%, transparent);
}

.footer {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);

  padding: var(--space-md);
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
  /* [响应式-sm] 手机：侧栏改为左侧抽屉(脱离文档流)，主内容占满宽度 */
  .sidebar {
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
  .main {
    width: 100%;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
}
</style>
