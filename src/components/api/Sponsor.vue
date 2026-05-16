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

const toggleModal = () => {
  showModal.value = !showModal.value
}

const closeModal = () => {
  showModal.value = false
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showModal.value) closeModal()
  })
}

onMounted(loadConfig)
</script>

<template>
  <div v-if="sponsor.enabled" class="sponsor-wrap">
    <button class="sponsor-btn" @click="toggleModal" title="赞赏">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <button class="sponsor-close" @click="closeModal">&times;</button>
            </div>
            <p class="sponsor-msg">{{ sponsor.message }}</p>

            <div class="sponsor-tabs">
              <button
                :class="['sp-tab', { active: activeTab === 'wechat' }]"
                @click="activeTab = 'wechat'"
              >微信</button>
              <button
                :class="['sp-tab', { active: activeTab === 'alipay' }]"
                @click="activeTab = 'alipay'"
              >支付宝</button>
            </div>

            <div class="sponsor-qr">
              <img
                :src="activeTab === 'wechat' ? sponsor.wechat : sponsor.alipay"
                :alt="activeTab === 'wechat' ? '微信赞赏码' : '支付宝收款码'"
                class="qr-image"
              />
            </div>

            <p class="sponsor-thanks">感谢你的支持 ✨</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.sponsor-wrap {
  display: inline-flex;
}

.sponsor-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  border: 2px solid var(--common-color-1);
  background: var(--common-color-1);
  color: var(--common-content);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.sponsor-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px var(--common-shadow);
}

.sponsor-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sponsor-modal {
  background: var(--common-bg);
  border-radius: 14px;
  padding: 28px;
  width: 340px;
  max-width: 92vw;
  border: 2px solid var(--common-color-1);
  box-shadow: 0 16px 48px var(--common-shadow);
  text-align: center;
}

.sponsor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sponsor-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--common-text);
}

.sponsor-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--common-text);
  cursor: pointer;
  line-height: 1;
}

.sponsor-msg {
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.7;
  margin-bottom: 16px;
}

.sponsor-tabs {
  display: flex;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--common-color-1);
  margin-bottom: 18px;
}

.sp-tab {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  color: var(--common-text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.sp-tab.active {
  background: var(--common-color-1);
  color: var(--common-content);
}

.sponsor-qr {
  padding: 8px;
  background: #fff;
  border-radius: 8px;
}

.qr-image {
  width: 100%;
  max-height: 260px;
  object-fit: contain;
  display: block;
}

.sponsor-thanks {
  margin-top: 14px;
  font-size: 13px;
  color: var(--common-text);
  opacity: 0.5;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .sponsor-modal,
.modal-fade-leave-active .sponsor-modal {
  transition: transform 0.25s ease;
}

.modal-fade-enter-from {
  opacity: 0;
}

.modal-fade-enter-from .sponsor-modal {
  transform: scale(0.92) translateY(12px);
}

.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-leave-to .sponsor-modal {
  transform: scale(0.92) translateY(12px);
}
</style>
