<script setup lang="ts">
import IndexLogo from '../components/page-index/IndexLogo.vue'
import IndexNavbar from '../components/page-index/IndexNavbar.vue'
import HeroContent from '../components/page-index/HeroContent.vue'
import ScrollIndicator from '../components/page-index/ScrollIndicator.vue'
import NetworkParticles from '../components/page-index/NetworkParticles.vue'
</script>

<template>
  <div class="hero-container">
    <NetworkParticles />

    <header class="index-header">
      <IndexLogo />
      <IndexNavbar />
    </header>

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
}

.index-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .index-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
}
</style>
