<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  receivedData: {
    type: String,
    default: ''
  },
  isConnected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send-data', 'clear-received', 'clear-send', 'format-change'])

const sendData = ref('')
const autoScroll = ref(true)
const receiveFormat = ref('ascii')
const sendFormat = ref('ascii')
const receiveEncoding = ref('utf-8')
const sendEncoding = ref('utf-8')
const addNewline = ref(false)

const encodingOptions = [
  { value: 'utf-8', label: 'UTF-8' },
  { value: 'utf-16', label: 'UTF-16' },
  { value: 'gbk', label: 'GBK' },
  { value: 'gb18030', label: 'GB18030' }
]

const formattedReceivedData = computed(() => {
  if (!props.receivedData) return ''
  
  switch (receiveFormat.value) {
    case 'hex':
      return toHex(props.receivedData)
    case 'binary':
      return toBinary(props.receivedData)
    case 'decimal':
      return toDecimal(props.receivedData)
    default:
      return props.receivedData
  }
})

const sendDataToSerial = () => {
  if (sendData.value) {
    let data = sendData.value
    
    // 根据发送格式处理数据
    switch (sendFormat.value) {
      case 'hex':
        data = fromHex(data)
        break
      case 'binary':
        data = fromBinary(data)
        break
      case 'decimal':
        data = fromDecimal(data)
        break
    }
    
    // 添加换行符
    if (addNewline.value) {
      data += '\n'
    }
    
    emit('send-data', data)
  }
}

const clearReceivedData = () => {
  emit('clear-received')
}

const clearSendData = () => {
  emit('clear-send')
  sendData.value = ''
}

const changeReceiveFormat = (format) => {
  receiveFormat.value = format
  emit('format-change', { 
    receive: format, 
    send: sendFormat.value,
    receiveEncoding: receiveEncoding.value,
    sendEncoding: sendEncoding.value
  })
}

const changeSendFormat = (format) => {
  sendFormat.value = format
  emit('format-change', { 
    receive: receiveFormat.value, 
    send: format,
    receiveEncoding: receiveEncoding.value,
    sendEncoding: sendEncoding.value
  })
}

const changeReceiveEncoding = (encoding) => {
  receiveEncoding.value = encoding
  emit('format-change', { 
    receive: receiveFormat.value, 
    send: sendFormat.value,
    receiveEncoding: encoding,
    sendEncoding: sendEncoding.value
  })
}

const changeSendEncoding = (encoding) => {
  sendEncoding.value = encoding
  emit('format-change', { 
    receive: receiveFormat.value, 
    send: sendFormat.value,
    receiveEncoding: receiveEncoding.value,
    sendEncoding: encoding
  })
}

const toggleAddNewline = () => {
  addNewline.value = !addNewline.value
}

// 数据格式转换函数
const toHex = (str) => {
  return [...str].map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')
}

const toBinary = (str) => {
  return [...str].map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
}

const toDecimal = (str) => {
  return [...str].map(char => char.charCodeAt(0)).join(' ')
}

const fromHex = (hexStr) => {
  const hex = hexStr.replace(/\s/g, '')
  let result = ''
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16)
    if (!isNaN(byte)) {
      result += String.fromCharCode(byte)
    }
  }
  return result
}

const fromBinary = (binStr) => {
  const bins = binStr.split(/\s+/)
  let result = ''
  for (const bin of bins) {
    const byte = parseInt(bin, 2)
    if (!isNaN(byte)) {
      result += String.fromCharCode(byte)
    }
  }
  return result
}

const fromDecimal = (decStr) => {
  const decs = decStr.split(/\s+/)
  let result = ''
  for (const dec of decs) {
    const byte = parseInt(dec, 10)
    if (!isNaN(byte)) {
      result += String.fromCharCode(byte)
    }
  }
  return result
}
</script>

<template>
  <div class="data-panel">
    <!-- 接收区 -->
    <div class="terminal-section">
      <div class="terminal-header">
        <h2>接收数据</h2>
        <div class="terminal-controls">
          <label class="checkbox-label">
            <input type="checkbox" v-model="autoScroll"> 自动滚动
          </label>
          <select 
            class="format-select" 
            v-model="receiveFormat"
            @change="changeReceiveFormat(receiveFormat)"
          >
            <option value="ascii">ASCII</option>
            <option value="hex">HEX</option>
            <option value="binary">BINARY</option>
            <option value="decimal">DECIMAL</option>
          </select>
          <select 
            class="format-select" 
            v-model="receiveEncoding"
            @change="changeReceiveEncoding(receiveEncoding)"
          >
            <option v-for="option in encodingOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <button class="clear-button" @click="clearReceivedData">清空</button>
        </div>
      </div>
      <div id="receive-terminal" class="terminal">
        <pre>{{ formattedReceivedData }}</pre>
      </div>
    </div>
    
    <!-- 发送区 -->
    <div class="send-section">
      <div class="send-header">
        <h2>发送数据</h2>
        <div class="send-controls-left">
          <select 
            class="format-select" 
            v-model="sendFormat"
            @change="changeSendFormat(sendFormat)"
          >
            <option value="ascii">ASCII</option>
            <option value="hex">HEX</option>
            <option value="binary">BINARY</option>
            <option value="decimal">DECIMAL</option>
          </select>
          <select 
            class="format-select" 
            v-model="sendEncoding"
            @change="changeSendEncoding(sendEncoding)"
          >
            <option v-for="option in encodingOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <label class="checkbox-label">
            <input type="checkbox" v-model="addNewline" @change="toggleAddNewline"> 添加换行
          </label>
          <button class="clear-button" @click="clearSendData">清空</button>
        </div>
      </div>
      <textarea 
        v-model="sendData"
        class="send-input"
        :placeholder="`输入要发送的数据... (${sendFormat.toUpperCase()}, ${sendEncoding.toUpperCase()})`"
        rows="4"
      ></textarea>
      <div class="send-controls">
        <button 
          class="send-button" 
          :disabled="!isConnected || !sendData"
          @click="sendDataToSerial"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.data-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.terminal-section {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.terminal-header h2 {
  color: #333333;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;
}

.terminal-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.format-select {
  padding: 6px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.format-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-controls-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #555555;
  cursor: pointer;
  font-weight: 500;
}

.clear-button {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  color: #555555;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.clear-button:hover {
  background-color: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

.terminal {
  height: 350px;
  overflow-y: auto;
  padding: 20px;
  background-color: #ffffff;
  font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border: 1px solid #e0e0e0;
}

.terminal pre {
  margin: 0;
  color: #000000;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.send-section {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.send-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.send-header h2 {
  color: #333333;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;
}

.send-input {
  width: 100%;
  padding: 20px;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  color: #333333;
  font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  resize: none;
  min-height: 120px;
}

.send-input:focus {
  outline: none;
  border-bottom: 2px solid #667eea;
}

.send-controls {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
}

.send-button {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  background: linear-gradient(135deg, #e0e0e0 0%, #cccccc 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .terminal {
    height: 250px;
  }
  
  .terminal-header,
  .send-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .terminal-controls {
    width: 100%;
    justify-content: space-between;
  }
}

.terminal::-webkit-scrollbar {
  width: 8px;
}

.terminal::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.terminal::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.terminal::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>