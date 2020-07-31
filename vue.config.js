'use strict'
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'poster'

// All configuration item explanations can be find in https://cli.vuejs.org/config/
const webpackConfig = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: './',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: '8001',
    open: true
    // proxy: {
    // '/api': {
    //   target: '',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/api': ''
    //   }
    // }
    // }
  },
  configureWebpack: {
    name: name,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        '@': resolve('src'),
        'poster': resolve('src/views/posterEditor')
      }
    },
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css/,
        threshold: 10240
        // deleteOriginAssets:false
      })
    ]
  },
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: ['./src/styles/mixin.scss', './src/styles/variables.scss']
        })
        .end()
    })
  }
}

module.exports = webpackConfig
