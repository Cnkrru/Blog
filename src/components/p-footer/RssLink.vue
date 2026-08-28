<script setup>
import VIcon from '@/components/__common/VIcon.vue'
</script>

<template>
  <a
    href="/rss.xml"
    title="RSS"
    target="_blank"
    class="footer-social-link"
  >
    <VIcon :src="'rss.svg'" :size="18" />
    <span class="social-label">RSS</span>
  </a>
</template>