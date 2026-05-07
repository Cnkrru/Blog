<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  updateDOM()
}

const closeMobileMenu = () => {
  isMenuOpen.value = false
  updateDOM()
}

const updateDOM = () => {
  const leftAsider = document.querySelector('.left-asider-S')
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay')
  
  if (leftAsider && mobileMenuOverlay) {
    if (isMenuOpen.value) {
      leftAsider.classList.add('active')
      mobileMenuOverlay.classList.add('active')
    } else {
      leftAsider.classList.remove('active')
      mobileMenuOverlay.classList.remove('active')
    }
  }
}

// 点击遮罩层关闭菜单
const handleOverlayClick = (event) => {
  if (event.target.id === 'mobile-menu-overlay') {
    closeMobileMenu()
  }
}

// 监听 ESC 键关闭菜单
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="mobile-menu-container">
    <!-- 移动端菜单按钮 -->
    <div 
      class="button-style mobile-menu-toggle" 
      id="mobile-menu-toggle" 
      @click="toggleMobileMenu"
    >
      <img src="../../assets/imgs/svg/order.svg" alt="菜单">
    </div>
    
    <!-- 移动端菜单遮罩层 -->
    <div 
      class="mobile-menu-overlay" 
      id="mobile-menu-overlay" 
      @click="handleOverlayClick"
    ></div>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.mobile-menu-container {
  display: none;
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: none;
}

.mobile-menu-overlay.active {
  display: block;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.mobile-menu-overlay {
  background: rgba(0, 0, 0, 0.5);
}
/* 按钮颜色由 Header.vue 统一管理 */
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
@media (max-width: calc(var(--sm) - 1px)) {
  .mobile-menu-toggle {
      display: none;
  }
}

@media (max-width: var(--md)) {
  .mobile-menu-container {
    display: block;
  }
  .mobile-menu-toggle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
  }

  .mobile-menu-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
  }

  .mobile-menu-overlay.active {
      display: block;
  }
}

@media (max-width: var(--lg)) {
    .mobile-menu-toggle {
        display: none;
    }
    
    .mobile-menu-overlay {
        display: none;
    }
}
</style>
