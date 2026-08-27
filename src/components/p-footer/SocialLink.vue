<script setup>
import VIcon from '@/components/common/VIcon.vue'

const props = defineProps({
  link: { type: Object, required: true },
})
</script>

<template>
  <a
    :href="props.link.url"
    :title="props.link.name"
    target="_blank"
    rel="noopener noreferrer"
    class="footer-social-link"
  >
    <VIcon :src="props.link.icon" :size="18" />
    <span class="social-label">{{ props.link.name }}</span>
  </a>
</template>