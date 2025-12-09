import { ref, onUnmounted, type Ref } from 'vue'
import { fabric } from 'fabric'

const CANVAS_CONFIG = {
  maxWidth: { mobile: 800, desktop: 1600 },
  hat: {
    initialTop: 40,
    cornerColor: '#04b9d9',
    cornerStrokeColor: '#fff',
    cornerStyle: 'circle' as const,
    transparentCorners: false,
    rotatingPointOffset: 30,
    cornerSize: 36,
  },
}

export function useCanvasEditor(isMobile: Ref<boolean>) {
  let canvasFabric: fabric.Canvas | null = null
  let hatInstance: fabric.Image | null = null
  let imageWidth = 0
  let imageHeight = 0

  const isCanvasReady = ref(false)

  const getMaxWidth = () => isMobile.value ? CANVAS_CONFIG.maxWidth.mobile : CANVAS_CONFIG.maxWidth.desktop

  const initCanvas = (
    canvasEl: HTMLCanvasElement,
    imgEl: HTMLImageElement,
    imgSrc: string
  ): Promise<void> => {
    return new Promise((resolve) => {
      imgEl.src = imgSrc
      imgEl.onload = () => {
        canvasEl.width = imgEl.width
        canvasEl.height = imgEl.height

        imageWidth = imgEl.width
        imageHeight = imgEl.height

        canvasEl.style.display = 'block'

        // Dispose old canvas instance to prevent memory leak
        if (canvasFabric) {
          canvasFabric.dispose()
        }

        canvasFabric = new fabric.Canvas(canvasEl)

        const maxWidth = getMaxWidth()
        let scale = 1

        if (imageWidth > maxWidth) {
          canvasFabric.setWidth(maxWidth)
          canvasFabric.setHeight((maxWidth / imageWidth) * imageHeight)
          scale = maxWidth / imageWidth
        } else {
          canvasFabric.setWidth(imageWidth)
          canvasFabric.setHeight(imageHeight)
        }

        const backgroundImage = new fabric.Image(imgEl, {
          scaleX: scale,
          scaleY: scale,
          top: 0,
          left: 0,
          selectable: false,
        })

        canvasFabric.setBackgroundImage(backgroundImage, () => {})
        isCanvasReady.value = true
        resolve()
      }
    })
  }

  const addHat = (hatImgEl: HTMLImageElement) => {
    if (!canvasFabric) return

    if (hatInstance) {
      canvasFabric.remove(hatInstance)
    }

    const maxWidth = getMaxWidth()
    let scale = imageWidth / 2 / hatImgEl.naturalWidth

    if (imageWidth > maxWidth) {
      scale = maxWidth / 2 / hatImgEl.naturalWidth
    }

    hatInstance = new fabric.Image(hatImgEl, {
      top: CANVAS_CONFIG.hat.initialTop,
      scaleX: scale,
      scaleY: scale,
      cornerColor: CANVAS_CONFIG.hat.cornerColor,
      cornerStrokeColor: CANVAS_CONFIG.hat.cornerStrokeColor,
      cornerStyle: CANVAS_CONFIG.hat.cornerStyle,
      transparentCorners: CANVAS_CONFIG.hat.transparentCorners,
      rotatingPointOffset: CANVAS_CONFIG.hat.rotatingPointOffset,
      cornerSize: CANVAS_CONFIG.hat.cornerSize,
    })

    hatInstance.setControlVisible('mt', false)
    canvasFabric.add(hatInstance)
    hatInstance.centerH()
  }

  const adjustCanvasContainer = (container: HTMLDivElement, wrapper: HTMLDivElement) => {
    if (!canvasFabric) return

    const containerWidth = container.offsetWidth
    const canvasWidth = canvasFabric.width as number
    const canvasHeight = canvasFabric.height as number

    if (canvasWidth > containerWidth) {
      const scaleFactor = containerWidth / canvasWidth
      wrapper.style.transform = `scale(${scaleFactor})`
      wrapper.style.width = '100%'
      wrapper.style.height = `${canvasHeight * scaleFactor}px`
    }
  }

  const toDataURL = (): string => {
    if (!canvasFabric) return ''
    return canvasFabric.toDataURL()
  }

  const dispose = () => {
    if (canvasFabric) {
      canvasFabric.dispose()
      canvasFabric = null
    }
    hatInstance = null
    isCanvasReady.value = false
  }

  onUnmounted(() => {
    dispose()
  })

  return {
    isCanvasReady,
    initCanvas,
    addHat,
    adjustCanvasContainer,
    toDataURL,
    dispose,
  }
}
