<template>
  <div class="heatmap-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>

    <div v-if="error && !isLoading" class="error-message">
      <p>⚠️ {{ error }}</p>
      <button @click="updateHeatmapData" class="retry-button" aria-label="重试">重试</button>
    </div>

    <div class="heatmap-header">
      <!-- 年份下拉 -->
      <div class="custom-select" ref="yearSelectRef">
        <button
          class="select-trigger"
          :class="{ active: yearDropdownOpen }"
          @click="toggleYearDropdown"
          :disabled="isLoading"
          aria-label="切换年份"
        >
          <span class="select-value">{{ selectedYear }}年</span>
          <span class="select-arrow" :class="{ rotated: yearDropdownOpen }"></span>
        </button>
        <Teleport to="body">
          <transition name="dropdown">
            <ul v-if="yearDropdownOpen" class="dropdown-menu" :style="yearMenuStyle" @click.stop>
              <li
                v-for="year in years"
                :key="year"
                class="dropdown-item"
                :class="{ active: selectedYear === year }"
                @click="selectYear(year)"
              >
                {{ year }}年
              </li>
            </ul>
          </transition>
        </Teleport>
      </div>

      <h3 class="heatmap-title">文章发布热力图</h3>

      <!-- 月份下拉 -->
      <div class="custom-select" ref="monthSelectRef">
        <button
          class="select-trigger"
          :class="{ active: monthDropdownOpen }"
          @click="toggleMonthDropdown"
          :disabled="isLoading"
          aria-label="切换月份"
        >
          <span class="select-value">{{ months[selectedMonth - 1] }}</span>
          <span class="select-arrow" :class="{ rotated: monthDropdownOpen }"></span>
        </button>
        <Teleport to="body">
          <transition name="dropdown">
            <ul v-if="monthDropdownOpen" class="dropdown-menu" :style="monthMenuStyle" @click.stop>
              <li
                v-for="(month, index) in months"
                :key="index"
                class="dropdown-item"
                :class="{ active: selectedMonth === index + 1 }"
                @click="selectMonth(index + 1)"
              >
                {{ month }}
              </li>
            </ul>
          </transition>
        </Teleport>
      </div>
    </div>

    <div class="heatmap-content">
      <div class="heatmap-grid" v-if="currentMonthData.length > 0 && !error">
        <div
          v-for="(day, index) in currentMonthData"
          :key="index"
          class="heatmap-cell"
          :class="[
            day.hasArticle ? 'heatmap-has-article' : 'heatmap-no-article'
          ]"
          :title="`${day.date}: ${day.hasArticle ? '有文章' : '无文章'}`"
        ></div>
      </div>
      <div v-else-if="!isLoading && !error && currentMonthData.length === 0" class="no-data">
        <p>暂无数据</p>
      </div>
    </div>

    <div class="heatmap-legend">
      <span class="legend-text">无文章</span>
      <div class="legend-cells">
        <div class="legend-cell no-article"></div>
        <div class="legend-cell has-article"></div>
      </div>
      <span class="legend-text">有文章</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useThemeStore } from '../../stores'

const themeStore = useThemeStore()

const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)
const isLoading = ref(false)
const error = ref(null)

const currentYear = new Date().getFullYear()
const years = ref(Array.from({ length: Math.max(currentYear + 2 - 2026 + 1, 3) }, (_, i) => 2026 + i))
const months = ref([
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
])
const yearData = ref([])
const currentMonthData = ref([])

// 自定义下拉菜单状态
const yearDropdownOpen = ref(false)
const monthDropdownOpen = ref(false)
const yearSelectRef = ref<HTMLElement | null>(null)
const monthSelectRef = ref<HTMLElement | null>(null)
const yearMenuStyle = ref<Record<string, string>>({})
const monthMenuStyle = ref<Record<string, string>>({})

const positionMenu = async (selectRef: typeof yearSelectRef, menuStyle: typeof yearMenuStyle) => {
  await nextTick()
  const el = selectRef.value
  if (el) {
    const rect = el.getBoundingClientRect()
    menuStyle.value = {
      minWidth: `${rect.width}px`,
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      position: 'fixed',
      zIndex: '10001'
    }
  }
}

const toggleYearDropdown = async () => {
  yearDropdownOpen.value = !yearDropdownOpen.value
  if (yearDropdownOpen.value) {
    monthDropdownOpen.value = false
    await positionMenu(yearSelectRef, yearMenuStyle)
  }
}

const toggleMonthDropdown = async () => {
  monthDropdownOpen.value = !monthDropdownOpen.value
  if (monthDropdownOpen.value) {
    yearDropdownOpen.value = false
    await positionMenu(monthSelectRef, monthMenuStyle)
  }
}

const selectYear = async (year: number) => {
  selectedYear.value = year
  yearDropdownOpen.value = false
  await updateHeatmapData()
}

const selectMonth = (month: number) => {
  selectedMonth.value = month
  monthDropdownOpen.value = false
  onMonthChange()
}

