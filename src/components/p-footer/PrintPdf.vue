<script setup>
import VIcon from '@/components/common/VIcon.vue'

function printPdf() {
  window.print()
}
</script>

<template>
  <button
    class="print-pdf-btn"
    title="打印 / 保存为 PDF"
    @click="printPdf"
  >
    <VIcon :src="'printer.svg'" :size="18" />
    <span class="print-label">PDF</span>
  </button>
</template>

<style scoped>
.print-pdf-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: var(--common-text);
  opacity: 0.7;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.3));
}

.print-pdf-btn:hover {
  opacity: 1;
  color: var(--common-color-1);
  border-color: var(--common-color-1);
  transform: translateY(-1px);
}

@media print {
  .print-pdf-btn {
    display: none;
  }
}
</style>