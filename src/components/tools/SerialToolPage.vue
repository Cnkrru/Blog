<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'

// 导入子组件
import SerialNav from './Serial/SerialNav.vue'
import ConfigPanel from './Serial/ConfigPanel.vue'
import DataPanel from './Serial/DataPanel.vue'
import StatsPanel from './Serial/StatsPanel.vue'
import LogsPanel from './Serial/LogsPanel.vue'
import AboutPanel from './Serial/AboutPanel.vue'
import AnalysisPanel from './Serial/AnalysisPanel.vue'
import SerialFooter from './Serial/SerialFooter.vue'

// SEO 配置
useHead({
  title: '串口工具 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: 'Web Serial API 串口调试工具，支持设备选择、配置、数据收发和格式转换' },
    { name: 'keywords', content: '串口工具,Web Serial API,串口调试,数据收发' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' }
  ]
})

// 状态管�?const activeTab = ref('serial')
const port = ref(null)
const reader = ref(null)
const writer = ref(null)
const isConnected = ref(false)
const portList = ref([])
const statusText = ref('就绪')
const receivedData = ref('')
const logsPanelRef = ref(null)
const portInfo = ref(null)

// 分析配置
const analysisConfig = ref({
  enabled: false,
  maxDataPoints: 100,
  refreshInterval: 1000,
  chartType: 'line'
})

// 回调函数管理
const callbacks = ref([])

// 统计信息
const stats = ref({
  rxBytes: 0,
  txBytes: 0,
  rxCount: 0,
  txCount: 0,
  lastRxTime: null,
  lastTxTime: null,
  rxRate: 0,
  txRate: 0
})

// 错误处理
const error = ref(null)
const status = ref({
  serial: {
    port: null,
    isOpen: false,
    baudrate: null,
    bytesize: null,
    parity: null,
    stopbits: null,
    timeout: null
  },
  data: {
    rxBytes: 0,
    txBytes: 0,
    rxCount: 0,
    txCount: 0,
    rxRate: 0,
    txRate: 0,
    lastRxTime: null,
    lastTxTime: null
  },
  system: {
    timestamp: Date.now(),
    browser: navigator.userAgent
  }
})

// 数据格式
const dataFormat = ref({
  receive: 'ascii',
  send: 'ascii'
})

// 切换标签
const handleTabChange = (tab) => {
  activeTab.value = tab
}

// 处理数据格式变化
const handleFormatChange = (format) => {
  dataFormat.value = format
  addLog('系统', `数据格式已更新 接收=${format.receive}, 发送=${format.send}`)
}

// 添加日志
const addLog = (source, message) => {
  if (logsPanelRef.value) {
    logsPanelRef.value.addLog(source, message)
  }
}

// 错误恢复机制
const recoverFromError = async () => {
  try {
    addLog('系统', '尝试从错误中恢复...')
    
    // 检查串口状态
    if (port.value && port.value.readable) {
      addLog('系统', '尝试重新初始化读取器...')
      await startReading()
    }
    
    // 清除错误
    error.value = null
    addLog('系统', '错误恢复成功')
  } catch (err) {
    addLog('错误', `错误恢复失败: ${err.message}`)
  }
}

// 更新状态
const updateStatus = () => {
  status.value.serial = {
    port: port.value ? '已连接' : null,
    isOpen: isConnected.value,
    baudrate: null, // Web Serial API 不提供这些信息
    bytesize: null,
    parity: null,
    stopbits: null,
    timeout: null
  }
  
  status.value.data = {
    rxBytes: stats.value.rxBytes,
    txBytes: stats.value.txBytes,
    rxCount: stats.value.rxCount,
    txCount: stats.value.txCount,
    rxRate: stats.value.rxRate,
    txRate: stats.value.txRate,
    lastRxTime: stats.value.lastRxTime,
    lastTxTime: stats.value.lastTxTime
  }
  
  status.value.system.timestamp = Date.now()
}

// 注册回调函数
const registerCallback = (callback) => {
  if (callback && !callbacks.value.includes(callback)) {
    callbacks.value.push(callback)
    addLog('系统', '回调函数已注册')
  }
}

// 注销回调函数
const unregisterCallback = (callback) => {
  const index = callbacks.value.indexOf(callback)
  if (index > -1) {
    callbacks.value.splice(index, 1)
    addLog('系统', '回调函数已注销')
  }
}

// 通知回调函数
const notifyCallbacks = (data) => {
  callbacks.value.forEach(callback => {
    try {
      callback(data)
    } catch (err) {
      addLog('错误', `回调函数执行失败: ${err.message}`)
    }
  })
}

