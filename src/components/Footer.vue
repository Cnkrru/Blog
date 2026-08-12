<script setup lang="ts">
import { useGlobalStore } from '../stores/global'
import WebsiteAge from './p-footer/WebsiteAge.vue'
import Copyright from './p-footer/CopyRight.vue'
import PrintPdf from './p-footer/PrintPdf.vue'
import githubSvg from '@/assets/svg/github.svg?raw'
import mailSvg from '@/assets/svg/mail.svg?raw'
import rssSvg from '@/assets/svg/rss.svg?raw'

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
              <span v-if="link.name === 'GitHub'" class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="githubSvg"></span>
              <span v-else-if="link.name === 'Mail'" class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="mailSvg"></span>
              <span class="social-label">{{ link.name }}</span>
            </a>
            <a
              href="/rss.xml"
              title="RSS"
              target="_blank"
              class="footer-social-link"
            >
              <span class="svg-icon" :style="{ width: '18px', height: '18px' }" v-html="rssSvg"></span>
              <span class="social-label">RSS</span>
            </a>
            <PrintPdf />
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