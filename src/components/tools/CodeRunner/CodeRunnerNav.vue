<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['tab-change'])
const activeTab = ref('editor')
const router = useRouter()

const handleTabClick = (tab) => {
  activeTab.value = tab
  emit('tab-change', tab)
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <nav class="code-runner-nav">
    <div class="nav-container">
      <div class="nav-logo">
        <h2>代码运行器</h2>
      </div>
      <div class="nav-tabs">
        <button 
          class="nav-tab" 
          :class="{ active: activeTab === 'editor' }"
          @click="handleTabClick('editor')"
        >
          编辑器
        </button>
        <button 
          class="nav-tab" 
          :class="{ active: activeTab === 'stats' }"
          @click="handleTabClick('stats')"
        >
          统计
        </button>
        <button 
          class="nav-tab home"
          @click="goHome"
        >
          返回首页
        </button>
      </div>
    </div>
  </nav>
</template>

<style>
.code-runner-nav {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
  border-radius: 12px;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 60px;
}

.nav-logo h2 {
  color: #e0e0e0;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-tabs {
  display: flex;
  gap: 20px;
}

.nav-tab {
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-tab:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.nav-tab.active {
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.nav-tab.home {
  background-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.nav-tab.home:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px;
    gap: 15px;
  }
  
  .nav-tabs {
    width: 100%;
    justify-content: space-around;
  }
  
  .nav-tab {
    flex: 1;
    text-align: center;
  }
}
</style>