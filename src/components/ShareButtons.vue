<script setup lang="ts">
import { ref } from 'vue'
import { useShare } from '@/composables'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import shareCodeImg from '@/assets/shareCode.jpg'

const { t } = useI18n()
const message = useMessage()

const { copyLink } = useShare()

// 分享二维码弹窗状态
const showShareQRCode = ref(false)

const handleCopyLink = async () => {
  const success = await copyLink()
  if (success) {
    message.success(t('share.linkCopied'))
  } else {
    message.error(t('share.copyFailed'))
  }
}

// 显示分享二维码
const handleShowShareQRCode = () => {
  showShareQRCode.value = true
}

// 关闭分享二维码
const closeShareQRCode = () => {
  showShareQRCode.value = false
}
</script>

<template>
  <div class="share-buttons">
    <!-- 复制链接 -->
    <n-button
      class="share-btn copy"
      circle
      size="large"
      @click="handleCopyLink"
      :title="t('share.copyLink')"
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </template>
    </n-button>

    <!-- 分享二维码 -->
    <n-button
      class="share-btn qrcode"
      circle
      size="large"
      @click="handleShowShareQRCode"
      :title="t('share.showQRCode')"
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      </template>
    </n-button>

    <!-- 分享二维码弹窗 -->
    <n-modal
      v-model:show="showShareQRCode"
      preset="dialog"
      :title="t('share.shareQRCodeTitle')"
      :positive-text="t('share.close')"
      @positive-click="closeShareQRCode"
    >
      <div class="qrcode-container">
        <img :src="shareCodeImg" alt="Share QR Code" class="qrcode-img" />
        <p class="qrcode-hint">{{ t('share.shareQRCodeHint') }}</p>
      </div>
    </n-modal>
  </div>
</template>

<style scoped>
.share-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.share-btn {
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.share-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.share-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* 复制链接样式 */
.share-btn.copy {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.share-btn.copy:hover:not(:disabled) {
  background: linear-gradient(135deg, #764ba2 0%, #5a3d7a 100%);
}

/* 二维码样式 */
.share-btn.qrcode {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
}

.share-btn.qrcode:hover:not(:disabled) {
  background: linear-gradient(135deg, #f5576c 0%, #d4415c 100%);
}

/* 二维码容器 */
.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.qrcode-img {
  width: 200px;
  height: 200px;
  margin: 1rem 0;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
}

.qrcode-hint {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .share-buttons {
    gap: 0.5rem;
  }

  .share-btn {
    width: 44px !important;
    height: 44px !important;
  }
}

/* 禁用状态 */
.share-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
