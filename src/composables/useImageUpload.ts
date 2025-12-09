import { ref } from 'vue'
import type { UploadFileInfo } from 'naive-ui'

export function useImageUpload() {
  const imageFile = ref<File | null>(null)
  const imagePath = ref('')
  const isLoading = ref(false)

  const handleUpload = (options: {
    file: UploadFileInfo
    fileList: Array<UploadFileInfo>
    event?: Event
  }): string | null => {
    const file = options.file.file
    if (!file) return null

    imageFile.value = file
    imagePath.value = file.name

    // Read file and return data URL
    return URL.createObjectURL(file)
  }

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const loadImage = async (): Promise<string | null> => {
    if (!imageFile.value) return null

    isLoading.value = true
    try {
      const dataUrl = await readFileAsDataURL(imageFile.value)
      return dataUrl
    } finally {
      isLoading.value = false
    }
  }

  const hasImage = () => imageFile.value !== null

  return {
    imageFile,
    imagePath,
    isLoading,
    handleUpload,
    loadImage,
    hasImage,
  }
}
