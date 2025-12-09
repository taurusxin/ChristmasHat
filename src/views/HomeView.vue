<script setup lang="ts">
import { ImageOutline, DownloadOutline } from '@vicons/ionicons5'
import type { UploadFileInfo } from 'naive-ui'
import { saveAs } from 'file-saver'
import { useI18n } from 'vue-i18n'
import { useHatManager, useCanvasEditor, useImageUpload } from '@/composables'

// i18n
const { t, locale } = useI18n()

// 语言切换
const toggleLanguage = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
}

// Responsive state
const isMobile = ref(window.innerWidth <= 768)
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

// Composables
const { hatList, currentHat, selectHat, isLoading: isHatLoading, loadError: hatLoadError } = useHatManager()
const { imageFile, imagePath, loadImage, isLoading: isImageLoading } = useImageUpload()
const { isCanvasReady, initCanvas, addHat, adjustCanvasContainer, toDataURL } = useCanvasEditor(isMobile)

// Template refs
const uploadImageRef = ref()
const cvsRef = ref<HTMLCanvasElement>()
const imgRef = ref<HTMLImageElement>()
const cvsContainerRef = ref<HTMLDivElement>()

// Preview modal
const previewShow = ref(false)
const previewImage = ref('')

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const chooseImage = () => {
  uploadImageRef.value.openOpenFileDialog()
}

const handleUploadImage = async (options: {
  file: UploadFileInfo
  fileList: Array<UploadFileInfo>
  event?: Event
}) => {
  const file = options.file.file
  if (!file) return
  
  imageFile.value = file
  imagePath.value = file.name

  const dataUrl = await loadImage()
  if (dataUrl && cvsRef.value && imgRef.value) {
    await initCanvas(cvsRef.value, imgRef.value, dataUrl)
    switchHatInCanvas()
  }
}

const switchHat = (currentIndex: number, _lastIndex: number) => {
  selectHat(currentIndex)
  switchHatInCanvas()
}

const clickHat = (imageIndex: number) => {
  selectHat(imageIndex)
  switchHatInCanvas()
}

const switchHatInCanvas = () => {
  if (!isCanvasReady.value) return

  const hatsAvailable: NodeListOf<HTMLImageElement> = document.querySelectorAll('.carousel-img')
  const hatChoose = hatsAvailable[currentHat.value]
  if (!hatChoose) return

  addHat(hatChoose)

  if (cvsContainerRef.value) {
    const canvasWrapper = document.querySelector('.canvas-container') as HTMLDivElement
    if (canvasWrapper) {
      adjustCanvasContainer(cvsContainerRef.value, canvasWrapper)
    }
  }
}

const save = () => {
  previewShow.value = true
  previewImage.value = toDataURL()
}

const download = () => {
  saveAs(toDataURL(), `christmas_hat_${Date.now()}.png`)
}
</script>

