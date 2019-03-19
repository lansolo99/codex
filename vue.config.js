const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/variables.scss'),
        path.resolve(__dirname, 'src/styles/globals.scss'),
        path.resolve(__dirname, 'src/styles/icons.scss'),
        path.resolve(__dirname, 'src/styles/mixins.scss')
      ]
    }
  },
  pwa: {
    name: 'Weekx',
    themeColor: '#FFBA4C',
    msTileColor: '#FFBA4C',
    // Workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js'
    }
  },
  baseUrl: '/',
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '~': path.resolve(__dirname, 'src/'),
        '@': path.resolve('src/'),
        modernizr$: path.resolve(__dirname, '.modernizrrc')
      }
    }
  },
  chainWebpack (config) {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          ...options.compilerOptions,
          preserveWhitespace: true
        }
      }))
    config.module
      .rule('modernizr')
      .test(/\.modernizrrc$/)
      .use('webpack-modernizr-loader')
      .loader('webpack-modernizr-loader')
  }
}
