const FractalWebpackPlugin = require('fractal-webpack-plugin');
const config =  require('./tasks/config');

module.exports = {
  outputDir: `${config.directories.themeBuildDirectory}/${config.currentWebsite}`,
  filenameHashing: false,
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new FractalWebpackPlugin({
        mode: 'server', // mode: 'build'
        sync: true,
        configPath: './tasks/gulp/fractalfile.js' // defaults to 'fractal.js'
      })
    ]
  },
  chainWebpack: config => {
    config.plugins.delete('html');
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
  },
  css: {
    extract: {
      filename: '[name].css'
    },
    sourceMap: true
  }
}