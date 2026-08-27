<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useHead } from '@vueuse/head'
import VIcon from '@/components/common/VIcon.vue'

useHead({
  title: '友链申请 - Cnkrru\'s Blog',
  link: [{ rel: 'canonical', href: 'https://cnkrru.top/links/apply' }]
})

const form = ref({ name: '', url: '', description: '', email: '' })
const submitted = ref(false)
const submitting = ref(false)

const formspreeId = 'xkoajadl'

async function submitForm() {
  submitting.value = true
  try {
    await axios.post(
      `https://formspree.io/f/${formspreeId}`,
      form.value,
      { headers: { 'Content-Type': 'application/json' } }
    )
    submitted.value = true
  } catch (e) { console.error('提交失败:', e) } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="center-head-card">
    <h2>友链申请</h2>
  </div>
  <hr>
  <div class="center-card-content">
    <div v-if="submitted" class="success-card">
      <span class="s-icon"><VIcon :src="'check.svg'" :size="40" /></span>
      <h3>申请已提交</h3>
      <p>我会尽快审核并添加你的友链，感谢支持！</p>
    </div>

    <form v-else class="apply-form" @submit.prevent="submitForm">
      <p class="form-desc">申请友链前请先在你的网站添加本站链接：<strong>https://cnkrru.top</strong></p>

      <label class="field">
        <span>网站名称</span>
        <input class="text-input" v-model="form.name" type="text" required placeholder="你的网站名" />
      </label>

      <label class="field">
        <span>网站链接</span>
        <input class="text-input" v-model="form.url" type="url" required placeholder="https://" />
      </label>

      <label class="field">
        <span>网站描述</span>
        <input class="text-input" v-model="form.description" type="text" placeholder="简短介绍（选填）" />
      </label>

      <label class="field">
        <span>你的邮箱</span>
        <input class="text-input" v-model="form.email" type="email" placeholder="用于回复通知（选填）" />
      </label>

      <button type="submit" class="submit-btn" :disabled="submitting">
        {{ submitting ? '提交中...' : '提交申请' }}
      </button>
    </form>
  </div>
</template>

<!-- 布局样式 -->
<style scoped>
.center-head-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.success-card {
  text-align: center;
  padding: 40px 20px;
}
.s-icon { font-size: 40px; }
.success-card h3 { margin: 12px 0 8px; }

.apply-form {
  max-width: 480px;
  margin: 0 auto;
}

.form-desc {
  font-size: 13px;
  text-align: center;
  margin-bottom: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.field span {
  font-size: 13px;
  margin-left: 2px;
}

.field input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field input:focus {
  outline: none;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border-radius: 24px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

.submit-btn:hover { transform: translateY(-1px); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
</style>

<!-- 颜色样式 -->
<style scoped>
.success-card h3 { color: var(--common-text); }
.success-card p { color: var(--common-text); opacity: 0.55; font-size: 14px; }

.form-desc { color: var(--common-text); opacity: 0.55; }
.field span { color: var(--common-text); opacity: 0.6; }

.field input {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  border-color: color-mix(in srgb, var(--common-text) 10%, transparent);
  color: var(--common-text);
}
.field input:focus {
  border-color: var(--common-color-1);
  box-shadow: 0 0 0 3px rgba(255, 192, 203, 0.12);
}

.submit-btn {
  background: var(--common-color-1);
  color: #fff;
}
</style>
