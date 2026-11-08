<script setup lang="ts">
import { WELCOME_SAYINGS } from '@/composables/common/config'
</script>

<template>
  <div class="welcome">{{ WELCOME_SAYINGS }}</div>
</template>

<style scoped>
.welcome {
  width: 90%;
  height: fit-content;
  margin: var(--space-xs) auto;
  text-align: center;

  font-size: 14px;
  font-style: italic;
  line-height: normal;
  color: var(--g-color);

  user-select: none;
}
</style>
