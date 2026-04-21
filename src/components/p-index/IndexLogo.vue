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
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  animation: gradient-shift 3s ease infinite, pulse 2s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
}

.logo-dot {
  font-size: 2rem;
  font-weight: 800;
  background: var(--logo-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite, dot-pulse 1.5s ease-in-out infinite;
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
    text-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
  }
  50% {
    opacity: 0.9;
    text-shadow: 0 0 30px rgba(78, 205, 196, 0.5);
  }
}

@keyframes dot-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.25rem;
  }
}
</style>