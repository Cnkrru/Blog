<script setup>
import IndexLogo from '../components/p-index/IndexLogo.vue'
import IndexNavbar from '../components/p-index/IndexNavbar.vue'
import HeroContent from '../components/p-index/HeroContent.vue'
import ScrollIndicator from '../components/p-index/ScrollIndicator.vue'
import NetworkParticles from '../components/p-index/NetworkParticles.vue'
import WelcomeNotification from '../components/api/WelcomeNotification.vue'

import '../assets/css/index.css'
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

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.gradient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--gradient-bg);
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

@media (max-width: 768px) {
  .navbar {
    padding: 1.5rem 1.5rem;
  }
}

@media (max-width: 480px) {
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
@media (max-width: 480px) {
  .hero-container {
    overflow-x: hidden;
  }
  
  .navbar {
    flex-wrap: wrap;
  }
}
</style>