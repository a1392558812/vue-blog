import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import inject from '@rollup/plugin-inject'
import { chunkSplitPlugin } from 'vite-plugin-chunk-split'
import UnoCSS from 'unocss/vite'
// import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig((config) => {
  console.log('config', config)
  const plugins = [
    vue(),
    vueJsx(),
    vueDevTools(),
    UnoCSS(),
    inject({
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['**/*.*'],
      pwaAssets: {
        disabled: false,
        config: true
      },

      manifest: {
        name: 'awen-blog',
        short_name: 'awen-blog',
        description: 'awen-blog',
        theme_color: '#ffffff',
        screenshots: [
          {
            src: 'screenshots/IMG_1920x1080.png',
            sizes: '1920x1080'
          },
          {
            src: 'screenshots/IMG_320x320.png',
            sizes: '320x320'
          },
          {
            src: 'screenshots/IMG_1920x1080.png',
            sizes: '1920x1080',
            form_factor: 'wide'
          },
          {
            src: 'screenshots/IMG_1080x1920.png',
            sizes: '1080x1920',
            form_factor: 'narrow'
          }
        ],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.*'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 30000000, // 30MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[^\s/$.?#].[^\s]*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // <== 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },

      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module'
      }
    })
  ]
  if (config.mode === 'production') {
    plugins.push(
      chunkSplitPlugin({
        strategy: 'unbundle', // 分割的策略
        customSplitting: {},
        customChunk: ({ id }) => {
          if (id.includes('node_modules/@vue/')) {
            const list = id.toString().split('node_modules/')[1].split('/')
            return list[0] + '-' + list[1]
          }
          if (id.includes('node_modules/@vue-office/')) {
            const list = id.toString().split('node_modules/')[1].split('/')
            return list[0] + '-' + list[1]
          }
          if (id.includes('@vite-plugin-pwa/')) {
            return '@vite-plugin-pwa'
          }
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }),
      /* 
      // 放弃兼容传统浏览器
      legacy({
        targets: [
          'last 2 versions',
          'iOS >= 10',
          'Android >= 6',
          'Chrome >= 49',
          'Safari >= 10',
          'Samsung >= 5',
          'OperaMobile >= 46',
        ],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        polyfills: true
      }), */
      viteCompression({
        verbose: true, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用压缩
        algorithm: 'gzip', // 压缩算法
        threshold: 1024, // 文件大小阈值，小于该值的文件将不会被压缩
        deleteOriginFile: false, // 是否删除原文件
        ext: '.gz'
      }),
      visualizer({
        open: true, // 注意这里要设置为true，否则无效，如果存在本地服务端口，将在打包后自动展示
        gzipSize: true,
        file: 'stats.html', //分析图生成的文件名
        brotliSize: true
      })
    )
  }
  return {
    base: './',
    plugins,
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      chunkSizeWarningLimit: 500, // chunk 大小警告的限制
      cssCodeSplit: true, // 启用 CSS 代码拆分
      minify: 'terser', // 启用 Terser 压缩混淆代码
      modulePreload: false,
      sourcemap: false, // 禁用或启用生成的 SourceMap
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      // 通过配置分割策略优化代码分割
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
})
