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

    <p>就读于东北电力大学,电气工程及其自动化.</p>
    <p>对编程感兴趣,自学了点编程.</p>

    <h3>技术栈</h3>
    <ul>
      <li>
        <strong>前端</strong>
        :HTML5,CSS3,TypeScript(JavaScript),Vue3,SSG(Hugo,vitepress)
      </li>
      <li>
        <strong>后端</strong>
        :Python,TypeScript,express
      </li>
      <li>
        <strong>硬件</strong>
        :arduino(Cpp),stm32(C)
      </li>
      <li>
        <strong>工具</strong>
        :Vite,Git,npm
      </li>
    </ul>

    <h3>关于技术栈</h3>
    <ul>
      <li>
        最开始接触编程是学C++,后来学了arduino和STM32,单片机接触了三个月左右,实在不喜欢硬件,后接触Hexo(一个JavaScript写的SSG),接触node,JavaScript,前端
        ,后来学了python,前端(HTML5,CSS3,前端JavaScript),正在学express,准备做后端开发
      </li>
      <li>
        学过C++,C,Py,JavaScript,以后可能会学一下go(比较感兴趣),不过主力语言是Typescript(JavaScript)
      </li>
    </ul>

    <h3>联系方式</h3>
    <ul>
      <li>
        <strong>邮箱</strong>
        :3253884026@qq.com
      </li>
      <li>
        <strong>GitHub</strong>
        :https://github.com/Cnkrru
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
