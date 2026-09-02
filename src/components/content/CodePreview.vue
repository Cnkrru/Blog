<script setup>
import { ref, nextTick } from 'vue'
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'

const props = defineProps(['code'])

const show = ref(false)
const iframeKey = ref(0)
const iframeRef = ref(null)

function runCode() {
  show.value = true
  iframeKey.value++
  nextTick(() => {
    const iframe = iframeRef.value
    if (!iframe) return
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return
    doc.open()
    doc.write(props.code)
    doc.close()
  })
}

function close() {
  show.value = false
}
</script>

<template>
  <VButton class="v-btn-rect v-btn-ghost run-btn" style="height:24px;min-width:24px" @click="runCode" title="运行代码"><VIcon :src="'play.svg'" :size="13" /></VButton>
  <Teleport to="body">
    <div v-if="show" class="preview-overlay" @click.self="close">
      <div class="preview-window">
        <div class="preview-header">
          <span>预览</span>
          <VButton class="v-btn-round v-btn-ghost preview-close" style="height:28px;min-width:28px" @click="close" aria-label="关闭"><VIcon :src="'x.svg'" :size="15" /></VButton>
        </div>
        <div class="preview-body">
          <iframe :key="iframeKey" ref="iframeRef" class="preview-iframe" sandbox="allow-scripts allow-same-origin" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.run-btn {
  font-weight: 700;
}

.preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.preview-window {
  width: 90vw;
  max-width: 900px;
  height: 80vh;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  animation: zoomIn 0.25s ease;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 600;
}

.preview-close {
  --v-btn-bg: rgba(255, 255, 255, 0.2);
  --v-btn-hover-bg: rgba(255, 255, 255, 0.35);
  color: var(--common-content);
}

.preview-close:hover {
  transform: scale(1.1) rotate(90deg);
}

.preview-body {
  flex: 1;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #fff;
}

.run-btn {
  --v-btn-bg: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  --v-btn-hover-bg: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  --v-btn-border: color-mix(in srgb, var(--common-text) 8%, transparent);
}
.run-btn:hover {
  --v-btn-border: var(--common-color-1);
}

.preview-window {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), var(--glass-alpha));
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid color-mix(in srgb, var(--common-text) 8%, transparent);
}

.preview-header {
  background: var(--common-color-1);
  color: var(--common-content);
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
</style>
