<script setup>
import { ref } from 'vue'

const toggleMobileMenu = () => {
  const leftAsider = document.querySelector('.left-asider-S');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  
  if (leftAsider && mobileMenuOverlay) {
    leftAsider.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
  }
}

const closeMobileMenu = () => {
  const leftAsider = document.querySelector('.left-asider-S');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  
  if (leftAsider && mobileMenuOverlay) {
    leftAsider.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
  }
}
</script>

<template>
  <div class="mobile-menu-container">
    <!-- 移动端菜单按钮 -->
    <div class="button-style mobile-menu-toggle" id="mobile-menu-toggle" @click="toggleMobileMenu">
      <img src="../../../assets/imgs/svg/order.svg" alt="菜单">
    </div>
    
    <!-- 移动端菜单遮罩层 -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay" @click="closeMobileMenu"></div>
  </div>
</template>

<style scoped>

/* 移动端菜单容器 - 只在768px以下显示 */
.mobile-menu-container {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-container {
    display: block;
  }
}

/* 移动端菜单遮罩层样式 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

.mobile-menu-overlay.active {
  display: block;
}
</style>