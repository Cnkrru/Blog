<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showPopup = ref(false)
const loading = ref(true)
const error = ref(false)

const stats = ref({
  sitePv: '-',
  siteUv: '-',
  pagePv: '-'
})

let jsonpScript = null
let callbackName = ''
let timeoutId = null

const togglePopup = () => {
  showPopup.value = !showPopup.value
}

const closePopup = (e) => {
  const target = e.target
  if (!target.closest('.busuanzi-popup') && !target.closest('.busuanzi-btn')) {
    showPopup.value = false
  }
}

// 直接发起 JSONP 请求，绕过不蒜子脚本的 DOM 操作
const fetchBusuanzi = () => {
  if (typeof window === 'undefined') return

  // 生成唯一回调名
  callbackName = '_bsz_' + Math.floor(1099511627776 * Math.random())

  // 注册 JSONP 回调
  ;window[callbackName] = (data) => {
    cleanup()

    if (data && typeof data === 'object') {
      if (data.site_pv !== undefined) stats.value.sitePv = String(data.site_pv)
      if (data.site_uv !== undefined) stats.value.siteUv = String(data.site_uv)
      if (data.page_pv !== undefined) stats.value.pagePv = String(data.page_pv)
    }

    loading.value = false
    error.value = false
  }

  // 超时处理
  timeoutId = setTimeout(() => {
    if (loading.value) {
      cleanup()
      loading.value = false
      error.value = true
    }
  }, 8000)

  // 创建 JSONP script 标签
  jsonpScript = document.createElement('script')
  jsonpScript.type = 'text/javascript'
  jsonpScript.src = `//busuanzi.ibruce.info/busuanzi?jsonpCallback=${callbackName}`
  jsonpScript.referrerPolicy = 'no-referrer-when-downgrade'
  jsonpScript.onerror = () => {
    cleanup()
    loading.value = false
    error.value = true
  }
  document.head.appendChild(jsonpScript)
}

const cleanup = () => {
  if (callbackName && window[callbackName]) {
    delete window[callbackName]
  }
  if (jsonpScript && jsonpScript.parentElement) {
    jsonpScript.parentElement.removeChild(jsonpScript)
  }
  jsonpScript = null
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

onMounted(() => {
  fetchBusuanzi()
  document.addEventListener('click', closePopup)
})

onUnmounted(() => {
  cleanup()
  document.removeEventListener('click', closePopup)
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

          <div v-if="loading" class="popup-loading">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>

          <div v-else-if="error" class="popup-error">
            <span>统计数据加载失败</span>
            <button class="retry-button" @click="loading = true; error = false; fetchBusuanzi()">重试</button>
          </div>

          <div v-else class="stats-grid">
            <div class="stats-item">
              <span class="stats-label">站点 PV</span>
              <span class="stats-value">{{ stats.sitePv }}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">站点 UV</span>
              <span class="stats-value">{{ stats.siteUv }}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">本页阅读</span>
              <span class="stats-value">{{ stats.pagePv }}</span>
            </div>
          </div>

          <div class="popup-footer">
            Powered by <a href="https://busuanzi.ibruce.info" target="_blank" rel="noopener">不蒜子</a>
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
  border: 1px solid color-mix(in srgb, var(--common-color-1) 30%, transparent);
  background: color-mix(in srgb, var(--common-color-1) 30%, transparent);
  color: var(--common-text);
  font-size: 14px;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.busuanzi-btn:hover {
  transform: translateY(-2px);
  background: color-mix(in srgb, var(--common-color-1) 50%, transparent);
  border-color: color-mix(in srgb, var(--common-color-1) 45%, transparent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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
  width: 320px;
  max-width: 90vw;
  border-radius: 16px;
  padding: 20px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  box-shadow: 0 20px 60px var(--common-shadow);
  animation: popupIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  background: color-mix(in srgb, var(--common-text) 8%, transparent);
  color: var(--common-text);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.popup-close:hover {
  background: color-mix(in srgb, var(--common-text) 18%, transparent);
}

.popup-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  color: var(--common-text);
  opacity: 0.6;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid color-mix(in srgb, var(--common-color-1) 30%, transparent);
  border-top-color: var(--common-color-1);
  animation: spin 0.8s linear infinite;
}

.popup-error {
  text-align: center;
  padding: 20px;
  color: var(--common-text);
  opacity: 0.6;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.stats-item {
  padding: 12px 8px;
  border-radius: 10px;
  text-align: center;
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--common-color-1) 20%, transparent);
}

.stats-label {
  display: block;
  font-size: 11px;
  color: var(--common-text);
  opacity: 0.7;
  margin-bottom: 4px;
}

.stats-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--common-color-1);
}

/* 底部链接 */
.popup-footer {
  text-align: center;
  font-size: 11px;
  color: var(--common-text);
  opacity: 0.4;
  margin-top: 8px;
}

.popup-footer a {
  color: var(--common-color-1);
  text-decoration: none;
}

.popup-footer a:hover {
  text-decoration: underline;
}
</style>