<script setup>
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Main from '@/components/Main.vue';
import Footer from '@/components/Footer.vue';
import BackToTop from './components/p-main/content/BackToTop.vue';

import { theme } from './modules/theme';
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

onBeforeMount(() => {
  theme.init_bg();
})

onMounted (()=> {
  theme.init_theme();  
  theme.init_light_dark();
  theme.init_layout();
  theme.init_opacity();
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
}

@media (max-width: 480px) {
    /* [响应式-xs] 窄屏 */
}
</style>
