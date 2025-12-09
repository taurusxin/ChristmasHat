<script setup lang="ts">
import { ImageOutline, DownloadOutline } from '@vicons/ionicons5'
import type { UploadFileInfo } from 'naive-ui'
import { fabric } from 'fabric'
import { saveAs } from 'file-saver'

const imageFile = ref()
const imagePath = ref('')
const hatList = ref<string[]>([])
const currentHat = ref(0)
const uploadImageRef = ref()

let canvasFabric: fabric.Canvas
let hatInstance: fabric.Image
let imageWidth: number
let imageHeight: number
let isMobile = window.innerWidth <= 768

onMounted(async () => {
  try {
    const res = await fetch('./hats.json')
    const data = await res.json()
    hatList.value = Array.isArray(data) ? data : []
  } catch (_) {
    hatList.value = Array.from(new Array(30).keys()).map(
      i => `https://tools.taurusxin.com/assets/hats/${i}.png`
    )
  }
})

onUnmounted(() => {
  // Clean up canvas instance when component unmounts
  if (canvasFabric) {
    canvasFabric.dispose()
  }
})

const switchHat = (currentIndex: number, lastIndex: number) => {
  currentHat.value = currentIndex
  switchHatInCanvas()
}

const clickHat = (imageIndex: number) => {
  currentHat.value = imageIndex
}

const chooseImage = () => {
  uploadImageRef.value.openOpenFileDialog()
}

const handleUploadImage = (options: {
  file: UploadFileInfo
  fileList: Array<UploadFileInfo>
  event?: Event
}) => {
  imageFile.value = options.file.file
  imagePath.value = imageFile.value.name
  loadImage()
}

const loadImage = () => {
  if (imageFile.value != null) {
    let file: File = imageFile.value
    let cvs: HTMLCanvasElement = document.querySelector('#cvs') as HTMLCanvasElement
    let img: HTMLImageElement = document.querySelector('#image') as HTMLImageElement

    // load the image file
    let reader: FileReader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
      img.src = reader.result as string
      img.onload = () => {
        cvs.width = img.width
        cvs.height = img.height

        imageWidth = img.width
        imageHeight = img.height

        cvs.style.display = 'block'

        // Dispose old canvas instance to prevent memory leak
        if (canvasFabric) {
          canvasFabric.dispose()
        }

        canvasFabric = new fabric.Canvas('cvs')

        let e = isMobile ? 800 : 1600,
          scale = 1
        if (imageWidth > e) {
          canvasFabric.setWidth(e)
          canvasFabric.setHeight((e / imageWidth) * imageHeight)
          scale = e / imageWidth
        } else {
          canvasFabric.setWidth(imageWidth)
          canvasFabric.setHeight(imageHeight)
        }

        let backgroundImage = new fabric.Image(img, {
          scaleX: scale,
          scaleY: scale,
          top: 0,
          left: 0,
          selectable: false,
        })

        canvasFabric.setBackgroundImage(backgroundImage, () => {})
        switchHatInCanvas()
      }
    }
  }
}

const switchHatInCanvas = () => {
  let hatsAvaliable: NodeListOf<HTMLImageElement> = document.querySelectorAll('.carousel-img')
  if (hatInstance) {
    canvasFabric.remove(hatInstance)
  }
  let hatChoose = hatsAvaliable[currentHat.value]

  let scale = imageWidth / 2 / hatChoose.naturalWidth
  let e = isMobile ? 800 : 1600

  if (imageWidth > e) {
    scale = e / 2 / hatChoose.naturalWidth
  }

  hatInstance = new fabric.Image(hatChoose, {
    top: 40,
    scaleX: scale,
    scaleY: scale,
    cornerColor: '#04b9d9',
    cornerStrokeColor: '#fff',
    cornerStyle: 'circle',
    transparentCorners: false,
    rotatingPointOffset: 30,
    cornerSize: 36,
  })
  hatInstance.setControlVisible('mt', false)
  canvasFabric.add(hatInstance)
  hatInstance.centerH()

  let cvsContainer = document.querySelector('.cvs-container') as HTMLDivElement
  let canvasWrapperEl = document.querySelector('.canvas-container') as HTMLDivElement
  let cvsContainerWidth = cvsContainer.offsetWidth
  if ((canvasFabric.width as number) > cvsContainerWidth) {
    canvasWrapperEl.style.transform = 'scale('.concat(
      (cvsContainerWidth / (canvasFabric.width as number)).toString(),
      ')'
    )
    canvasWrapperEl.style.width = '100%'
    canvasWrapperEl.style.height =
      (canvasFabric.height as number) * (cvsContainerWidth / (canvasFabric.width as number)) + 'px'
  }
}

const previewShow = ref(false)
const previewImage = ref('')

const save = () => {
  previewShow.value = true
  previewImage.value = canvasFabric.toDataURL()
}

