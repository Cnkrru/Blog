import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const visitorCount = ref(0)
  const visitorCities = ref([])
  const currentLocation = ref(null)
  
  // 方法
  const incrementVisitorCount = () => {
    visitorCount.value++
  }
  
  const addVisitorCity = (city, lat, lon) => {
    visitorCities.value.push({
      name: city,
      value: [lon, lat]
    })
  }
  
  const setCurrentLocation = (location) => {
    currentLocation.value = location
  }
  
  const fetchUserLocation = async () => {
    // API 列表，按优先级排序
    const apis = [
      {
        name: 'ip-api.com',
        url: 'https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon',
        parser: (data) => data.status === 'success' ? { city: data.city, lat: data.lat, lon: data.lon } : null
      },
      {
        name: 'ipwho.is',
        url: 'https://ipwho.is/',
        parser: (data) => data.ip ? { city: data.city, lat: data.latitude, lon: data.longitude } : null
      }
    ]
    
    let locationData = null
    
    for (const api of apis) {
      if (locationData) break
      try {
        const response = await fetch(api.url)
        if (response.ok) {
          const data = await response.json()
          locationData = api.parser(data)
        }
      } catch (error) {
        console.warn(`[userStore] ${api.name} API 调用失败:`, error)
      }
    }
    
    // 如果获取到位置数据，更新状态
    if (locationData && locationData.city) {
      incrementVisitorCount()
      addVisitorCity(locationData.city, locationData.lat, locationData.lon)
      setCurrentLocation(locationData)
    }
    
    return locationData
  }
  
  return {
    visitorCount,
    visitorCities,
    currentLocation,
    incrementVisitorCount,
    addVisitorCity,
    setCurrentLocation,
    fetchUserLocation
  }
})