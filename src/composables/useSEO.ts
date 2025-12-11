import { watch } from 'vue'
import { useRoute } from 'vue-router'

interface SEOConfig {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogImageAlt: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  itempropName: string
  itempropDescription: string
  itempropImage: string
  lang: string
  ogLocale: string
  ogLocaleAlternate: string
  canonical: string
  structuredData: object
}

const seoConfigs: Record<string, SEOConfig> = {
  zh: {
    title: '头像加圣诞帽 🎄  在线给头像加圣诞帽 - 免费圣诞头像制作工具 | TaurusXin Tools',
    description:
      '免费在线头像加圣诞帽，一键给照片和头像添加圣诞帽。支持AI人脸识别自动定位，完美适配微信、QQ、抖音等社交平台。想给谁戴圣诞帽就给谁戴！节日氛围拉满，高清无水印下载。',
    keywords:
      '头像加圣诞帽,圣诞头像,加圣诞帽,圣诞帽制作,头像生成器,圣诞节头像,节日头像,微信圣诞头像,QQ圣诞头像,免费圣诞帽工具,AI人脸识别,抖音圣诞头像,在线图片编辑,Christmas hat generator',
    ogTitle: '头像加圣诞帽 🎄  想给谁戴圣诞帽就给谁戴',
    ogDescription: '免费在线工具，一键给照片添加圣诞帽。AI智能识别，节日氛围拉满！',
    ogImage: 'https://assets.taurusxin.com/tools/hats/og-image-zh.jpg',
    ogImageAlt: '头像加圣诞帽示例图',
    twitterTitle: '头像加圣诞帽 - 在线给头像加圣诞帽',
    twitterDescription: '免费在线头像加圣诞帽，一键给照片和头像添加圣诞帽。支持AI人脸识别自动定位。',
    twitterImage: 'https://assets.taurusxin.com/tools/hats/twitter-image-zh.jpg',
    itempropName: '头像加圣诞帽 - 想给谁戴圣诞帽就给谁戴',
    itempropDescription: '免费在线工具，一键给头像加圣诞帽🎄 节日氛围拉满！',
    itempropImage: 'https://assets.taurusxin.com/tools/hats/wechat-share-zh.jpg',
    lang: 'zh-CN',
    ogLocale: 'zh_CN',
    ogLocaleAlternate: 'en_US',
    canonical: 'https://tools.taurusxin.com/hat/zh',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: '头像加圣诞帽',
      alternateName: 'Christmas Hat Generator',
      description: '免费在线头像加圣诞帽，一键为头像添加圣诞帽装饰。支持AI人脸识别自动定位。',
      url: 'https://tools.taurusxin.com/hat/zh',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY'
      },
      author: {
        '@type': 'Person',
        name: 'TaurusXin'
      },
      inLanguage: 'zh-CN',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '1.0',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        ratingCount: '1'
      }
    }
  },
  en: {
    title: 'Christmas Hat Generator 🎄  Add Santa Hat to Photos Online Free | TaurusXin Tools',
    description:
      'Free online Christmas hat generator. Add festive Santa hats to your photos and avatars instantly with AI-powered face detection. Perfect for holiday profile pictures on social media. HD download, no watermark!',
    keywords:
      'Christmas hat generator,Santa hat maker,holiday avatar creator,add Santa hat to photo,Christmas profile picture,festive photo editor,free Christmas hat tool,Santa hat filter,AI face detection',
    ogTitle: 'Christmas Hat Generator 🎄  Add Santa Hat to Your Photos',
    ogDescription:
      'Free online tool to add Christmas hats to your photos. AI-powered face detection for perfect positioning. Create festive avatars in seconds!',
    ogImage: 'https://assets.taurusxin.com/tools/hats/og-image-en.jpg',
    ogImageAlt: 'Christmas Hat Generator Example',
    twitterTitle: 'Christmas Hat Generator - Add Santa Hat to Photos',
    twitterDescription:
      'Free online Christmas hat generator with AI face detection. Add festive Santa hats to your photos instantly!',
    twitterImage: 'https://assets.taurusxin.com/tools/hats/twitter-image-en.jpg',
    itempropName: 'Christmas Hat Generator - Add Santa Hat to Photos',
    itempropDescription: 'Free online tool. Add Christmas hats to your photos with AI 🎄 ',
    itempropImage: 'https://assets.taurusxin.com/tools/hats/share-image-en.jpg',
    lang: 'en',
    ogLocale: 'en_US',
    ogLocaleAlternate: 'zh_CN',
    canonical: 'https://tools.taurusxin.com/hat/en',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Christmas Hat Generator',
      alternateName: '头像加圣诞帽',
      description:
        'Free online Christmas hat generator. Add festive Santa hats to your photos with AI-powered face detection.',
      url: 'https://tools.taurusxin.com/hat/en',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      author: {
        '@type': 'Person',
        name: 'TaurusXin'
      },
      inLanguage: 'en-US',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '1.0',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        ratingCount: '1'
      }
    }
  }
}

