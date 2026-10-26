<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
// 页头区
import HeaderMusic from './components/pheader/Music.vue'
import Header from './components/Header.vue'
// 侧栏区
import Sidebar from './components/Sidebar.vue'
// 正文区
import Main from './components/Main.vue'
// 页脚区
import Footer from './components/Footer.vue'
// 全局
import BackToTop from './components/pmain/BackToTop.vue'
import LoadingBar from './components/pheader/LoadingBar.vue'
// ts
import { initTheme, initLayout, initBg, initOpacity } from './composables/pamin/setting.ts'
import { initLD } from './composables/pheader.ts'
import { initLocale } from './composables/i18n.ts'
import { refSidebar } from './composables/psidebar.ts'
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
// 返回顶部只在文章页出现（阅读进度环与"回到正文顶部"仅对文章有意义）
const isPost = computed(() => route.name === 'post')

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
  initLocale()
})
</script>

<template>
  <!-- 全局路由加载进度条：所有页面共用，放在 isIndex 分支外 -->
  <LoadingBar />

  <!-- 音乐播放器移出 header 常驻渲染，否则进首页(不渲染 header)会卸载 Music 触发 howler.unload 中断播放 -->
  <HeaderMusic />

  <template v-if="isIndex">
    <RouterView to="/"></RouterView>
  </template>

  <template v-else>
    <Header />
    <div class="center">
      <Sidebar />
      <Main />
    </div>
    <Footer />

    <BackToTop v-if="isPost" />
  </template>
</template>

<style scoped>
.center {
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: row;
}
</style>
