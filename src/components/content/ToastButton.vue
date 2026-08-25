<template>
  <button class="toast-btn" :class="`toast-btn-${type}`" @click="triggerToast">
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps(['type', 'text'])

const typeMap = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
}

function triggerToast() {
  if (typeof window === 'undefined' || !window.toast) return
  const fn = window.toast[typeMap[props.type] || 'info']
  if (typeof fn === 'function') {
    fn(props.text)
  } else {
    window.toast.add(props.text, { type: props.type || 'info' })
  }
}
</script>

<style scoped>
.toast-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 18px;
  margin: 4px 6px 4px 0;
  border-radius: 8px;
  border: 1px solid;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s ease;
}

.toast-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toast-btn:active {
  transform: translateY(0);
}

/* ── info ── */
.toast-btn-info {
  color: var(--common-color-1);
  border-color: color-mix(in srgb, var(--common-color-1) 40%, transparent);
}
.toast-btn-info:hover {
  background: color-mix(in srgb, var(--common-color-1) 12%, transparent);
  border-color: var(--common-color-1);
}

/* ── success ── */
.toast-btn-success {
  color: var(--color-success);
  border-color: color-mix(in srgb, var(--color-success) 40%, transparent);
}
.toast-btn-success:hover {
  background: color-mix(in srgb, var(--color-success) 12%, transparent);
  border-color: var(--color-success);
}

/* ── warning ── */
.toast-btn-warning {
  color: var(--color-warning);
  border-color: color-mix(in srgb, var(--color-warning) 40%, transparent);
}
.toast-btn-warning:hover {
  background: color-mix(in srgb, var(--color-warning) 12%, transparent);
  border-color: var(--color-warning);
}

/* ── error ── */
.toast-btn-error {
  color: var(--color-error);
  border-color: color-mix(in srgb, var(--color-error) 40%, transparent);
}
.toast-btn-error:hover {
  background: color-mix(in srgb, var(--color-error) 12%, transparent);
  border-color: var(--color-error);
}
</style>