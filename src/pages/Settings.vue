<script setup>
import { computed } from 'vue'
import { useHead } from '@vueuse/head'
import { useThemeStore } from '../stores'
import FontSizeControl from '../components/p-center/FontSizeControl.vue'

const themeStore = useThemeStore()
const currentStyle = computed(() => themeStore.currentStyle)
const currentLayout = computed(() => themeStore.currentLayout)
const glassAlpha = computed(() => themeStore.glassAlpha)
const bgType = computed(() => themeStore.bgType)

const isAutoSwitch = computed(() => themeStore.isAutoSwitch)
const setStyle = (style) => themeStore.setStyle(style)
const setLayout = (layout) => themeStore.setLayout(layout)
const setBgType = (type) => themeStore.setBgType(type)
const toggleAutoSwitch = () => themeStore.setAutoSwitch(!isAutoSwitch.value)

let glassSaveTimer = null
const onGlassInput = (e) => {
  const val = Number(e.target.value)
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
        <button
          class="style-opt"
          :class="{ active: currentStyle === 'purple' }"
          @click="setStyle('purple')"
          aria-label="紫色风格"
        >
          <span class="opt-name">紫色风</span>
          <span class="opt-desc">紫罗兰调 · 夜幕星河</span>
        </button>
        <button
          class="style-opt"
          :class="{ active: currentStyle === 'cyan' }"
          @click="setStyle('cyan')"
          aria-label="青色风格"
        >
          <span class="opt-name">青色风</span>
          <span class="opt-desc">冰蓝基调 · 深海夜色</span>
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
        <button
          class="style-opt"
          :class="{ active: currentLayout === 'minimal' }"
          @click="setLayout('minimal')"
          aria-label="极简模式"
        >
          <span class="opt-name">极简</span>
          <span class="opt-desc">仅保留 Header + 背景，Ctrl+C 退出</span>
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

    <!-- 系统主题跟随 -->
    <section class="setting-block">
      <h3 class="setting-title">系统主题跟随</h3>
      <div class="toggle-row">
        <button
          class="toggle-switch"
          :class="{ active: isAutoSwitch }"
          @click="toggleAutoSwitch"
          :aria-label="isAutoSwitch ? '关闭系统主题跟随' : '开启系统主题跟随'"
          role="switch"
          :aria-checked="isAutoSwitch"
        >
          <span class="toggle-track">
            <span class="toggle-thumb"></span>
          </span>
        </button>
        <span class="toggle-label">{{ isAutoSwitch ? '已开启' : '已关闭' }}</span>
      </div>
      <p class="slider-hint">开启后自动跟随系统亮暗模式，手动切换主题会临时覆盖，下次系统变化时恢复跟随</p>
    </section>

    <!-- 背景类型 -->
    <section class="setting-block">
      <h3 class="setting-title">背景类型</h3>
      <div class="option-row">
        <button
          class="style-opt"
          :class="{ active: bgType === 'image' }"
          @click="setBgType('image')"
          aria-label="图片背景"
        >
          <span class="opt-name">图片背景</span>
          <span class="opt-desc">静态背景图片，节省性能</span>
        </button>
        <button
          class="style-opt"
          :class="{ active: bgType === 'video' }"
          @click="setBgType('video')"
          aria-label="视频背景"
        >
          <span class="opt-name">视频背景</span>
          <span class="opt-desc">动态视频背景，播放 bg.mp4</span>
        </button>
      </div>
    </section>

    <!-- 文章字号 -->
    <section class="setting-block">
      <h3 class="setting-title">文章字号</h3>
      <div class="fontsize-row">
        <FontSizeControl />
      </div>
      <p class="slider-hint">调整文章正文的字体大小，点击数字可重置为 16px</p>
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

/* 开关组件 */
.toggle-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-switch {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.toggle-track {
  display: block;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: var(--track-bg, #ccc);
  position: relative;
  transition: background-color 0.25s ease;
}

.toggle-switch.active {
  --track-bg: var(--common-color-1);
  --thumb-translate: translateX(20px);
}

.toggle-thumb {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 2px;
  left: 2px;
  transform: var(--thumb-translate, none);
  transition: transform 0.25s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-label {
  font-size: 14px;
  color: var(--common-text);
  opacity: 0.7;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .settings-content {
    padding-top: 0;
  }

  .setting-block {
    margin-bottom: 20px;
  }

  .setting-title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .option-row {
    gap: 10px;
  }

  .style-opt {
    min-width: 100%;
    padding: 12px 14px;
    gap: 2px;
  }

  .opt-name {
    font-size: 14px;
  }

  .opt-desc {
    font-size: 11px;
  }

  .slider-row {
    gap: 10px;
  }

  .slider-value {
    min-width: 38px;
    font-size: 13px;
  }

  .slider-hint {
    font-size: 11px;
  }

  .setting-tip {
    font-size: 12px;
  }
}

/* 文章字号 */
.fontsize-row {
  display: flex;
  justify-content: flex-start;
}
</style>
