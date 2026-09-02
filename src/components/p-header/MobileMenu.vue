<!-- review完成 -->

<script setup>
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const isMenuOpen = ref(false)
const overlayRef = ref(null)

//切换移动端侧边栏状态
const toggleMobileMenu = () => {
  //反转移动端侧边栏标志位
  isMenuOpen.value = !isMenuOpen.value

  const leftAsider = document.querySelector('.left-asider-s')
  const mobileMenuOverlay = overlayRef.value
  
  if (leftAsider && mobileMenuOverlay) {
    if (isMenuOpen.value) 
    {
      leftAsider.classList.add('active')              //加入左侧边栏
      mobileMenuOverlay.classList.add('active')       //加入遮盖层
    } 
    else 
    {
      leftAsider.classList.remove('active')           //移除
      mobileMenuOverlay.classList.remove('active')
    }
  }
}


// 点击遮罩层关闭菜单
const handleOverlayClick = (event) => {
  if (event.target.id === 'menu-overlay') {
    toggleMobileMenu()
  }
}

// 监听 ESC 键关闭菜单
const handleKeydown = (event) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    toggleMobileMenu()
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
  <div class="menu-container">
    <!-- 移动端菜单按钮 -->
    <VButton
      class="button-style v-btn-primary menu-button"
      id="menu-button"
      title="菜单"
      style="height:36px;min-width:36px"
      @click="toggleMobileMenu"
    >
      <VIcon :src="'menu.svg'" :size="24" />
    </VButton>
    
    <!-- 移动端菜单遮罩层 -->
    <Teleport to="body">
      <div
        class="menu-overlay"
        ref="overlayRef"
        id="menu-overlay"
        @click="handleOverlayClick"
      ></div>
    </Teleport>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.menu-container {
  display: none;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: none;
}

.menu-overlay.active {
  display: block;
}

.menu-overlay {
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
/* 按钮颜色由 Header.vue 统一管理 */

@media (max-width: 768px) {
  .menu-container {
    display: block;
  }
  .menu-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .menu-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 260px;
    right: 0;
    bottom: 0;
    z-index: 999;
  }

  .menu-overlay.active {
    display: block;
  }
}
</style>
