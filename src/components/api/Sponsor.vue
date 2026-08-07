<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showModal = ref(false)
const activeTab = ref<'wechat' | 'alipay'>('wechat')
const sponsor = ref<any>({ enabled: false })

const loadConfig = async () => {
  try {
    const res = await fetch('/config/sponsor.json')
    if (res.ok) sponsor.value = await res.json()
  } catch {}
}

const toggleModal = () => { showModal.value = !showModal.value }
const closeModal = () => { showModal.value = false }

onMounted(loadConfig)
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showModal.value) closeModal()
  })
}
</script>

<template>
  <div v-if="sponsor.enabled" class="sponsor-wrap">
    <button class="sponsor-btn" @click="toggleModal">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="sp-btn-icon">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      赞赏
    </button>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="sponsor-overlay" @click.self="closeModal">
          <div class="sponsor-modal">
            <div class="sponsor-header">
              <h3>赞赏支持</h3>
              <button class="sponsor-close" @click="closeModal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <p class="sponsor-msg">{{ sponsor.message }}</p>

            <div class="sponsor-tabs">
              <button :class="['sp-tab', { active: activeTab === 'wechat' }]" @click="activeTab = 'wechat'">微信</button>
              <button :class="['sp-tab', { active: activeTab === 'alipay' }]" @click="activeTab = 'alipay'">支付宝</button>
            </div>

            <div class="sponsor-qr">
              <img :src="activeTab === 'wechat' ? sponsor.wechat : sponsor.alipay" :alt="activeTab === 'wechat' ? '微信赞赏码' : '支付宝收款码'" class="qr-image" />
            </div>

            <p class="sponsor-thanks">感谢你的支持</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<!-- 布局 -->
<style scoped>
.sponsor-wrap { display: flex; justify-content: center; }
.sponsor-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, background-color 0.2s ease;
}
.sponsor-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px var(--common-shadow); }
.sp-btn-icon { flex-shrink: 0; }

.sponsor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sponsor-modal {
  border-radius: 18px;
  padding: 28px 24px 20px;
  width: 340px;
  max-width: 92vw;
  text-align: center;
  border: 1px solid;
}

.sponsor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.sponsor-header h3 { margin: 0; font-size: 17px; font-weight: 600; }
.sponsor-close {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.2s ease;
}
.sponsor-close:hover { transform: scale(1.1) rotate(90deg); }

.sponsor-msg { font-size: 13px; margin-bottom: 14px; opacity: 0.6; }

.sponsor-tabs { display: flex; gap: 0; border-radius: 10px; overflow: hidden; border: 1px solid; margin-bottom: 16px; }
.sp-tab { flex: 1; padding: 8px; border: none; background: transparent; font-size: 13px; cursor: pointer; transition: background-color 0.2s ease, color 0.2s ease; }

.sponsor-qr { padding: 10px; background: #fff; border-radius: 12px; }
.qr-image { width: 100%; max-height: 240px; object-fit: contain; display: block; }
.sponsor-thanks { margin-top: 12px; font-size: 12px; opacity: 0.4; }

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-active .sponsor-modal,
.modal-fade-leave-active .sponsor-modal { transition: transform 0.25s ease; }
.modal-fade-enter-from { opacity: 0; }
.modal-fade-enter-from .sponsor-modal { transform: scale(0.92) translateY(12px); }
.modal-fade-leave-to { opacity: 0; }
.modal-fade-leave-to .sponsor-modal { transform: scale(0.92) translateY(12px); }
</style>

<!-- 颜色 — 使用 CSS 变量，无 body.dark-theme 硬编码 -->
<style scoped>
.sponsor-btn {
  background: var(--common-color-1);
  border-color: color-mix(in srgb, var(--common-color-1) 30%, transparent);
  color: var(--common-content);
}

.sponsor-modal {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-alpha));
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-color: color-mix(in srgb, var(--common-color-1) 12%, transparent);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
}

.sponsor-header h3 { color: var(--common-text); }
.sponsor-close {
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
  color: var(--common-text);
}
.sponsor-close:hover { background: color-mix(in srgb, var(--common-color-1) 20%, transparent); }

.sponsor-msg { color: var(--common-text); }
.sponsor-tabs { border-color: color-mix(in srgb, var(--common-color-1) 15%, transparent); }
.sp-tab { color: var(--common-text); }
.sp-tab.active { background: var(--common-color-1); color: var(--common-content); }

.sponsor-thanks { color: var(--common-text); }
</style>