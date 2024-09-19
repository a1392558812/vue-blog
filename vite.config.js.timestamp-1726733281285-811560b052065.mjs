// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/Awen/vue-blog/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Awen/vue-blog/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/Awen/vue-blog/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueDevTools from "file:///D:/Awen/vue-blog/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import viteCompression from "file:///D:/Awen/vue-blog/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///D:/Awen/vue-blog/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import inject from "file:///D:/Awen/vue-blog/node_modules/@rollup/plugin-inject/dist/es/index.js";
import { chunkSplitPlugin } from "file:///D:/Awen/vue-blog/node_modules/vite-plugin-chunk-split/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/Awen/vue-blog/vite.config.js";
var vite_config_default = defineConfig((config) => {
  console.log("config", config);
  const plugins = [
    vue(),
    vueJsx(),
    vueDevTools(),
    inject({
      $: "jquery",
      jQuery: "jquery",
      "windows.jQuery": "jquery"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBd2VuXFxcXHZ1ZS1ibG9nXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxBd2VuXFxcXHZ1ZS1ibG9nXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Bd2VuL3Z1ZS1ibG9nL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xyXG5pbXBvcnQgaW5qZWN0IGZyb20gJ0Byb2xsdXAvcGx1Z2luLWluamVjdCdcclxuaW1wb3J0IHsgY2h1bmtTcGxpdFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWNodW5rLXNwbGl0J1xyXG4vLyBpbXBvcnQgbGVnYWN5IGZyb20gJ0B2aXRlanMvcGx1Z2luLWxlZ2FjeSdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoY29uZmlnKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ2NvbmZpZycsIGNvbmZpZylcclxuICBjb25zdCBwbHVnaW5zID0gW1xyXG4gICAgdnVlKCksXHJcbiAgICB2dWVKc3goKSxcclxuICAgIHZ1ZURldlRvb2xzKCksXHJcbiAgICBpbmplY3Qoe1xyXG4gICAgICAkOiAnanF1ZXJ5JyxcclxuICAgICAgalF1ZXJ5OiAnanF1ZXJ5JyxcclxuICAgICAgJ3dpbmRvd3MualF1ZXJ5JzogJ2pxdWVyeSdcclxuICAgIH0pXHJcbiAgXVxyXG4gIGlmIChjb25maWcubW9kZSA9PT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICBwbHVnaW5zLnB1c2goXHJcbiAgICAgIGNodW5rU3BsaXRQbHVnaW4oe1xyXG4gICAgICAgIHN0cmF0ZWd5OiAndW5idW5kbGUnLCAvLyBcdTUyMDZcdTUyNzJcdTc2ODRcdTdCNTZcdTc1NjVcclxuICAgICAgICBjdXN0b21TcGxpdHRpbmc6IHt9LFxyXG4gICAgICAgIGN1c3RvbUNodW5rOiAoeyBpZCB9KSA9PiB7XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9AdnVlLycpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVxyXG4gICAgICAgICAgICByZXR1cm4gbGlzdFswXSArICctJyArIGxpc3RbMV1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0B2dWUtb2ZmaWNlLycpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVxyXG4gICAgICAgICAgICByZXR1cm4gbGlzdFswXSArICctJyArIGxpc3RbMV1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkLnRvU3RyaW5nKCkuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpWzBdLnRvU3RyaW5nKClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICAvKiBcclxuICAgICAgLy8gXHU2NTNFXHU1RjAzXHU1MTdDXHU1QkI5XHU0RjIwXHU3RURGXHU2RDRGXHU4OUM4XHU1NjY4XHJcbiAgICAgIGxlZ2FjeSh7XHJcbiAgICAgICAgdGFyZ2V0czogW1xyXG4gICAgICAgICAgJ2xhc3QgMiB2ZXJzaW9ucycsXHJcbiAgICAgICAgICAnaU9TID49IDEwJyxcclxuICAgICAgICAgICdBbmRyb2lkID49IDYnLFxyXG4gICAgICAgICAgJ0Nocm9tZSA+PSA0OScsXHJcbiAgICAgICAgICAnU2FmYXJpID49IDEwJyxcclxuICAgICAgICAgICdTYW1zdW5nID49IDUnLFxyXG4gICAgICAgICAgJ09wZXJhTW9iaWxlID49IDQ2JyxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGFkZGl0aW9uYWxMZWdhY3lQb2x5ZmlsbHM6IFsncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJ10sXHJcbiAgICAgICAgcmVuZGVyTGVnYWN5Q2h1bmtzOiB0cnVlLFxyXG4gICAgICAgIHBvbHlmaWxsczogdHJ1ZVxyXG4gICAgICB9KSwgKi9cclxuICAgICAgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgICB2ZXJib3NlOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTU3MjhcdTYzQTdcdTUyMzZcdTUzRjBcdThGOTNcdTUxRkFcdTUzOEJcdTdGMjlcdTdFRDNcdTY3OUNcclxuICAgICAgICBkaXNhYmxlOiBmYWxzZSwgLy8gXHU2NjJGXHU1NDI2XHU3OTgxXHU3NTI4XHU1MzhCXHU3RjI5XHJcbiAgICAgICAgYWxnb3JpdGhtOiAnZ3ppcCcsIC8vIFx1NTM4Qlx1N0YyOVx1N0I5N1x1NkNENVxyXG4gICAgICAgIHRocmVzaG9sZDogMTAyNCwgLy8gXHU2NTg3XHU0RUY2XHU1OTI3XHU1QzBGXHU5NjA4XHU1MDNDXHVGRjBDXHU1QzBGXHU0RThFXHU4QkU1XHU1MDNDXHU3Njg0XHU2NTg3XHU0RUY2XHU1QzA2XHU0RTBEXHU0RjFBXHU4OEFCXHU1MzhCXHU3RjI5XHJcbiAgICAgICAgZGVsZXRlT3JpZ2luRmlsZTogZmFsc2UsIC8vIFx1NjYyRlx1NTQyNlx1NTIyMFx1OTY2NFx1NTM5Rlx1NjU4N1x1NEVGNlxyXG4gICAgICAgIGV4dDogJy5neidcclxuICAgICAgfSksXHJcbiAgICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICAgIG9wZW46IHRydWUsIC8vIFx1NkNFOFx1NjEwRlx1OEZEOVx1OTFDQ1x1ODk4MVx1OEJCRVx1N0Y2RVx1NEUzQXRydWVcdUZGMENcdTU0MjZcdTUyMTlcdTY1RTBcdTY1NDhcdUZGMENcdTU5ODJcdTY3OUNcdTVCNThcdTU3MjhcdTY3MkNcdTU3MzBcdTY3MERcdTUyQTFcdTdBRUZcdTUzRTNcdUZGMENcdTVDMDZcdTU3MjhcdTYyNTNcdTUzMDVcdTU0MEVcdTgxRUFcdTUyQThcdTVDNTVcdTc5M0FcclxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcclxuICAgICAgICBmaWxlOiAnc3RhdHMuaHRtbCcsIC8vXHU1MjA2XHU2NzkwXHU1NkZFXHU3NTFGXHU2MjEwXHU3Njg0XHU2NTg3XHU0RUY2XHU1NDBEXHJcbiAgICAgICAgYnJvdGxpU2l6ZTogdHJ1ZVxyXG4gICAgICB9KVxyXG4gICAgKVxyXG4gIH1cclxuICByZXR1cm4ge1xyXG4gICAgYmFzZTogJy4vJyxcclxuICAgIHBsdWdpbnMsXHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgJ3Byb2Nlc3MuZW52Jzoge31cclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyBjaHVuayBcdTU5MjdcdTVDMEZcdThCNjZcdTU0NEFcdTc2ODRcdTk2NTBcdTUyMzZcclxuICAgICAgY3NzQ29kZVNwbGl0OiB0cnVlLCAvLyBcdTU0MkZcdTc1MjggQ1NTIFx1NEVFM1x1NzgwMVx1NjJDNlx1NTIwNlxyXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLCAvLyBcdTU0MkZcdTc1MjggVGVyc2VyIFx1NTM4Qlx1N0YyOVx1NkRGN1x1NkRDNlx1NEVFM1x1NzgwMVxyXG4gICAgICBtb2R1bGVQcmVsb2FkOiBmYWxzZSxcclxuICAgICAgc291cmNlbWFwOiBmYWxzZSwgLy8gXHU3OTgxXHU3NTI4XHU2MjE2XHU1NDJGXHU3NTI4XHU3NTFGXHU2MjEwXHU3Njg0IFNvdXJjZU1hcFxyXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XHJcbiAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSxcclxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFx1OTAxQVx1OEZDN1x1OTE0RFx1N0Y2RVx1NTIwNlx1NTI3Mlx1N0I1Nlx1NzU2NVx1NEYxOFx1NTMxNlx1NEVFM1x1NzgwMVx1NTIwNlx1NTI3MlxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnc3RhdGljL2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdzdGF0aWMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJc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
