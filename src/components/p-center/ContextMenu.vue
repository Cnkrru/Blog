<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const x = ref(0)
const y = ref(0)

const menuItems = [
  { icon: 'home', label: '回首页', action: () => router.push('/') },
  { icon: 'refresh', label: '刷新页面', action: () => location.reload() },
  { icon: 'up', label: '返回顶部', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { icon: 'copy', label: '复制当前链接', action: () => navigator.clipboard.writeText(location.href) },
]

const closeMenu = () => { visible.value = false }

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  x.value = e.clientX
  y.value = e.clientY
  visible.value = true
  adjustPosition()
}

const adjustPosition = () => {
  if (!visible.value) return
  nextTick(() => {
    const menu = document.querySelector('.anime-context-menu') as HTMLElement
    if (!menu) return
    const rect = menu.getBoundingClientRect()
    if (x.value + rect.width > window.innerWidth) x.value -= rect.width
    if (y.value + rect.height > window.innerHeight) y.value -= rect.height
  })
}

const handleClick = () => closeMenu()
const handleKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }

onMounted(() => {
  document.addEventListener('contextmenu', handleContextMenu)
  document.addEventListener('click', handleClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('contextmenu', handleContextMenu)
  document.removeEventListener('click', handleClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="anime-context-menu" :style="{ left: `${x}px`, top: `${y}px` }" @click.stop>
      <div class="menu-header">
        <span class="menu-title">菜单</span>
      </div>
      <div class="menu-divider"></div>
      <div v-for="(item, index) in menuItems" :key="index" class="menu-item" @click="item.action(); closeMenu()">
        <span class="menu-label">{{ item.label }}</span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.anime-context-menu {
  position: fixed;
  z-index: 99999;
  min-width: 180px;
  border-radius: 14px;
  padding: 6px 0;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid;
  animation: menuPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top left;
  overflow: hidden;
}

@keyframes menuPop {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

.menu-header {
  padding: 8px 14px 4px;
}

.menu-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  opacity: 0.4;
}

.menu-divider {
  height: 1px;
  margin: 4px 12px;
  opacity: 0.15;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 9px 14px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 14px;
}

.menu-item:hover {
  background: rgba(255, 192, 203, 0.12);
}

body.dark-theme .menu-item:hover {
  background: rgba(58, 170, 231, 0.12);
}

.menu-label {
  color: var(--common-text);
}
</style>

<style scoped>
.anime-context-menu {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

body.dark-theme .anime-context-menu {
  background: rgba(21, 7, 60, 0.88);
  border-color: rgba(255, 255, 255, 0.06);
}

.menu-divider { background: var(--common-text); }
</style>
