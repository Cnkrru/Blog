<script setup>
import { ref } from 'vue'

// 版本信息 - �?Serial_Version.py 获取
const versionInfo = {
  Version: '1.0.0',
  Author: 'Cnkrru',
  Date: '2026-04-08',
  Description: '串口工具',
  Copyright: 'Copyright (c) 2026 Cnkrru',
  License: 'MIT License',
  Website: 'https://github.com/Cnkrru',
  QQEmail: '3253884026@qq.com',
  GoogleEmail: 'j19323850@gmail.com'
}

const features = [
  'Web Serial API 支持',
  '完整的串口配置（波特率、数据位、校验位、停止位）',
  '实时数据收发',
  '操作日志记录',
  '响应式设计',
  '本地存储日志',
  '日志导出功能',
  '速率统计',
  '错误恢复机制'
]

const dependencies = [
  { name: 'Vue 3', version: '3.4.0+' },
  { name: 'Web Serial API', version: 'Chrome 89+' },
  { name: 'LocalStorage', version: '所有现代浏览器' }
]
</script>

<template>
  <div class="about-panel">
    <div class="about-header">
      <h2>{{ versionInfo.Description }}</h2>
      <div class="version-badge">v{{ versionInfo.Version }}</div>
    </div>
    
    <div class="about-content">
      <section class="about-section">
        <div class="version-info-list">
          <div class="version-info-item">
            <span class="version-info-label">版本:</span>
            <span class="version-info-value">{{ versionInfo.Version }}</span>
          </div>
          <div class="version-info-item">
            <span class="version-info-label">作者:</span>
            <span class="version-info-value">{{ versionInfo.Author }}</span>
          </div>
          <div class="version-info-item">
            <span class="version-info-label">日期:</span>
            <span class="version-info-value">{{ versionInfo.Date }}</span>
          </div>
          <div class="version-info-item">
            <span class="version-info-label">版权:</span>
            <span class="version-info-value">{{ versionInfo.Copyright }}</span>
          </div>
          <div class="version-info-item">
            <span class="version-info-label">协议:</span>
            <span class="version-info-value">{{ versionInfo.License }}</span>
          </div>
          <div class="version-info-item">
            <span class="version-info-label">网站:</span>
            <span class="version-info-value">
              <a :href="versionInfo.Website" target="_blank" rel="noopener noreferrer">{{ versionInfo.Website }}</a>
            </span>
          </div>
          <div class="version-info-item">
            <span class="version-info-label">QQ邮箱:</span>
            <span class="version-info-value">
              <a :href="'mailto:' + versionInfo.QQEmail">{{ versionInfo.QQEmail }}</a>
            </span>
          </div>
          <div class="version-info-item">
            <span class="version-info-label">Google邮箱:</span>
            <span class="version-info-value">
              <a :href="'mailto:' + versionInfo.GoogleEmail">{{ versionInfo.GoogleEmail }}</a>
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
.about-panel {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.about-header h2 {
  color: #333333;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.version-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.about-section {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.about-section h3 {
  color: #333333;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  color: #555555;
  font-size: 14px;
}

.feature-icon {
  color: #4CAF50;
  font-weight: bold;
  margin-right: 10px;
  font-size: 16px;
}

.dependency-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.dependency-item {
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dependency-name {
  color: #333333;
  font-weight: 500;
  font-size: 14px;
}

.dependency-version {
  color: #667eea;
  font-size: 12px;
  font-family: 'Courier New', monospace;
}

.version-info-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.version-info-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.version-info-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.version-info-label {
  color: #666666;
  font-size: 14px;
  font-weight: 600;
  min-width: 100px;
  text-align: right;
}

.version-info-value {
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.version-info-value a {
  color: #667eea;
  text-decoration: none;
  transition: all 0.3s ease;
}

.version-info-value a:hover {
  color: #764ba2;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .about-panel {
    padding: 20px;
  }
  
  .about-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .version-info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .version-info-label {
    min-width: auto;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .version-info-item {
    padding: 12px;
  }
  
  .version-info-label {
    font-size: 12px;
  }
  
  .version-info-value {
    font-size: 13px;
  }
}
</style>