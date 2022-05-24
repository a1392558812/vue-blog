const UglifyJsPlugin = require('uglifyjs-webpack-plugin') // 去掉注释
const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启压缩
const { HashedModuleIdsPlugin, ProvidePlugin } = require('webpack')
const path = require('path')
const resolve = (dir) => path.resolve(__dirname, dir)
const isProduction = process.env.NODE_ENV === 'production'

const cdn = {
  // 忽略打包的第三方库
  externals: {
    // vue: 'Vue',
    // vuex: 'Vuex',
    // 'vue-router': 'VueRouter',
    // axios: 'axios'
  },
  // 通过cdn方式使用
  js: [
    // 'https://cdn.jsdelivr.net/npm/vue@3.2.22/dist/vue.global.prod.js',
    // 'https://cdn.jsdelivr.net/npm/vue-router@4.0.12/dist/vue-router.global.prod.js',
    // 'https://cdn.jsdelivr.net/npm/vuex@4.0.2/dist/vuex.global.prod.js',
    // 'https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js'
  ],
  css: []
}

module.exports = {
  publicPath: './', // 基本路径
  assetsDir: 'static',
  productionSourceMap: false, // 去除sourceMap
  configureWebpack: config => {
    const plugins = []
    plugins.push(new ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }))
    if (isProduction) {
      plugins.push(new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false // 去掉注释
          },
          warnings: false,
          compress: {
            drop_console: true,
            drop_debugger: false,
            pure_funcs: ['console.log']// 移除console
          }
        }
      }))
      // 服务器也要相应开启gzip
      plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.(js|css)$/, // 匹配文件名
        threshold: 10000, // 对超过10k的数据压缩
        deleteOriginalAssets: false, // 不删除源文件
        minRatio: 0.8 // 压缩比
      }))
      // 用于根据模块的相对路径生成 hash 作为模块 id, 一般用于生产环境
      plugins.push(new HashedModuleIdsPlugin())
      // 开启分离js
      config.optimization = {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 1000 * 60,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name (module) {
                // 排除node_modules 然后吧 @ 替换为空 ,考虑到服务器的兼容
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                return `npm.${packageName.replace('@', '')}`
              }
            }
          }
        }
      }
      // 取消webpack警告的性能提示
      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积
        maxEntrypointSize: 1000 * 500,
        // 生成文件的最大体积
        maxAssetSize: 1000 * 1000,
        // 只给出 js 文件的性能提示
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
      // 打包时npm包转CDN
      config.externals = cdn.externals
    }

    return { plugins }
  },
  chainWebpack: config => {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
    if (isProduction) {
      // 移除 prefetch 插件
      config.plugins.delete('prefetch')
      // 移除 preload 插件，避免加载多余的资源
      config.plugins.delete('preload')
    }
    config.plugin('html').tap(args => {
      isProduction && (args[0].cdn = cdn)
      args[0].title = 'Awen的博客'
      return args
    })
  }
}