const closeDropdowns = () => {
  yearDropdownOpen.value = false
  monthDropdownOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (!yearSelectRef.value?.contains(e.target as Node) &&
      !monthSelectRef.value?.contains(e.target as Node)) {
    closeDropdowns()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeDropdowns()
}

onMounted(async () => {
  try {
    await updateHeatmapData()
  } catch (e) {
    console.error('加载热力图数据失败:', e)
  }
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

// === 数据逻辑 ===

const fetchArticleData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('/config/search.json')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: 无法加载文章数据`)
    }
    const articles = await response.json()
    return articles
  } catch (err) {
    error.value = err.message
    console.error('加载热力图数据失败:', err)
    return []
  } finally {
    isLoading.value = false
  }
}

const buildDateIndex = (articles) => {
  const dateIndex = new Set()
  articles.forEach(article => {
    if (article.date) {
      dateIndex.add(article.date)
    }
  })
  return dateIndex
}

const processArticleData = (articles, year) => {
  const data = []
  const dateIndex = buildDateIndex(articles)

  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateString = date.toISOString().split('T')[0]
      data.push({ date: dateString, hasArticle: dateIndex.has(dateString), month })
    }
  }
  return data
}

let cachedArticles = null

const updateHeatmapData = async () => {
  try {
    if (!cachedArticles) {
      cachedArticles = await fetchArticleData()
    }
    yearData.value = processArticleData(cachedArticles, selectedYear.value)
    currentMonthData.value = yearData.value
      .filter(item => item.month === selectedMonth.value)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  } catch (e) {
    console.error('加载热力图数据失败:', e)
  }
}

const onMonthChange = () => {
  currentMonthData.value = yearData.value
    .filter(item => item.month === selectedMonth.value)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}
</script>

<style scoped>
/* ============================== 容器 ============================== */
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

/* ============================== Loading ============================== */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--common-shadow);
  border-top-color: var(--common-color-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 10px;
}

.loading-text {
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.5;
}

/* ============================== Error ============================== */
.error-message {
  text-align: center;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--common-shadow);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.3));
}

.error-message p {
  margin: 0 0 8px;
  color: var(--common-text);
  font-size: 13px;
}

.no-data {
  text-align: center;
  padding: 30px;
  font-size: 13px;
  color: var(--common-text);
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
  color: var(--common-text);
  margin: 0;
  opacity: 0.6;
}

/* ============================== 自定义下拉 ============================== */
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
  color: var(--common-text);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) - 0.2));
  border: 1px solid var(--common-shadow);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.select-trigger:hover:not(:disabled) {
  border-color: var(--common-color-1);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 25%, transparent);
}

.select-trigger.active {
  border-color: var(--common-color-1);
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
  box-shadow: 0 2px 8px color-mix(in srgb, var(--common-color-1) 30%, transparent);
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
  border-top: 5px solid var(--common-text);
  transition: transform 0.2s ease;
  opacity: 0.6;
}

.select-arrow.rotated {
  transform: rotate(180deg);
  opacity: 1;
}

/* 下拉菜单面板 */
.dropdown-menu {
  position: fixed;
  min-width: 120px;
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
  margin: 0;
  list-style: none;
  border-radius: 12px;
  border: 1px solid var(--common-shadow);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-alpha));
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 8px 24px var(--common-shadow);
  z-index: 10001;
}

.dropdown-item {
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  color: var(--common-text);
  transition: background-color 0.15s ease, color 0.15s ease;
  font-weight: 500;
}

.dropdown-item:hover {
  background: color-mix(in srgb, var(--common-color-1) 12%, transparent);
}

.dropdown-item.active {
  background: var(--common-color-1);
  color: var(--common-content);
  font-weight: 600;
}

/* 下拉动画 */
.dropdown-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ============================== 热力图网格 ============================== */
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
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.heatmap-cell:hover {
  transform: scale(1.25);
  border-color: var(--common-color-1);
  z-index: 1;
}

.heatmap-no-article {
  background: color-mix(in srgb, var(--common-text) 6%, transparent);
  border-color: color-mix(in srgb, var(--common-text) 6%, transparent);
}

.heatmap-has-article {
  background: var(--common-color-1);
  opacity: 0.55;
}

.heatmap-has-article:hover {
  opacity: 0.85;
}

/* ============================== 图例 ============================== */
.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 11px;
  color: var(--common-text);
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

.legend-cell.no-article {
  background: color-mix(in srgb, var(--common-text) 8%, transparent);
}

.legend-cell.has-article {
  background: var(--common-color-1);
  opacity: 0.55;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============================== 响应式 ============================== */
@media (max-width: 640px) {
  .heatmap-header {
    flex-wrap: wrap;
  }
  .heatmap-grid {
    gap: 4px;
    max-width: 100%;
  }
  .select-trigger {
    padding: 4px 10px;
    font-size: 12px;
  }
  .dropdown-menu {
    font-size: 12px;
  }
}
</style>
