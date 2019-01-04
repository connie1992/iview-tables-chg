const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const config = require('./config/index');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');


function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

function assetsPath (_path) {
  const assetsSubDirectory = config.build.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
}

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  output: {
    publicPath: config.build.assetsPublicPath,
    filename: assetsPath('iview-tables-chg.js'),
    library: 'iview-tables-chg',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue'
    }
  },
  optimization: {
      minimize: true,
      providedExports: true,
      usedExports: true,
      //识别package.json中的sideEffects以剔除无用的模块，用来做tree-shake
      //依赖于optimization.providedExports和optimization.usedExports
      sideEffects: true,
      //取代 new webpack.optimize.ModuleConcatenationPlugin()
      concatenateModules: true,
      //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。
      noEmitOnErrors: true
      /*提取公共类和第三方库*/
  },
  plugins: [
    new CleanWebpackPlugin(
      ['lib'],
      {
        root: resolve('./'), //根目录
        verbose:  true //开启在控制台输出信息
      }
    )
  ]
});
