<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const x = ref(0)
const y = ref(0)

const menuItems = [
  {
    icon: 'home',
    label: '回首页',
    action: () => router.push('/'),
  },
  {
    icon: 'refresh',
    label: '刷新页面',
    action: () => location.reload(),
  },
  {
    icon: 'up',
    label: '返回顶部',
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  },
  {
    icon: 'copy',
    label: '复制当前链接',
    action: () => navigator.clipboard.writeText(location.href),
  },
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
    <Transition name="menu-pop">
      <div v-if="visible" class="anime-context-menu" :style="{ left: `${x}px`, top: `${y}px` }" @click.stop>
        <div class="menu-header">
          <span class="menu-title">菜单</span>
        </div>
        <div class="menu-divider"></div>
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="menu-item"
          @click="item.action(); closeMenu()"
        >
          <!-- Home -->
          <svg v-if="item.icon === 'home'" class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <!-- Refresh -->
          <svg v-else-if="item.icon === 'refresh'" class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <!-- Up -->
          <svg v-else-if="item.icon === 'up'" class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <!-- Copy -->
          <svg v-else-if="item.icon === 'copy'" class="menu-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.anime-context-menu {
  position: fixed;
  z-index: 99999;
  min-width: 190px;
  border-radius: 14px;
  padding: 6px 0;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid;
  overflow: hidden;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-alpha));
  border-color: color-mix(in srgb, var(--common-color-1) 12%, transparent);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 8px 32px rgba(0, 0, 0, 0.12);
}

.menu-header {
  padding: 8px 16px 4px;
}

.menu-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  opacity: 0.4;
  color: var(--common-text);
}

.menu-divider {
  height: 1px;
  margin: 4px 14px;
  background: var(--common-text);
  opacity: 0.12;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 14px;
  color: var(--common-text);
}

.menu-item:hover {
  background: color-mix(in srgb, var(--common-color-1) 12%, transparent);
}

.menu-icon {
  flex-shrink: 0;
  opacity: 0.5;
  transition: opacity 0.15s ease;
}

.menu-item:hover .menu-icon {
  opacity: 0.8;
}

.menu-label {
  color: var(--common-text);
}

/* Transition */
.menu-pop-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: top left;
}
.menu-pop-leave-active {
  transition: all 0.15s ease;
  transform-origin: top left;
}
.menu-pop-enter-from {
  opacity: 0;
  transform: scale(0.85);
}
.menu-pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>