// 获取状态
const getStatus = () => {
  updateStatus()
  return status.value
}

// 检测浏览器支持
const isWebSerialSupported = 'serial' in navigator

// 处理分析配置
const handleAnalysisConfig = (config) => {
  analysisConfig.value = config
  addLog('系统', `分析配置更新: ${JSON.stringify(config)}`)
}

// 加载可用串口
const loadPorts = async () => {
  try {
    addLog('系统', '开始加载串口列表...')
    const ports = await navigator.serial.getPorts()
    portList.value = ports.map((p, index) => ({
      id: index,
      name: p.name || `串口 ${index + 1}`,
      port: p
    }))
    addLog('系统', `找到 ${portList.value.length} 个串口设备`)
  } catch (err) {
    error.value = '加载串口失败'
    addLog('错误', `加载串口失败: ${err.message}`)
  }
}

// 连接串口
const connectSerial = async (config) => {
  if (isConnected.value) {
    await disconnectSerial()
    return
  }

  try {
    error.value = null
    statusText.value = '正在连接...'
    addLog('系统', '开始连接串口...')
        
    
    if (config.port) {
      port.value = config.port.port
      addLog('系统', `选择串口: ${config.port.name}`)
    } else {
      port.value = await navigator.serial.requestPort()
      addLog('系统', '用户选择串口设备')
    }

    addLog('系统', `配置参数: 波特率=${config.baudrate}, 数据位=${config.dataBits}, 校验位=${config.parity}, 停止位=${config.stopBits}`)
    
    await port.value.open({
      baudRate: parseInt(config.baudrate),
      dataBits: parseInt(config.dataBits),
      parity: config.parity,
      stopBits: parseFloat(config.stopBits)
    })

    // 获取串口详细信息
    portInfo.value = {
      name: port.value.name || '未知',
      readable: port.value.readable,
      writable: port.value.writable
    }
    addLog('系统', `串口信息: ${JSON.stringify(portInfo.value)}`)

    isConnected.value = true
    statusText.value = '已连接'
    addLog('系统', '串口连接成功')

    // 通知回调函数
    notifyCallbacks({ event: 'connected', port: portInfo.value })

    startReading()
  } catch (err) {
    error.value = '连接失败: ' + err.message
    statusText.value = '连接失败'
    addLog('错误', `连接失败: ${err.message}`)
  }
}

// 断开串口
const disconnectSerial = async () => {
  try {
    addLog('系统', '开始断开串口连接')
    if (reader.value) {
      await reader.value.cancel()
      reader.value = null
      addLog('系统', '关闭读取器')
    }
    if (writer.value) {
      await writer.value.close()
      writer.value = null
      addLog('系统', '关闭写入器')
    }
    if (port.value) {
      await port.value.close()
      port.value = null
      addLog('系统', '关闭串口连接')
    }
    isConnected.value = false
    statusText.value = '已断开'
    portInfo.value = null
    addLog('系统', '串口断开成功')
    
    // 通知回调函数
    notifyCallbacks({ event: 'disconnected' })
  } catch (err) {
    error.value = '断开失败: ' + err.message
    addLog('错误', `断开失败: ${err.message}`)
  }
}

// 开始读取数据
const startReading = async () => {
  if (!port.value || !port.value.readable) return

  try {
    addLog('系统', '开始监听串口数据')
    const textDecoder = new TextDecoder()
    
    while (port.value && port.value.readable) {
      reader.value = port.value.readable.getReader()
      
      try {
        while (true) {
          const { value, done } = await reader.value.read()
          if (done) break
          
          const data = textDecoder.decode(value)
          processReceivedData(data)
          addLog('接收', data.trim())
        }
      } catch (err) {
        error.value = '读取错误: ' + err.message
        addLog('错误', `读取错误: ${err.message}`)
        
        // 尝试错误恢复
        await recoverFromError()
      } finally {
        if (reader.value) {
          reader.value.releaseLock()
          reader.value = null
        }
      }
    }
  } catch (err) {
    error.value = '开始读取失败: ' + err.message
    addLog('错误', `开始读取失败: ${err.message}`)
    
    // 尝试错误恢复
    await recoverFromError()
  }
}

// 处理接收的数据
const processReceivedData = (data) => {
  receivedData.value += data
  stats.value.rxBytes += data.length
  stats.value.rxCount++
  stats.value.lastRxTime = new Date().toLocaleTimeString()
  
  setTimeout(() => {
    const terminal = document.getElementById('receive-terminal')
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight
    }
  }, 0)
}

