<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import Terminal from '../../components/Terminal.vue'

// 在组件顶层调用 useHead，使用响应式数据
useHead({
  title: '终端 - Cnkrru\'s Blog',
  meta: [
    {
      name: 'description',
      content: 'Cnkrru\'s Blog网站内置终端，执行特殊命令，体验隐藏的彩蛋功能'
    },
    {
      name: 'keywords',
      content: '终端,命令cmd,隐藏功能'
    },
    {
      name: 'author',
      content: 'Cnkrru'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/terminal' },
    { property: 'og:title', content: '终端 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru\'s Blog网站内置终端，执行特殊命令' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/terminal' },
    { name: 'twitter:title', content: '终端 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru\'s Blog网站内置终端' }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://cnkrru.top/terminal'
    }
  ]
})
</script>

<template>
    <div class="terminal-page">
        <!-- 终端组件 -->
        <Terminal />
    </div>
</template>

<style scoped>
.terminal-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    z-index: 100;
}
</style>