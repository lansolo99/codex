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
  }
}
