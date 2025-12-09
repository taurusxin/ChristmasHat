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

        canvasFabric = new fabric.Canvas(canvasEl, {
          // 移动端优化配置
          selection: !isMobile.value, // 移动端禁用范围选取
          allowTouchScrolling: isMobile.value, // 移动端允许触摸滚动
          stopContextMenu: true, // 禁用右键菜单
          fireRightClick: false, // 禁用右键事件
          fireMiddleClick: false, // 禁用中键事件
        })

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
      cornerSize: isMobile.value ? 44 : CANVAS_CONFIG.hat.cornerSize, // 移动端更大的控制点
      hasRotatingPoint: !isMobile.value, // 移动端禁用旋转点
    })

    hatInstance.setControlVisible('mt', false)
    
    // 移动端优化：禁用一些控制点
    if (isMobile.value) {
      hatInstance.setControlVisible('mtr', false) // 禁用旋转控制点
      hatInstance.setControlVisible('ml', false)  // 禁用左侧控制点
      hatInstance.setControlVisible('mr', false)  // 禁用右侧控制点
      hatInstance.setControlVisible('mb', false)  // 禁用底部控制点
    }
    
    canvasFabric.add(hatInstance)
    hatInstance.centerH()
    
    // 移动端触摸优化
    if (isMobile.value && canvasFabric) {
      // 禁用画布的双击缩放
      canvasFabric.off('mouse:dblclick')
      
      // 优化触摸事件
      let touchStartTime = 0
      let touchStartPos = { x: 0, y: 0 }
      
      canvasFabric.on('touch:gesture', (e) => {
        // 阻止默认的手势行为
        e.e.preventDefault()
      })
      
      canvasFabric.on('mouse:down', (e) => {
        touchStartTime = Date.now()
        if (e.pointer) {
          touchStartPos = { x: e.pointer.x, y: e.pointer.y }
        }
      })
      
      canvasFabric.on('mouse:up', (e) => {
        const touchEndTime = Date.now()
        const touchDuration = touchEndTime - touchStartTime
        
        // 如果是快速点击（小于200ms）且移动距离很小，则选中对象
        if (touchDuration < 200 && e.pointer) {
          const distance = Math.sqrt(
            Math.pow(e.pointer.x - touchStartPos.x, 2) + 
            Math.pow(e.pointer.y - touchStartPos.y, 2)
          )
          
          if (distance < 10 && canvasFabric) {
            const target = canvasFabric.findTarget(e.e as any, false)
            if (target && target !== canvasFabric.backgroundImage) {
              canvasFabric.setActiveObject(target)
              canvasFabric.renderAll()
            }
          }
        }
      })
    }
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