<template>
  <main>
    <!-- 移动端语言切换浮动按钮 -->
    <n-button 
      class="lang-switch-mobile" 
      circle
      type="info"
      size="large"
      @click="toggleLanguage"
      :title="locale === 'zh-CN' ? 'Switch to English' : '切换到中文'"
    >
      {{ locale === 'zh-CN' ? 'EN' : '中' }}
    </n-button>
    
    <div class="main-container">
      <div class="main-panel app-panel">
        <div class="panel-title">
          <span class="title-text">{{ t('title') }}</span>
        </div>
        
        <!-- PC端语言切换按钮 -->
        <div class="lang-switch-desktop">
          <n-button 
            size="small"
            quaternary
            @click="toggleLanguage"
            :title="locale === 'zh-CN' ? 'Switch to English' : '切换到中文'"
          >
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m5 8 6 6"/>
                  <path d="m4 14 6-6 2-3"/>
                  <path d="M2 5h12"/>
                  <path d="M7 2h1"/>
                  <path d="m22 22-5-10-5 10"/>
                  <path d="M14 18h6"/>
                </svg>
              </n-icon>
            </template>
            {{ locale === 'zh-CN' ? 'English' : '中文' }}
          </n-button>
        </div>
        <div>
          <h3 class="sub-title">{{ t('subtitle.selectImage') }}</h3>
          <n-input-group>
            <n-input class="choose-image" :placeholder="imagePath ? imagePath : t('placeholders.uploadHint')" :readonly="true"
              type="text" />
            <n-upload :abstract="true" ref="uploadImageRef" accept="image/*" @change="handleUploadImage">
              <n-button type="primary" ghost @click="chooseImage" icon-placement="left">
                <template #icon>
                  <n-icon>
                    <image-outline />
                  </n-icon>
                </template>
                {{ t('buttons.selectImage') }}
              </n-button>
            </n-upload>
          </n-input-group>
        </div>

        <div>
          <h3 class="sub-title mt-15">{{ t('subtitle.selectHat') }}</h3>
          <n-spin :show="isHatLoading">
            <n-carousel v-if="hatList.length > 0" :space-between="15" :loop="false" :show-dots="false"
              :current-index="currentHat" slides-per-view="auto" centered-slides draggable
              @update:current-index="switchHat">
              <n-carousel-item class="hat-container" style="height: calc(1rem + 100px); width: calc(1rem + 100px)"
                v-for="(item, index) in hatList" :key="index" @click="clickHat(index)">
                <img class="carousel-img" :src="item" crossorigin="anonymous" />
              </n-carousel-item>
            </n-carousel>
            <n-alert v-if="hatLoadError && !isHatLoading" type="warning" :bordered="false">
              {{ t('messages.hatLoadError') }}
            </n-alert>
          </n-spin>
          <div class="up-arrow" v-if="hatList.length > 0">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-tabler-arrow-up" width="20" height="20"
              viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="18" y1="11" x2="12" y2="5" />
              <line x1="6" y1="11" x2="12" y2="5" />
            </svg>
          </div>
        </div>

        <h3 class="sub-title mt-15">{{ t('subtitle.download') }}</h3>
        <n-button type="primary" ghost @click="save" :disabled="imagePath == ''" icon-placement="left">
          <template #icon>
            <n-icon>
              <download-outline />
            </n-icon>
          </template>
          {{ t('buttons.saveImage') }}
        </n-button>
      </div>

      <div class="canvas-panel app-panel" v-show="imageFile">
        <div class="panel-title">
          <span class="title-text">{{ t('messages.previewAndAdjust') }}</span>
        </div>
        <n-spin :show="isImageLoading" :description="t('messages.processing')">
          <img ref="imgRef" src="" alt="" style="display: none" />
          <div ref="cvsContainerRef" class="cvs-container">
            <canvas ref="cvsRef"></canvas>
          </div>
        </n-spin>
      </div>

      <n-modal v-model:show="previewShow" preset="dialog" :title="t('messages.saveImageDialog')">
        <p>{{ isMobile ? t('messages.mobileHint') : t('messages.desktopHint') }}</p>
        <img id="preview-image" :src="previewImage" alt="" />
        <n-button type="primary" ghost @click="download" :disabled="imagePath == ''" icon-placement="left"
          v-show="!isMobile">
          <template #icon>
            <n-icon>
              <download-outline />
            </n-icon>
          </template>
          {{ t('buttons.downloadLocal') }}
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

.cvs-container canvas {
  display: block;
  /* 移动端触摸优化 */
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 移动端Canvas容器优化 */
@media (max-width: 768px) {
  .cvs-container {
    /* 防止意外的触摸滚动 */
    overflow: hidden;
    /* 优化触摸响应 */
    touch-action: pan-x pan-y;
  }
  
  .cvs-container canvas {
    /* 移动端禁用文本选择 */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    /* 优化触摸延迟 */
    touch-action: manipulation;
  }
}

#preview-image {
  margin-top: 8px;
  width: 100%;
}

/* 移动端语言切换按钮 - 浮动样式 */
.lang-switch-mobile {
  position: fixed !important;
  top: 1rem !important;
  right: 1rem !important;
  z-index: 1000 !important;
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15) !important;
  transition: all 0.2s ease !important;
  width: 48px !important;
  height: 48px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
}

.lang-switch-mobile:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 0.375rem 1rem rgba(0, 0, 0, 0.2) !important;
}

.lang-switch-mobile:active {
  transform: scale(0.95) !important;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2) !important;
}

/* PC端语言切换按钮 - 内联样式 */
.lang-switch-desktop {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  display: none;
}

.lang-switch-desktop .n-button {
  font-size: 0.875rem;
  opacity: 0.7;
  transition: all 0.2s ease;
  border-radius: 0.375rem;
}

.lang-switch-desktop .n-button:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

/* 响应式显示控制 */
@media (min-width: 769px) {
  .lang-switch-mobile {
    display: none !important;
  }
  
  .lang-switch-desktop {
    display: block;
  }
}

@media (max-width: 768px) {
  .lang-switch-mobile {
    display: flex !important;
    width: 50px !important;
    height: 50px !important;
    font-size: 0.85rem !important;
  }
  
  .lang-switch-desktop {
    display: none;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .lang-switch-mobile {
    top: 0.75rem !important;
    right: 0.75rem !important;
    width: 46px !important;
    height: 46px !important;
    font-size: 0.75rem !important;
  }
}
</style>
