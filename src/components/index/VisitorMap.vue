<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const chartRef = ref(null)
const isLoading = ref(true)
const visitorCount = ref(0)
const visitorCities = ref([])

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

const initChart = () => {
  if (!chartRef.value || !echarts) return

  chart = echarts.init(chartRef.value)

  const option = {
    backgroundColor: 'transparent',
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2,
      label: {
        show: false
      },
      itemStyle: {
        borderColor: 'rgba(78, 205, 196, 0.6)',
        borderWidth: 1,
        areaColor: 'rgba(78, 205, 196, 0.2)',
        shadowColor: 'rgba(78, 205, 196, 0.5)',
        shadowBlur: 20
      },
      emphasis: {
        label: {
          show: true,
          color: '#fff'
        },
        itemStyle: {
          areaColor: 'rgba(78, 205, 196, 0.4)'
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
          color: '#ff6b6b',
          shadowBlur: 10,
          shadowColor: 'rgba(255, 107, 107, 0.5)'
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
          color: '#4ecdc4',
          width: 2,
          opacity: 0.6,
          curveness: 0.3
        },
        effect: {
          show: true,
          period: 3,
          trailLength: 0.3,
          color: '#4ecdc4',
          symbol: 'circle',
          symbolSize: 3
        }
      }
    ]
  }

  chart.setOption(option)
  isLoading.value = false
}

const fetchVisitorLocation = async () => {
  try {
    const response = await fetch('https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon')
    const data = await response.json()

    if (data.status === 'success') {
      visitorCount.value++
      visitorCities.value.push({
        name: data.city,
        value: [data.lon, data.lat]
      })

      updateChart()
      addFlyLine()
    }
  } catch (error) {
    console.warn('Failed to fetch visitor location:', error)
  }
}

const updateChart = () => {
  if (!chart) return

  chart.setOption({
    series: [
      {
        name: '访客',
        data: visitorCities.value
      }
    ]
  })
}

const addFlyLine = () => {
  if (!chart || visitorCities.value.length < 1) return

  const startCity = {
    name: '随机起点',
    value: [
      Math.random() * 40 + 100,
      Math.random() * 30 + 20
    ]
  }

  const endCity = visitorCities.value[visitorCities.value.length - 1]

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
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-text">地图加载中...</div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
      <div class="map-info">
        <h4>访客地图</h4>
        <p>总访客: {{ visitorCount }}</p>
      </div>
  </div>
</template>

<style scoped>
.visitor-map {
  width: 100%;
  height: 600px;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
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
  border-radius: 8px;
}

.loading-text {
  color: #4ecdc4;
  font-size: 16px;
  font-weight: 500;
}

.map-info {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
  border-radius: 8px;
  color: #fff;
}

.map-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #4ecdc4;
}

.map-info p {
  margin: 0;
  font-size: 12px;
  color: #aaa;
}
</style>