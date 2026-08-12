<script setup lang="ts">
import IndexLogo from '../components/page-index/IndexLogo.vue'
import IndexNavbar from '../components/page-index/IndexNavbar.vue'
import HeroContent from '../components/page-index/HeroContent.vue'
import NetworkParticles from '../components/page-index/NetworkParticles.vue'
import { useHeadRaw } from '@vueuse/head'

useHeadRaw({
  title: 'Cnkrru\'s Blog',
  meta: [
    { name: 'description', content: '一个技术博客，记录学习与成长' },
    { name: 'keywords', content: '技术博客,编程,前端,后端,C++,Vue' },
    { name: 'author', content: 'Cnkrru' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://cnkrru.top' },
    { property: 'og:title', content: 'Cnkrru\'s Blog' },
    { property: 'og:description', content: '一个技术博客，记录学习与成长' },
    { property: 'og:locale', content: 'zh_CN' },
    { property: 'og:site_name', content: "Cnkrru's Blog" },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:url', content: 'https://cnkrru.top' },
    { name: 'twitter:title', content: 'Cnkrru\'s Blog' },
    { name: 'twitter:description', content: '一个技术博客，记录学习与成长' }
  ],
  link: [
    { rel: 'canonical', href: 'https://cnkrru.top' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            'name': "Cnkrru's Blog",
            'url': 'https://cnkrru.top',
            'description': '个人技术博客 — 记录 C++ 学习、前端开发与工程实践',
            'inLanguage': 'zh-CN'
          },
          {
            '@type': 'Person',
            'name': 'Cnkrru',
            'url': 'https://cnkrru.top',
            'sameAs': [
              'https://github.com/Cnkrru'
            ]
          }
        ]
      })
    }
  ]
})
</script>

<template>
  <div class="index-page">
    <div class="hero-container">
      <NetworkParticles />

      <header class="index-header">
        <IndexLogo />
        <IndexNavbar />
      </header>

      <HeroContent />
    </div>
  </div>
</template>

<style scoped>
.index-page {
  width: 100%;
}

.hero-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.index-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .index-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
}
</style>