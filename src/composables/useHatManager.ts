import { ref, onMounted } from 'vue'

const HAT_CDN_BASE = 'https://tools.taurusxin.com/assets/hats'
const HAT_COUNT = 30

// 检查是否为开发环境
const isDev = import.meta.env.DEV

// 将外部 URL 转换为开发环境代理 URL
const convertToProxyUrl = (url: string): string => {
  if (!isDev) return url
  
  if (url.startsWith('https://assets.taurusxin.com')) {
    return url.replace('https://assets.taurusxin.com', '/proxy/assets')
  }
  if (url.startsWith('https://tools.taurusxin.com')) {
    return url.replace('https://tools.taurusxin.com', '/proxy/tools')
  }
  return url
}

export function useHatManager() {
  const hatList = ref<string[]>([])
  const currentHat = ref(0)
  const isLoading = ref(true)
  const loadError = ref(false)

  const loadHats = async () => {
    isLoading.value = true
    loadError.value = false

    try {
      const res = await fetch('./hats.json')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid hats.json format or empty array')
      }
      
      // 在开发环境中转换 URL 为代理 URL
      hatList.value = data.map(convertToProxyUrl)
      console.log('Successfully loaded hats from hats.json:', hatList.value.length, 'items')
    } catch (error) {
      console.warn('Failed to load hats.json, using fallback CDN:', error)
      // Fallback to CDN
      const fallbackUrls = Array.from(new Array(HAT_COUNT).keys()).map(
        i => `${HAT_CDN_BASE}/${i}.png`
      )
      hatList.value = fallbackUrls.map(convertToProxyUrl)
      loadError.value = true
    } finally {
      isLoading.value = false
    }
  }

  const selectHat = (index: number) => {
    currentHat.value = index
  }

  onMounted(() => {
    loadHats()
  })

  return {
    hatList,
    currentHat,
    isLoading,
    loadError,
    selectHat,
  }
}
