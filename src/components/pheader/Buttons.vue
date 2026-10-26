<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import Light from '../icon/Light.vue'
import Dark from '../icon/Dark.vue'
import Immersive from '../icon/Immersive.vue'
import Music from '../icon/Music.vue'
import Menu from '../icon/Menu.vue'
import TranslateIcon from '../icon/TranslateIcon.vue'
import {
  refLd,
  setImmersive,
  toggleLd,
  toggleUi,
  refLocaleOpen,
  refLocaleMenuPos,
  toggleLocaleMenu,
  chooseLocale,
  localeTriggerKeydown,
  localeMenuKeydown,
  unmountLocaleMenu,
} from '@/composables/pheader.ts'
import { refLocale, refText } from '@/composables/i18n.ts'
import { toggleSidebar } from '@/composables/psidebar.ts'

// Header 卸载（如回到首页）时收掉语言菜单的全局监听
onBeforeUnmount(unmountLocaleMenu)
</script>

<template>
  <div class="button-list">
    <button class="h-button menu-btn" :title="refText.menu" @click="toggleSidebar">
      <Menu class="icon" />
    </button>
    <!-- 明暗切换 @click 移到 button 上，原先绑在图标子组件导致仅点到 svg 才生效 -->
    <button class="h-button" @click="toggleLd()">
      <Light class="icon" v-if="refLd === 'light'" />
      <Dark class="icon" v-if="refLd === 'dark'" />
    </button>
    <button class="h-button immersive-btn" @click="setImmersive()">
      <Immersive class="icon" />
    </button>
    <button class="h-button" @click="toggleUi()"><Music class="icon" /></button>
    <button
      class="h-button locale-btn"
      :title="refText.language"
      :aria-label="refText.language"
      aria-haspopup="menu"
      :aria-expanded="refLocaleOpen"
      @click="toggleLocaleMenu"
      @keydown="localeTriggerKeydown"
    >
      <TranslateIcon class="icon" />
    </button>
  </div>

  <Teleport to="body">
    <Transition name="locale-fade">
      <ul
        v-if="refLocaleOpen"
        class="locale-menu"
        role="menu"
        :aria-label="refText.language"
        :style="{ left: refLocaleMenuPos.left + 'px', top: refLocaleMenuPos.top + 'px' }"
        @keydown="localeMenuKeydown"
      >
        <li role="none">
          <button
            type="button"
            class="locale-item"
            :class="{ on: refLocale === 'zh' }"
            role="menuitemradio"
            :aria-checked="refLocale === 'zh'"
            tabindex="-1"
            @click="chooseLocale('zh')"
          >
            <span>{{ refText.localeZh }}</span>
            <svg
              v-if="refLocale === 'zh'"
              class="locale-check"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </li>
        <li role="none">
          <button
            type="button"
            class="locale-item"
            :class="{ on: refLocale === 'en' }"
            role="menuitemradio"
            :aria-checked="refLocale === 'en'"
            tabindex="-1"
            @click="chooseLocale('en')"
          >
            <span>{{ refText.localeEn }}</span>
            <svg
              v-if="refLocale === 'en'"
              class="locale-check"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </li>
      </ul>
    </Transition>
  </Teleport>
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

.h-button {
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

.h-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--g-color) 40%, transparent);
}

.icon {
  color: white;
}

/* 汉堡键：桌面隐藏，仅移动端(≤768)显示 */
.menu-btn {
  display: none;
}

/* ============================== 语言菜单 ============================== */
.locale-menu {
  position: fixed;
  z-index: 10000;

  width: 168px;
  margin: 0;
  padding: 4px;
  list-style: none;

  border-radius: var(--radius-md);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 16%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-opacity));
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.14);
}

.locale-item {
  width: 100%;
  height: 38px;
  padding: 0 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);

  border: none;
  border-radius: var(--radius-sm);
  background: transparent;

  font: inherit;
  font-size: 14px;
  line-height: 1;
  text-align: left;
  color: var(--g-text);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.locale-item:hover {
  background: color-mix(in srgb, var(--g-color) 14%, transparent);
}

.locale-item:focus-visible {
  outline: 2px solid var(--g-color);
  outline-offset: -2px;
  background: color-mix(in srgb, var(--g-color) 14%, transparent);
}

.locale-item.on {
  color: var(--g-color);
  font-weight: 600;
}

.locale-check {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.locale-fade-enter-active,
.locale-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.locale-fade-enter-from,
.locale-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ====================<响应式>==================== */

@media (max-width: 768px) {
  /* [响应式-sm] 手机 */
  .menu-btn {
    display: flex;
  }
  .immersive-btn {
    display: none;
  }
  .button-list {
    gap: var(--space-sm);
  }
  .h-button {
    width: 38px;
    height: 38px;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .button-list {
    gap: var(--space-sm);
  }
  .h-button {
    width: 36px;
    height: 36px;
  }
}
</style>
