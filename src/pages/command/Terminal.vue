<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { helpCommand } from '../../components/commands/HelpCommand.js'
import { clearCommand } from '../../components/commands/ClearCommand.js'
import { exitCommand } from '../../components/commands/ExitCommand.js'
import { lsCommand } from '../../components/commands/LSCommand.js'
import { cdCommand } from '../../components/commands/CDCommand.js'
import { infoCommand } from '../../components/commands/InfoCommand.js'

// 在组件顶层调用 useHead，使用响应式数据
useHead({
  title: '终端 - Cnkrru\'s Blog',
  meta: [
    {
      name: 'description',
      content: 'Cnkrru\'s Blog网站内置终端，执行特殊命令，体验隐藏的彩蛋功能'
    },
    {
      name: 'keywords',
      content: '终端,命令cmd,隐藏功能'
    },
    {
      name: 'author',
      content: 'Cnkrru'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top/terminal' },
    { property: 'og:title', content: '终端 - Cnkrru\'s Blog' },
    { property: 'og:description', content: 'Cnkrru\'s Blog网站内置终端，执行特殊命令' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top/terminal' },
    { name: 'twitter:title', content: '终端 - Cnkrru\'s Blog' },
    { name: 'twitter:description', content: 'Cnkrru\'s Blog网站内置终端' }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://cnkrru.top/terminal'
    }
  ]
})

const terminalOutput = ref('')
const terminalInput = ref('')
const showCnkrru = ref(false)
const autoScroll = ref(false)

const commands = {
  help: helpCommand,
  clear: clearCommand,
  exit: exitCommand,
  ls: lsCommand,
  cd: cdCommand,
  info: infoCommand
}

const terminal = {
  addLine: (text, type = 'output') => {
    if (type === 'error') {
      terminalOutput.value += `<div class="terminal-line"><span class="${type}">${text}</span></div>`
    } else {
      terminalOutput.value += `<div class="terminal-line"><span class="${type}">${text}</span></div>`
    }
    scrollToBottom()
  },
  output: {
    get innerHTML() {
      return terminalOutput.value
    },
    set innerHTML(value) {
      terminalOutput.value = value
    }
  },
  showCnkrru: () => {
    // 创建临时DOM元素来显示Cnkrru效果
    const cnkrruElement = document.createElement('div')
    cnkrruElement.style.position = 'fixed'
    cnkrruElement.style.top = '0'
    cnkrruElement.style.left = '0'
    cnkrruElement.style.width = '100vw'
    cnkrruElement.style.height = '100vh'
    cnkrruElement.style.background = 'rgba(0, 0, 0, 0.8)'
    cnkrruElement.style.display = 'flex'
    cnkrruElement.style.justifyContent = 'center'
    cnkrruElement.style.alignItems = 'center'
    cnkrruElement.style.zIndex = '99999'
    cnkrruElement.style.pointerEvents = 'none'
    
    const cnkrruText = document.createElement('div')
    cnkrruText.style.fontSize = '300px'
    cnkrruText.style.fontWeight = '800'
    cnkrruText.style.letterSpacing = '-0.02em'
    cnkrruText.style.background = 'var(--logo-gradient)'
    cnkrruText.style.backgroundSize = '400% 400%'
    cnkrruText.style.webkitBackgroundClip = 'text'
    cnkrruText.style.webkitTextFillColor = 'transparent'
    cnkrruText.style.backgroundClip = 'text'
    
    cnkrruElement.appendChild(cnkrruText)
    document.body.appendChild(cnkrruElement)
    
    // 强制重排以确保动画启动
    cnkrruText.offsetHeight
    
    // 应用动画
    cnkrruText.style.animation = 'gradient-shift 3s ease infinite'
    
    // 实现打字机效果
    const text = 'Cnkrru'
    let index = 0
    cnkrruText.textContent = ''
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        cnkrruText.textContent += text.charAt(index)
        index++
      } else {
        clearInterval(typingInterval)
      }
    }, 300)
    
    // 5秒后移除元素
    setTimeout(() => {
      document.body.removeChild(cnkrruElement)
    }, 5000)
  }
}

