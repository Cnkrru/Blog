<script setup>
</script>

<template>
  <div class="welcome-saying-card">
    <p class="welcome-link">欢迎来到我的博客</p>
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
    color: var(--common-color-1);
}

.welcome-link {
    cursor: pointer;
    user-select: none;
}

.welcome-link:active {
    transform: none;
}

@media (max-width: 768px) {
  .welcome-saying-card p {
      font-size: 14px;
  }
}
</style>
