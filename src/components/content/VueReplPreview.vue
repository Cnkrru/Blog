<script setup>
import { ref, shallowRef, computed } from 'vue'
import VButton from '@/components/__common/VButton.vue'
import VIcon from '@/components/__common/VIcon.vue'
import { useThemeStore } from '../../stores'

const props = defineProps(['code'])

const themeStore = useThemeStore()
const show = ref(false)
const loading = ref(false)
const loadError = ref('')
const store = shallowRef(null)
const SandboxComp = shallowRef(null)

const sandboxTheme = computed(() => (themeStore.isDark ? 'dark' : 'light'))

// @vue/repl 体积较大，首次点击运行时才懒加载，不挂进首屏
async function runCode() {
  show.value = true
  loadError.value = ''
  if (store.value) return
  loading.value = true
  try {
    const repl = await import('@vue/repl')
    // useStore 的 options 期望 ref（内部用 .value 访问）。不传 files/mainFile，
    // 走官方默认 src/App.vue，再用 setFiles 注入实际代码，避免裸值导致 mainFile.value undefined 崩溃
    const s = repl.useStore({
      builtinImportMap: ref({ imports: { vue: '/vendor/vue.runtime.esm-browser.js' } }),
      resourceLinks: ref({ esModuleShims: '/vendor/es-module-shims.js' })
    })
    if (s.files['src/App.vue']) s.files['src/App.vue'].code = props.code
    else await s.setFiles({ 'App.vue': props.code }, 'App.vue')
    store.value = s
    SandboxComp.value = repl.Sandbox
  } catch (err) {
    loadError.value = (err && (err.message || String(err))) || '未知错误'
  } finally {
    loading.value = false
  }
}

function close() {
  show.value = false
}
</script>

<template>
  <VButton class="v-btn-rect v-btn-ghost run-btn" style="height:24px;min-width:24px" @click="runCode" title="运行组件"><VIcon :src="'play.svg'" :size="13" /></VButton>
  <Teleport to="body">
    <div v-if="show" class="preview-overlay" @click.self="close">
      <div class="preview-window">
        <div class="preview-header">
          <span>组件预览</span>
          <VButton class="v-btn-round v-btn-ghost preview-close" style="height:28px;min-width:28px" @click="close" aria-label="关闭"><VIcon :src="'x.svg'" :size="15" /></VButton>
        </div>
        <div class="preview-body">
          <div v-if="loading" class="loading">
            <span class="loading-spinner"></span>
            <span>正在编译组件…</span>
          </div>
          <div v-else-if="loadError" class="repl-error">
            <strong>组件引擎加载失败</strong>
            <span class="repl-error-msg">{{ loadError }}</span>
          </div>
          <component v-else-if="SandboxComp && store" :is="SandboxComp" :store="store" :theme="sandboxTheme" class="repl-sandbox" />
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

.preview-body :deep(.repl-sandbox) {
  width: 100%;
  height: 100%;
}

.loading {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  color: var(--common-text);
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--common-text);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.repl-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--common-text);
}
.repl-error .repl-error-msg {
  font-size: 12px;
  color: color-mix(in srgb, var(--common-text) 70%, transparent);
  word-break: break-all;
  max-width: 90%;
}
</style>