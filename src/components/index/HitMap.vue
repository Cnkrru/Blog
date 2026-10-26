<script setup lang="ts">
import { onMounted } from 'vue'
import { hitmap } from '@/composables/index.ts'
import { refText } from '@/composables/i18n.ts'

const {
  years,
  selectedMonth,
  selectedYear,
  openYear,
  openMonth,
  daysData,
  isLoading,
  level,
  toggleYear,
  toggleMonth,
  setYear,
  setMonth,
} = hitmap

onMounted(() => {
  hitmap.load()
})
</script>

<template>
  <div class="heatmap-wrapper">
    <div class="heatmap-header">
      <div class="custom-select">
        <button class="select-trigger" :class="{ active: openYear }" @click="toggleYear">
          <span class="select-value">{{
            selectedYear === null ? '' : refText.yearLabel(selectedYear)
          }}</span>
          <span class="select-arrow" :class="{ rotated: openYear }"></span>
        </button>
        <transition name="dropdown">
          <ul v-if="openYear" class="dropdown-menu" @click.stop>
            <li
              v-for="y in years"
              :key="y"
              class="dropdown-item"
              :class="{ active: y === selectedYear }"
              @click="setYear(y)"
            >
              {{ refText.yearLabel(y) }}
            </li>
          </ul>
        </transition>
      </div>

      <h3 class="heatmap-title">{{ refText.heatmapTitle }}</h3>

      <div class="custom-select">
        <button
          class="select-trigger"
          :class="{ active: openMonth }"
          :disabled="isLoading"
          @click="toggleMonth"
        >
          <span class="select-value">{{ refText.months[selectedMonth - 1] }}</span>
          <span class="select-arrow" :class="{ rotated: openMonth }"></span>
        </button>
        <transition name="dropdown">
          <ul v-if="openMonth" class="dropdown-menu" @click.stop>
            <li
              v-for="(m, i) in refText.months"
              :key="i"
              class="dropdown-item"
              :class="{ active: i + 1 === selectedMonth }"
              @click="setMonth(i + 1)"
            >
              {{ m }}
            </li>
          </ul>
        </transition>
      </div>
    </div>

    <div class="heatmap-content">
      <div v-if="daysData?.days?.length" class="heatmap-grid">
        <span
          v-for="day in daysData.days"
          :key="day.date"
          class="heatmap-cell"
          :class="['heatmap-lv' + level(day)]"
          :title="refText.heatmapTip(day.date, day.activity)"
        ></span>
      </div>
      <div v-else class="no-data">{{ refText.heatmapNoData }}</div>
    </div>

    <div class="heatmap-legend">
      <span class="legend-text">{{ refText.heatmapLess }}</span>
      <div class="legend-cells">
        <div class="legend-cell heatmap-lv0"></div>
        <div class="legend-cell heatmap-lv1"></div>
        <div class="legend-cell heatmap-lv2"></div>
        <div class="legend-cell heatmap-lv3"></div>
        <div class="legend-cell heatmap-lv4"></div>
      </div>
      <span class="legend-text">{{ refText.heatmapMore }}</span>
    </div>
  </div>
</template>

<style scoped>
/* ============================== 容器（透明，对齐blog-map） ============================== */
.heatmap-wrapper {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  position: relative;
  min-height: 200px;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

/* ============================== 暂无数据 ============================== */
.no-data {
  text-align: center;
  padding: 30px;
  font-size: 13px;
  color: var(--g-text);
  opacity: 0.4;
}

/* ============================== Header ============================== */
.heatmap-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.heatmap-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--g-text);
  margin: 0;
  opacity: 0.6;
}

/* ============================== 下拉 ============================== */
.custom-select {
  position: relative;
  flex-shrink: 0;
}

.select-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  color: var(--g-text);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
  border: 1px solid color-mix(in srgb, var(--g-text) 12%, transparent);
  backdrop-filter: blur(8px);
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.select-trigger:hover:not(:disabled) {
  border-color: var(--g-color);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 25%, transparent);
}

.select-trigger.active {
  border-color: var(--g-color);
  background: color-mix(in srgb, var(--g-color) 10%, transparent);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--g-color) 30%, transparent);
}

.select-trigger:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.select-value {
  line-height: 1;
}

.select-arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid var(--g-text);
  transition: transform 0.2s ease;
  opacity: 0.6;
}

.select-arrow.rotated {
  transform: rotate(180deg);
  opacity: 1;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 120px;
  max-height: 240px;
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--g-text) 12%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 8px 24px var(--g-shadow);
  z-index: 20;
}

.dropdown-item {
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  color: var(--g-text);
  font-weight: 500;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.dropdown-item:hover {
  background: color-mix(in srgb, var(--g-color) 12%, transparent);
}

.dropdown-item.active {
  background: var(--g-color);
  color: #fff;
  font-weight: 600;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ============================== 网格 ============================== */
.heatmap-content {
  width: 100%;
  display: flex;
  justify-content: center;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  max-width: 360px;
  width: 100%;
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}

.heatmap-cell:hover {
  transform: scale(1.25);
  border-color: var(--g-color);
  z-index: 1;
}

.heatmap-lv0 {
  background: color-mix(in srgb, var(--g-text) 6%, transparent);
  border-color: color-mix(in srgb, var(--g-text) 6%, transparent);
}

.heatmap-lv1 {
  background: var(--g-color);
  opacity: 0.25;
}
.heatmap-lv2 {
  background: var(--g-color);
  opacity: 0.45;
}
.heatmap-lv3 {
  background: var(--g-color);
  opacity: 0.65;
}
.heatmap-lv4 {
  background: var(--g-color);
  opacity: 0.85;
}

.heatmap-lv1:hover,
.heatmap-lv2:hover,
.heatmap-lv3:hover,
.heatmap-lv4:hover {
  opacity: 0.95;
}

/* ============================== 图例 ============================== */
.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 11px;
  color: var(--g-text);
  opacity: 0.5;
}

.legend-cells {
  display: flex;
  gap: 5px;
}

.legend-cell {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

/* ====================<响应式>==================== */

@media (max-width: 1024px) {
  /* [响应式-md] 平板 */
  .heatmap-header {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  /* [响应式-sm] 手机 */
  .heatmap-wrapper {
    gap: 12px;
    width: 90%;
  }
  .heatmap-grid {
    gap: 4px;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  /* [响应式-xs] 窄屏 */
  .select-trigger {
    padding: 4px 10px;
    font-size: 12px;
  }
  .dropdown-menu {
    font-size: 12px;
  }
  .heatmap-grid {
    gap: 3px;
  }
}
</style>
