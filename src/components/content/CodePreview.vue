<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = defineProps<{ code: string }>()

const show = ref(false)
const iframeKey = ref(0)

function runCode() {
  show.value = true
  iframeKey.value++
  nextTick(() => {
    const iframe = document.getElementById('code-preview-frame') as HTMLIFrameElement | null
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
          <iframe :key="iframeKey" id="code-preview-frame" class="preview-iframe" sandbox="allow-scripts allow-same-origin" />
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
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(0, 0, 0, 0.08);
  color: var(--common-text);
}
body.dark-theme .run-btn {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}
.run-btn:hover {
  background: rgba(255, 192, 203, 0.2);
  border-color: var(--common-color-1);
}
body.dark-theme .run-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.preview-window {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
body.dark-theme .preview-window {
  background: rgba(21, 7, 60, 0.92);
  border-color: rgba(255, 255, 255, 0.08);
}

.preview-header {
  background: var(--common-color-1);
  color: #fff;
}

.preview-close {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.preview-close:hover { background: rgba(255, 255, 255, 0.35); }
</style>
