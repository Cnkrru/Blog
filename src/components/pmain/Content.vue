<script setup lang="ts">
import { root, contentClick } from '../../composables/pamin/post.ts'
</script>

<template>
  <div ref="root" class="content" @click="contentClick">
    <slot />
  </div>
</template>
