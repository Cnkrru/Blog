<script setup>
</script>

<template>
  <div class="rss-subscribe">
    <a href="/rss.xml" target="_blank" rel="noopener noreferrer" class="rss-subscribe-link">
      RSS 订阅
    </a>
  </div>
</template>

<style scoped>
.rss-subscribe {
  width: 100%;
  height: fit-content;
  text-align: center;
  padding: 10px;
  margin-top: 10px;
}

.rss-subscribe-link {
  display: block;
  width: 100%;
  padding: 8px;
  background-color: var(--button-bg);
  color: var(--button-text);
  border: 1px solid var(--button-border);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.rss-subscribe-link:hover {
  background-color: var(--button-hover-bg);
  transform: translateY(-5px);
}
</style>