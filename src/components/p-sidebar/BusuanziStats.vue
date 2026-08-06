<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showPopup = ref(false)
const loading = ref(true)

const togglePopup = () => {
  showPopup.value = !showPopup.value
}

const closePopup = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.busuanzi-popup') && !target.closest('.busuanzi-btn')) {
    showPopup.value = false
  }
}

const loadBusuanzi = () => {
  if (typeof window === 'undefined') return
  if (document.querySelector('script[src*="busuanzi"]')) {
    loading.value = false
    return
  }
  const script = document.createElement('script')
  script.src = '//cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
  script.defer = true
  script.onload = () => { loading.value = false }
  script.onerror = () => { loading.value = false }
  document.head.appendChild(script)
}

onMounted(() => {
  loadBusuanzi()
  document.addEventListener('click', closePopup)
})
</script>

<template>
  <div class="busuanzi-wrapper">
    <button class="busuanzi-btn" @click="togglePopup" title="站点统计">
      统计
    </button>

    <Teleport to="body">
      <div v-if="showPopup" class="busuanzi-overlay" @click="closePopup">
        <div class="busuanzi-popup">
          <div class="popup-header">
            <h3>站点统计</h3>
            <button class="popup-close" @click="showPopup = false">&times;</button>
          </div>

          <div v-if="loading" class="popup-loading">加载中...</div>

          <div v-else class="stats-grid">
            <div class="stats-item">
              <span class="stats-label">今日PV</span>
              <span id="busuanzi_today_pv" class="stats-value">-</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">今日UV</span>
              <span id="busuanzi_today_uv" class="stats-value">-</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">总访问量</span>
              <span id="busuanzi_site_pv" class="stats-value">-</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">总访客数</span>
              <span id="busuanzi_site_uv" class="stats-value">-</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">本页阅读</span>
              <span id="busuanzi_page_pv" class="stats-value">-</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">本页访客</span>
              <span id="busuanzi_page_uv" class="stats-value">-</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.busuanzi-wrapper {
  width: 100%;
}

.busuanzi-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.3);
  color: var(--common-text);
  font-size: 14px;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

body.dark-theme .busuanzi-btn {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.busuanzi-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.45);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

body.dark-theme .busuanzi-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 弹窗 */
.busuanzi-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  background: rgba(0, 0, 0, 0.2);
}

.busuanzi-popup {
  width: 340px;
  max-width: 90vw;
  border-radius: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: popupIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

body.dark-theme .busuanzi-popup {
  background: rgba(30, 30, 40, 0.95);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

@keyframes popupIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.popup-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--common-text);
}

.popup-close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  color: var(--common-text);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

body.dark-theme .popup-close {
  background: rgba(255, 255, 255, 0.1);
}

.popup-close:hover {
  background: rgba(0, 0, 0, 0.12);
}

body.dark-theme .popup-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.popup-loading {
  text-align: center;
  padding: 20px;
  color: var(--common-text);
  opacity: 0.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stats-item {
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  background: rgba(255, 192, 203, 0.15);
  border: 1px solid rgba(255, 192, 203, 0.2);
}

body.dark-theme .stats-item {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.stats-label {
  display: block;
  font-size: 12px;
  color: var(--common-text);
  opacity: 0.7;
  margin-bottom: 4px;
}

.stats-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--common-color-1);
}
</style>