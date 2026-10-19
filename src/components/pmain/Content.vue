<script setup lang="ts">
import { root, codeCopy } from '../../composables/pamin/post.ts'
// AI修复：图片放大/mermaid 初始化改由 Post.vue 在正文异步就绪后触发，此处不再依赖子组件挂载时机
</script>

<template>
  <div ref="root" class="content" @click="codeCopy">
    <slot />
  </div>
</template>