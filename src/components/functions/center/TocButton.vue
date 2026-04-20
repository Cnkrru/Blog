<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show'])

const toggleToc = () => {
  emit('update:show', !props.show)
}
</script>

<template>
  <div class="toc-btn-container">
    <button class="toc-btn" @click="toggleToc">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
      </svg>
      目录
    </button>
  </div>
</template>

<style scoped>

/* 目录按钮容器 */
.toc-btn-container {
    display: flex;
    align-items: center;
}

/* 目录按钮 */
.toc-btn {
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

.toc-btn:hover {
    background-color: var(--button-hover-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
}

.toc-btn svg {
    width: 18px;
    height: 18px;
    margin-right: 6px;
}
</style>