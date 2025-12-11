import { watch } from 'vue'
import { useRoute } from 'vue-router'

interface SEOConfig {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  twitterTitle: string
  twitterDescription: string
  lang: string
  ogLocale: string
  canonical: string
}

const seoConfigs: Record<string, SEOConfig> = {
  zh: {
    title: '头像加圣诞帽 🎄 - TaurusXin Tools',
    description:
      '免费在线圣诞帽生成器，一键为头像添加圣诞帽装饰。支持微信、QQ头像制作，操作简单，即时生成，让你的头像充满节日气氛。无需下载软件，在线即可完成。',
    keywords:
      '圣诞帽生成器,在线添加圣诞帽,头像圣诞帽,圣诞帽制作工具,微信圣诞帽头像,QQ圣诞帽,免费圣诞帽工具,Christmas hat generator,圣诞头像制作,节日头像,头像装饰,圣诞节头像,在线图片编辑,圣诞帽图片生成,avatar Christmas hat',
    ogTitle: '圣诞帽生成器 - 免费在线为头像添加圣诞帽 | TaurusXin',
    ogDescription:
      '一键为你的头像添加可爱的圣诞帽！免费在线工具，无需注册，支持微信、QQ头像制作，让你的社交头像充满圣诞气氛。',
    twitterTitle: '圣诞帽生成器 - 免费在线为头像添加圣诞帽',
    twitterDescription: '一键为你的头像添加可爱的圣诞帽！免费在线工具，无需注册，操作简单快捷。',
    lang: 'zh-CN',
    ogLocale: 'zh_CN',
    canonical: 'https://tools.taurusxin.com/hat/zh'
  },
  en: {
    title: 'Christmas Hat Generator 🎄 - Add Santa Hat to Avatar | TaurusXin Tools',
    description:
      'Free online Christmas hat generator. Add festive Santa hats to your profile pictures instantly. Perfect for WeChat, QQ, and social media avatars. No download required, works directly in your browser.',
    keywords:
      'Christmas hat generator,add Christmas hat online,avatar Santa hat,Christmas hat maker,profile picture Christmas hat,free Christmas hat tool,holiday avatar maker,festive profile picture,Christmas avatar generator,online image editor,Santa hat overlay',
    ogTitle: 'Christmas Hat Generator - Add Santa Hat to Your Avatar | TaurusXin',
    ogDescription:
      'Add a cute Christmas hat to your avatar with one click! Free online tool, no registration required. Make your social media profile festive for the holidays.',
    twitterTitle: 'Christmas Hat Generator - Add Santa Hat to Your Avatar',
    twitterDescription:
      'Add a cute Christmas hat to your avatar with one click! Free online tool, no registration required.',
    lang: 'en',
    ogLocale: 'en_US',
    canonical: 'https://tools.taurusxin.com/hat/en'
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
    updateMetaTag('[property="og:locale"]', 'content', config.ogLocale)

    // 更新 Twitter Card 标签
    updateMetaTag('[name="twitter:title"]', 'content', config.twitterTitle)
    updateMetaTag('[name="twitter:description"]', 'content', config.twitterDescription)

    // 更新 canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (canonical) {
      canonical.href = config.canonical
    }

    // 更新 alternate 链接
    updateLinkTag('alternate', 'zh-CN', 'https://tools.taurusxin.com/hat/zh')
    updateLinkTag('alternate', 'en', 'https://tools.taurusxin.com/hat/en')
    updateLinkTag('alternate', 'x-default', 'https://tools.taurusxin.com/hat/')
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
