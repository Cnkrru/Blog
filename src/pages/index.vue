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

</style>