// 发送数据
const sendDataToSerial = async (data) => {
  if (!isConnected.value || !port.value || !port.value.writable) {
    error.value = '请先连接串口'
    addLog('错误', '发送失败 请先连接串口')
    return
  }

  try {
    addLog('发送', data.trim())
    if (!writer.value) {
      writer.value = port.value.writable.getWriter()
      addLog('系统', '创建写入')
    }

    const encoder = new TextEncoder()
    await writer.value.write(encoder.encode(data))

    stats.value.txBytes += data.length
    stats.value.txCount++
    stats.value.lastTxTime = new Date().toLocaleTimeString()

    error.value = null
    addLog('系统', `发送成功 ${data.length} 字节`)
  } catch (err) {
    error.value = '发送失败: ' + err.message
    addLog('错误', `发送失败: ${err.message}`)
  }
}

// 清空接收的数据
const clearReceivedData = () => {
  receivedData.value = ''
}

// 监听串口断开
const handlePortDisconnect = (e) => {
  if (e.target === port.value) {
    isConnected.value = false
    statusText.value = '已断开'
    port.value = null
  }
}

// 加载 Chart.js
const loadChartJS = () => {
  if (typeof Chart === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js'
    script.async = true
    script.onload = () => {
      // Chart.js 加载成功
    }
    script.onerror = () => {
      // Chart.js 加载失败
    }
    document.head.appendChild(script)
  }
}

// 生命周期
onMounted(() => {
  if (isWebSerialSupported) {
    loadPorts()
    navigator.serial.addEventListener('disconnect', handlePortDisconnect)
  } else {
    error.value = '您的浏览器不支持 Web Serial API，请使用 Chrome 或 Edge 浏览器'
  }
  
  // 加载 Chart.js
  loadChartJS()
})

onUnmounted(() => {
  if (isWebSerialSupported) {
    navigator.serial.removeEventListener('disconnect', handlePortDisconnect)
  }
  if (isConnected.value) {
    disconnectSerial()
  }
})
</script>

<template>
  <div class="serial-tool-container">
    <!-- 导航栏 -->
    <SerialNav @tab-change="handleTabChange" />
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- 浏览器支持检测 -->
    <div v-if="!isWebSerialSupported && activeTab === 'serial'" class="warning-message">
      <p>⚠️ 您的浏览器不支持 Web Serial API，请使用 Chrome 或 Edge 浏览器</p>
    </div>
    
    <!-- 功能页面 -->
    <div v-if="activeTab === 'serial'" class="tab-content">
      <!-- 主内容 -->
      <div class="serial-content">
        <!-- 左侧：串口配置 --> 
        <ConfigPanel 
          :port-list="portList"
          :is-connected="isConnected"
          :status-text="statusText"
          @connect="connectSerial"
          @load-ports="loadPorts"
        />
        
        <!-- 右侧：数据收发 -->
        <DataPanel 
          :received-data="receivedData"
          :is-connected="isConnected"
          @send-data="sendDataToSerial"
          @clear-received="clearReceivedData"
          @clear-send="() => {}"
          @format-change="handleFormatChange"
        />
      </div>
    </div>
    
    <!-- 统计页面 -->
    <div v-else-if="activeTab === 'stats'" class="tab-content">
      <StatsPanel :stats="stats" />
    </div>
    
    <!-- 日志页面 -->
    <div v-else-if="activeTab === 'logs'" class="tab-content">
      <LogsPanel ref="logsPanelRef" />
    </div>
    
    <!-- 关于页面 -->
    <div v-else-if="activeTab === 'about'" class="tab-content">
      <AboutPanel />
    </div>
    
    <!-- 分析页面 -->
    <div v-else-if="activeTab === 'analysis'" class="tab-content">
      <AnalysisPanel 
        :received-data="receivedData"
        :is-connected="isConnected"
        :analysis-config="analysisConfig"
        @analysis-config="handleAnalysisConfig"
      />
    </div>
    
    <!-- 底部信息 -->
    <SerialFooter />
  </div>
</template>

<style>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #e0e0e0;
  background-color: #121212;
}

.serial-tool-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 40px 20px;
}

/* 错误和警告信�?*/
.error-message {
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  color: #dc3545;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.warning-message {
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  color: #ffc107;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 主内�?*/
.serial-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 25px;
  margin-bottom: 30px;
}

/* 标签内容 */
.tab-content {
  margin-bottom: 30px;
}

/* 响应式设�?*/
@media (max-width: 768px) {
  .serial-content {
    grid-template-columns: 1fr;
  }
  
  .serial-tool-container {
    padding: 20px 10px;
  }
  
  .tab-content {
    margin-bottom: 20px;
  }
}
</style>