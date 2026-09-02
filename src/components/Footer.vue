<script setup>
import WebsiteAge from './p-footer/WebsiteAge.vue'
import Copyright from './p-footer/CopyRight.vue'
import SocialLink from './p-footer/SocialLink.vue'
import RssLink from './p-footer/RssLink.vue'
import PrintPdf from './p-footer/PrintPdf.vue'

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/cnkrru', icon: 'github.svg' },
  { name: 'Mail', url: 'mailto:admin@cnkrru.top', icon: 'mail.svg' }
]
</script>

<template>
  <footer class="footer-flex">
    <div class="footer-s">
      <nav class="footer-container">
        <div class="footer-card">
          <!-- 社交链接 -->
          <div class="footer-social">
            <SocialLink v-for="link in socialLinks" :key="link.name" :link="link" />
            <RssLink />
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

.footer-s {
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

.footer-social {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 社交链接胶囊（SocialLink/RssLink 根类，scoped 命中子组件根节点） */
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

/* 站点信息卡片（CopyRight/WebsiteAge 根类，scoped 命中子组件根节点） */
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

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .footer-s {
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
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .footer-s {
    height: auto;
    padding: 10px 0;
  }
}

@media (min-width: 1280px) {
  .footer-s {
    max-width: 1400px;
  }
}
</style>