import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const visitorCount = ref<number>(0)
  const visitorCities = ref<Array<{ name: string; value: [number, number] }>>([])
  const currentLocation = ref<any>(null)
  const isLoadingLocation = ref<boolean>(false)

  const incrementVisitorCount = (): void => {
    visitorCount.value++
  }

  const addVisitorCity = (city: string, lat: number, lon: number): void => {
    visitorCities.value.push({
      name: city,
      value: [lon, lat]
    })
  }

  const setCurrentLocation = (location: any): void => {
    currentLocation.value = location
  }

  const fetchUserLocation = async (): Promise<any> => {
    if (isLoadingLocation.value) return null
    isLoadingLocation.value = true

    const apis = [
      {
        name: 'ip-api.com',
        url: 'https://ip-api.com/json/?fields=status,country,countryCode,city,lat,lon',
        parser: (data: any) => data.status === 'success' ? { city: data.city, lat: data.lat, lon: data.lon } : null
      },
      {
        name: 'ipwho.is',
        url: 'https://ipwho.is/',
        parser: (data: any) => data.ip ? { city: data.city, lat: data.latitude, lon: data.longitude } : null
      }
    ]

    let locationData: any = null

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

    if (locationData?.city) {
      incrementVisitorCount()
      addVisitorCity(locationData.city, locationData.lat, locationData.lon)
      setCurrentLocation(locationData)
    }

    isLoadingLocation.value = false
    return locationData
  }

  return {
    visitorCount,
    visitorCities,
    currentLocation,
    isLoadingLocation,
    incrementVisitorCount,
    addVisitorCity,
    setCurrentLocation,
    fetchUserLocation
  }
})
