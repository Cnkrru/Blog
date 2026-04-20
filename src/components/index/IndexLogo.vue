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
  background: var(--logo-gradient);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  animation: gradient-shift 3s ease infinite;
}

.logo-dot {
  font-size: 2rem;
  font-weight: 800;
  background: var(--logo-gradient);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.25rem;
  }
}
</style>