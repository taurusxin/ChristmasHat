import { ref, onMounted } from 'vue'

const HAT_CDN_BASE = 'https://tools.taurusxin.com/assets/hats'
const HAT_COUNT = 30

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
      const data = await res.json()
      hatList.value = Array.isArray(data) ? data : []
    } catch (_) {
      // Fallback to CDN
      hatList.value = Array.from(new Array(HAT_COUNT).keys()).map(
        i => `${HAT_CDN_BASE}/${i}.png`
      )
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
