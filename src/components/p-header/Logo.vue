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
    font-size: 24px;
    font-family: "Microsoft YaHei", sans-serif;
    white-space: nowrap;
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
