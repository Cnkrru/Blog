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
  background: var(--common-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite, pulse 2s ease-in-out infinite;
  text-shadow: 0 0 20px var(--common-color-1);
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    text-shadow: 0 0 20px var(--common-color-1);
  }
  50% {
    opacity: 0.9;
    text-shadow: 0 0 30px var(--common-color-1);
  }
}

.logo-dot {
  background: var(--common-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}
</style>

<style scoped>
@media (max-width: 640px) {
  .logo-text {
    font-size: 1.25rem;
  }
}
</style>
