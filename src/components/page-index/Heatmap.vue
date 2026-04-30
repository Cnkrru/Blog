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

<script setup>
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
  margin: 2rem 0;
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  position: relative;
  min-height: 300px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid;
  border-top-color: inherit;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  font-size: 0.875rem;
}

.error-message {
  text-align: center;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid;
  margin-bottom: 1rem;
}

.error-message p {
  margin-bottom: 0.5rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.3s ease;
}

.retry-btn:hover {
  opacity: 0.8;
}

.no-data {
  text-align: center;
  padding: 2rem;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
  gap: 1.5rem;
}

.heatmap-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.year-selector,
.month-selector {
  position: relative;
  flex-shrink: 0;
}

.year-selector select,
.month-selector select {
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  min-width: 80px;
}

.year-selector select:hover:not(:disabled),
.month-selector select:hover:not(:disabled) {
}

.year-selector select:disabled,
.month-selector select:disabled {
  opacity: 0.5;
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
  gap: 6px;
  width: 90%;
  max-width: 600px;
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  transition: all 0.3s ease;
  min-width: 16px;
  min-height: 16px;
  max-width: 30px;
  max-height: 30px;
  cursor: pointer;
}

.heatmap-cell:hover {
  transform: scale(1.1);
}

.heatmap-no-article {
}

.heatmap-has-article {
  box-shadow: 0 0 8px;
  border: 1px solid;
}

.heatmap-no-article-dark {
}

.heatmap-has-article-dark {
  box-shadow: 0 0 8px;
  border: 1px solid;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.75rem;
  width: 100%;
}

.legend-cells {
  display: flex;
  gap: 6px;
}

.legend-cell {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-cell.no-article {
}

.legend-cell.has-article {
  box-shadow: 0 0 8px;
  border: 1px solid;
}

.legend-cell.no-article-dark {
}

.legend-cell.has-article-dark {
  box-shadow: 0 0 8px;
  border: 1px solid;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<style scoped>
.heatmap-wrapper {
  background: var(--common-bg);
  border: 1px solid var(--common-color-1);
  box-shadow: 0 8px 32px var(--common-shadow);
}

.loading-overlay {
  background: var(--common-bg);
}

.loading-spinner {
  border-color: var(--common-color-1);
  border-top-color: var(--common-color-1);
}

.loading-text {
  color: var(--common-text);
}

.error-message {
  background: var(--common-shadow);
  border-color: var(--common-color-1);
}

.error-message p {
  color: var(--common-color-1);
}

.retry-btn {
  background: var(--common-color-1);
}

.no-data {
  color: var(--common-text);
}

.heatmap-header {
  color: var(--common-text);
}

.heatmap-title {
  background: var(--common-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.year-selector select,
.month-selector select {
  border-color: var(--common-color-1);
  background: var(--common-bg);
  color: var(--common-text);
}

.year-selector select:hover:not(:disabled),
.month-selector select:hover:not(:disabled) {
  background: var(--common-color-1);
  border-color: var(--common-color-1);
}

.heatmap-no-article {
  background: var(--common-content);
  border: 1px solid var(--common-color-1);
}

.heatmap-has-article {
  background: var(--common-color-1);
  box-shadow: 0 0 8px var(--common-color-1);
  border-color: var(--common-color-1);
}

.heatmap-no-article-dark {
  background: var(--common-content);
  border: 1px solid var(--common-color-1);
}

.heatmap-has-article-dark {
  background: var(--common-color-1);
  box-shadow: 0 0 8px var(--common-color-1);
  border-color: var(--common-color-1);
}

.heatmap-legend {
  color: var(--common-text);
}

.legend-cell.no-article {
  background: var(--common-color-1);
  border: 1px solid var(--common-color-1);
}

.legend-cell.has-article {
  background: var(--common-color-1);
  box-shadow: 0 0 8px var(--common-color-1);
  border-color: var(--common-color-1);
}

.legend-cell.no-article-dark {
  background: var(--common-color-1);
  border: 1px solid var(--common-color-1);
}

.legend-cell.has-article-dark {
  background: var(--common-color-1);
  box-shadow: 0 0 8px var(--common-color-1);
  border-color: var(--common-color-1);
}
</style>

<style scoped>
@media (max-width: var(--md)) {
  .heatmap-header {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .heatmap-grid {
    gap: 4px;
    max-width: 300px;
  }

  .heatmap-wrapper {
    padding: 1.5rem;
    gap: 1.5rem;
  }
}

@media (max-width: var(--sm)) {
  .heatmap-grid {
    gap: 3px;
    max-width: 250px;
  }

  .heatmap-title {
    font-size: 1rem;
  }

  .year-selector select,
  .month-selector select {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }

  .legend-cell {
    width: 12px;
    height: 12px;
  }

  .heatmap-wrapper {
    padding: 1rem;
    gap: 1rem;
  }
}
</style>
