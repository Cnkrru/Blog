<script setup lang="ts">
import { useSeo } from '../composables/seo'
import { refText } from '../composables/i18n'

useSeo({
  title: '关于我',
  description: 'Cnkrru 的个人简介、技术栈与联系方式。',
  path: '/about',
})
</script>

<template>
  <div class="content">
    <h2>{{ refText.aboutTitle }}</h2>

    <h3>{{ refText.aboutIntro }}</h3>

    <p>{{ refText.aboutIntro1 }}</p>
    <p>{{ refText.aboutIntro2 }}</p>

    <h3>{{ refText.aboutStack }}</h3>
    <ul>
      <li><strong>{{ refText.aboutFrontend }}</strong>:HTML5,CSS3,TypeScript(JavaScript),Vue3,SSG(Hugo,vitepress)</li>
      <li><strong>{{ refText.aboutBackend }}</strong>:Python,TypeScript,express</li>
      <li><strong>{{ refText.aboutHardware }}</strong>:arduino(Cpp),stm32(C)</li>
      <li><strong>{{ refText.aboutTools }}</strong>:Vite,Git,npm</li>
    </ul>

    <h3>{{ refText.aboutContact }}</h3>
    <ul>
      <li><strong>{{ refText.aboutEmail }}</strong>:3253884026@qq.com</li>
      <li><strong>GitHub</strong>:https://github.com/Cnkrru</li>
    </ul>
  </div>
</template>

<style scoped></style>
