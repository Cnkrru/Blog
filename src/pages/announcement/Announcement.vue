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
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
      <span>公告</span>
    </button>
    
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeAnnouncement">
        <transition name="modal-content">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>网站公告</h3>
              <button class="modal-close" @click="closeAnnouncement">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
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
  </div>
</template>

<style scoped>
/* 布局样式 */
.announcement-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border: 2px solid;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
    font-weight: bold;
}

.announcement-btn svg {
    width: 18px;
    height: 18px;
    margin-right: 6px;
}

.announcement-btn:hover {
    transform: translateY(-2px);
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
    border-radius: 8px;
    padding: 20px;
    max-width: 500px;
    width: 90%;
    border: 1px solid;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
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
    padding-bottom: 10px;
    border-bottom: 1px solid;
}

.modal-header h3 {
    margin: 0;
}

.modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
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
    border: 1px solid;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.modal-btn:hover {
}
</style>

<style scoped>
/* 颜色样式 */
.announcement-btn {
    background-color: var(--common-color-1);
    border-color: var(--common-color-1);
    color: var(--common-content);
    box-shadow: 0 2px 8px var(--common-shadow);
}

.announcement-btn:hover {
    background-color: var(--common-hover);
    box-shadow: 0 4px 12px var(--common-shadow);
}

.modal-overlay {
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background: var(--common-bg);
    border-color: var(--common-color-1);
    box-shadow: 0 4px 12px var(--common-shadow);
}

.loading-spinner {
    border-color: var(--common-color-1);
    border-top-color: var(--common-hover);
}

.modal-header {
    border-bottom-color: var(--common-color-1);
}

.modal-header h3 {
    color: var(--common-text);
}

.modal-close {
    color: var(--common-text);
}

.modal-close:hover {
    background-color: var(--common-hover);
}

.modal-body {
    color: var(--common-text);
}

.modal-footer {
    border-top-color: var(--common-color-1);
}

.modal-btn {
    background: var(--common-hover);
    color: var(--common-text);
    border-color: var(--common-color-1);
}

.modal-btn:hover {
    background: var(--common-hover);
}
</style>

<style scoped>
/* 响应式设计媒体查询 */
</style>
