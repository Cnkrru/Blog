<script setup lang="ts">
const nav = [
  { elName: '文章', elTo: '/postlist' },
  { elName: '关于', elTo: '/about' },
  { elName: '分类', elTo: '/category' },
  { elName: '标签', elTo: '/tag' },
  { elName: '图集', elTo: '/photo' },
  { elName: '链接', elTo: '/link' },
  { elName: '设置', elTo: '/setting' },
]
</script>

<template>
  <nav class="nav">
    <router-link
      class="nav-elName"
      v-for="{ elName, elTo } in nav"
      :to="elTo"
      :key="elName"
    >
      {{ elName }}
    </router-link>
  </nav>
</template>

<style scoped>
.nav {
  width: 100%;
  height: fit-content;
  max-height: 240px;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: var(--space-xs);

  padding: var(--space-sm);
  margin-bottom: var(--space-xs);

  text-align: center;
  overflow-y: auto;
  background: transparent;
}

.nav-elName {
  width: fit-content;
  height: fit-content;
  min-width: 160px;
  min-height: 40px;

  padding: var(--space-sm);
  border: var(--border-width) solid color-mix(in srgb, var(--g-text) 8%, transparent);
  border-radius: var(--radius-md);

  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);

  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  text-decoration: none;
  color: var(--g-text);
}

.nav-elName:hover {
  transform: translateY(-2px);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
  border-color: color-mix(in srgb, var(--g-text) 15%, transparent);
  box-shadow: 0 4px 12px var(--common-shadow);
}
</style>
