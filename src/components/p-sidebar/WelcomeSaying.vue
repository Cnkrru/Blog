<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToChangelog = () => {
  router.push('/changelog')
}
</script>

<template>
  <div class="welcome-saying-card">
    <p @click="navigateToChangelog" class="welcome-link">欢迎来到我的博客</p>
  </div>
</template>

<style scoped>
.welcome-saying-card {
    width: 90%;
    height: fit-content;
    margin: 4px auto;
    text-align: center;
}

.welcome-saying-card p {
    font-size: 14px;
    font-style: italic;
    font-family: "Microsoft YaHei", sans-serif;
    line-height: normal;
}

.welcome-link {
    cursor: pointer;
    user-select: none;
}

.welcome-link:active {
    transform: none;
}
</style>

<style scoped>
.welcome-saying-card p {
    color: var(--common-color-1);
}
</style>

<style scoped>
@media (max-width: 768px) {
  .welcome-saying-card p {
      font-size: 14px;
  }
}
</style>
