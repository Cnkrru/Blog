<template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const hasShownWelcome = ref(false)

const visitorInfo = ref({
  ip: '',
  city: '',
  region: '',
  country: '',
  countryCode: ''
})

const cityNames = {
  'Beijing': '北京',
  'Shanghai': '上海',
  'Guangzhou': '广州',
  'Shenzhen': '深圳',
  'Hangzhou': '杭州',
  'Nanjing': 'Nanjing',
  'Wuhan': '武汉',
  'Chengdu': '成都',
  'Xian': '西安',
  'Tianjin': 'Tianjin',
  'Chongqing': '重庆',
  'Suzhou': '苏州',
  'Dalian': '大连',
  'Qingdao': '青岛',
  'Changsha': '长沙',
  'Zhengzhou': '郑州',
  'Shijiazhuang': '石家庄',
  'Jinan': '济南',
  'Kunming': '昆明',
  'Harbin': '哈尔滨',
  'Changchun': '长春',
  'Shenyang': '沈阳',
  'Fuzhou': '福州',
  'Nanchang': '南昌',
  'Hefei': '合肥',
  'Taiyuan': '太原',
  'Lanzhou': '兰州',
  'Urumqi': '乌鲁木齐',
  'Xining': '西宁',
  'Yinchuan': '银川',
  ' Hohhot': '呼和浩特',
  'Nanning': '南宁',
  'Guiyang': '贵阳',
  'Haikou': '海口',
  'Lhasa': '拉萨',
  'Hong Kong': '香港',
  'Macau': '澳门',
  'Taipei': '台北'
}

const getCityName = (city, countryCode) => {
  if (countryCode === 'TW') {
    return city
  }
  if (cityNames[city]) {
    return cityNames[city]
  }
  return city
}

const getWelcomeMessage = (city, region, country, countryCode) => {
  const cityName = getCityName(city, countryCode)

  const greetings = [
    `欢迎来自 ${cityName} 的朋友！🌟`,
    `Hello, ${cityName} 朋友！✨`,
    `${cityName} 来的访客你好！👋`,
    `有缘千里来相会，来自 ${cityName} 的朋友！💫`,
    `欢迎来到 Cnkrru 的小站，${cityName} 的朋友！🏠`
  ]

  const hour = new Date().getHours()
  let timeGreeting = ''

  if (hour >= 5 && hour < 9) {
    timeGreeting = '早上好'
  } else if (hour >= 9 && hour < 12) {
    timeGreeting = '上午好'
  } else if (hour >= 12 && hour < 14) {
    timeGreeting = '中午好'
  } else if (hour >= 14 && hour < 18) {
    timeGreeting = '下午好'
  } else if (hour >= 18 && hour < 22) {
    timeGreeting = '晚上好'
  } else {
    timeGreeting = '夜深了'
  }

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)]

  return `${timeGreeting}！${randomGreeting}`
}

const fetchVisitorInfo = async () => {
  const defaultVisitorInfo = {
    ip: '未知',
    city: '未知',
    region: '',
    country: '中国',
    countryCode: 'CN'
  }

  let visitorData = defaultVisitorInfo
  let apiSuccess = false

  const apis = [
    {
      name: 'ipinfo.io',
      url: 'https://ipinfo.io/json',
      parser: (data) => ({
        ip: data.ip || '未知',
        city: data.city || '未知',
        region: data.region || '',
        country: data.country || '中国',
        countryCode: data.country || ''
      })
    },
    {
      name: 'ipapi.co',
      url: 'https://ipapi.co/json/',
      parser: (data) => ({
        ip: data.ip || '未知',
        city: data.city || '未知',
        region: data.region || '',
        country: data.country_name || '中国',
        countryCode: data.country_code || ''
      })
    },
    {
      name: 'ipwho.is',
      url: 'https://ipwho.is/',
      parser: (data) => ({
        ip: data.ip || '未知',
        city: data.city || '未知',
        region: data.region || '',
        country: data.country || '中国',
        countryCode: data.country_code || ''
      })
    },
    {
      name: 'freeipapi.com',
      url: 'https://freeipapi.com/api/json/',
      parser: (data) => ({
        ip: data.ipAddresses?.[0] || '未知',
        city: data.cityName || '未知',
        region: data.regionName || '',
        country: data.countryName || '中国',
        countryCode: data.countryCode || ''
      })
    },
    {
      name: 'ip-api.com',
      url: 'https://ip-api.com/json/?fields=status,country,countryCode,regionName,city,query',
      parser: (data) => ({
        ip: data.query || '未知',
        city: data.city || '未知',
        region: data.regionName || '',
        country: data.country || '中国',
        countryCode: data.countryCode || ''
      })
    }
  ]

  for (const api of apis) {
    if (apiSuccess) break
    try {
      const response = await fetch(api.url)
      if (response.ok) {
        const data = await response.json()
        if (data.status !== 'fail' && data.ip) {
          visitorData = api.parser(data)
          apiSuccess = true
        }
      }
    } catch (error) {
      console.warn(`[WelcomeNotification] ${api.name} API 调用失败:`, error)
    }
  }

  visitorInfo.value = visitorData

  const welcomeMsg = getWelcomeMessage(
    visitorInfo.value.city,
    visitorInfo.value.region,
    visitorInfo.value.country,
    visitorInfo.value.countryCode
  )

  const showWelcomeMessage = (message) => {
    if (typeof window !== 'undefined' && document && document.body) {
      if (window.toast) {
        window.toast.info(message, 5000)
      } else {
        const toast = document.createElement('div')
        toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          min-width: 300px;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.3s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          color: white;
          z-index: 9999;
        `
        
        const toastContent = document.createElement('div')
        toastContent.style.display = 'flex'
        toastContent.style.alignItems = 'center'
        toastContent.style.gap = '12px'
        
        const icon = document.createElement('div')
        icon.style.width = '24px'
        icon.style.height = '24px'
        icon.style.borderRadius = '50%'
        icon.style.display = 'flex'
        icon.style.alignItems = 'center'
        icon.style.justifyContent = 'center'
        icon.style.fontWeight = 'bold'
        icon.style.fontSize = '14px'
        icon.style.background = 'rgba(255, 255, 255, 0.2)'
        icon.style.color = '#ffffff'
        icon.textContent = 'i'
        
        const messageDiv = document.createElement('div')
        messageDiv.style.flex = '1'
        messageDiv.style.fontSize = '14px'
        messageDiv.style.lineHeight = '1.4'
        messageDiv.textContent = message
        
        toastContent.appendChild(icon)
        toastContent.appendChild(messageDiv)
        toast.appendChild(toastContent)
        
        document.body.appendChild(toast)
        
        setTimeout(() => {
          toast.style.transition = 'opacity 0.3s ease'
          toast.style.opacity = '0'
          setTimeout(() => {
            if (document.body && document.body.contains(toast)) {
              document.body.removeChild(toast)
            }
          }, 300)
        }, 5000)
      }
    }
  }

  showWelcomeMessage(welcomeMsg)
}

onMounted(() => {
  fetchVisitorInfo()
})
</script>