const scrollToBottom = () => {
  if (autoScroll.value) {
    setTimeout(() => {
      const outputElement = document.getElementById('terminal-output')
      if (outputElement) {
        outputElement.scrollTop = outputElement.scrollHeight
      }
    }, 100)
  }
}

const handleEnterKey = () => {
  const command = terminalInput.value.trim()
  if (!command) return

  terminalOutput.value += `<div class="terminal-line"><span class="prompt">Cnkrru@blog:~$</span> <span class="command">${command}</span></div>`

  const [cmd, ...args] = command.split(' ')

  if (cmd === 'c') {
    terminal.showCnkrru()
  } else if (commands[cmd]) {
    commands[cmd].execute(terminal, args)
  } else {
    terminal.addLine(`命令未找到: ${cmd}`, 'error')
  }

  terminalInput.value = ''
  updateCursorPosition()
  scrollToBottom()
}

const updateCursorPosition = () => {
  const inputElement = document.querySelector('.terminal-input')
  const cursorElement = document.querySelector('.input-cursor')
  if (inputElement && cursorElement) {
    const rect = inputElement.getBoundingClientRect()
    const inputRect = inputElement.getClientRects()[0]
    if (inputRect) {
      cursorElement.style.left = `${inputElement.value.length * 8}px`
    }
  }
}

const handleInput = () => {
  updateCursorPosition()
}

onMounted(() => {
  terminal.addLine('欢迎使用 Cnkrru Blog 终端！')
  terminal.addLine('输入 help 查看可用命令')
})
</script>

<template>
  <div class="terminal-page">
    <div class="terminal-container">
      <div class="terminal-header">
        <div class="terminal-title">终端</div>
        <div class="terminal-controls">
          <div class="control-button close"></div>
          <div class="control-button minimize"></div>
          <div class="control-button maximize"></div>
        </div>
      </div>
      <div class="terminal-body">
        <div class="terminal-output" id="terminal-output" v-html="terminalOutput"></div>
      </div>
      <div class="terminal-input-area">
        <div class="terminal-input-line">
          <span class="prompt">Cnkrru@blog:~$</span>
          <div class="input-container">
            <input
              type="text"
              class="terminal-input"
              v-model="terminalInput"
              @keydown.enter="handleEnterKey"
              @input="handleInput"
              @click="updateCursorPosition"
              @keyup="updateCursorPosition"
              autocomplete="off"
              spellcheck="false"
              placeholder="输入命令..."
            >
            <div class="input-cursor"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
}

.terminal-container {
  width: 100%;
  height: 100%;
  max-width: none;
  margin: 0;
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: var(--terminal-background);
  font-family: 'Courier New', Courier, monospace;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  flex-shrink: 0;
}

.terminal-title {
  color: var(--terminal-text);
  font-size: 14px;
  font-weight: 500;
  font-family: 'Courier New', Courier, monospace;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.control-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-button:hover {
  transform: scale(1.1);
}

.control-button.close {
  background-color: #ff6b6b;
}

.control-button.minimize {
  background-color: #ffbd2e;
}

.control-button.maximize {
  background-color: #27c93f;
}

.terminal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.terminal-output {
  width: 100%;
}

.terminal-input-area {
  padding: 0 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.output {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
}

.terminal-line {
  margin-bottom: 8px;
  line-height: 1.4;
}

.prompt {
  font-weight: bold;
  margin-right: 8px;
}

.error {
  color: #ff3333;
}

.terminal-input-line {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-top: 10px;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.terminal-input-line:hover {
  border-color: var(--accent-color);
  box-shadow: 0 0 10px rgba(0, 122, 255, 0.2);
}

.input-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  color: var(--terminal-text);
  padding: 0;
  margin: 0;
  z-index: 1;
}

.terminal-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.input-cursor {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 2px;
  background-color: var(--accent-color);
  animation: blink 1s infinite;
  z-index: 2;
  transform: translateX(calc(var(--cursor-position, 0px) + 0px));
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>