const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const nib = require('nib');

const app_root = 'src';
const publicPath = path.resolve(__dirname, 'public');

module.exports = {
  mode: 'development', // mude para 'production' no build final
  cache: {
    type: 'filesystem', // cache moderno do Webpack 5
  },
  devtool: 'source-map',
  entry: path.resolve(__dirname, app_root, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'public/js'),
    publicPath: '/js/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    clean: true, // limpa arquivos antigos automaticamente
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      moment: 'moment'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              ['@babel/preset-react', { runtime: 'automatic' }] // React 17+
            ]
          }
        }
      },
      {
        test: /\.svg$/,
        use: ['svg-inline-loader']
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                use: [nib()],
                import: ['~nib/index.styl']
              }
            }
          }
        ]
      }
    ]
  },
  devServer: {
    static: {
      directory: publicPath
    },
    host: '0.0.0.0',
    port: 8080,
    client: {
      logging: 'info'
    },
    hot: true,
    liveReload: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: 'single'
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      JSONTree: 'react-json-tree'
    }),
    new LodashModuleReplacementPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/images', to: path.resolve(__dirname, 'public/images') },
        { from: 'src/themes/dist', to: path.resolve(__dirname, 'public/themes') }
      ]
    })
  ]
};
