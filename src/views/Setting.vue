<script setup lang="ts">
import { useSeo } from '../composables/seo'
import {
  RefTheme,
  RefLayout,
  RefBg,
  RefOpacity,
  setTheme,
  setLayout,
  setBg,
  setOpacity,
} from '../composables/pamin/setting'

useSeo({
  title: '设置',
  description: '调整博客的主题风格、布局、背景与透明度等外观设置。',
  path: '/setting',
})
</script>

<template>
  <div class="set">
    <div class="btn-area">
      <span>主题风格</span>
      <div class="btn-list">
        <button
          class="btn btn-theme"
          :class="RefTheme === 'blue' ? 'btn-on' : null"
          @click="setTheme('blue')"
        >
          天蓝色
        </button>
        <button
          class="btn btn-theme"
          :class="RefTheme === 'ink' ? 'btn-on' : null"
          @click="setTheme('ink')"
        >
          水墨风
        </button>
        <button
          class="btn btn-theme"
          :class="RefTheme === 'sakura' ? 'btn-on' : null"
          @click="setTheme('sakura')"
        >
          樱花粉
        </button>
        <button
          class="btn btn-theme"
          :class="RefTheme === 'purple' ? 'btn-on' : null"
          @click="setTheme('purple')"
        >
          紫罗兰
        </button>
        <button
          class="btn btn-theme"
          :class="RefTheme === 'cyan' ? 'btn-on' : null"
          @click="setTheme('cyan')"
        >
          天青色
        </button>
      </div>
    </div>

    <div class="btn-area">
      <span>布局风格</span>
      <div class="btn-list">
        <button
          class="btn btn-layout"
          :class="RefLayout === 'default' ? 'btn-on' : null"
          @click="setLayout('default')"
        >
          默认
        </button>
        <button
          class="btn btn-layout"
          :class="RefLayout === 'card' ? 'btn-on' : null"
          @click="setLayout('card')"
        >
          卡片式
        </button>
      </div>
    </div>

    <div class="opacity">
      <span>透明度调节</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        class="opacity-input"
        v-model.number="RefOpacity"
        @input="setOpacity()"
      />
    </div>

    <div class="btn-area">
      <span>背景</span>
      <div class="btn-list">
        <button
          class="btn btn-bg"
          :class="RefBg === 'video' ? 'btn-on' : null"
          @click="setBg('video')"
        >
          视频
        </button>
        <button class="btn btn-bg" :class="RefBg === 'img' ? 'btn-on' : null" @click="setBg('img')">
          图片
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.set {
  width: 100%;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ==========<主题>========== */
.btn-area {
  width: 100%;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  gap: var(--space-sm);
}

.btn-area span {
  color: var(--g-text);
}

.btn-list {
  width: 100%;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: row;
  gap: var(--space-lg);
}

.btn {
  min-width: 50px;
  height: auto;
  min-height: 80px;

  border-radius: var(--radius-lg);
  border: var(--border-width) solid color-mix(in srgb, var(--g-color) 15%, transparent);
  padding: var(--space-sm);

  background: rgba(
    var(--glass-r),
    var(--glass-g),
    var(--glass-b),
    calc(var(--glass-opacity) * 0.5)
  );
  color: var(--g-text);

  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  border-color: var(--g-color);
}

.btn-theme {
  width: 20%;
}

.btn-layout {
  width: 50%;
}

.btn-bg {
  width: 50%;
}

.btn-on {
  background-color: var(--g-color);
  border-color: var(--g-color);
  color: #fff;
}

/* ==========<透明度>========== */
.opacity {
  width: 100%;
  height: auto;

  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  gap: var(--space-sm);
}

.opacity span {
  color: var(--g-text);
}

/* ====================<滑块控件>==================== */
.opacity-input {
  width: 100%;
  height: 16px;
  /* ==========<滑块控件跨平台CSS>========== */
  -webkit-appearance: none; /* WebKit：去原生外观 */
  appearance: none; /* 标准语法 */
  background: transparent; /* 轨道背景让给伪元素画 */
  outline: none;
  cursor: pointer;
}

/* ===== 2) WebKit：轨道（Chrome/Edge/Safari） ===== */
.opacity-input::-webkit-slider-runnable-track {
  height: 6px; /* 轨道粗细 */
  border-radius: 3px;
  background: linear-gradient(
    /* 用两段色块模拟"进度填充"：左侧主题色，右侧底色 */ to right,
    var(--g-color) 0%,
    var(--g-color) var(--progress, 0%),
    color-mix(in srgb, var(--g-text) 25%, transparent) var(--progress, 0%),
    color-mix(in srgb, var(--g-text) 25%, transparent) 100%
  );
}

/* ===== 3) WebKit：滑钮 ===== */
.opacity-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  margin-top: -6px; /* 垂直居中：(6-18)/2 = -6 */
  border: 2px solid var(--g-color);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease; /* 拖动/hover滑钮放大+阴影加深 */
}

.opacity-input:hover::-webkit-slider-thumb,
.opacity-input:active::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
}

/* ===== 4) Firefox：轨道 ===== */
.opacity-input::-moz-range-track {
  height: 6px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--g-text) 25%, transparent);
}

/* ===== 5) Firefox：进度（FF 有原生伪元素，可直接上色） ===== */
.opacity-input::-moz-range-progress {
  height: 6px;
  border-radius: 3px;
  background: var(--g-color);
}

/* ===== 6) Firefox：滑钮 ===== */
.opacity-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: 2px solid var(--g-color);
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); /* 同WebKit滑钮放大 */
}

.opacity-input:hover::-moz-range-thumb,
.opacity-input:active::-moz-range-thumb {
  transform: scale(1.15);
}

/* ====================<响应式>==================== */
@media (max-width: 768px) {
  /* [响应式-sm] 手机：主题按钮一行放不下 5 个，改为允许换行 + 精确等分宽度；整体间距收窄 */
  .set {
    gap: var(--space-md);
  }
  .btn-list {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }
  .btn-theme {
    width: calc((100% - var(--space-sm) * 4) / 5);
    min-width: 0;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏：主题按钮改三列排布（自动换行成两行），按钮降低高度、文字缩小 */
  .btn {
    min-width: 0;
    min-height: 56px;
    font-size: 13px;
  }
  .btn-theme {
    width: calc((100% - var(--space-sm) * 2) / 3);
  }
}
</style>
