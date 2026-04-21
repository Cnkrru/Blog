<template>
  <div class="nav-menu-container">
    <ul class="nav-menu">
      <li v-for="(section, index) in sections" :key="section.id" class="nav-item">
        <a 
          href="#" 
          @click.prevent="navigateTo(section.path)"
          class="nav-link"
        >
          <span class="nav-link-text">{{ section.name }}</span>
          <span class="nav-link-underline"></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const sections = [
  { id: 0, name: '首页', path: '/home' },
  { id: 1, name: '关于', path: '/about' },
  { id: 2, name: '归档', path: '/archives' },
  { id: 3, name: '友链', path: '/links' },
  { id: 4, name: '项目', path: '/projects' }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.nav-menu-container {
  display: flex;
  align-items: center;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  position: relative;
  display: inline-block;
  text-decoration: none;
  background: var(--logo-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.25rem;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
  animation: gradient-shift 3s ease infinite, nav-glow 2s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(78, 205, 196, 0.2);
}

.nav-link:hover {
  background: var(--logo-gradient);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 2s ease infinite, nav-glow-hover 1s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(78, 205, 196, 0.4);
  transform: translateY(-2px);
}

.nav-link-text {
  position: relative;
  z-index: 2;
}

.nav-link-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--navbar-gradient-primary);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-link:hover .nav-link-underline {
  width: 100%;
}

@media (max-width: 768px) {
  .nav-menu {
    gap: 1.5rem;
  }
  
  .nav-link {
    font-size: 0.875rem;
    padding: 0.4rem 0;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    font-size: 0.75rem;
    padding: 0.3rem 0;
  }
  
  .nav-item {
    margin-bottom: 0.25rem;
  }
}

@keyframes nav-glow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(78, 205, 196, 0.2);
  }
  50% {
    text-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
  }
}

@keyframes nav-glow-hover {
  0%, 100% {
    text-shadow: 0 0 20px rgba(78, 205, 196, 0.4);
  }
  50% {
    text-shadow: 0 0 30px rgba(78, 205, 196, 0.6);
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .nav-link {
    padding: 0.5rem 0.75rem;
  }
  
  .nav-link:hover .nav-link-underline {
    width: 0;
  }
  
  .nav-link:active .nav-link-underline {
    width: 100%;
  }
}


</style>