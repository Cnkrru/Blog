import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SocialLink, AppNotification } from '../types/index'

export const useGlobalStore = defineStore('global', () => {
  const siteTitle = ref<string>('Cnkrru\'s Blog')
  const siteDescription = ref<string>('一个技术博客，记录学习与成长')
  const siteUrl = ref<string>('https://www.moyublog.com')
  const siteKeywords = ref<string>('')
  const socialLinks = ref<SocialLink[]>([
    { name: 'GitHub', url: 'https://github.com/cnkrru', icon: 'fa-brands fa-github' },
    { name: 'Mail', url: 'mailto:admin@moyublog.com', icon: 'fa-solid fa-envelope' }
  ])
  const notifications = ref<AppNotification[]>([])

  const fullTitle = computed<string>(() => siteTitle.value)
  const siteInfo = computed<{ title: string; description: string; url: string }>(() => ({
    title: siteTitle.value,
    description: siteDescription.value,
    url: siteUrl.value
  }))

  const setSiteTitle = (title: string): void => {
    siteTitle.value = title
  }

  const setSiteDescription = (description: string): void => {
    siteDescription.value = description
  }

  const setSiteUrl = (url: string): void => {
    siteUrl.value = url
  }

  const setKeywords = (keywords: string): void => {
    siteKeywords.value = keywords
  }

  const addSocialLink = (link: SocialLink): void => {
    socialLinks.value.push(link)
  }

  const removeSocialLink = (index: number): void => {
    socialLinks.value.splice(index, 1)
  }

  const addNotification = (notification: AppNotification): void => {
    notifications.value.push(notification)
    setTimeout(() => {
      removeNotification(notification.id)
    }, notification.duration || 5000)
  }

  const removeNotification = (id: string): void => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    siteTitle,
    siteDescription,
    siteUrl,
    siteKeywords,
    socialLinks,
    notifications,
    fullTitle,
    siteInfo,
    setSiteTitle,
    setSiteDescription,
    setSiteUrl,
    setKeywords,
    addSocialLink,
    removeSocialLink,
    addNotification,
    removeNotification
  }
})
