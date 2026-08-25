<script setup>
import { ref, computed } from 'vue'
import calendarSvg from '@/assets/svg/calendar.svg?raw'
import refreshCwSvg from '@/assets/svg/refresh-cw.svg?raw'
import chevronDownSvg from '@/assets/svg/chevron-down.svg?raw'

const props = defineProps(['date', 'updated', 'history'])

const expanded = ref(false)

const parsedHistory = computed(() => {
  if (!props.history || props.history.length === 0) return []
  return props.history.map(item => {
    const trimmed = item.trim()
    const spaceIdx = trimmed.indexOf(' ')
    if (spaceIdx > 0) {
      return { date: trimmed.slice(0, spaceIdx), desc: trimmed.slice(spaceIdx + 1) }
    }
    return { date: trimmed, desc: '' }
  })
})

const hasHistory = computed(() => parsedHistory.value.length > 0)
const hasUpdated = computed(() => !!props.updated && props.updated !== props.date)

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <div class="edit-history-wrapper">
    <div class="edit-history-card">
      <!-- 发布信息行 -->
      <div class="date-row">
        <div class="date-block">
          <div class="date-icon-wrap">
            <span class="svg-icon" :style="{ width: '15px', height: '15px' }" v-html="calendarSvg"></span>
          </div>
          <div class="date-info">
            <span class="date-label">发布</span>
            <span class="date-value">{{ date }}</span>
          </div>
        </div>

        <div v-if="hasUpdated" class="date-block">
          <div class="date-icon-wrap is-update">
            <span class="svg-icon" :style="{ width: '15px', height: '15px' }" v-html="refreshCwSvg"></span>
          </div>
          <div class="date-info">
            <span class="date-label">更新</span>
            <span class="date-value">{{ updated }}</span>
          </div>
        </div>
      </div>

      <!-- 编辑历史 -->
      <div v-if="hasHistory" class="history-section">
        <button class="history-toggle" @click="toggle">
          <div class="toggle-line"></div>
          <span class="svg-icon" :style="{ width: '12px', height: '12px' }" :class="{ rotated: expanded }" v-html="chevronDownSvg"></span>
          <span class="toggle-text">{{ expanded ? '收起修订记录' : '展开修订记录' }}</span>
          <span class="history-count">{{ parsedHistory.length }}</span>
        </button>

        <div v-if="expanded" class="history-timeline">
          <div class="timeline-track"></div>
          <div v-for="(item, i) in parsedHistory" :key="i" class="timeline-item">
            <div class="timeline-dot" :class="{ latest: i === 0 }"></div>
            <div class="timeline-content">
              <span class="timeline-date">{{ item.date }}</span>
              <span class="timeline-desc" v-if="item.desc">{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── 布局 ── */
.edit-history-wrapper {
  width: 100%;
  margin: 8px 0;
}

.edit-history-card {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.3);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

/* ── 日期行 ── */
.date-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.date-block {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--common-color-1) 12%, transparent);
  color: var(--common-color-1);
}

.date-icon-wrap.is-update {
  background: color-mix(in srgb, var(--common-color-1) 8%, transparent);
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.date-label {
  font-size: 11px;
  opacity: 0.5;
  line-height: 1;
}

.date-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--common-text);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1;
}

/* ── 编辑历史 ── */
.history-section {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid color-mix(in srgb, var(--common-text) 6%, transparent);
}

.history-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: none;
  cursor: pointer;
  background: none;
  font-family: inherit;
  color: var(--common-text);
  opacity: 0.45;
  transition: opacity 0.2s ease;
  width: 100%;
}

.history-toggle:hover {
  opacity: 0.7;
}

.toggle-line {
  height: 1px;
  flex: 1;
  min-width: 20px;
  background: color-mix(in srgb, var(--common-text) 12%, transparent);
}

.history-toggle svg {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.history-toggle svg.rotated {
  transform: rotate(90deg);
}

.toggle-text {
  font-size: 12px;
  white-space: nowrap;
}

.history-count {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  font-weight: 600;
  background: color-mix(in srgb, var(--common-text) 10%, transparent);
}

/* ── 时间线 ── */
.history-timeline {
  position: relative;
  margin-top: 10px;
  padding-left: 0;
}

.timeline-track {
  position: absolute;
  left: 5px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  border-radius: 1px;
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 6px 0;
  padding-left: 20px;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 10px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.95);
  border: 2px solid color-mix(in srgb, var(--common-color-1) 35%, transparent);
  z-index: 1;
}

.timeline-dot.latest {
  border-color: var(--common-color-1);
  background: var(--common-color-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--common-color-1) 15%, transparent);
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.timeline-date {
  font-size: 11px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  opacity: 0.45;
  line-height: 1;
}

.timeline-desc {
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.75;
  line-height: 1.5;
  word-break: break-word;
}
</style>

<style scoped>
@media (max-width: 640px) {
  .edit-history-card {
    padding: 10px 12px;
    border-radius: 8px;
  }
  .date-row {
    gap: 16px;
  }
  .date-icon-wrap {
    width: 28px;
    height: 28px;
    border-radius: 7px;
  }
  .date-icon-wrap svg {
    width: 13px;
    height: 13px;
  }
  .date-value {
    font-size: 12px;
  }
  .timeline-desc {
    font-size: 12px;
  }
}
</style>