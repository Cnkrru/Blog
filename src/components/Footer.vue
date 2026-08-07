<script setup lang="ts">
import { useGlobalStore } from '../stores/global'
import WebsiteAge from './p-footer/WebsiteAge.vue'
import Copyright from './p-footer/CopyRight.vue'

const globalStore = useGlobalStore()
const socialLinks = globalStore.socialLinks
</script>

<template>
  <footer class="footer-flex">
    <div class="footer-S">
      <nav class="footer-container">
        <div class="footer-card">
          <!-- 社交链接 -->
          <div class="footer-social">
            <a
              v-for="link in socialLinks"
              :key="link.name"
              :href="link.url"
              :title="link.name"
              target="_blank"
              rel="noopener noreferrer"
              class="footer-social-link"
            >
              <svg v-if="link.name === 'GitHub'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <svg v-else-if="link.name === 'Mail'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span class="social-label">{{ link.name }}</span>
            </a>
            <a
              href="/rss.xml"
              title="RSS"
              target="_blank"
              class="footer-social-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              <span class="social-label">RSS</span>
            </a>
          </div>

          <!-- 站点信息 -->
          <div class="footer-info">
            <WebsiteAge />
            <Copyright />
          </div>
        </div>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0 28px;
}

.footer-S {
  width: 95%;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-container {
  width: 100%;
}

.footer-card {
  width: 100%;
  padding: 20px 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.4));
  border: 1px solid color-mix(in srgb, var(--common-color-1) 10%, transparent);
}

/* 社交链接 */
.footer-social {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-social-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  text-decoration: none;
  color: var(--common-text);
  opacity: 0.7;
  font-size: 13px;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: rgba(var(--glass-r), var(--glass-g), var(--glass-b), calc(var(--glass-alpha) * 0.3));
  border: 1px solid transparent;
}

.footer-social-link:hover {
  opacity: 1;
  color: var(--common-color-1);
  border-color: var(--common-color-1);
  transform: translateY(-1px);
}
</style>

<style scoped>
.footer-element-card {
  width: 80% !important;
  border-radius: 14px;
  padding: 8px 20px;
  border: 1px solid;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: color-mix(in srgb, var(--common-color-1) 15%, transparent);
  border-color: color-mix(in srgb, var(--common-color-1) 25%, transparent);
  color: var(--common-text);
}

.footer-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}
</style>

<style scoped>
@media (max-width: 480px) {
  .footer-S {
    height: auto;
    padding: 6px 0;
  }
  .footer-card {
    padding: 12px 10px;
    gap: 10px;
  }
  .footer-element-card {
    width: 95% !important;
    padding: 6px;
  }
  .footer-social-link {
    padding: 5px 10px;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .footer-S {
    height: auto;
    padding: 10px 0;
  }
}

@media (min-width: 1281px) {
  .footer-S {
    max-width: 1400px;
  }
}
</style>