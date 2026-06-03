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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  z-index: 900;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
}

body.dark-theme .mobile-nav {
  background: rgba(21, 7, 60, 0.85);
  border-top: 0.5px solid rgba(255, 255, 255, 0.08);
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
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 4px 12px;
  border-radius: 12px;
}

.mn-item.active {
  opacity: 1;
  color: var(--common-color-1);
  background-color: rgba(255, 192, 203, 0.15);
  transform: translateY(-2px);
}

body.dark-theme .mn-item.active {
  background-color: rgba(58, 170, 231, 0.15);
}

.mn-icon {
  font-size: 20px;
}

.mn-label {
  font-size: 11px;
  font-weight: 500;
}
</style>
