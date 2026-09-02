<script setup>
import VIcon from '@/components/__common/VIcon.vue'
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollStore } from '../../stores/scroll'

const router = useRouter()
const scrollStore = useScrollStore()
const visible = ref(false)
const x = ref(0)
const y = ref(0)
const menuRef = ref(null)

const MENU_WIDTH = 190
const MENU_HEIGHT = 200

const menuItems = [
  {
    icon: 'home.svg',
    label: '回首页',
    action: () => router.push('/'),
  },
  {
    icon: 'refresh-cw.svg',
    label: '刷新页面',
    action: () => location.reload(),
  },
  {
    icon: 'arrow-up.svg',
    label: '返回顶部',
    action: () => scrollStore.scroll_to_top(),
  },
  {
    icon: 'copy.svg',
    label: '复制当前链接',
    action: () => navigator.clipboard.writeText(location.href),
  },
]

const closeMenu = () => { visible.value = false }

function calcPosition(cx, cy, w, h) {
  let left = cx
  let top = cy
  if (left + w > window.innerWidth) left = window.innerWidth - w - 8
  if (top + h > window.innerHeight) top = window.innerHeight - h - 8
  return { left: Math.max(4, left), top: Math.max(4, top) }
}

const handleContextMenu = (e) => {
  e.preventDefault()
  // 先以估算尺寸定位，避免闪烁
  const pos = calcPosition(e.clientX, e.clientY, MENU_WIDTH, MENU_HEIGHT)
  x.value = pos.left
  y.value = pos.top
  visible.value = true
  // 渲染后用实际尺寸微调
  nextTick(() => {
    if (!menuRef.value) return
    const rect = menuRef.value.getBoundingClientRect()
    const finePos = calcPosition(e.clientX, e.clientY, rect.width, rect.height)
    x.value = finePos.left
    y.value = finePos.top
  })
}

const handleClick = () => closeMenu()
const handleKeydown = (e) => { if (e.key === 'Escape') closeMenu() }
const handleResize = () => { if (visible.value) closeMenu() }

onMounted(() => {
  document.addEventListener('contextmenu', handleContextMenu)
  document.addEventListener('click', handleClick)
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('contextmenu', handleContextMenu)
  document.removeEventListener('click', handleClick)
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="menu-pop">
      <div
        v-if="visible"
        ref="menuRef"
        class="context-menu"
        :style="{ left: `${x}px`, top: `${y}px` }"
        @click.stop
      >
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
          <VIcon :src="item.icon" :size="16" class="menu-icon" />
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.context-menu {
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