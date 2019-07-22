const path = require('path');
const config = require('./config/index');
//4.0 vue-loader需要这个
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}


function assetsPath (_path) {
  const assetsSubDirectory = config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
}

module.exports = {
  entry: {
    main: process.env.NODE_ENV == 'production' ? './src/components/index.js' : './src/main.js'
  },
  output: {
    path: process.env.NODE_ENV == 'production' ? config.build.assetsRoot : config.dev.assetsRoot
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: [{
          loader: 'vue-loader',
          options: {
            loader: {
              scss: 'style-loader!css-loader'
            }
          },
        },
        {
          loader: 'iview-loader',
          options: {
            prefix: false
          }
        }
        ],
        include: [
          resolve('src'),
          resolve('node_modules/iview/src')
        ]
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader' // loader 由下往上依次开始处理
        ]
      },
      {
          test: /\.css$/,
          use: [
              'style-loader',
              'css-loader'
          ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src')
        ]
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[path][name].[hash:8].[ext]'
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(html|tpl)$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  }
};
