<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const x = ref(0)
const y = ref(0)

const menuItems = [
  { icon: '🏠', label: '回首页', action: () => router.push('/') },
  { icon: '🔄', label: '刷新页面', action: () => location.reload() },
  { icon: '⬆', label: '返回顶部', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { icon: '📋', label: '复制当前链接', action: () => navigator.clipboard.writeText(location.href) },
]

const closeMenu = () => {
  visible.value = false
}

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
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (x.value + rect.width > vw) x.value = vw - rect.width - 8
    if (y.value + rect.height > vh) y.value = vh - rect.height - 8
  })
}

const handleClick = () => {
  closeMenu()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMenu()
}

import { nextTick } from 'vue'
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
    <div
      v-if="visible"
      class="anime-context-menu"
      :style="{ left: `${x}px`, top: `${y}px` }"
      @click.stop
    >
      <div class="menu-header">
        <span class="menu-avatar">ฅ^•ﻌ•^ฅ</span>
        <span class="menu-title">菜单</span>
      </div>
      <div class="menu-divider"></div>
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-item"
        @click="item.action(); closeMenu()"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-label">{{ item.label }}</span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.anime-context-menu {
  position: fixed;
  z-index: 99999;
  min-width: 200px;
  border-radius: 16px;
  padding: 8px 0;
  box-shadow: 0 8px 32px var(--common-shadow), 0 0 0 2px var(--common-color-1);
  animation: menuPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top left;
}

@keyframes menuPop {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 6px;
}

.menu-avatar {
  font-size: 18px;
}

.menu-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--common-text);
  opacity: 0.6;
  letter-spacing: 1px;
}

.menu-divider {
  height: 1px;
  background: var(--common-color-1);
  opacity: 0.4;
  margin: 4px 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.menu-item:hover {
  background: linear-gradient(90deg, transparent, var(--common-color-1));
  background-size: 200% 100%;
  animation: shimmerSlide 0.6s ease forwards;
}

@keyframes shimmerSlide {
  from { background-position: -100% 0; }
  to { background-position: 100% 0; }
}

.menu-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.menu-label {
  font-size: 14px;
  flex: 1;
}

</style>

<style scoped>
.anime-context-menu {
  background-color: var(--common-bg);
  border: 2px solid var(--common-color-1);
}

.menu-label,
.menu-title {
  color: var(--common-text);
}
</style>
