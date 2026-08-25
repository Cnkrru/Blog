<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../../stores/theme'
import minusSvg from '@/assets/svg/minus.svg?raw'
import plusSvg from '@/assets/svg/plus.svg?raw'

const theme = useThemeStore()

const MIN = 14
const MAX = 20

const decrease = () => theme.setArticleFontSize(theme.articleFontSize - 1)
const increase = () => theme.setArticleFontSize(theme.articleFontSize + 1)
const reset = () => theme.setArticleFontSize(16)

const progress = computed(() =>
  ((theme.articleFontSize - MIN) / (MAX - MIN)) * 100
)

const isAtMin = computed(() => theme.articleFontSize <= MIN)
const isAtMax = computed(() => theme.articleFontSize >= MAX)
</script>

<template>
  <div class="font-size-control" title="文章字体大小">
    <button
      class="size-btn"
      @click="decrease"
      :disabled="isAtMin"
      aria-label="缩小字体"
    >
      <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="minusSvg"></span>
    </button>

    <div class="size-display" @click="reset" title="点击重置为 16px">
      <span class="size-value">{{ theme.articleFontSize }}</span>
      <span class="size-unit">px</span>
      <div class="size-bar">
        <div class="size-bar-fill" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>

    <button
      class="size-btn"
      @click="increase"
      :disabled="isAtMax"
      aria-label="放大字体"
    >
      <span class="svg-icon" :style="{ width: '14px', height: '14px' }" v-html="plusSvg"></span>
    </button>
  </div>
</template>

<style scoped>
.font-size-control {
  display: flex;
  align-items: center;
  height: 36px;
  border-radius: 18px;
  background: var(--common-color-1);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
  padding: 0 4px;
  gap: 0;
  flex-shrink: 0;
}

.size-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #fff;
  transition: background-color 0.2s, transform 0.2s, opacity 0.2s;
  flex-shrink: 0;
  padding: 0;
}

.size-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.size-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.size-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.size-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 100%;
  cursor: pointer;
  position: relative;
  padding: 0 4px;
  user-select: none;
  gap: 1px;
}

.size-value {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  letter-spacing: 0.5px;
  transition: transform 0.2s;
}

.size-display:hover .size-value {
  transform: scale(1.1);
}

.size-unit {
  font-size: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.size-bar {
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: absolute;
  bottom: 4px;
  left: 0;
}

.size-bar-fill {
  height: 100%;
  border-radius: 1px;
  background-color: rgba(255, 255, 255, 0.7);
  transition: width 0.2s ease;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .font-size-control {
    height: 32px;
    border-radius: 16px;
    padding: 0 3px;
  }

  .size-btn {
    width: 24px;
    height: 24px;
  }

  .size-display {
    min-width: 30px;
    padding: 0 3px;
  }

  .size-value {
    font-size: 12px;
  }

  .size-unit {
    font-size: 7px;
  }
}
</style>