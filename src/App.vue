<script setup>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Main from '@/components/Main.vue';
import Footer from '@/components/Footer.vue';
import BackToTop from './components/p-main/post/BackToTop.vue';

import { bg, theme as theme_factory, layout, opacity } from '@/composables/pmain/setting.js';
import { lightDark } from '@/composables/pheader.js';
import { onBeforeMount, onMounted,computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';

// 全局 head：站点元信息 + RSS/Atom 自动发现（订阅器靠 <link rel="alternate"> 发现 feed）
useHead({
  title: 'Cnkrru',
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'alternate', type: 'application/rss+xml', title: 'RSS', href: '/feed.xml' },
    { rel: 'alternate', type: 'application/atom+xml', title: 'Atom', href: '/atom.xml' },
  ],
})

const route = useRoute()
const isIndexPage = computed(() => route.path === '/')

// [AI迁移] 全局主题系初始化改走 pmain/setting 模块顶层导出（去壳，替代已删的 theme.js/setting())
onBeforeMount(() => {
  bg().init();
})

onMounted (()=> {
  theme_factory().init();
  lightDark().init();
  layout().init();
  opacity().init();
})
</script>

<template>
  <template v-if="isIndexPage">
    <router-view/>
  </template>

  <template v-else>
    <Header/>

    <div class="center-area">
      <Sidebar/>
      <Main/>
    </div>
    
    <Footer/>
    <BackToTop/>
  </template>
</template>

<style scoped>
.center-area {
  width: 100%;
  flex: 1;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
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
    /* 移动端主内容高度随内容撑开(而非吃满视口)，开启 body 整页滚动，footer 落到内容底部 */
    .center-area { flex: none; }
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}
</style>
