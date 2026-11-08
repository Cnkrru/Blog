<script setup lang="ts">
import Light from '../icon/Light.vue'
import Dark from '../icon/Dark.vue'
import Immersive from '../icon/Immersive.vue'
import Music from '../icon/Music.vue'
import Menu from '../icon/Menu.vue'
import { refLd, setImmersive, setLd, toggleUi } from '@/composables/pheader.ts'
import { toggleSidebar } from '@/composables/psidebar.ts'
</script>

<template>
  <div class="button-list">
    <!-- 侧边栏 -->
    <button
      class="button sidebar-btn"
      title="菜单"
      @click="toggleSidebar"
    >
      <Menu class="icon" />
    </button>
    <!-- 亮暗调节 -->
    <button
      class="button"
      v-if="refLd === 'light'"
      @click="setLd('dark')"
    >
      <Light class="icon" />
    </button>
    <button
      class="button"
      v-if="refLd === 'dark'"
      @click="setLd('light')"
    >
      <Dark class="icon" />
    </button>
    <!-- 沉浸阅读 -->
    <button
      class="button immersive-btn"
      @click="setImmersive()"
    >
      <Immersive class="icon" />
    </button>
    <!-- 音乐播放 -->
    <button
      class="button"
      @click="toggleUi()"
    >
      <Music class="icon" />
    </button>
  </div>
</template>

<style scoped>
.button-list {
  width: fit-content;
  height: 80%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);
}

.button {
  width: 40px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: var(--radius-full);
  background-color: var(--g-color);

  border: var(--border-width) solid var(--g-color);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 30%, transparent);
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--g-color) 40%, transparent);
}

.icon {
  color: white;
}

/* 汉堡键：桌面隐藏，仅移动端(≤768)显示 */
.sidebar-btn {
  display: none;
}

@media (max-width: 768px) {
  .sidebar-btn {
    display: flex;
  }
  .immersive-btn {
    display: none;
  }
  .button-list {
    gap: var(--space-sm);
  }
  .button {
    width: 38px;
    height: 38px;
  }
}

@media (max-width: 480px) {
  .button-list {
    gap: var(--space-sm);
  }
  .button {
    width: 36px;
    height: 36px;
  }
}
</style>
