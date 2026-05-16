<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: '友链申请 - Cnkrru\'s Blog',
  link: [{ rel: 'canonical', href: 'https://cnkrru.top/links/apply' }]
})

const form = ref({ name: '', url: '', description: '', email: '' })
const submitted = ref(false)
const submitting = ref(false)

const formspreeId = 'YOUR_FORM_ID' // 替换为你的 Formspree form ID

async function submitForm() {
  submitting.value = true
  try {
    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    if (res.ok) {
      submitted.value = true
    }
  } catch {} finally {
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
      <span class="s-icon">✅</span>
      <h3>申请已提交</h3>
      <p>我会尽快审核并添加你的友链，感谢支持！</p>
    </div>

    <form v-else class="apply-form" @submit.prevent="submitForm">
      <p class="form-desc">申请友链前请先在你的网站添加本站链接：<strong>https://cnkrru.top</strong></p>

      <label class="field">
        <span>网站名称</span>
        <input v-model="form.name" type="text" required placeholder="你的网站名" />
      </label>

      <label class="field">
        <span>网站链接</span>
        <input v-model="form.url" type="url" required placeholder="https://" />
      </label>

      <label class="field">
        <span>网站描述</span>
        <input v-model="form.description" type="text" placeholder="简短介绍（选填）" />
      </label>

      <label class="field">
        <span>你的邮箱</span>
        <input v-model="form.email" type="email" placeholder="用于回复通知（选填）" />
      </label>

      <button type="submit" class="submit-btn" :disabled="submitting">
        {{ submitting ? '提交中...' : '提交申请' }}
      </button>
    </form>
  </div>
</template>

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
.success-card h3 { margin: 12px 0 8px; color: var(--common-text); }
.success-card p { color: var(--common-text); opacity: 0.6; font-size: 14px; }

.apply-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-desc {
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.6;
  margin-bottom: 24px;
  text-align: center;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.field span {
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.7;
  margin-left: 2px;
}

.field input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid var(--common-color-1);
  background: var(--common-bg);
  color: var(--common-text);
  font-size: 14px;
  transition: border-color 0.2s;
}

.field input:focus {
  outline: none;
  border-color: var(--common-hover);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: var(--common-color-1);
  color: var(--common-content);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
