<script setup>
import IndexLogo from '../components/page-index/IndexLogo.vue'
import IndexNavbar from '../components/page-index/IndexNavbar.vue'
import HeroContent from '../components/page-index/HeroContent.vue'
import ScrollIndicator from '../components/page-index/ScrollIndicator.vue'
import NetworkParticles from '../components/page-index/NetworkParticles.vue'
import WelcomeNotification from '../components/api/WelcomeNotification.vue'
</script>

<template>
  <div class="hero-container">
    <WelcomeNotification />

    <div class="gradient-bg"></div>

    <NetworkParticles />

    <nav class="navbar">
      <IndexLogo />
      <IndexNavbar />
    </nav>

    <HeroContent />

    <ScrollIndicator />
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  transition: all 0.3s ease;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  transition: all 0.3s ease;
}

.navbar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 4rem;
  z-index: 100;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.hero-container {
  background: linear-gradient(to bottom, var(--common-color-1), var(--common-color-2));
}

.gradient-bg {
 background: linear-gradient(to bottom, var(--common-color-1), var(--common-color-2));
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
@media (max-width: var(--md)) {
  .navbar {
    padding: 1.5rem 1.5rem;
  }
}

@media (max-width: var(--sm)) {
  .navbar {
    padding: 1rem 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero-container {
    min-height: 100vh;
    overflow-x: hidden;
  }
}

/* 防止移动端横向滚动 */
@media (max-width: var(--sm)) {
  .hero-container {
    overflow-x: hidden;
  }
  
  .navbar {
    flex-wrap: wrap;
  }
}
</style>