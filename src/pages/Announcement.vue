<script setup>
import VIcon from '@/components/__common/VIcon.vue'
import VButton from '@/components/__common/VButton.vue'
import { ref, onMounted, onUnmounted, onServerPrefetch } from 'vue'
import MarkdownRender from '../components/content/MarkdownRender.vue'
import { readPublicText } from '../stores'

// ---- 原 announcement store 逻辑内联（仅本组件消费）----
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
    // 加载构建期预渲染的静态 HTML（content/announcement/index.md → public/html/announcement.html）
    announcementContent.value = await readPublicText('html/announcement.html')
  } catch (error) {
    console.error('[announcement] 加载公告失败:', error)
    announcementContent.value = '<h2>网站公告</h2><p>公告加载失败，请稍后再试。</p>'
  } finally {
    loading.value = false
  }
}

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

onServerPrefetch(() => loadAnnouncement())

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
    <button class="announcement-btn" @click="openAnnouncement" aria-label="查看公告">
      <VIcon :src="'info.svg'" :size="16" />
      <span>公告</span>
    </button>

    <Teleport to="body">
      <transition name="modal">
        <div v-if="showModal" class="modal-overlay" @click="closeAnnouncement">
          <transition name="modal-content">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>网站公告</h3>
                <VButton class="v-btn-round v-btn-ghost modal-close" style="height:30px;min-width:30px" @click="closeAnnouncement" aria-label="关闭公告"><VIcon :src="'x.svg'" :size="16" /></VButton>
              </div>
              <div class="modal-body">
                <div v-if="loading" class="loading-message">
                  <div class="loading-spinner"></div>
                  <p>加载公告中...</p>
                </div>
                <MarkdownRender v-else :html="announcementContent" />
              </div>
              <div class="modal-footer">
                <button class="modal-btn" @click="closeAnnouncement" aria-label="关闭公告">确定</button>
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
  margin-bottom: 10px;
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
    --v-btn-bg: var(--common-shadow);
    --v-btn-hover-bg: var(--common-shadow);
}

.modal-close:hover {
    transform: scale(1.1) rotate(90deg);
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

/* 颜色样式 */
.announcement-btn {
    background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
    border-color: color-mix(in srgb, var(--common-color-1) 30%, transparent);
    color: var(--common-text);
}

.announcement-btn:hover {
    background: color-mix(in srgb, var(--common-color-1) 35%, transparent);
}

.modal-overlay {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.modal-content {
    background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-alpha));
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-color: var(--common-shadow);
    box-shadow: 0 16px 48px var(--common-shadow);
}

.modal-header {
    border-bottom-color: var(--common-shadow);
}

.modal-header h3 {
    color: var(--common-text);
}

.modal-body {
    color: var(--common-text);
}

.modal-footer {
    border-top-color: var(--common-shadow);
}

.modal-btn {
    background: var(--common-color-1);
    color: var(--common-content);
}

.modal-btn:hover {
    filter: brightness(1.1);
}
</style>
