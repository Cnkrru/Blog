<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import questionSvg from '@/assets/svg/question.svg?raw'
import thumbsUpSvg from '@/assets/svg/thumbs-up.svg?raw'
import thumbsDownSvg from '@/assets/svg/thumbs-down.svg?raw'

const props = defineProps(['postId'])

// counterapi.dev 配置（在项目根目录 .env 文件中设置）
const API_BASE = import.meta.env.VITE_COUNTERAPI_BASE || 'https://api.counterapi.dev/v2'
const WORKSPACE = import.meta.env.VITE_COUNTERAPI_WORKSPACE
const TOKEN = import.meta.env.VITE_COUNTERAPI_TOKEN

const feedback = ref(null)
const showThanks = ref(false)
const upCount = ref(0)
const downCount = ref(0)
const storageKey = `article-feedback-${props.postId}`

function apiHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  }
  if (TOKEN) {
    headers['Authorization'] = `Bearer ${TOKEN}`
  }
  return headers
}

async function apiGet(name) {
  const { data } = await axios.get(`${API_BASE}/${WORKSPACE}/${name}`, { headers: apiHeaders() })
  return data
}

async function apiUp(name) {
  const { data } = await axios.post(`${API_BASE}/${WORKSPACE}/${name}/up`, null, { headers: apiHeaders() })
  return data
}

async function apiDown(name) {
  const { data } = await axios.post(`${API_BASE}/${WORKSPACE}/${name}/down`, null, { headers: apiHeaders() })
  return data
}

onMounted(async () => {
  // 读取本地投票状态
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'up' || saved === 'down') {
      feedback.value = saved
    }
  } catch {}

  // 从 API 获取当前计数
  const counterName = `post-${props.postId}`
  try {
    const data = await apiGet(counterName)
    if (data.code === '200') {
      upCount.value = data.data.up_count ?? 0
      downCount.value = data.data.down_count ?? 0
    }
  } catch {
    // 计数器不存在时静默忽略（首次访问会自动创建）
  }
})

async function submit(type) {
  if (feedback.value === type) {
    // 取消投票（仅清理本地状态，不修改服务端）
    feedback.value = null
    showThanks.value = false
    try { localStorage.removeItem(storageKey) } catch {}
    return
  }

  feedback.value = type
  showThanks.value = true
  try { localStorage.setItem(storageKey, type) } catch {}

  // 发送到 counterapi.dev
  const counterName = `post-${props.postId}`
  try {
    const data = type === 'up' ? await apiUp(counterName) : await apiDown(counterName)
    if (data.code === '200') {
      upCount.value = data.data.up_count ?? 0
      downCount.value = data.data.down_count ?? 0
    }
  } catch {
    // API 失败时不影响本地状态
  }

  setTimeout(() => { showThanks.value = false }, 2500)
}
</script>

<template>
  <div class="feedback-wrap">
    <div class="feedback-card">
      <div class="feedback-question">
        <span class="question-icon">
          <span class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="questionSvg"></span>
        </span>
        <span class="feedback-label">这篇文章对你有用吗？</span>
      </div>

      <div class="feedback-buttons">
        <button
          class="feedback-btn btn-up"
          :class="{ active: feedback === 'up' }"
          :disabled="!!feedback"
          title="有用"
          @click="submit('up')"
        >
          <span class="btn-wrap">
            <span class="svg-icon" :style="{ width: '22px', height: '22px' }" v-html="thumbsUpSvg"></span>
          </span>
          <span class="btn-text">有用</span>
          <span class="btn-count" v-if="upCount > 0">{{ upCount }}</span>
        </button>

        <button
          class="feedback-btn btn-down"
          :class="{ active: feedback === 'down' }"
          :disabled="!!feedback"
          title="没用"
          @click="submit('down')"
        >
          <span class="btn-wrap">
            <span class="svg-icon" :style="{ width: '22px', height: '22px' }" v-html="thumbsDownSvg"></span>
          </span>
          <span class="btn-text">没用</span>
          <span class="btn-count" v-if="downCount > 0">{{ downCount }}</span>
        </button>
      </div>

      <Transition name="thanks">
        <div v-if="showThanks" class="feedback-thanks">
          <span class="thanks-dot"></span>
          感谢反馈！
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.feedback-wrap {
  display: flex;
  justify-content: center;
  padding: 28px 0 20px;
}

/* 卡片容器 */
.feedback-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 24px 32px;
  border-radius: 16px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.35);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: border-color 0.3s ease;
}

.feedback-card:has(.feedback-btn.active) {
  border-color: color-mix(in srgb, var(--common-color-1) 20%, transparent);
}

/* 问题区域 */
.feedback-question {
  display: flex;
  align-items: center;
  gap: 8px;
}

.question-icon {
  display: flex;
  align-items: center;
  color: var(--common-text);
  opacity: 0.45;
  flex-shrink: 0;
}

.feedback-label {
  font-size: 0.95rem;
  color: var(--common-text);
  opacity: 0.75;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* 按钮 */
.feedback-buttons {
  display: flex;
  gap: 12px;
}

.feedback-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 24px;
  border: 1.5px solid color-mix(in srgb, var(--common-text) 12%, transparent);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.5);
  color: var(--common-text);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition:
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.25s ease,
    background 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;
  outline: none;
}

.feedback-btn:disabled {
  cursor: default;
}

.feedback-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.btn-up:not(:disabled):hover {
  border-color: var(--color-success);
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
}

.btn-down:not(:disabled):hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
}

.btn-up:not(:disabled):active {
  transform: scale(0.94);
}

.btn-down:not(:disabled):active {
  transform: scale(0.94);
}

.feedback-btn.active {
  border-color: var(--common-color-1);
  background: color-mix(in srgb, var(--common-color-1) 12%, transparent);
  color: var(--common-color-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--common-color-1) 8%, transparent);
  opacity: 1;
}

.btn-wrap {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.btn-text {
  white-space: nowrap;
}

/* 计数小标 */
.btn-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  font-size: 0.75rem;
  font-weight: 600;
  background: color-mix(in srgb, var(--common-text) 10%, transparent);
  color: var(--common-text);
  opacity: 0.7;
  transition: background 0.25s ease, color 0.25s ease;
}

.feedback-btn.active .btn-count {
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  color: var(--common-color-1);
  opacity: 1;
}

/* 感谢反馈 */
.feedback-thanks {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--common-color-1);
  font-weight: 500;
  opacity: 0.85;
}

.thanks-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--common-color-1);
  flex-shrink: 0;
}

/* 过渡动画 */
.thanks-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.thanks-leave-active {
  transition: all 0.3s ease;
}

.thanks-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.thanks-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .feedback-card {
    padding: 20px 20px;
    gap: 14px;
  }

  .feedback-btn {
    padding: 10px 20px;
  }

  .feedback-label {
    font-size: 0.88rem;
  }
}
</style>