import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import i18n from '@/locales'

const router = createRouter({
  history: createWebHistory('/hat/'),
  routes: [
    {
      path: '/',
      redirect: () => {
        const lang = navigator.language.startsWith('zh') ? 'zh' : 'en'
        return `/${lang}`
      }
    },
    {
      path: '/:lang',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        const lang = to.params.lang as string
        if (['en', 'zh'].includes(lang)) {
          i18n.global.locale.value = lang === 'zh' ? 'zh-CN' : 'en-US'
          next()
        } else {
          next('/zh')
        }
      }
    }
  ]
})

export default router
