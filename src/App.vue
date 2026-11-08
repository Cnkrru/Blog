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
import { refSidebar } from './composables/psidebar.ts'

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
