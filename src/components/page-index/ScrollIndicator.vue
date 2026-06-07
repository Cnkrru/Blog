<template>
  <div class="scroll-indicator">
    <div class="scroll-mouse">
      <div class="scroll-wheel"></div>
    </div>
    <span class="scroll-text">SCROLL</span>
  </div>
</template>

<style scoped>
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 10;
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border-radius: 12px;
  border: 2px solid;
  position: relative;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollWheel {
  0% {
  opacity: 1;
   transform: translateX(-50%) translateY(0);
   
}
  50% {
  opacity: 0.3;
   transform: translateX(-50%) translateY(8px);
   
}
  100% {
  opacity: 1;
   transform: translateX(-50%) translateY(0);
   
}
}

.scroll-text {
  font-size: 10px;
  letter-spacing: 0.3em;
  font-weight: 500;
}
</style>

<style scoped>
.scroll-mouse {
  border-color: var(--common-text);
  opacity: 0.3;
}

.scroll-wheel {
  background: var(--common-text);
  opacity: 0.3;
}

.scroll-text {
  color: var(--common-text);
  opacity: 0.3;
}
</style>