const download = () => {
  saveAs(canvasFabric.toDataURL(), 'christmas_hat_'.concat(new Date().getTime().toString(), '.png'))
}
</script>

<template>
  <main>
    <div class="main-container">
      <div class="main-panel app-panel">
        <div class="panel-title">
          <span class="title-text">给头像加圣诞帽</span>
        </div>
        <div>
          <h3 class="sub-title">选择要制作的图片</h3>
          <n-input-group>
            <n-input
              class="choose-image"
              :placeholder="imagePath ? imagePath : '戳右边上传头像→'"
              :readonly="true"
              type="text"
            />
            <n-upload
              :abstract="true"
              ref="uploadImageRef"
              accept="image/*"
              @change="handleUploadImage"
            >
              <n-button type="primary" ghost @click="chooseImage" icon-placement="left">
                <template #icon>
                  <n-icon>
                    <image-outline />
                  </n-icon>
                </template>
                选择图片
              </n-button>
            </n-upload>
          </n-input-group>
        </div>

        <div>
          <h3 class="sub-title mt-15">选择一顶圣诞帽（左右滑动）</h3>
          <n-carousel
            :space-between="15"
            :loop="false"
            :show-dots="false"
            :current-index="currentHat"
            slides-per-view="auto"
            centered-slides
            draggable
            @update:current-index="switchHat"
          >
            <n-carousel-item
              class="hat-container"
              style="height: calc(1rem + 100px); width: calc(1rem + 100px)"
              v-for="(item, index) in hatList"
              :key="index"
              @click="clickHat(index)"
            >
              <img class="carousel-img" :src="item" crossorigin="anonymous" />
            </n-carousel-item>
          </n-carousel>
          <div class="up-arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon-tabler-arrow-up"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="18" y1="11" x2="12" y2="5" />
              <line x1="6" y1="11" x2="12" y2="5" />
            </svg>
          </div>
        </div>

        <h3 class="sub-title mt-15">制作完成了就下载吧</h3>
        <n-button
          type="primary"
          ghost
          @click="save"
          :disabled="imagePath == ''"
          icon-placement="left"
        >
          <template #icon>
            <n-icon>
              <download-outline />
            </n-icon>
          </template>
          保存图片
        </n-button>
      </div>

      <div class="canvas-panel app-panel" v-show="imageFile">
        <div class="panel-title">
          <span class="title-text">预览和调整</span>
        </div>
        <img id="image" src="" alt="" style="display: none" />
        <div class="cvs-container">
          <canvas id="cvs"></canvas>
        </div>
      </div>

      <n-modal v-model:show="previewShow" preset="dialog" title="保存图片">
        <p>{{ isMobile ? '长按来保存图片' : '右键另存为图片或者点击按钮下载' }}</p>
        <img id="preview-image" :src="previewImage" alt="" />
        <n-button
          type="primary"
          ghost
          @click="download"
          :disabled="imagePath == ''"
          icon-placement="left"
          v-show="!isMobile"
        >
          <template #icon>
            <n-icon>
              <download-outline />
            </n-icon>
          </template>
          下载到本地
        </n-button>
      </n-modal>
    </div>
  </main>
</template>

<style scoped>
main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0.5rem;
}

.main-container {
  position: relative;
}

.app-panel {
  position: relative;
  padding: 1.25rem;
  padding-top: 2.1875rem;
  margin-top: 1.125rem;
  margin-bottom: 3.125rem;
  box-shadow: 0.5rem 0.875rem 2.375rem rgb(39 44 49 / 6%),
    0.0625rem 0.1875rem 0.5rem rgb(39 44 49 / 3%);
  background-color: var(--color-background);
  border: none;
  border-radius: 0.5rem;
}

.panel-title {
  position: absolute;
  left: 1.25rem;
  top: -1.125rem;
  padding: 0.5rem 0.9375rem;
  font-weight: 700;
  font-size: 0;
  background-color: #1d98d6;
  color: #fff;
  box-shadow: 0 0.25rem 0.625rem rgba(49, 177, 236, 0.3);
  border-radius: 0.5rem;
}

.title-text {
  font-size: 1.0625rem;
  line-height: 1.25rem;
  vertical-align: middle;
  font-weight: 700;
}

.sub-title {
  display: block;
  font-size: 1.125rem;
  margin-bottom: 0.625rem;
  font-weight: 700;
}

.mt-15 {
  margin-top: 0.9375rem;
}

.hat-container {
  cursor: pointer;
  border: 0.5px dashed var(--color-text);
  padding: 0.5rem;
}

.carousel-img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.up-arrow {
  padding: 0.2rem 0;
}

.icon-tabler-arrow-up {
  display: block;
  margin: 0 auto;
  stroke: var(--color-text);
}

#cvs {
  display: none;
}

#preview-image {
  margin-top: 8px;
  width: 100%;
}
</style>
