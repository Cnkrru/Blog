<script setup lang="ts">
import { onMounted } from 'vue'
import { root, codeCopy, imgBox, mermaid } from '../../composables/pamin/post.ts'

onMounted(() => {
  imgBox()
  mermaid()
})
</script>

<template>
  <div ref="root" class="content" @click="codeCopy">
    <slot />
  </div>
</template>

<style scoped>
</style>