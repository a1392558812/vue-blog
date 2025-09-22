// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/vite-plugin-pwa/dist/index.js";
import prismjs from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/vite-plugin-prismjs/dist/index.js";
import { codeInspectorPlugin } from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/code-inspector-plugin/dist/index.mjs";
import vitePluginAppinfo from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/vite-plugin-build-info/dist/index.js";
import { defineConfig } from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueDevTools from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import viteCompression from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import inject from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/@rollup/plugin-inject/dist/es/index.js";
import { chunkSplitPlugin } from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/vite-plugin-chunk-split/dist/index.mjs";
import UnoCSS from "file:///C:/Users/13925/Desktop/project/vue-blog/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/13925/Desktop/project/vue-blog/vite.config.js";
var vite_config_default = defineConfig((config) => {
  console.log("config", config);
  const plugins = [
    vue(),
    vueJsx(),
    vueDevTools(),
    prismjs({
      languages: [
        "json",
        "javascript",
        "typescript",
        "html",
        "css",
        "scss",
        "less",
        "markdown",
        "tsx",
        "jsx",
        "python",
        "bash",
        "shell"
      ]
    }),
    UnoCSS(),
    inject({
      $: "jquery",
      jQuery: "jquery",
      "windows.jQuery": "jquery"
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["**/*.*"],
      pwaAssets: {
        disabled: false,
        config: true
      },
      manifest: {
        name: "awen-blog",
        short_name: "awen-blog",
        description: "awen-blog",
        theme_color: "#ffffff",
        screenshots: [
          {
            src: "screenshots/IMG_1920x1080.png",
            sizes: "1920x1080"
          },
          {
            src: "screenshots/IMG_320x320.png",
            sizes: "320x320"
          },
          {
            src: "screenshots/IMG_1920x1080.png",
            sizes: "1920x1080",
            form_factor: "wide"
          },
          {
            src: "screenshots/IMG_1080x1920.png",
            sizes: "1080x1920",
            form_factor: "narrow"
          }
        ],
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.*"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 3e7,
        // 30MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[^\s/$.?#].[^\s]*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
                // <== 30 days
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
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module"
      }
    }),
    codeInspectorPlugin({
      bundler: "vite",
      editor: "code",
      // 当前热键： ctrl + alt + 点击 触发
      hotKeys: ["ctrlKey", "altKey"],
      // 触发源码定位功能的组合键，为空数组则会关闭组合键触发功能。(ctrlKey 对应 Mac 中的 control 键；altKey 对应 Mac 中的 option 键；metaKey 对应 Mac 中的 command 键)
      dev: () => config.mode === "development"
    }),
    vitePluginAppinfo({
      showBuildUser: true,
      enableLog: true
    })
  ];
  if (config.mode === "production") {
    plugins.push(
      chunkSplitPlugin({
        strategy: "unbundle",
        // 分割的策略
        customSplitting: {},
        customChunk: ({ id }) => {
          if (id.includes("node_modules/@vue/")) {
            const list = id.toString().split("node_modules/")[1].split("/");
            return list[0] + "-" + list[1];
          }
          if (id.includes("node_modules/@vue-office/")) {
            const list = id.toString().split("node_modules/")[1].split("/");
            return list[0] + "-" + list[1];
          }
          if (id.includes("@vite-plugin-pwa/")) {
            return "@vite-plugin-pwa";
          }
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
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
        verbose: true,
        // 是否在控制台输出压缩结果
        disable: false,
        // 是否禁用压缩
        algorithm: "gzip",
        // 压缩算法
        threshold: 1024,
        // 文件大小阈值，小于该值的文件将不会被压缩
        deleteOriginFile: false,
        // 是否删除原文件
        ext: ".gz"
      }),
      visualizer({
        open: true,
        // 注意这里要设置为true，否则无效，如果存在本地服务端口，将在打包后自动展示
        gzipSize: true,
        file: "stats.html",
        //分析图生成的文件名
        brotliSize: true
      })
    );
  }
  return {
    base: "./",
    plugins,
    server: {
      port: 5200
    },
    optimizeDeps: {
      exclude: ["@vue/repl"]
    },
    define: {
      "process.env": {}
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    build: {
      chunkSizeWarningLimit: 500,
      // chunk 大小警告的限制
      cssCodeSplit: true,
      // 启用 CSS 代码拆分
      minify: "terser",
      // 启用 Terser 压缩混淆代码
      modulePreload: false,
      sourcemap: false,
      // 禁用或启用生成的 SourceMap
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      // 通过配置分割策略优化代码分割
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]"
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwxMzkyNVxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxcdnVlLWJsb2dcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDEzOTI1XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx2dWUtYmxvZ1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvMTM5MjUvRGVza3RvcC9wcm9qZWN0L3Z1ZS1ibG9nL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXHJcbmltcG9ydCBwcmlzbWpzIGZyb20gJ3ZpdGUtcGx1Z2luLXByaXNtanMnXHJcbmltcG9ydCB7IGNvZGVJbnNwZWN0b3JQbHVnaW4gfSBmcm9tICdjb2RlLWluc3BlY3Rvci1wbHVnaW4nXHJcbmltcG9ydCB2aXRlUGx1Z2luQXBwaW5mbyBmcm9tICd2aXRlLXBsdWdpbi1idWlsZC1pbmZvJ1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbidcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcclxuaW1wb3J0IGluamVjdCBmcm9tICdAcm9sbHVwL3BsdWdpbi1pbmplY3QnXHJcbmltcG9ydCB7IGNodW5rU3BsaXRQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1jaHVuay1zcGxpdCdcclxuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcclxuLy8gaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKGNvbmZpZykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdjb25maWcnLCBjb25maWcpXHJcbiAgY29uc3QgcGx1Z2lucyA9IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgICB2dWVEZXZUb29scygpLFxyXG4gICAgcHJpc21qcyh7XHJcbiAgICAgIGxhbmd1YWdlczogW1xyXG4gICAgICAgICdqc29uJyxcclxuICAgICAgICAnamF2YXNjcmlwdCcsXHJcbiAgICAgICAgJ3R5cGVzY3JpcHQnLFxyXG4gICAgICAgICdodG1sJyxcclxuICAgICAgICAnY3NzJyxcclxuICAgICAgICAnc2NzcycsXHJcbiAgICAgICAgJ2xlc3MnLFxyXG4gICAgICAgICdtYXJrZG93bicsXHJcbiAgICAgICAgJ3RzeCcsXHJcbiAgICAgICAgJ2pzeCcsXHJcbiAgICAgICAgJ3B5dGhvbicsXHJcbiAgICAgICAgJ2Jhc2gnLFxyXG4gICAgICAgICdzaGVsbCdcclxuICAgICAgXVxyXG4gICAgfSksXHJcbiAgICBVbm9DU1MoKSxcclxuICAgIGluamVjdCh7XHJcbiAgICAgICQ6ICdqcXVlcnknLFxyXG4gICAgICBqUXVlcnk6ICdqcXVlcnknLFxyXG4gICAgICAnd2luZG93cy5qUXVlcnknOiAnanF1ZXJ5J1xyXG4gICAgfSksXHJcbiAgICBWaXRlUFdBKHtcclxuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgICAgIGluamVjdFJlZ2lzdGVyOiAnYXV0bycsXHJcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnKiovKi4qJ10sXHJcbiAgICAgIHB3YUFzc2V0czoge1xyXG4gICAgICAgIGRpc2FibGVkOiBmYWxzZSxcclxuICAgICAgICBjb25maWc6IHRydWVcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgICAgbmFtZTogJ2F3ZW4tYmxvZycsXHJcbiAgICAgICAgc2hvcnRfbmFtZTogJ2F3ZW4tYmxvZycsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICdhd2VuLWJsb2cnLFxyXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgc2NyZWVuc2hvdHM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAnc2NyZWVuc2hvdHMvSU1HXzE5MjB4MTA4MC5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE5MjB4MTA4MCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ3NjcmVlbnNob3RzL0lNR18zMjB4MzIwLnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnMzIweDMyMCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHNyYzogJ3NjcmVlbnNob3RzL0lNR18xOTIweDEwODAucG5nJyxcclxuICAgICAgICAgICAgc2l6ZXM6ICcxOTIweDEwODAnLFxyXG4gICAgICAgICAgICBmb3JtX2ZhY3RvcjogJ3dpZGUnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdzY3JlZW5zaG90cy9JTUdfMTA4MHgxOTIwLnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnMTA4MHgxOTIwJyxcclxuICAgICAgICAgICAgZm9ybV9mYWN0b3I6ICduYXJyb3cnXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdwd2EtNjR4NjQucG5nJyxcclxuICAgICAgICAgICAgc2l6ZXM6ICc2NHg2NCcsXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdwd2EtMTkyeDE5Mi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAncHdhLTUxMng1MTIucG5nJyxcclxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcclxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnknXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdtYXNrYWJsZS1pY29uLTUxMng1MTIucG5nJyxcclxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcclxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXHJcbiAgICAgICAgICAgIHB1cnBvc2U6ICdtYXNrYWJsZSdcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB3b3JrYm94OiB7XHJcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyouKiddLFxyXG4gICAgICAgIGNsZWFudXBPdXRkYXRlZENhY2hlczogdHJ1ZSxcclxuICAgICAgICBjbGllbnRzQ2xhaW06IHRydWUsXHJcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDMwMDAwMDAwLCAvLyAzME1CXHJcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9bXlxccy8kLj8jXS5bXlxcc10qJC8sXHJcbiAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2dvb2dsZS1mb250cy1jYWNoZScsXHJcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAsXHJcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzMCAvLyA8PT0gMzAgZGF5c1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRldk9wdGlvbnM6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIG5hdmlnYXRlRmFsbGJhY2s6ICdpbmRleC5odG1sJyxcclxuICAgICAgICBzdXBwcmVzc1dhcm5pbmdzOiB0cnVlLFxyXG4gICAgICAgIHR5cGU6ICdtb2R1bGUnXHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgY29kZUluc3BlY3RvclBsdWdpbih7XHJcbiAgICAgIGJ1bmRsZXI6ICd2aXRlJyxcclxuICAgICAgZWRpdG9yOiAnY29kZScsXHJcbiAgICAgIC8vIFx1NUY1M1x1NTI0RFx1NzBFRFx1OTUyRVx1RkYxQSBjdHJsICsgYWx0ICsgXHU3MEI5XHU1MUZCIFx1ODlFNlx1NTNEMVxyXG4gICAgICBob3RLZXlzOiBbJ2N0cmxLZXknLCAnYWx0S2V5J10sIC8vIFx1ODlFNlx1NTNEMVx1NkU5MFx1NzgwMVx1NUI5QVx1NEY0RFx1NTI5Rlx1ODBGRFx1NzY4NFx1N0VDNFx1NTQwOFx1OTUyRVx1RkYwQ1x1NEUzQVx1N0E3QVx1NjU3MFx1N0VDNFx1NTIxOVx1NEYxQVx1NTE3M1x1OTVFRFx1N0VDNFx1NTQwOFx1OTUyRVx1ODlFNlx1NTNEMVx1NTI5Rlx1ODBGRFx1MzAwMihjdHJsS2V5IFx1NUJGOVx1NUU5NCBNYWMgXHU0RTJEXHU3Njg0IGNvbnRyb2wgXHU5NTJFXHVGRjFCYWx0S2V5IFx1NUJGOVx1NUU5NCBNYWMgXHU0RTJEXHU3Njg0IG9wdGlvbiBcdTk1MkVcdUZGMUJtZXRhS2V5IFx1NUJGOVx1NUU5NCBNYWMgXHU0RTJEXHU3Njg0IGNvbW1hbmQgXHU5NTJFKVxyXG4gICAgICBkZXY6ICgpID0+IGNvbmZpZy5tb2RlID09PSAnZGV2ZWxvcG1lbnQnXHJcbiAgICB9KSxcclxuICAgIHZpdGVQbHVnaW5BcHBpbmZvKHtcclxuICAgICAgc2hvd0J1aWxkVXNlcjogdHJ1ZSxcclxuICAgICAgZW5hYmxlTG9nOiB0cnVlXHJcbiAgICB9KVxyXG4gIF1cclxuICBpZiAoY29uZmlnLm1vZGUgPT09ICdwcm9kdWN0aW9uJykge1xyXG4gICAgcGx1Z2lucy5wdXNoKFxyXG4gICAgICBjaHVua1NwbGl0UGx1Z2luKHtcclxuICAgICAgICBzdHJhdGVneTogJ3VuYnVuZGxlJywgLy8gXHU1MjA2XHU1MjcyXHU3Njg0XHU3QjU2XHU3NTY1XHJcbiAgICAgICAgY3VzdG9tU3BsaXR0aW5nOiB7fSxcclxuICAgICAgICBjdXN0b21DaHVuazogKHsgaWQgfSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvQHZ1ZS8nKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3RbMF0gKyAnLScgKyBsaXN0WzFdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9AdnVlLW9mZmljZS8nKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0ID0gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylcclxuICAgICAgICAgICAgcmV0dXJuIGxpc3RbMF0gKyAnLScgKyBsaXN0WzFdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0B2aXRlLXBsdWdpbi1wd2EvJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuICdAdml0ZS1wbHVnaW4tcHdhJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSksXHJcbiAgICAgIC8qIFxyXG4gICAgICAvLyBcdTY1M0VcdTVGMDNcdTUxN0NcdTVCQjlcdTRGMjBcdTdFREZcdTZENEZcdTg5QzhcdTU2NjhcclxuICAgICAgbGVnYWN5KHtcclxuICAgICAgICB0YXJnZXRzOiBbXHJcbiAgICAgICAgICAnbGFzdCAyIHZlcnNpb25zJyxcclxuICAgICAgICAgICdpT1MgPj0gMTAnLFxyXG4gICAgICAgICAgJ0FuZHJvaWQgPj0gNicsXHJcbiAgICAgICAgICAnQ2hyb21lID49IDQ5JyxcclxuICAgICAgICAgICdTYWZhcmkgPj0gMTAnLFxyXG4gICAgICAgICAgJ1NhbXN1bmcgPj0gNScsXHJcbiAgICAgICAgICAnT3BlcmFNb2JpbGUgPj0gNDYnLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYWRkaXRpb25hbExlZ2FjeVBvbHlmaWxsczogWydyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnXSxcclxuICAgICAgICByZW5kZXJMZWdhY3lDaHVua3M6IHRydWUsXHJcbiAgICAgICAgcG9seWZpbGxzOiB0cnVlXHJcbiAgICAgIH0pLCAqL1xyXG4gICAgICB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICAgIHZlcmJvc2U6IHRydWUsIC8vIFx1NjYyRlx1NTQyNlx1NTcyOFx1NjNBN1x1NTIzNlx1NTNGMFx1OEY5M1x1NTFGQVx1NTM4Qlx1N0YyOVx1N0VEM1x1Njc5Q1xyXG4gICAgICAgIGRpc2FibGU6IGZhbHNlLCAvLyBcdTY2MkZcdTU0MjZcdTc5ODFcdTc1MjhcdTUzOEJcdTdGMjlcclxuICAgICAgICBhbGdvcml0aG06ICdnemlwJywgLy8gXHU1MzhCXHU3RjI5XHU3Qjk3XHU2Q0Q1XHJcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0LCAvLyBcdTY1ODdcdTRFRjZcdTU5MjdcdTVDMEZcdTk2MDhcdTUwM0NcdUZGMENcdTVDMEZcdTRFOEVcdThCRTVcdTUwM0NcdTc2ODRcdTY1ODdcdTRFRjZcdTVDMDZcdTRFMERcdTRGMUFcdTg4QUJcdTUzOEJcdTdGMjlcclxuICAgICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSwgLy8gXHU2NjJGXHU1NDI2XHU1MjIwXHU5NjY0XHU1MzlGXHU2NTg3XHU0RUY2XHJcbiAgICAgICAgZXh0OiAnLmd6J1xyXG4gICAgICB9KSxcclxuICAgICAgdmlzdWFsaXplcih7XHJcbiAgICAgICAgb3BlbjogdHJ1ZSwgLy8gXHU2Q0U4XHU2MTBGXHU4RkQ5XHU5MUNDXHU4OTgxXHU4QkJFXHU3RjZFXHU0RTNBdHJ1ZVx1RkYwQ1x1NTQyNlx1NTIxOVx1NjVFMFx1NjU0OFx1RkYwQ1x1NTk4Mlx1Njc5Q1x1NUI1OFx1NTcyOFx1NjcyQ1x1NTczMFx1NjcwRFx1NTJBMVx1N0FFRlx1NTNFM1x1RkYwQ1x1NUMwNlx1NTcyOFx1NjI1M1x1NTMwNVx1NTQwRVx1ODFFQVx1NTJBOFx1NUM1NVx1NzkzQVxyXG4gICAgICAgIGd6aXBTaXplOiB0cnVlLFxyXG4gICAgICAgIGZpbGU6ICdzdGF0cy5odG1sJywgLy9cdTUyMDZcdTY3OTBcdTU2RkVcdTc1MUZcdTYyMTBcdTc2ODRcdTY1ODdcdTRFRjZcdTU0MERcclxuICAgICAgICBicm90bGlTaXplOiB0cnVlXHJcbiAgICAgIH0pXHJcbiAgICApXHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBiYXNlOiAnLi8nLFxyXG4gICAgcGx1Z2lucyxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiA1MjAwXHJcbiAgICB9LFxyXG4gICAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICAgIGV4Y2x1ZGU6IFsnQHZ1ZS9yZXBsJ11cclxuICAgIH0sXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgJ3Byb2Nlc3MuZW52Jzoge31cclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyBjaHVuayBcdTU5MjdcdTVDMEZcdThCNjZcdTU0NEFcdTc2ODRcdTk2NTBcdTUyMzZcclxuICAgICAgY3NzQ29kZVNwbGl0OiB0cnVlLCAvLyBcdTU0MkZcdTc1MjggQ1NTIFx1NEVFM1x1NzgwMVx1NjJDNlx1NTIwNlxyXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLCAvLyBcdTU0MkZcdTc1MjggVGVyc2VyIFx1NTM4Qlx1N0YyOVx1NkRGN1x1NkRDNlx1NEVFM1x1NzgwMVxyXG4gICAgICBtb2R1bGVQcmVsb2FkOiBmYWxzZSxcclxuICAgICAgc291cmNlbWFwOiBmYWxzZSwgLy8gXHU3OTgxXHU3NTI4XHU2MjE2XHU1NDJGXHU3NTI4XHU3NTFGXHU2MjEwXHU3Njg0IFNvdXJjZU1hcFxyXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFx1OTAxQVx1OEZDN1x1OTE0RFx1N0Y2RVx1NTIwNlx1NTI3Mlx1N0I1Nlx1NzU2NVx1NEYxOFx1NTMxNlx1NEVFM1x1NzgwMVx1NTIwNlx1NTI3MlxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnc3RhdGljL2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVQsU0FBUyxlQUFlLFdBQVc7QUFDdFYsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sYUFBYTtBQUNwQixTQUFTLDJCQUEyQjtBQUNwQyxPQUFPLHVCQUF1QjtBQUU5QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8scUJBQXFCO0FBQzVCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sWUFBWTtBQUNuQixTQUFTLHdCQUF3QjtBQUNqQyxPQUFPLFlBQVk7QUFkOEssSUFBTSwyQ0FBMkM7QUFrQmxQLElBQU8sc0JBQVEsYUFBYSxDQUFDLFdBQVc7QUFDdEMsVUFBUSxJQUFJLFVBQVUsTUFBTTtBQUM1QixRQUFNLFVBQVU7QUFBQSxJQUNkLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxNQUNOLFdBQVc7QUFBQSxRQUNUO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsR0FBRztBQUFBLE1BQ0gsUUFBUTtBQUFBLE1BQ1Isa0JBQWtCO0FBQUEsSUFDcEIsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsZ0JBQWdCO0FBQUEsTUFDaEIsZUFBZSxDQUFDLFFBQVE7QUFBQSxNQUN4QixXQUFXO0FBQUEsUUFDVCxVQUFVO0FBQUEsUUFDVixRQUFRO0FBQUEsTUFDVjtBQUFBLE1BRUEsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFVBQ1g7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLGFBQWE7QUFBQSxVQUNmO0FBQUEsUUFDRjtBQUFBLFFBQ0EsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixTQUFTO0FBQUEsVUFDWDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLFNBQVM7QUFBQSxVQUNYO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUVBLFNBQVM7QUFBQSxRQUNQLGNBQWMsQ0FBQyxRQUFRO0FBQUEsUUFDdkIsdUJBQXVCO0FBQUEsUUFDdkIsY0FBYztBQUFBLFFBQ2QsK0JBQStCO0FBQUE7QUFBQSxRQUMvQixnQkFBZ0I7QUFBQSxVQUNkO0FBQUEsWUFDRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUCxXQUFXO0FBQUEsY0FDWCxZQUFZO0FBQUEsZ0JBQ1YsWUFBWTtBQUFBLGdCQUNaLGVBQWUsS0FBSyxLQUFLLEtBQUs7QUFBQTtBQUFBLGNBQ2hDO0FBQUEsY0FDQSxtQkFBbUI7QUFBQSxnQkFDakIsVUFBVSxDQUFDLEdBQUcsR0FBRztBQUFBLGNBQ25CO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BRUEsWUFBWTtBQUFBLFFBQ1YsU0FBUztBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsa0JBQWtCO0FBQUEsUUFDbEIsTUFBTTtBQUFBLE1BQ1I7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELG9CQUFvQjtBQUFBLE1BQ2xCLFNBQVM7QUFBQSxNQUNULFFBQVE7QUFBQTtBQUFBLE1BRVIsU0FBUyxDQUFDLFdBQVcsUUFBUTtBQUFBO0FBQUEsTUFDN0IsS0FBSyxNQUFNLE9BQU8sU0FBUztBQUFBLElBQzdCLENBQUM7QUFBQSxJQUNELGtCQUFrQjtBQUFBLE1BQ2hCLGVBQWU7QUFBQSxNQUNmLFdBQVc7QUFBQSxJQUNiLENBQUM7QUFBQSxFQUNIO0FBQ0EsTUFBSSxPQUFPLFNBQVMsY0FBYztBQUNoQyxZQUFRO0FBQUEsTUFDTixpQkFBaUI7QUFBQSxRQUNmLFVBQVU7QUFBQTtBQUFBLFFBQ1YsaUJBQWlCLENBQUM7QUFBQSxRQUNsQixhQUFhLENBQUMsRUFBRSxHQUFHLE1BQU07QUFDdkIsY0FBSSxHQUFHLFNBQVMsb0JBQW9CLEdBQUc7QUFDckMsa0JBQU0sT0FBTyxHQUFHLFNBQVMsRUFBRSxNQUFNLGVBQWUsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHO0FBQzlELG1CQUFPLEtBQUssQ0FBQyxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBQUEsVUFDL0I7QUFDQSxjQUFJLEdBQUcsU0FBUywyQkFBMkIsR0FBRztBQUM1QyxrQkFBTSxPQUFPLEdBQUcsU0FBUyxFQUFFLE1BQU0sZUFBZSxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUc7QUFDOUQsbUJBQU8sS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLENBQUM7QUFBQSxVQUMvQjtBQUNBLGNBQUksR0FBRyxTQUFTLG1CQUFtQixHQUFHO0FBQ3BDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixtQkFBTyxHQUFHLFNBQVMsRUFBRSxNQUFNLGVBQWUsRUFBRSxDQUFDLEVBQUUsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFNBQVM7QUFBQSxVQUN4RTtBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BaUJELGdCQUFnQjtBQUFBLFFBQ2QsU0FBUztBQUFBO0FBQUEsUUFDVCxTQUFTO0FBQUE7QUFBQSxRQUNULFdBQVc7QUFBQTtBQUFBLFFBQ1gsV0FBVztBQUFBO0FBQUEsUUFDWCxrQkFBa0I7QUFBQTtBQUFBLFFBQ2xCLEtBQUs7QUFBQSxNQUNQLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULE1BQU07QUFBQTtBQUFBLFFBQ04sVUFBVTtBQUFBLFFBQ1YsTUFBTTtBQUFBO0FBQUEsUUFDTixZQUFZO0FBQUEsTUFDZCxDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFDQSxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxXQUFXO0FBQUEsSUFDdkI7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGVBQWUsQ0FBQztBQUFBLElBQ2xCO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ3REO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsdUJBQXVCO0FBQUE7QUFBQSxNQUN2QixjQUFjO0FBQUE7QUFBQSxNQUNkLFFBQVE7QUFBQTtBQUFBLE1BQ1IsZUFBZTtBQUFBLE1BQ2YsV0FBVztBQUFBO0FBQUEsTUFDWCxlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxlQUFlO0FBQUEsUUFDakI7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxVQUNOLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
