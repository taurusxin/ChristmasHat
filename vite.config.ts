import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dts: 'src/auto-imports.d.ts',
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './',
  server: {
    proxy: {
      '/proxy/tools': {
        target: 'https://tools.taurusxin.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/tools/, '')
      },
      '/proxy/assets': {
        target: 'https://assets.taurusxin.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/assets/, '')
      }
    }
  }
})
