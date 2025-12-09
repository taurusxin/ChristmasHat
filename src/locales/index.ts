import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

// 检测浏览器语言
const getDefaultLocale = (): string => {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en-US'
  
  // 如果是中文相关语言，返回中文
  if (browserLang.startsWith('zh')) {
    return 'zh-CN'
  }
  
  // 其他语言都返回英文
  return 'en-US'
}

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getDefaultLocale(),
  fallbackLocale: 'en-US',
  messages
})

export default i18n
