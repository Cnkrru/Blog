<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useAnnouncementStore } from '../../stores'
import MarkdownRender from '../../components/content/MarkdownRender.vue'

const announcementStore = useAnnouncementStore()

// 从store中获取状态
const showModal = computed(() => announcementStore.showModal)
const announcementContent = computed(() => announcementStore.announcementContent)
const loading = computed(() => announcementStore.loading)

// 从store中获取方法
const openAnnouncement = () => announcementStore.openAnnouncement()
const closeAnnouncement = () => announcementStore.closeAnnouncement()
const loadAnnouncement = () => announcementStore.loadAnnouncement()

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showModal.value) {
    closeAnnouncement()
  }
}

// 暴露方法
defineExpose({
  openAnnouncement
})

onMounted(() => {
  loadAnnouncement()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <button class="announcement-btn" @click="openAnnouncement">
      <img src="../../assets/imgs/svg/announcement.svg" alt="" width="16" height="16">
      <span>公告</span>
    </button>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click="closeAnnouncement">
          <transition name="modal-content">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>网站公告</h3>
                <button class="modal-close" @click="closeAnnouncement">
                  <img src="../../assets/imgs/svg/close.svg" alt="" width="20" height="20">
                </button>
              </div>
              <div class="modal-body">
                <div v-if="loading" class="loading-message">
                  <div class="loading-spinner"></div>
                  <p>加载公告中...</p>
                </div>
                <MarkdownRender v-else :content="announcementContent" />
              </div>
              <div class="modal-footer">
                <button class="modal-btn" @click="closeAnnouncement">确定</button>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* 布局样式 */
.announcement-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 16px;
    border: 1px solid;
    border-radius: 20px;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease;
    font-size: 13px;
    font-weight: 500;
}

.announcement-btn svg {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    flex-shrink: 0;
}

.announcement-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--common-shadow);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    border-radius: 16px;
    padding: 24px;
    max-width: 500px;
    width: 90%;
    border: 1px solid;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid;
  border-top-color: inherit;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 12px;
    border-bottom: 1px solid;
}

.modal-header h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
}

.modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: rgba(0, 0, 0, 0.05);
    border: none;
    cursor: pointer;
    border-radius: 50%;
    color: var(--common-text);
    transition: background-color 0.2s ease, transform 0.2s ease;
}

body.dark-theme .modal-close {
    background: rgba(255, 255, 255, 0.1);
}

.modal-close:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: scale(1.1) rotate(90deg);
}

body.dark-theme .modal-close:hover {
    background: rgba(255, 255, 255, 0.18);
}

.modal-body {
    margin-bottom: 20px;
    line-height: 1.6;
}

.modal-body p {
    margin-bottom: 10px;
}

.modal-body p:last-child {
    margin-bottom: 0;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
    border-top: 1px solid;
}

.modal-btn {
    border: none;
    padding: 8px 24px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease;
}

.modal-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--common-shadow);
}
</style>

<style scoped>
/* 颜色样式 */
.announcement-btn {
    background: rgba(255, 192, 203, 0.2);
    border-color: rgba(255, 192, 203, 0.3);
    color: var(--common-text);
}

body.dark-theme .announcement-btn {
    background: rgba(58, 170, 231, 0.15);
    border-color: rgba(58, 170, 231, 0.25);
}

.announcement-btn:hover {
    background: rgba(255, 192, 203, 0.35);
}

body.dark-theme .announcement-btn:hover {
    background: rgba(58, 170, 231, 0.28);
}

.modal-overlay {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.modal-content {
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-color: rgba(0, 0, 0, 0.06);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
}

body.dark-theme .modal-content {
    background: rgba(30, 15, 60, 0.94);
    border-color: rgba(255, 255, 255, 0.06);
}

.modal-header {
    border-bottom-color: rgba(0, 0, 0, 0.06);
}

body.dark-theme .modal-header {
    border-bottom-color: rgba(255, 255, 255, 0.08);
}

.modal-header h3 {
    color: var(--common-text);
}

.modal-body {
    color: var(--common-text);
}

.modal-footer {
    border-top-color: rgba(0, 0, 0, 0.06);
}

body.dark-theme .modal-footer {
    border-top-color: rgba(255, 255, 255, 0.08);
}

.modal-btn {
    background: var(--common-color-1);
    color: #fff;
}

.modal-btn:hover {
    filter: brightness(1.1);
}
</style>

<style scoped>
/* 响应式设计媒体查询 */
</style>
