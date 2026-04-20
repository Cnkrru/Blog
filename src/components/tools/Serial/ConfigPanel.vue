<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  portList: {
    type: Array,
    default: () => []
  },
  isConnected: {
    type: Boolean,
    default: false
  },
  statusText: {
    type: String,
    default: '就绪'
  }
})

const emit = defineEmits(['connect', 'load-ports'])

// 串口配置
const baudrate = ref(9600)
const baudrateOptions = [9600, 19200, 38400, 57600, 115200]
const dataBits = ref(8)
const dataBitsOptions = [5, 6, 7, 8]
const parity = ref('none')
const parityOptions = ['none', 'odd', 'even']
const stopBits = ref(1)
const stopBitsOptions = [1, 1.5, 2]
const selectedPort = ref(null)

const connectButtonText = ref('连接串口')

const connectSerial = () => {
  emit('connect', {
    port: selectedPort.value,
    baudrate: baudrate.value,
    dataBits: dataBits.value,
    parity: parity.value,
    stopBits: stopBits.value
  })
}

const loadPorts = () => {
  emit('load-ports')
}
</script>

<template>
  <div class="config-panel">
    <h2>串口配置</h2>
    
    <!-- 串口选择 -->
    <div class="config-group">
      <label>选择串口:</label>
      <select v-model="selectedPort" @change="loadPorts">
        <option value="">自动检测</option>
        <option v-for="p in portList" :key="p.id" :value="p">
          {{ p.name }}
        </option>
      </select>
    </div>
    
    <!-- 波特率 -->
    <div class="config-group">
      <label>波特率:</label>
      <select v-model="baudrate">
        <option v-for="rate in baudrateOptions" :key="rate" :value="rate">
          {{ rate }}
        </option>
      </select>
    </div>
    
    <!-- 数据位 -->
    <div class="config-group">
      <label>数据位:</label>
      <select v-model="dataBits">
        <option v-for="bits in dataBitsOptions" :key="bits" :value="bits">
          {{ bits }}
        </option>
      </select>
    </div>
    
    <!-- 校验位 -->
    <div class="config-group">
      <label>校验位:</label>
      <select v-model="parity">
        <option value="none">无</option>
        <option value="odd">奇</option>
        <option value="even">偶</option>
      </select>
    </div>
    
    <!-- 停止位 -->
    <div class="config-group">
      <label>停止位:</label>
      <select v-model="stopBits">
        <option value="1">1</option>
        <option value="1.5">1.5</option>
        <option value="2">2</option>
      </select>
    </div>
    
    <!-- 连接按钮 -->
    <div class="connect-section">
      <button 
        class="connect-button" 
        :class="{ connected: isConnected }"
        @click="connectSerial"
      >
        {{ isConnected ? '断开连接' : '连接串口' }}
      </button>
      <span class="status-text">{{ statusText }}</span>
    </div>
  </div>
</template>

<style>
.config-panel {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.config-panel h2 {
  color: #333333;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.config-group {
  margin-bottom: 20px;
}

.config-group label {
  display: block;
  margin-bottom: 8px;
  color: #555555;
  font-weight: 500;
  font-size: 14px;
}

.config-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.config-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.connect-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.connect-button {
  padding: 15px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.connect-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.connect-button.connected {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.connect-button.connected:hover {
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.status-text {
  text-align: center;
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .config-panel {
    padding: 20px;
  }
}
</style>