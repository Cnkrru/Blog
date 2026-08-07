<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useThemeStore } from '../stores'

const themeStore = useThemeStore()
const currentStyle = computed(() => themeStore.currentStyle)
const currentLayout = computed(() => themeStore.currentLayout)
const glassAlpha = computed(() => themeStore.glassAlpha)

const setStyle = (style: 'ink' | 'sakura') => themeStore.setStyle(style)
const setLayout = (layout: 'card' | 'compact') => themeStore.setLayout(layout)
let glassSaveTimer: ReturnType<typeof setTimeout> | null = null
const onGlassInput = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value)
  themeStore.setGlassAlphaLive(val)          // 实时改 CSS 变量（不写存储）
  if (glassSaveTimer) clearTimeout(glassSaveTimer)
  glassSaveTimer = setTimeout(() => themeStore.savePreference(), 150)  // 节流落盘
}

useHead({
  title: '设置 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: '主题与风格设置' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <div class="center-head-card">
    <h2>设置</h2>
  </div>
  <hr>
  <div class="center-card-content settings-content">

    <!-- 风格方案 -->
    <section class="setting-block">
      <h3 class="setting-title">风格方案</h3>
      <div class="option-row">
        <button
          class="style-opt"
          :class="{ active: currentStyle === 'ink' }"
          @click="setStyle('ink')"
          aria-label="水墨风格"
        >
          <span class="opt-name">水墨风</span>
          <span class="opt-desc">宣纸米白 · 朱砂点睛</span>
        </button>
        <button
          class="style-opt"
          :class="{ active: currentStyle === 'sakura' }"
          @click="setStyle('sakura')"
          aria-label="樱粉风格"
        >
          <span class="opt-name">樱粉风</span>
          <span class="opt-desc">粉色基调 · 梦幻渐变</span>
        </button>
      </div>
    </section>

    <!-- 布局模式 -->
    <section class="setting-block">
      <h3 class="setting-title">布局模式</h3>
      <div class="option-row">
        <button
          class="style-opt"
          :class="{ active: currentLayout === 'card' }"
          @click="setLayout('card')"
          aria-label="卡片布局"
        >
          <span class="opt-name">卡片式</span>
          <span class="opt-desc">区域之间留有间隔</span>
        </button>
        <button
          class="style-opt"
          :class="{ active: currentLayout === 'compact' }"
          @click="setLayout('compact')"
          aria-label="紧凑布局"
        >
          <span class="opt-name">无空隙</span>
          <span class="opt-desc">四大区域紧贴相连</span>
        </button>
      </div>
    </section>

    <!-- 玻璃风透明度 -->
    <section class="setting-block">
      <h3 class="setting-title">玻璃风透明度</h3>
      <div class="slider-row">
        <input
          class="glass-slider"
          type="range"
          min="0.2"
          max="1"
          step="0.02"
          :value="glassAlpha"
          @input="onGlassInput"
        >
        <span class="slider-value">{{ Math.round(glassAlpha * 100) }}%</span>
      </div>
      <p class="slider-hint">越低越通透（MAC 玻璃感越强），越高越实色</p>
    </section>

    <p class="setting-tip">设置会自动保存，刷新后依然生效。</p>
  </div>
</template>

<style scoped>
.settings-content {
  padding-top: 4px;
}

.setting-block {
  margin-bottom: 24px;
}

.setting-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--common-text);
}

.option-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.style-opt {
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--common-color-1) 15%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.5));
  color: var(--common-text);
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.style-opt:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  border-color: var(--common-color-1);
}

.style-opt.active {
  background: var(--common-color-1);
  border-color: var(--common-color-1);
  color: var(--common-content);
}

.opt-name {
  font-size: 15px;
  font-weight: 600;
}

.opt-desc {
  font-size: 12px;
  opacity: 0.7;
}



.setting-tip {
  font-size: 13px;
  opacity: 0.55;
  margin-top: 8px;
}

/* 玻璃风透明度滑块 */
.slider-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.glass-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--common-color-1), var(--common-hover));
  outline: none;
  cursor: pointer;
}

.glass-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--common-color-1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}

.glass-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--common-color-1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  cursor: pointer;
}

.slider-value {
  min-width: 44px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: var(--common-color-1);
}

.slider-hint {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 6px;
}
</style>
