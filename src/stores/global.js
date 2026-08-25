import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const siteTitle = ref('Cnkrru\'s Blog')
  const siteDescription = ref('一个技术博客，记录学习与成长')
  const siteUrl = ref('https://cnkrru.top')
  const siteKeywords = ref('')
  const socialLinks = ref([
    { name: 'GitHub', url: 'https://github.com/cnkrru', icon: 'fa-brands fa-github' },
    { name: 'Mail', url: 'mailto:admin@cnkrru.top', icon: 'fa-solid fa-envelope' }
  ])
  const notifications = ref([])

  const fullTitle = computed(() => siteTitle.value)
  const siteInfo = computed(() => ({
    title: siteTitle.value,
    description: siteDescription.value,
    url: siteUrl.value
  }))

  const setSiteTitle = (title) => {
    siteTitle.value = title
  }

  const setSiteDescription = (description) => {
    siteDescription.value = description
  }

  const setSiteUrl = (url) => {
    siteUrl.value = url
  }

  const setKeywords = (keywords) => {
    siteKeywords.value = keywords
  }

  const addSocialLink = (link) => {
    socialLinks.value.push(link)
  }

  const removeSocialLink = (index) => {
    socialLinks.value.splice(index, 1)
  }

  const addNotification = (notification) => {
    notifications.value.push(notification)
    setTimeout(() => {
      removeNotification(notification.id)
    }, notification.duration || 5000)
  }

  const removeNotification = (id) => {
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