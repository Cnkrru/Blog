<script setup>
import { ref, nextTick } from 'vue'

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
  <button class="run-btn" @click="runCode" title="运行代码">&#9654;</button>
  <Teleport to="body">
    <div v-if="show" class="preview-overlay" @click.self="close">
      <div class="preview-window">
        <div class="preview-header">
          <span>预览</span>
          <button class="preview-close" @click="close">&times;</button>
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
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease;
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

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
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
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.preview-close:hover { transform: scale(1.1) rotate(90deg); }

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
</style>

<style scoped>
.run-btn {
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), 0.4);
  border-color: color-mix(in srgb, var(--common-text) 8%, transparent);
  color: var(--common-text);
}
.run-btn:hover {
  background: color-mix(in srgb, var(--common-color-1) 20%, transparent);
  border-color: var(--common-color-1);
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

.preview-close {
  background: rgba(255, 255, 255, 0.2);
  color: var(--common-content);
}
.preview-close:hover { background: rgba(255, 255, 255, 0.35); }
</style>
