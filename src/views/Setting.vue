<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeo } from '../composables/common/seo'
import {
  setBlueTheme,
  setCyanTheme,
  setInkTheme,
  setPurpleTheme,
  setSakuraTheme,
  setDefaultLayout,
  setCardLayout,
  setImgBg,
  setVideoBg,
  setOpacity,
} from '../composables/pmain/setting'

onMounted(() => {
  setBlueTheme()
  setCyanTheme()
  setInkTheme()
  setPurpleTheme()
  setSakuraTheme()
  setDefaultLayout()
  setCardLayout()
  setImgBg()
  setVideoBg()
  setOpacity()
})

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
          id="blue"
          class="btn btn-theme"
        >
          天蓝色
        </button>
        <button
          id="ink"
          class="btn btn-theme"
        >
          水墨风
        </button>
        <button
          id="sakura"
          class="btn btn-theme"
        >
          樱花粉
        </button>
        <button
          id="purple"
          class="btn btn-theme"
        >
          紫罗兰
        </button>
        <button
          id="cyan"
          class="btn btn-theme"
        >
          天青色
        </button>
      </div>
    </div>

    <div class="btn-area">
      <span>布局风格</span>
      <div class="btn-list">
        <button
          id="default"
          class="btn btn-layout"
        >
          默认
        </button>
        <button
          id="card"
          class="btn btn-layout"
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
      />
    </div>

    <div class="btn-area">
      <span>背景</span>
      <div class="btn-list">
        <button
          id="video"
          class="btn btn-bg"
        >
          视频
        </button>
        <button
          id="img"
          class="btn btn-bg"
        >
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

/* 激活态：由 body 上的状态类派生，无需 JS 同步按钮 */
body.blue #blue,
body.ink #ink,
body.sakura #sakura,
body.purple #purple,
body.cyan #cyan,
body.default #default,
body.card #card,
body.bg-img #img,
body:has(.bg-video) #video {
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

.opacity-input {
  width: 100%;
  height: 16px;
  cursor: pointer;
}
</style>
