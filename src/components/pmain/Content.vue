<script setup lang="ts">
import { root } from '../../composables/pmain/post.ts'
</script>

<template>
  <div ref="root" class="content">
    <slot />
  </div>
</template>
