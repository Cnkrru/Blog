<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useHead } from '@vueuse/head'

// 导入子组件
import CodeRunnerNav from './CodeRunner/CodeRunnerNav.vue'
import CodeEditor from './CodeRunner/CodeEditor.vue'
import OutputPanel from './CodeRunner/OutputPanel.vue'
import StatsPanel from './CodeRunner/StatsPanel.vue'
import AboutPanel from './CodeRunner/AboutPanel.vue'

// SEO 配置
useHead({
  title: '代码运行器 - Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: '在线代码运行器，支持JavaScript代码的实时执行和输出显示' },
    { name: 'keywords', content: '代码运行器,JavaScript,在线运行,Web Worker' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' }
  ]
})

// 状态管理
const activeTab = ref('editor')
const code = ref('console.log("Hello World!");\n\n// 尝试一些JavaScript代码\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconsole.log("5! =", factorial(5));')
const output = ref('')
const isRunning = ref(false)
const executionTime = ref(0)
const error = ref(null)

// 统计信息
const stats = ref({
  executionCount: 0,
  totalExecutionTime: 0,
  successCount: 0,
  errorCount: 0
})

// Web Worker
let worker = null

// 切换标签
const handleTabChange = (tab) => {
  activeTab.value = tab
}

// 加载CodeMirror
const loadCodeMirror = () => {
  if (typeof CodeMirror === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/codemirror@6.0.1/dist/codemirror.min.js'
    script.async = true
    document.head.appendChild(script)
    
    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = 'https://cdn.jsdelivr.net/npm/codemirror@6.0.1/dist/codemirror.min.css'
    document.head.appendChild(style)
  }
}

// 创建Web Worker
const createWorker = () => {
  const workerCode = `
    // 重写console方法
    const originalConsole = console;
    const output = [];
    
    console.log = function(...args) {
      output.push({ type: 'log', args: args });
      originalConsole.log(...args);
    };
    
    console.error = function(...args) {
      output.push({ type: 'error', args: args });
      originalConsole.error(...args);
    };
    
    self.onmessage = function(e) {
      try {
        // 执行代码
        eval(e.data.code);
        self.postMessage({ success: true, output: output, executionTime: e.data.executionTime });
      } catch (error) {
        self.postMessage({ success: false, error: error.message, stack: error.stack, executionTime: e.data.executionTime });
      }
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  return new Worker(workerUrl);
}

// 运行代码
const runCode = () => {
  if (isRunning.value) return
  
  isRunning.value = true
  output.value = ''
  error.value = null
  const startTime = performance.now()
  
  if (!worker) {
    worker = createWorker()
    worker.onmessage = function(e) {
      const endTime = performance.now()
      executionTime.value = endTime - startTime
      
      if (e.data.success) {
        displayOutput(e.data.output)
        stats.value.successCount++
      } else {
        displayError(e.data.error, e.data.stack)
        stats.value.errorCount++
      }
      
      stats.value.executionCount++
      stats.value.totalExecutionTime += executionTime.value
      isRunning.value = false
    }
  }
  
  worker.postMessage({ code: code.value, executionTime: performance.now() })
}

// 显示输出
const displayOutput = (outputData) => {
  let html = ''
  outputData.forEach(item => {
    const content = item.args.map(arg => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2)
      }
      return arg
    }).join(' ')
    
    html += `<div class="${item.type}">${content}</div>`
  })
  output.value = html
}

// 显示错误
const displayError = (errorMessage, stack) => {
  let html = `<div class="error">Error: ${errorMessage}</div>`
  if (stack) {
    html += `<div class="stack">${stack}</div>`
  }
  output.value = html
  error.value = errorMessage
}

// 清空输出
const clearOutput = () => {
  output.value = ''
  error.value = null
}

// 生命周期
onMounted(() => {
  loadCodeMirror()
  worker = createWorker()
  worker.onmessage = function(e) {
    const endTime = performance.now()
    executionTime.value = endTime - performance.now()
    
    if (e.data.success) {
      displayOutput(e.data.output)
      stats.value.successCount++
    } else {
      displayError(e.data.error, e.data.stack)
      stats.value.errorCount++
    }
    
    stats.value.executionCount++
    stats.value.totalExecutionTime += executionTime.value
    isRunning.value = false
  }
})

onUnmounted(() => {
  if (worker) {
    worker.terminate()
  }
})
</script>

<template>
  <div class="code-runner-container">
    <!-- 导航栏 -->
    <CodeRunnerNav @tab-change="handleTabChange" />
    
    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- 编辑器页面 -->
    <div v-if="activeTab === 'editor'" class="tab-content">
      <div class="code-runner-content">
        <!-- 代码编辑器 -->
        <CodeEditor 
          v-model:code="code"
          :is-running="isRunning"
          @run-code="runCode"
          @clear-output="clearOutput"
        />
        
        <!-- 输出面板 -->
        <OutputPanel 
          :output="output"
          :execution-time="executionTime"
        />
      </div>
    </div>
    
    <!-- 统计页面 -->
    <div v-else-if="activeTab === 'stats'" class="tab-content">
      <StatsPanel :stats="stats" />
    </div>
    

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

.code-runner-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 40px 20px;
}

/* 错误信息 */
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

/* 主内容 */
.code-runner-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 30px;
}

/* 标签内容 */
.tab-content {
  margin-bottom: 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-runner-content {
    grid-template-columns: 1fr;
  }
  
  .code-runner-container {
    padding: 20px 10px;
  }
  
  .tab-content {
    margin-bottom: 20px;
  }
}
</style>