<script setup lang="ts">
import { onMounted, watch, ref, nextTick } from 'vue'

const props = defineProps<{ title: string; url: string; description?: string }>()

const scriptLoaded = ref(false)

const loadShareScript = () => {
  if (document.getElementById('addtoany-script')) { initButtons(); return }
  const script = document.createElement('script')
  script.id = 'addtoany-script'
  script.src = 'https://static.addtoany.com/menu/page.js'
  script.async = true
  script.onload = () => { scriptLoaded.value = true; initButtons() }
  document.body.appendChild(script)
}

const initButtons = () => {
  nextTick(() => {
    if ((window as any).a2a?.init_all) (window as any).a2a.init_all()
  })
}

onMounted(() => loadShareScript())
watch(() => props.url, () => { if (scriptLoaded.value) initButtons() })
</script>

<template>
  <div class="share-container">
    <div class="share-header">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024" fill="currentColor" class="share-icon"><path d="M832 128h-192v64h146.752l-265.376 265.376 45.248 45.248L832 237.248V384h64V128z"/><path d="M768 832H192V256h352V192H160a32 32 0 0 0-32 32v640a32 32 0 0 0 32 32h640a32 32 0 0 0 32-32V480h-64v352z"/></svg>
      <span class="share-title">分享这篇文章</span>
    </div>
    <div class="a2a_kit a2a_kit_size_32 a2a_default_style" :data-a2a-url="url" :data-a2a-title="title">
      <a class="a2a_button_wechat"></a>
      <a class="a2a_button_qzone"></a>
      <a class="a2a_button_copy_link"></a>
      <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    </div>
  </div>
</template>

<style scoped>
.share-container {
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.share-header {
  display: flex;
  align-items: center;
  gap: 6px;
}
.share-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}
.share-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--common-text);
  opacity: 0.6;
}
:deep(.a2a_kit a) {
  border-radius: 8px !important;
  transition: transform 0.15s ease, opacity 0.15s ease !important;
}
:deep(.a2a_kit a:hover) {
  transform: translateY(-2px) !important;
  opacity: 0.8 !important;
}
</style>
