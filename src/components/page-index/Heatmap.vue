<template>
  <div class="heatmap-wrapper">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>

    <div v-if="error && !isLoading" class="error-message">
      <p>⚠️ {{ error }}</p>
      <button @click="updateHeatmapData" class="retry-btn">重试</button>
    </div>

    <div class="heatmap-header">
      <div class="year-selector">
        <select v-model="selectedYear" @change="updateHeatmapData" :disabled="isLoading">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}年
          </option>
        </select>
      </div>
      <h3 class="heatmap-title">文章发布热力图</h3>
      <div class="month-selector">
        <select v-model="selectedMonth" @change="onMonthChange" :disabled="isLoading">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>
      </div>
    </div>

    <div class="heatmap-content">
      <div class="heatmap-grid" v-if="currentMonthData.length > 0 && !error">
        <div
          v-for="(day, index) in currentMonthData"
          :key="index"
          class="heatmap-cell"
          :class="[
            day.hasArticle ? (isDarkMode ? 'heatmap-has-article-dark' : 'heatmap-has-article') : (isDarkMode ? 'heatmap-no-article-dark' : 'heatmap-no-article')
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
        <div class="legend-cell" :class="isDarkMode ? 'no-article-dark' : 'no-article'"></div>
        <div class="legend-cell" :class="isDarkMode ? 'has-article-dark' : 'has-article'"></div>
      </div>
      <span class="legend-text">有文章</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useThemeStore } from '../../stores'

const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDark)

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
  if (!cachedArticles) {
    cachedArticles = await fetchArticleData()
  }
  yearData.value = processArticleData(cachedArticles, selectedYear.value)
  currentMonthData.value = yearData.value
    .filter(item => item.month === selectedMonth.value)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

const onMonthChange = () => {
  currentMonthData.value = yearData.value
    .filter(item => item.month === selectedMonth.value)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

onMounted(async () => {
  await updateHeatmapData()
})
</script>

<style scoped>
.heatmap-wrapper {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  position: relative;
  min-height: 200px;
}

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
  border: 3px solid rgba(0,0,0,0.1);
  border-top-color: var(--common-color-1);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 10px;
}

body.dark-theme .loading-spinner {
  border-color: rgba(255,255,255,0.1);
}

.loading-text {
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.5;
}

.error-message {
  text-align: center;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.3);
}

.error-message p {
  margin: 0 0 8px;
  color: var(--common-text);
  font-size: 13px;
}

.retry-btn {
  padding: 6px 16px;
  border-radius: 16px;
  background: var(--common-color-1);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 13px;
}

.no-data {
  text-align: center;
  padding: 30px;
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.4;
}

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

.year-selector,
.month-selector {
  position: relative;
  flex-shrink: 0;
}

.year-selector select,
.month-selector select {
  appearance: none;
  -webkit-appearance: none;
  padding: 6px 28px 6px 12px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  background: rgba(255,255,255,0.45) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 8px center;
  background-size: 14px;
  color: var(--common-text);
  outline: none;
  font-weight: 500;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

body.dark-theme .year-selector select,
body.dark-theme .month-selector select {
  background-color: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.1);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
}

.year-selector select:hover,
.month-selector select:hover {
  border-color: var(--common-color-1);
}

select:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

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

.heatmap-no-article,
.heatmap-no-article-dark {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.04);
}

body.dark-theme .heatmap-no-article-dark {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.04);
}

.heatmap-has-article {
  background: var(--common-color-1);
  opacity: 0.55;
}

.heatmap-has-article:hover {
  opacity: 0.85;
}

body.dark-theme .heatmap-has-article-dark {
  background: var(--common-color-1);
  opacity: 0.5;
}

body.dark-theme .heatmap-has-article-dark:hover {
  opacity: 0.85;
}

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

.legend-cell.no-article,
.legend-cell.no-article-dark {
  background: rgba(0, 0, 0, 0.06);
}

body.dark-theme .legend-cell.no-article-dark {
  background: rgba(255, 255, 255, 0.06);
}

.legend-cell.has-article {
  background: var(--common-color-1);
  opacity: 0.55;
}

body.dark-theme .legend-cell.has-article-dark {
  background: var(--common-color-1);
  opacity: 0.5;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<style scoped>
.heatmap-wrapper {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

@media (max-width: 640px) {
  .heatmap-header {
    flex-wrap: wrap;
  }
  .heatmap-grid {
    gap: 4px;
    max-width: 100%;
  }
  .year-selector select,
  .month-selector select {
    padding: 4px 10px;
    font-size: 12px;
  }
}
</style>
