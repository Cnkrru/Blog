<template>
  <div class="scroll-indicator">
    <div class="scroll-line"></div>
    <span class="scroll-text">Scroll</span>
  </div>
</template>

<script setup>
</script>

<style scoped>
.scroll-indicator {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
}

.scroll-line {
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, var(--scroll-accent-primary), transparent);
}

.scroll-text {
  font-size: 0.75rem;
  color: var(--scroll-text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
</style>
