<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '../../stores'

const chartRef = ref(null)
const isLoading = ref(true)
const userStore = useUserStore()
const visitorCount = computed(() => userStore.visitorCount)
const visitorCities = computed(() => userStore.visitorCities)

let echarts = null
let chart = null

const loadEcharts = async () => {
  return new Promise((resolve, reject) => {
    if (window.echarts) {
      echarts = window.echarts
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js'
    script.onload = () => {
      echarts = window.echarts
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const loadChinaMap = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      // 使用备用地图数据源
      const response = await fetch('https://cdn.jsdelivr.net/npm/echarts/map/json/china.json')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const chinaGeoJson = await response.json()
      echarts.registerMap('china', chinaGeoJson)
      resolve()
    } catch (error) {
      console.warn('Failed to load China map data:', error)
      // 即使加载失败也继续，避免阻塞其他功能
      resolve()
    }
  })
}

const getChartColors = () => {
  const isDark = document.body.classList.contains('dark-theme')
  return {
    borderColor: isDark ? 'rgba(79, 195, 247, 0.6)' : 'rgba(78, 205, 196, 0.6)',
    areaColor: isDark ? 'rgba(79, 195, 247, 0.2)' : 'rgba(78, 205, 196, 0.2)',
    shadowColor: isDark ? 'rgba(79, 195, 247, 0.5)' : 'rgba(78, 205, 196, 0.5)',
    scatterColor: isDark ? '#4fc3f7' : '#ff6b6b',
    lineColor: isDark ? '#4fc3f7' : '#4ecdc4',
    textColor: isDark ? '#e0e0e0' : '#333'
  }
}

const initChart = () => {
  if (!chartRef.value || !echarts) return

  chart = echarts.init(chartRef.value)
  const colors = getChartColors()

  const option = {
    backgroundColor: 'transparent',
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2,
      label: {
        show: false,
        color: colors.textColor
      },
      itemStyle: {
        borderColor: colors.borderColor,
        borderWidth: 1,
        areaColor: colors.areaColor,
        shadowColor: colors.shadowColor,
        shadowBlur: 20
      },
      emphasis: {
        label: {
          show: true,
          color: colors.textColor
        },
        itemStyle: {
          areaColor: colors.areaColor.replace('0.2', '0.4')
        }
      }
    },
    series: [
      {
        name: '访客',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: [],
        symbolSize: 12,
        itemStyle: {
          color: colors.scatterColor,
          shadowBlur: 10,
          shadowColor: colors.scatterColor + '80'
        },
        emphasis: {
          scale: 1.5
        }
      },
      {
        name: '飞线',
        type: 'lines',
        coordinateSystem: 'geo',
        data: [],
        lineStyle: {
          color: colors.lineColor,
          width: 2,
          opacity: 0.6,
          curveness: 0.3
        },
        effect: {
          show: true,
          period: 3,
          trailLength: 0.3,
          color: colors.lineColor,
          symbol: 'circle',
          symbolSize: 3
        }
      }
    ]
  }

  chart.setOption(option)
  isLoading.value = false
  
  // 监听主题变化
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      if (chart) {
        const newColors = getChartColors()
        chart.setOption({
          geo: {
            label: { color: newColors.textColor },
            itemStyle: {
              borderColor: newColors.borderColor,
              areaColor: newColors.areaColor,
              shadowColor: newColors.shadowColor
            }
          },
          series: [
            { itemStyle: { color: newColors.scatterColor, shadowColor: newColors.scatterColor + '80' } },
            { lineStyle: { color: newColors.lineColor }, effect: { color: newColors.lineColor } }
          ]
        })
      }
    })
    
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    
    // 保存observer以便清理
    onUnmounted(() => observer.disconnect())
  }
}

const fetchVisitorLocation = async () => {
  const locationData = await userStore.fetchUserLocation()
  
  // 只有有坐标时才更新图表和飞线
  if (locationData && locationData.lon !== null) {
    updateChart()
    addFlyLine()
  }
}

const updateChart = () => {
  if (!chart) return

  chart.setOption({
    series: [
      {
        name: '访客',
        data: userStore.visitorCities
      }
    ]
  })
}

const addFlyLine = () => {
  if (!chart || userStore.visitorCities.length < 1) return

  const endCity = userStore.visitorCities[userStore.visitorCities.length - 1]
  
  // 如果没有坐标，不显示飞线
  if (!endCity.value) return

  const startCity = {
    name: '随机起点',
    value: [
      Math.random() * 40 + 100,
      Math.random() * 30 + 20
    ]
  }

  chart.setOption({
    series: [
      { name: '访客' },
      {
        name: '飞线',
        data: [
          {
            fromName: startCity.name,
            toName: endCity.name,
            coords: [startCity.value, endCity.value]
          }
        ]
      }
    ]
  })

  setTimeout(() => {
    if (!chart) return
    chart.setOption({
      series: [
        { name: '访客' },
        { name: '飞线', data: [] }
      ]
    })
  }, 3000)
}

const handleResize = () => {
  if (chart) {
    chart.resize()
  }
}

onMounted(async () => {
  await loadEcharts()
  await loadChinaMap()
  initChart()
  fetchVisitorLocation()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
  }
})
</script>

<template>
  <div class="visitor-map">
    <div class="map-info-container">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-text">地图加载中...</div>
      </div>
      <div class="map-info">
        <h4>访客地图</h4>
        <p>总访客: {{ visitorCount }}</p>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped>
.visitor-map {
  width: 100%;
  height: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 12px;
  background: var(--card-bg);
}

@media (max-width: 768px) {
  .visitor-map {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .visitor-map {
    height: 300px;
  }
}

.map-info-container {
  padding: 1rem;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid var(--center-card-border-color);
  flex-shrink: 0;
  width: 100%;
  margin-bottom: 1rem;
  position: relative;
}

.map-info {
  background: var(--map-info-bg);
  padding: 10px 15px;
  border-radius: 8px;
  color: var(--map-info-text);
}

.chart-container {
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  background: var(--card-bg);
  border: 1px solid var(--center-card-border-color);
  min-height: 0;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
  border-radius: 12px;
  padding: 1rem;
  box-sizing: border-box;
}

.loading-text {
  color: #4ecdc4;
  font-size: 16px;
  font-weight: 500;
}

.map-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: var(--map-info-title);
}

.map-info p {
  margin: 0;
  font-size: 12px;
  color: var(--map-info-subtext);
}
</style>