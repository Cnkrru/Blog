<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import homeSvg from '@/assets/svg/home.svg?raw'
import refreshCwSvg from '@/assets/svg/refresh-cw.svg?raw'
import arrowUpSvg from '@/assets/svg/arrow-up.svg?raw'
import copySvg from '@/assets/svg/copy.svg?raw'

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
          <span v-if="item.icon === 'home'" class="svg-icon menu-icon" :style="{ width: '16px', height: '16px' }" v-html="homeSvg"></span>
          <!-- Refresh -->
          <span v-else-if="item.icon === 'refresh'" class="svg-icon menu-icon" :style="{ width: '16px', height: '16px' }" v-html="refreshCwSvg"></span>
          <!-- Up -->
          <span v-else-if="item.icon === 'up'" class="svg-icon menu-icon" :style="{ width: '16px', height: '16px' }" v-html="arrowUpSvg"></span>
          <!-- Copy -->
          <span v-else-if="item.icon === 'copy'" class="svg-icon menu-icon" :style="{ width: '16px', height: '16px' }" v-html="copySvg"></span>
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