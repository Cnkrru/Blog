<template>
  <button class="v-btn" v-bind="$attrs">
    <slot />
  </button>
</template>

<style scoped>
.v-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: var(--v-btn-pad, 0);
  box-sizing: border-box;
  border: 1px solid var(--v-btn-border, transparent);
  background: transparent;
  color: var(--common-text);
  font: inherit;
  cursor: pointer;
  vertical-align: middle;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    filter 0.2s ease,
    transform 0.12s ease;
}

.v-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.v-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* —— 外形 —— */
.v-btn-round {
  border-radius: 50%;
}

.v-btn-pill {
  border-radius: 999px;
}

.v-btn-rect {
  border-radius: 8px;
}

/* —— 配色骨架 —— */
.v-btn-primary {
  background: var(--v-btn-bg, var(--common-color-1));
  border-color: var(--v-btn-border, var(--common-color-1));
  color: #fff;
}

.v-btn-primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.v-btn-secondary {
  border-color: color-mix(in srgb, var(--common-text) 28%, transparent);
  color: var(--common-text);
}

.v-btn-secondary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--common-text) 9%, transparent);
}

.v-btn-ghost {
  color: var(--v-btn-color, var(--common-text));
  background: var(--v-btn-bg, transparent);
}

.v-btn-ghost:hover:not(:disabled) {
  background: var(--v-btn-hover-bg, color-mix(in srgb, var(--common-text) 9%, transparent));
}

.v-btn-text {
  color: var(--common-color-1);
}

.v-btn-text:hover:not(:disabled) {
  background: color-mix(in srgb, var(--common-color-1) 10%, transparent);
}

.v-btn-danger {
  background: var(--color-error);
  border-color: var(--color-error);
  color: #fff;
}

.v-btn-danger:hover:not(:disabled) {
  filter: brightness(1.08);
}
</style>