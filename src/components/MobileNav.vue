<script setup lang="ts">
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const items = [
  { path: '/home', label: '首页', icon: '🏠' },
  { path: '/archives', label: '归档', icon: '📂' },
  { path: '/timeline', label: '标签', icon: '🏷️' },
  { path: '/about', label: '关于', icon: '👤' },
]

const currentPath = computed(() => route.path)
</script>

<template>
  <nav class="mobile-nav">
    <RouterLink
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      class="mn-item"
      :class="{ active: currentPath === item.path }"
    >
      <span class="mn-icon">{{ item.icon }}</span>
      <span class="mn-label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.mobile-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: var(--common-bg);
  border-top: 2px solid var(--common-color-1);
  z-index: 900;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
}

@media (max-width: 639px) {
  .mobile-nav {
    display: flex;
  }
}

.mn-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  color: var(--common-text);
  opacity: 0.5;
  transition: all 0.2s;
  padding: 4px 12px;
  border-radius: 8px;
}

.mn-item.active {
  opacity: 1;
  color: var(--common-color-1);
}

.mn-icon {
  font-size: 20px;
}

.mn-label {
  font-size: 11px;
  font-weight: 500;
}
</style>
