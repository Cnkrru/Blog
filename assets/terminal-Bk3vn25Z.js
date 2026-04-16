var e=`---
title: 终端
date: 2026-04-16
author: Cnkrru
description: 网站内置终端，执行特殊命令
keywords: 终端,命令行,cmd
category: 工具
tags:
  - 工具
  - 终端
---

# 终端

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
    <div class="terminal-output" id="terminal-output">
      <div class="terminal-line">
        <span class="prompt">Cnkrru@blog:~$</span>
        <span class="command">help</span>
      </div>
      <div class="terminal-line">
        <span class="output">可用命令：</span>
      </div>
      <div class="terminal-line">
        <span class="output">- help: 显示帮助信息</span>
      </div>
      <div class="terminal-line">
        <span class="output">- echo [文本]: 输出文本</span>
      </div>
      <div class="terminal-line">
        <span class="output">- clear: 清空终端</span>
      </div>
      <div class="terminal-line">
        <span class="output">- date: 显示当前日期</span>
      </div>
      <div class="terminal-line">
        <span class="output">- whoami: 显示当前用户</span>
      </div>
      <div class="terminal-line">
        <span class="output">- about: 关于网站</span>
      </div>
      <div class="terminal-line">
        <span class="output">- exit: 退出终端</span>
      </div>
    </div>
    <div class="terminal-input-line">
      <span class="prompt">Cnkrru@blog:~$</span>
      <input type="text" class="terminal-input" id="terminal-input" autocomplete="off">
    </div>
  </div>
</div>

<script>
// 终端模拟器
class Terminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.commands = {
      help: this.help.bind(this),
      echo: this.echo.bind(this),
      clear: this.clear.bind(this),
      date: this.date.bind(this),
      whoami: this.whoami.bind(this),
      about: this.about.bind(this),
      exit: this.exit.bind(this)
    };
    this.init();
  }

  init() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.processCommand();
      }
    });
    this.input.focus();
  }

  processCommand() {
    const command = this.input.value.trim();
    if (!command) return;

    this.addLine(\`Cnkrru@blog:~$ \${command}\`, 'command');
    
    const [cmd, ...args] = command.split(' ');
    
    if (this.commands[cmd]) {
      this.commands[cmd](args);
    } else {
      this.addLine(\`命令未找到: \${cmd}\`, 'error');
    }

    this.input.value = '';
    this.scrollToBottom();
  }

  addLine(text, type = 'output') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'command') {
      line.innerHTML = \`<span class="prompt">Cnkrru@blog:~$</span> <span class="\${type}">\${text.split('$ ')[1]}</span>\`;
    } else {
      line.innerHTML = \`<span class="\${type}">\${text}</span>\`;
    }
    
    this.output.appendChild(line);
  }

  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  help() {
    this.addLine('可用命令：');
    this.addLine('- help: 显示帮助信息');
    this.addLine('- echo [文本]: 输出文本');
    this.addLine('- clear: 清空终端');
    this.addLine('- date: 显示当前日期');
    this.addLine('- whoami: 显示当前用户');
    this.addLine('- about: 关于网站');
    this.addLine('- exit: 退出终端');
  }

  echo(args) {
    this.addLine(args.join(' '));
  }

  clear() {
    this.output.innerHTML = '';
  }

  date() {
    const now = new Date();
    this.addLine(now.toString());
  }

  whoami() {
    this.addLine('Cnkrru');
  }

  about() {
    this.addLine('Cnkrru的个人博客');
    this.addLine('一个分享技术和生活的地方');
    this.addLine('https://your-blog.com');
  }

  exit() {
    this.addLine('退出终端...');
    setTimeout(() => {
      window.location.href = '/home';
    }, 1000);
  }
}

// 初始化终端
window.addEventListener('DOMContentLoaded', () => {
  new Terminal();
});
<\/script>

<style>
.terminal-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #2d2d2d;
  font-family: 'Courier New', Courier, monospace;
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #333;
  border-bottom: 1px solid #444;
}

.terminal-title {
  color: #ddd;
  font-size: 14px;
}

.terminal-controls {
  display: flex;
  gap: 8px;
}

.control-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control-button.close {
  background-color: #ff5f56;
}

.control-button.minimize {
  background-color: #ffbd2e;
}

.control-button.maximize {
  background-color: #27c93f;
}

.terminal-body {
  padding: 16px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  color: #ddd;
}

.terminal-line {
  margin-bottom: 8px;
  line-height: 1.4;
}

.prompt {
  color: #4ec9b0;
  font-weight: bold;
  margin-right: 8px;
}

.command {
  color: #ffcc66;
}

.output {
  color: #ddd;
}

.error {
  color: #ff6b6b;
}

.terminal-input-line {
  display: flex;
  align-items: center;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ddd;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
}

/* 滚动条样式 */
.terminal-output::-webkit-scrollbar {
  width: 8px;
}

.terminal-output::-webkit-scrollbar-track {
  background: #333;
}

.terminal-output::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.terminal-output::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
`;export{e as default};