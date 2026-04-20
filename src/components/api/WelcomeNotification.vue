<template>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
  // 备用的访客信息（当 API 调用失败时使用）
  const defaultVisitorInfo = {
    ip: '未知',
    city: '未知',
    region: '',
    country: '中国',
    countryCode: 'CN'
  }

  let visitorData = defaultVisitorInfo
  let apiSuccess = false

  try {
    // 尝试使用 ipinfo.io
    const response = await fetch('https://ipinfo.io/json')
    if (response.ok) {
      const data = await response.json()
      visitorData = {
        ip: data.ip || '未知',
        city: data.city || '未知',
        region: data.region || '',
        country: data.country || '中国',
        countryCode: data.country || ''
      }
      apiSuccess = true
    }
  } catch (error) {
    console.warn('ipinfo.io API 调用失败:', error)
  }

  // 如果第一个 API 失败，尝试使用 ipapi.co
  if (!apiSuccess) {
    try {
      const response = await fetch('https://ipapi.co/json/')
      if (response.ok) {
        const data = await response.json()
        visitorData = {
          ip: data.ip || '未知',
          city: data.city || '未知',
          region: data.region || '',
          country: data.country_name || '中国',
          countryCode: data.country_code || ''
        }
        apiSuccess = true
      }
    } catch (error) {
      console.warn('ipapi.co API 调用失败:', error)
    }
  }

  // 如果所有 API 都失败，使用默认信息
  visitorInfo.value = visitorData

  const welcomeMsg = getWelcomeMessage(
    visitorInfo.value.city,
    visitorInfo.value.region,
    visitorInfo.value.country,
    visitorInfo.value.countryCode
  )

  // 显示欢迎消息
  const showWelcomeMessage = (message) => {
    if (typeof window !== 'undefined' && document && document.body) {
      if (window.toast) {
        window.toast.info(message, 5000)
      } else {
        // 备用的 toast 实现
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

const getGreetingTime = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 9) {
    return '早上好'
  } else if (hour >= 9 && hour < 12) {
    return '上午好'
  } else if (hour >= 12 && hour < 14) {
    return '中午好'
  } else if (hour >= 14 && hour < 18) {
    return '下午好'
  } else if (hour >= 18 && hour < 22) {
    return '晚上好'
  } else {
    return '夜深了'
  }
}

onMounted(() => {
  fetchVisitorInfo()
})
</script>