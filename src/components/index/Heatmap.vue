<template>
  <div class="heatmap-wrapper">
    <!-- 第一个div：年份选择、标题、月份选择 -->
    <div class="heatmap-header">
      <div class="year-selector">
        <select v-model="selectedYear" @change="updateHeatmapData">          <option v-for="year in years" :key="year" :value="year">
            {{ year }}年
          </option>
        </select>
      </div>
      <h3 class="heatmap-title">文章发布热力图</h3>
      <div class="month-selector">
        <select v-model="selectedMonth" @change="onMonthChange">
          <option v-for="(month, index) in months" :key="index" :value="index + 1">
            {{ month }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- 第二个div：热力图 -->
    <div class="heatmap-content">
      <div class="heatmap-grid" v-if="currentMonthData.length > 0">
        <div 
          v-for="(day, index) in currentMonthData" 
          :key="index"
          class="heatmap-cell"
          :class="day.hasArticle ? 'heatmap-has-article' : 'heatmap-no-article'"
          :title="`${day.date}: ${day.hasArticle ? '有文章' : '无文章'}`"
        ></div>
      </div>
    </div>
    
    <!-- 第三个div：图例 -->
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

<script setup>
import { ref, onMounted, computed } from 'vue'

const selectedYear = ref(new Date().getFullYear()) // 默认选择当前年份
const selectedMonth = ref(new Date().getMonth() + 1) // 默认选择当前月份
// 动态生成年份列表：从2026年到当前年份+2年
const currentYear = new Date().getFullYear()
const years = ref(Array.from({ length: Math.max(currentYear + 2 - 2026 + 1, 3) }, (_, i) => 2026 + i))
const months = ref([
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
])
const yearData = ref([])
const currentMonthData = ref([])

// 从search.json获取文章发布数据
const fetchArticleData = async () => {
  try {
    const response = await fetch('/config/search.json')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const articles = await response.json()
    return articles
  } catch (error) {
    return []
  }
}

// 构建日期索引 - O(n) 时间复杂度
const buildDateIndex = (articles) => {
  const dateIndex = new Set()
  articles.forEach(article => {
    if (article.date) {
      dateIndex.add(article.date)
    }
  })
  return dateIndex
}

// 处理文章数据（针对指定年份）
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

// 缓存原始文章数据，避免切换年份时重复 fetch
let cachedArticles = null

// 更新热力图：切换年份或月份时调用
const updateHeatmapData = async () => {
  if (!cachedArticles) {
    cachedArticles = await fetchArticleData()
  }
  yearData.value = processArticleData(cachedArticles, selectedYear.value)
  currentMonthData.value = yearData.value
    .filter(item => item.month === selectedMonth.value)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

// 只切换月份时不需要重新处理全年数据
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
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 192, 203, 0.5);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
}

/* 第一个div：年份选择、标题、月份选择 */
.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
  gap: 1.5rem;
  color: #333;
}

.heatmap-title {
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(90deg, #ff69b4, #ff1493, #ff69b4);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
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
  border: 1px solid rgba(255, 192, 203, 0.5);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  font-size: 0.875rem;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.year-selector select:hover,
.month-selector select:hover {
  background: rgba(255, 192, 203, 0.2);
  border-color: #ff69b4;
}

/* 第二个div：热力图 */
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
}

.heatmap-cell:hover {
  transform: scale(1.1);
}

/* 热力图状态 */
.heatmap-no-article {
  background: rgba(255, 192, 203, 0.2);
  border: 1px solid rgba(255, 192, 203, 0.3);
}

.heatmap-has-article {
  background: #ff69b4;
  box-shadow: 0 0 8px #ff69b4;
  border: 1px solid #ff69b4;
}

/* 第三个div：图例 */
.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 0.75rem;
  color: #333;
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
  background: rgba(255, 192, 203, 0.2);
  border: 1px solid rgba(255, 192, 203, 0.3);
}

.legend-cell.has-article {
  background: #ff69b4;
  box-shadow: 0 0 8px #ff69b4;
  border: 1px solid #ff69b4;
}

/* 渐变动画 */
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

@media (max-width: 768px) {
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



@media (max-width: 480px) {
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