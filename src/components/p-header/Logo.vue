<!-- review完成 -->

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="logo-card">
    <router-link to="/"><h1>Cnkrru</h1></router-link>
  </div>
</template>

<style scoped>
.logo-card {
    width: auto;
    height: 100%;
    padding: 0 0 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-card h1 {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.3px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Microsoft YaHei", sans-serif;
    white-space: nowrap;
    transition: opacity 0.2s ease;
}

.logo-card h1:hover {
    opacity: 0.8;
}
</style>

<style scoped>
.logo-card h1 {
    color: var(--common-color-1);
}
</style>

<style scoped>
@media (max-width: 768px) {
  .logo-card {
      margin-left: 0;
      margin-right: 0;
  }

    .logo-card h1 {
    font-size: 20px;
  }
}
</style>
