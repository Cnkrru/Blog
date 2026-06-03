<template>
  <div class="nav-logo index-log">
    <span class="logo-text">Cnkrru</span>
    <span class="logo-dot">.</span>
  </div>
</template>

<style scoped>
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.logo-dot {
  font-size: 2rem;
  font-weight: 800;
}
</style>

<style scoped>
.logo-text {
  color: var(--common-color-1);
}

.logo-dot {
  color: var(--common-color-1);
  opacity: 0.5;
}
</style>

<style scoped>
@media (max-width: 640px) {
  .logo-text {
    font-size: 1.25rem;
  }
}
</style>
