<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  isRunning: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:code', 'run-code', 'clear-output'])
const editorRef = ref(null)
let editor = null

// 语言列表
const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' }
]

const selectedLanguage = ref('javascript')

// 加载CodeMirror
const loadCodeMirror = () => {
  return new Promise((resolve) => {
    if (typeof CodeMirror !== 'undefined') {
      resolve()
      return
    }

    // 加载CodeMirror脚本
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.js'
    script.async = true
    script.onload = () => {
      // 加载JavaScript模式
      const jsMode = document.createElement('script')
      jsMode.src = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/javascript/javascript.min.js'
      jsMode.onload = resolve
      document.head.appendChild(jsMode)
    }
    document.head.appendChild(script)

    // 加载样式
    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.css'
    document.head.appendChild(style)

    // 加载Monokai主题
    const theme = document.createElement('link')
    theme.rel = 'stylesheet'
    theme.href = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/theme/monokai.min.css'
    document.head.appendChild(theme)
  })
}

onMounted(async () => {
  await loadCodeMirror()
  
  // 初始化CodeMirror
  if (typeof CodeMirror !== 'undefined' && editorRef.value) {
    editor = CodeMirror(editorRef.value, {
      mode: selectedLanguage.value,
      lineNumbers: true,
      theme: 'monokai',
      value: props.code,
      lineWrapping: true,
      indentUnit: 2,
      tabSize: 2,
      autofocus: true
    })
    
    editor.on('change', () => {
      emit('update:code', editor.getValue())
    })
  }
})

watch(() => props.code, (newCode) => {
  if (editor && editor.getValue() !== newCode) {
    editor.setValue(newCode)
  }
})

const handleLanguageChange = (lang) => {
  selectedLanguage.value = lang
  if (editor) {
    editor.setOption('mode', lang)
  }
}

const handleRunCode = () => {
  emit('run-code')
}

const handleClearOutput = () => {
  emit('clear-output')
}
</script>

<template>
  <div class="code-editor">
    <div class="editor-header">
      <div class="header-left">
        <h3>代码编辑器</h3>
        <div class="language-selector">
          <select 
            v-model="selectedLanguage"
            @change="handleLanguageChange(selectedLanguage)"
            class="language-select"
          >
            <option v-for="lang in languages" :key="lang.value" :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="editor-controls">
        <button 
          class="control-button run-button"
          @click="handleRunCode"
          :disabled="isRunning"
        >
          <span v-if="isRunning">运行中...</span>
          <span v-else>运行</span>
        </button>
        <button 
          class="control-button clear-button"
          @click="handleClearOutput"
        >
          清空输出
        </button>
      </div>
    </div>
    <div class="editor-container">
      <div ref="editorRef" class="editor"></div>
    </div>
    <div class="editor-hint">
      <p>💡 提示：尝试输入代码并点击运行按钮</p>
    </div>
  </div>
</template>

<style>
.code-editor {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.editor-header h3 {
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.language-selector {
  position: relative;
}

.language-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.language-select:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.editor-controls {
  display: flex;
  gap: 10px;
}

.control-button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.run-button {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
}

.run-button:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}

.run-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-button {
  background: rgba(255, 255, 255, 0.1);
  color: #333;
  border: 1px solid #ddd;
}

.clear-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.editor-container {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  min-height: 300px;
}

.editor {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.editor-hint {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
}

/* CodeMirror 自定义样式 */
.CodeMirror {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  height: 100%;
  min-height: 300px;
}

.CodeMirror-scroll {
  min-height: 300px;
}

.CodeMirror-lines {
  padding: 10px 0;
}

.cm-s-monokai.CodeMirror {
  background: #272822;
  color: #f8f8f2;
}

.cm-s-monokai .CodeMirror-gutters {
  background: #272822;
  border-right: 1px solid #444;
}

.cm-s-monokai .CodeMirror-line-numbers {
  color: #75715e;
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .header-left {
    width: 100%;
    justify-content: space-between;
  }
  
  .editor-controls {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>