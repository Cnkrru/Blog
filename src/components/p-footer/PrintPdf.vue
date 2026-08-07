<script setup lang="ts">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
      <rect x="6" y="14" width="12" height="8" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
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