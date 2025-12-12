import { ref } from "vue";

export interface ShareOptions {
  title?: string;
  text?: string;
  imageUrl?: string;
  url?: string;
  hashtags?: string[];
  files?: File[]; // Web Share API Level 2 支持的文件
}

export interface ShareResult {
  success: boolean;
  isMobile?: boolean;
  error?: string;
}

export function useShare() {
  const isSharing = ref(false);
  const showQRCode = ref(false);
  const qrCodeUrl = ref("");
  const shareMessage = ref("");
  const showShareTip = ref(false);

  /**
   * 分享到 Twitter/X
   */
  const shareToTwitter = (options: ShareOptions) => {
    const {
      text = "我用这个工具给头像加上了圣诞帽！🎄",
      url = window.location.href,
      hashtags = ["圣诞头像", "ChristmasAvatar", "圣诞快乐"],
    } = options;

    const hashtagString = hashtags.join(",");
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(
      hashtagString
    )}`;

    window.open(twitterUrl, "_blank", "width=550,height=420");
  };

  /**
   * 分享到 Facebook
   */
  const shareToFacebook = (options: ShareOptions) => {
    const { url = window.location.href } = options;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=500");
  };

  /**
   * 分享到 QQ
   */
  const shareToQQ = (options: ShareOptions) => {
    const {
      title = "给头像加圣诞帽 🎄",
      text = "免费在线圣诞头像制作工具",
      url = window.location.href,
      imageUrl = "",
    } = options;

    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(
      text
    )}&summary=${encodeURIComponent(text)}&pics=${encodeURIComponent(
      imageUrl
    )}`;

    window.open(qqUrl, "_blank", "width=600,height=500");
  };

  /**
   * 分享到 QQ 空间
   */
  const shareToQzone = (options: ShareOptions) => {
    const {
      title = "给头像加圣诞帽 🎄",
      text = "免费在线圣诞头像制作工具，一键生成圣诞头像！",
      url = window.location.href,
      imageUrl = "",
    } = options;

    const qzoneUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(
      text
    )}&summary=${encodeURIComponent(text)}&pics=${encodeURIComponent(
      imageUrl
    )}`;

    window.open(qzoneUrl, "_blank", "width=600,height=500");
  };

  /**
   * 分享到微博
   */
  const shareToWeibo = (options: ShareOptions) => {
    const {
      title = "给头像加圣诞帽 🎄 免费在线制作",
      url = window.location.href,
      imageUrl = "",
    } = options;

    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}&pic=${encodeURIComponent(
      imageUrl
    )}&appkey=`;

    window.open(weiboUrl, "_blank", "width=600,height=500");
  };

  /**
   * 分享到微信（显示二维码）
   */
  const shareToWechat = (options: ShareOptions) => {
    const { url = window.location.href } = options;
    // 使用更稳定的二维码生成服务
    qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      url
    )}`;
    showQRCode.value = true;
    shareMessage.value = "微信扫码访问，长按保存图片后分享到朋友圈";
  };

  /**
   * 分享到豆瓣
   */
  const shareToDouban = (options: ShareOptions) => {
    const {
      title = "给头像加圣诞帽 🎄",
      text = "免费在线圣诞头像制作工具",
      url = window.location.href,
      imageUrl = "",
    } = options;

    const doubanUrl = `https://www.douban.com/share/service?href=${encodeURIComponent(
      url
    )}&name=${encodeURIComponent(title)}&text=${encodeURIComponent(
      text
    )}&image=${encodeURIComponent(imageUrl)}`;

    window.open(doubanUrl, "_blank", "width=600,height=500");
  };

  /**
   * 分享到 LinkedIn
   */
  const shareToLinkedIn = (options: ShareOptions) => {
    const { url = window.location.href } = options;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedinUrl, "_blank", "width=600,height=500");
  };

  /**
   * 分享到 Telegram
   */
  const shareToTelegram = (options: ShareOptions) => {
    const { text = "给头像加圣诞帽 🎄", url = window.location.href } = options;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank", "width=600,height=500");
  };

  /**
   * 分享到 WhatsApp
   */
  const shareToWhatsApp = (options: ShareOptions) => {
    const {
      text = "看看这个超棒的圣诞头像工具！🎄",
      url = window.location.href,
    } = options;
    const message = `${text} ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  /**
   * 分享到小红书（显示提示）
   */
  const shareToXiaohongshu = (options: ShareOptions) => {
    showShareTip.value = true;
    shareMessage.value =
      "小红书暂不支持直接分享，请：\n1. 截图保存本页面\n2. 打开小红书App\n3. 发布笔记时上传截图\n\n推荐话题：#圣诞头像 #圣诞氛围感 #头像制作";

    // 尝试打开小红书 App（移动端）
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setTimeout(() => {
        window.location.href = "xhsdiscover://item/publish";
      }, 100);
    }
  };

  /**
   * 分享到抖音（显示提示）
   */
  const shareToDouyin = (options: ShareOptions) => {
    showShareTip.value = true;
    shareMessage.value =
      "抖音暂不支持直接分享，请：\n1. 保存生成的圣诞头像\n2. 打开抖音App\n3. 发布时上传图片\n\n推荐话题：#圣诞头像 #圣诞帽 #圣诞氛围感";

    // 尝试打开抖音 App（移动端）
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      setTimeout(() => {
        window.location.href = "snssdk1128://upload";
      }, 100);
    }
  };

  /**
   * 分享到 Instagram
   * 优先使用 Web Share API（移动端），否则显示提示
   */
  const shareToInstagram = async (
    imageUrl?: string
  ): Promise<ShareResult> => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // 移动端：优先尝试使用 Web Share API 分享图片
    if (isMobile && imageUrl && canUseWebShare()) {
      try {
        const file = await imageUrlToFile(imageUrl, "christmas-avatar.png");
        if (file && canShareFiles([file])) {
          const result = await shareWithWebAPI({
            title: "给头像加圣诞帽 🎄",
            text: "我用这个工具给头像加上了圣诞帽！",
            files: [file],
          });
          
          if (result.success) {
            return { success: true, isMobile };
          }
        }
      } catch (error) {
        console.log("Web Share API failed, falling back to manual method:", error);
      }
    }

    // 降级方案：显示提示并尝试打开 Instagram App（移动端）
    if (isMobile) {
      setTimeout(() => {
        // Instagram 的 URL Scheme
        try {
          window.location.href = "instagram://camera";
        } catch {
          // 如果 URL Scheme 失败，忽略错误
        }
      }, 100);
    }

    showShareTip.value = true;
    shareMessage.value = isMobile
      ? "Instagram 应用已打开，请手动选择图片进行分享"
      : "请在 Instagram 网站上手动上传图片";

    return {
      success: false,
      isMobile,
      error: "Instagram requires manual upload",
    };
  };

  /**
   * 下载图片（用于分享到其他平台）
   */
  const downloadImage = (
    imageDataUrl: string,
    filename: string = "christmas-avatar.png"
  ) => {
    try {
    const link = document.createElement("a");
    link.download = filename;
    link.href = imageDataUrl;
      link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showShareTip.value = true;
    shareMessage.value = "图片已下载！您可以分享到任何平台 🎄";
    } catch (error) {
      console.error("Failed to download image:", error);
      showShareTip.value = true;
      shareMessage.value = "下载失败，请右键保存图片";
    }
  };

  /**
   * 使用 Web Share API 分享图片（如果支持）
   */
  const shareImageWithWebAPI = async (
    imageDataUrl: string,
    options?: Omit<ShareOptions, "imageUrl" | "files">
  ): Promise<ShareResult> => {
    try {
      // 将 Data URL 转换为 Blob，再转换为 File
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], "christmas-avatar.png", {
        type: blob.type || "image/png",
      });

      return await shareWithWebAPI({
        ...options,
        files: [file],
      });
    } catch (error) {
      console.error("Failed to share image:", error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  };

  /**
   * 检查是否支持 Web Share API
   */
  const canUseWebShare = (): boolean => {
    return typeof navigator !== "undefined" && "share" in navigator;
  };

  /**
   * 检查是否支持文件分享（Web Share API Level 2）
   */
  const canShareFiles = (files?: File[]): boolean => {
    if (!canUseWebShare() || !files || files.length === 0) {
      return false;
    }
    // 检查是否支持 canShare 方法
    if (navigator.canShare) {
      try {
        return navigator.canShare({ files });
      } catch {
        return false;
      }
    }
    return false;
  };

  /**
   * 将图片 URL 转换为 File 对象
   */
  const imageUrlToFile = async (
    imageUrl: string,
    filename: string = "christmas-avatar.png"
  ): Promise<File | null> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type || "image/png" });
    } catch (error) {
      console.error("Failed to convert image URL to File:", error);
      return null;
    }
  };

  /**
   * 使用 Web Share API（如果可用）- 优先使用，支持图片分享
   */
  const shareWithWebAPI = async (
    options: ShareOptions
  ): Promise<ShareResult> => {
    if (!canUseWebShare()) {
      return { success: false, error: "Web Share API not supported" };
    }

    try {
      isSharing.value = true;

      // 如果有文件，优先使用文件分享（Web Share API Level 2）
      if (options.files && options.files.length > 0) {
        if (canShareFiles(options.files)) {
          const shareData: ShareData = {
            title: options.title || "给头像加圣诞帽 🎄",
            text: options.text || "免费在线圣诞头像制作工具",
            url: options.url || window.location.href,
            files: options.files,
          };

          await navigator.share(shareData);
          return { success: true };
        }
      }

      // 如果有图片 URL，尝试转换为文件并分享
      if (options.imageUrl) {
        const file = await imageUrlToFile(options.imageUrl);
        if (file && canShareFiles([file])) {
          const shareData: ShareData = {
            title: options.title || "给头像加圣诞帽 🎄",
            text: options.text || "免费在线圣诞头像制作工具",
            url: options.url || window.location.href,
            files: [file],
          };

          await navigator.share(shareData);
          return { success: true };
        }
      }

      // 降级到文本/URL 分享
      const shareData: ShareData = {
        title: options.title || "给头像加圣诞帽 🎄",
        text: options.text || "免费在线圣诞头像制作工具",
        url: options.url || window.location.href,
      };

      await navigator.share(shareData);
      return { success: true };
    } catch (error) {
      const err = error as Error;
      if (err.name !== "AbortError") {
        console.error("Error sharing:", error);
        return { success: false, error: err.message };
      }
      return { success: false, error: "User cancelled" };
    } finally {
      isSharing.value = false;
    }
  };

  /**
   * 复制链接到剪贴板
   */
  const copyLink = async (url: string = window.location.href) => {
    try {
      await navigator.clipboard.writeText(url);
      showShareTip.value = true;
      shareMessage.value = "链接已复制！快去分享给朋友吧 🎉";
      return true;
    } catch (error) {
      // 降级方案
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showShareTip.value = true;
        shareMessage.value = "链接已复制！快去分享给朋友吧 🎉";
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  };

  /**
   * 分享到邮件
   */
  const shareViaEmail = (options: ShareOptions) => {
    const {
      title = "给头像加圣诞帽 🎄",
      text = "我发现了一个超棒的圣诞头像制作工具，快来试试吧！",
      url = window.location.href,
    } = options;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;

    window.location.href = mailtoUrl;
  };

  const closeQRCode = () => {
    showQRCode.value = false;
  };

  const closeTip = () => {
    showShareTip.value = false;
  };

  return {
    // 状态
    isSharing,
    showQRCode,
    qrCodeUrl,
    shareMessage,
    showShareTip,

    // 国际平台
    shareToTwitter,
    shareToFacebook,
    shareToLinkedIn,
    shareToTelegram,
    shareToWhatsApp,
    shareToInstagram,

    // 中国平台
    shareToQQ,
    shareToQzone,
    shareToWeibo,
    shareToWechat,
    shareToDouban,
    shareToXiaohongshu,
    shareToDouyin,

    // 通用功能
    shareWithWebAPI,
    shareImageWithWebAPI,
    copyLink,
    downloadImage,
    shareViaEmail,

    // 工具方法
    canUseWebShare,
    canShareFiles,
    imageUrlToFile,

    // 控制方法
    closeQRCode,
    closeTip,
  };
}
