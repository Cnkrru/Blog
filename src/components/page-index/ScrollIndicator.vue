<template>
  <div class="scroll-indicator">
    <div class="scroll-line"></div>
    <span class="scroll-text">Scroll</span>
  </div>
</template>

<script setup>
</script>

<!-- 布局样式 -->
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
}

.scroll-text {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
</style>

<!-- 颜色样式 -->
<style scoped>
.scroll-line {
  background: linear-gradient(to bottom, var(--common-color-1), transparent);
}

.scroll-text {
  color: var(--common-text);
}
</style>

<!-- 响应式设计媒体查询 -->
<style scoped>
</style>
