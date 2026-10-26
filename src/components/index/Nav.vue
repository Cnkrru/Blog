<script setup lang="ts">
import { refText } from '@/composables/i18n'
</script>

<template>
  <nav class="index-nav">
    <router-link to="/postlist" class="nav-element">{{ refText.navPost }}</router-link>
    <router-link to="/about" class="nav-element">{{ refText.navAbout }}</router-link>
    <router-link to="/category" class="nav-element">{{ refText.navArchive }}</router-link>
    <router-link to="/tag" class="nav-element">{{ refText.navTag }}</router-link>
    <router-link to="/link" class="nav-element">{{ refText.navLink }}</router-link>
    <router-link to="/setting" class="nav-element">{{ refText.navSetting }}</router-link>
  </nav>
</template>

<style scoped>
.index-nav {
  width: 100%;
  height: fit-content;
  max-height: 240px;

  display: flex;
  justify-content: end;
  align-items: center;
  flex-direction: row;
  gap: var(--space-lg);

  padding: var(--space-sm);
  margin-bottom: var(--space-xs);

  text-align: center;
  overflow-y: auto;
  background: transparent;
}

.nav-element {
  position: relative;
  width: fit-content;
  height: fit-content;

  padding: 6px 0;
  border-radius: var(--radius-md);

  text-decoration: none;
  color: var(--g-text);
  opacity: 0.7;
  transition: color 0.2s ease;
}

.nav-element::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--g-color);
  transition: width 0.3s ease;
}

.nav-element:hover {
  color: var(--g-color);
  opacity: 1;
}

.nav-element:hover::after {
  width: 100%;
}

/* ====================<响应式>==================== */

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
  .index-nav {
    gap: var(--space-md);
  }
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机 */
  .index-nav {
    gap: var(--space-sm);
    padding: var(--space-xs) var(--space-sm);
  }
  .nav-element {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .index-nav {
    gap: var(--space-xs);
  }
  .nav-element {
    padding: 4px 2px;
    font-size: 13px;
  }
}
</style>
