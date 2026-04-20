<script setup>
import IndexLogo from '../components/index/IndexLogo.vue'
import IndexNavbar from '../components/index/IndexNavbar.vue'
import HeroContent from '../components/index/HeroContent.vue'
import ScrollIndicator from '../components/index/ScrollIndicator.vue'
import NetworkParticles from '../components/index/NetworkParticles.vue'
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
</style>