function updateMetaTag(selector: string, attribute: string, value: string) {
  let element = document.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    if (selector.startsWith('[property=')) {
      const property = selector.match(/property="([^"]+)"/)?.[1]
      if (property) element.setAttribute('property', property)
    } else if (selector.startsWith('[name=')) {
      const name = selector.match(/name="([^"]+)"/)?.[1]
      if (name) element.setAttribute('name', name)
    } else if (selector.startsWith('[itemprop=')) {
      const itemprop = selector.match(/itemprop="([^"]+)"/)?.[1]
      if (itemprop) element.setAttribute('itemprop', itemprop)
    }
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

function updateLinkTag(rel: string, hreflang: string, href: string) {
  const selector = `link[rel="${rel}"][hreflang="${hreflang}"]`
  let element = document.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    element.setAttribute('hreflang', hreflang)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function updateStructuredData(data: object) {
  // 查找或创建 JSON-LD script 标签
  let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data, null, 2)
}

export function useSEO() {
  const route = useRoute()

  const updateSEO = (lang: string) => {
    const config = seoConfigs[lang] || seoConfigs.zh

    // 更新 title
    document.title = config.title

    // 更新 html lang 属性
    document.documentElement.lang = config.lang

    // 更新基础 meta 标签
    updateMetaTag('[name="description"]', 'content', config.description)
    updateMetaTag('[name="keywords"]', 'content', config.keywords)

    // 更新 Open Graph 标签
    updateMetaTag('[property="og:title"]', 'content', config.ogTitle)
    updateMetaTag('[property="og:description"]', 'content', config.ogDescription)
    updateMetaTag('[property="og:url"]', 'content', config.canonical)
    updateMetaTag('[property="og:image"]', 'content', config.ogImage)
    updateMetaTag('[property="og:image:alt"]', 'content', config.ogImageAlt)
    updateMetaTag('[property="og:locale"]', 'content', config.ogLocale)
    updateMetaTag('[property="og:locale:alternate"]', 'content', config.ogLocaleAlternate)

    // 更新 Twitter Card 标签
    updateMetaTag('[name="twitter:title"]', 'content', config.twitterTitle)
    updateMetaTag('[name="twitter:description"]', 'content', config.twitterDescription)
    updateMetaTag('[name="twitter:image"]', 'content', config.twitterImage)
    updateMetaTag('[name="twitter:url"]', 'content', config.canonical)

    // 更新微信/QQ分享标签 (itemprop)
    updateMetaTag('[itemprop="name"]', 'content', config.itempropName)
    updateMetaTag('[itemprop="description"]', 'content', config.itempropDescription)
    updateMetaTag('[itemprop="image"]', 'content', config.itempropImage)

    // 更新 canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (canonical) {
      canonical.href = config.canonical
    }

    // 更新 alternate 链接 - 包含更多语言变体
    updateLinkTag('alternate', 'zh', 'https://tools.taurusxin.com/hat/zh')
    updateLinkTag('alternate', 'zh-CN', 'https://tools.taurusxin.com/hat/zh')
    updateLinkTag('alternate', 'zh-Hans', 'https://tools.taurusxin.com/hat/zh')
    updateLinkTag('alternate', 'en', 'https://tools.taurusxin.com/hat/en')
    updateLinkTag('alternate', 'en-US', 'https://tools.taurusxin.com/hat/en')
    updateLinkTag('alternate', 'x-default', 'https://tools.taurusxin.com/hat/')

    // 更新结构化数据
    updateStructuredData(config.structuredData)
  }

  // 监听路由变化
  watch(
    () => route.params.lang,
    (lang) => {
      if (lang && typeof lang === 'string') {
        updateSEO(lang)
      }
    },
    { immediate: true }
  )

  return {
    updateSEO
  }
}
