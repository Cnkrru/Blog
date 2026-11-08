<script setup lang="ts">
import { useSeo } from '../composables/common/seo'

useSeo({
  title: '关于我',
  description: 'Cnkrru 的个人简介、技术栈与联系方式。',
  path: '/about',
})
</script>

<template>
  <div class="content">
    <h2>关于我</h2>

    <h3>个人简介</h3>

    <p>就读于东北电力大学,专业为电气工程及其自动化.</p>
    <p>对编程感兴趣,自学了点编程.</p>

    <h3>技术栈</h3>
    <ul>
      <li><strong>前端</strong>:HTML5,CSS3,TypeScript(JavaScript),Vue3,SSG(Hugo,vitepress)</li>
      <li><strong>后端</strong>:Python,TypeScript,express</li>
      <li><strong>硬件</strong>:arduino(Cpp),stm32(C)</li>
      <li><strong>工具</strong>:Vite,Git,npm</li>
    </ul>

    <h3>联系方式</h3>
    <ul>
      <li><strong>邮箱</strong>:3253884026@qq.com</li>
      <li><strong>GitHub</strong>:https://github.com/Cnkrru</li>
    </ul>
  </div>
</template>

<style scoped></style>
