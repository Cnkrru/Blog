<script setup>
import { ref, onMounted } from 'vue'
import SimpleMarkdownParser from './SimpleMarkdownParser.vue'

const showModal = ref(false)
const announcementContent = ref('')
const loading = ref(true)

const openAnnouncement = () => {
  showModal.value = true
}

const closeAnnouncement = () => {
  showModal.value = false
}

const loadAnnouncement = async () => {
  try {
    const mdModule = await import('../../../pages/announcement.md?raw')
    announcementContent.value = mdModule.default
  } catch (error) {
    console.error('加载公告失败:', error)
    announcementContent.value = '## 网站公告\n\n公告加载失败，请稍后再试。'
  } finally {
    loading.value = false
  }
}

// 暴露方法
defineExpose({
  openAnnouncement
})

onMounted(() => {
  loadAnnouncement()
})
</script>

<template>
  <div>
    <!-- 公告按钮 -->
    <button class="announcement-btn" @click="openAnnouncement">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
      <span>公告</span>
    </button>
    
    <!-- 公告弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click="closeAnnouncement">
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
            <p>加载公告中...</p>
          </div>
          <SimpleMarkdownParser v-else :content="announcementContent" />
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closeAnnouncement">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 公告按钮 */
.announcement-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    background-color: var(--button-bg);
    border: 2px solid var(--button-border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--button-text);
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 8px var(--shadow-color);
}

.announcement-btn svg {
    width: 18px;
    height: 18px;
    margin-right: 6px;
}

.announcement-btn:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
}

/* 弹窗样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal-content {
    background: var(--card-bg);
    border-radius: 8px;
    padding: 20px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--border-color);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
    margin: 0;
    color: var(--text-color);
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
    color: var(--text-color);
}

.modal-close:hover {
    background-color: var(--hover-bg);
}

.modal-body {
    margin-bottom: 20px;
    line-height: 1.6;
    color: var(--text-color);
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
    border-top: 1px solid var(--border-color);
}

.modal-btn {
    background: var(--button-bg);
    color: var(--button-text);
    border: 1px solid var(--button-border);
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.modal-btn:hover {
    background: var(--button-hover-bg);
}
</style>
