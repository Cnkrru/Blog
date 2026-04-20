<script setup>

</script>

<template>
  <div class="about-panel">
    <h3>关于代码运行器</h3>
    <div class="about-content">
      <div class="about-section">
        <h4>功能特点</h4>
        <ul>
          <li>📝 在线编辑 JavaScript 代码</li>
          <li>⚡ 实时执行代码并显示输出</li>
          <li>🔒 安全执行（使用 Web Worker 隔离）</li>
          <li>📊 执行统计和性能分析</li>
          <li>🎨 美观的代码编辑器</li>
        </ul>
      </div>
      
      <div class="about-section">
        <h4>技术实现</h4>
        <ul>
          <li><strong>前端框架：</strong>Vue 3 + Composition API</li>
          <li><strong>代码编辑器：</strong>CodeMirror 6（CDN）</li>
          <li><strong>执行环境：</strong>Web Workers</li>
          <li><strong>UI 设计：</strong>响应式布局</li>
        </ul>
      </div>
      
      <div class="about-section">
        <h4>使用说明</h4>
        <ol>
          <li>在代码编辑器中输入 JavaScript 代码</li>
          <li>点击「运行」按钮执行代码</li>
          <li>在输出面板查看执行结果</li>
          <li>查看「统计」标签页了解执行情况</li>
        </ol>
      </div>
      
      <div class="about-section">
        <h4>安全提示</h4>
        <p class="warning-text">
          ⚠️ 注意：代码运行器在浏览器的 Web Worker 中执行代码，
          虽然有一定的隔离保护，但仍建议只运行可信的代码。
        </p>
      </div>
      
      <div class="about-section">
        <h4>示例代码</h4>
        <pre class="code-example">
// 计算阶乘
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log("5! =", factorial(5));

// 生成斐波那契数列
function fibonacci(n) {
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib[i] = fib[i-1] + fib[i-2];
  }
  return fib;
}

console.log("斐波那契数列:", fibonacci(10));</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-panel {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.about-panel h3 {
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.about-section h4 {
  color: #1a1a2e;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  border-bottom: 2px solid #4ecdc4;
  padding-bottom: 5px;
}

.about-section ul {
  list-style: none;
  padding-left: 0;
}

.about-section li {
  padding: 5px 0;
  padding-left: 25px;
  position: relative;
}

.about-section li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ff6b6b;
  font-weight: bold;
}

.about-section ol {
  padding-left: 20px;
}

.about-section ol li {
  padding: 5px 0;
}

.warning-text {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid #ffc107;
  border-radius: 6px;
  padding: 10px;
  color: #856404;
  font-size: 14px;
  line-height: 1.4;
}

.code-example {
  background: #272822;
  color: #f8f8f2;
  border-radius: 6px;
  padding: 15px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}

@media (max-width: 768px) {
  .about-section {
    padding: 10px;
  }
  
  .code-example {
    font-size: 12px;
    padding: 10px;
  }
}
</style>