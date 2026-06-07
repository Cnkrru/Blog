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
      <img src="../../assets/imgs/svg/heart.svg" alt="" width="16" height="16" class="sp-btn-icon">
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
.sp-btn-icon { filter: brightness(0) invert(1); }

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

<!-- 颜色 -->
<style scoped>
.sponsor-btn {
  background: rgba(255, 192, 203, 0.85);
  border-color: rgba(255, 255, 255, 0.3);
  color: #333;
}
body.dark-theme .sponsor-btn {
  background: rgba(58, 170, 231, 0.85);
  border-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sponsor-modal {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
}
body.dark-theme .sponsor-modal {
  background: rgba(21, 7, 60, 0.92);
  border-color: rgba(255, 255, 255, 0.06);
}

.sponsor-header h3 { color: var(--common-text); }
.sponsor-close { background: rgba(0, 0, 0, 0.05); color: var(--common-text); }
body.dark-theme .sponsor-close { background: rgba(255, 255, 255, 0.08); }
.sponsor-close:hover { background: rgba(0, 0, 0, 0.1); }
body.dark-theme .sponsor-close:hover { background: rgba(255, 255, 255, 0.15); }

.sponsor-msg { color: var(--common-text); }
.sponsor-tabs { border-color: rgba(0, 0, 0, 0.08); }
body.dark-theme .sponsor-tabs { border-color: rgba(255, 255, 255, 0.1); }
.sp-tab { color: var(--common-text); }
.sp-tab.active { background: var(--common-color-1); color: #fff; }

.sponsor-thanks { color: var(--common-text); }
</style>
