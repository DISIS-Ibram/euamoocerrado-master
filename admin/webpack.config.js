const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
    publicPath: '/js/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
{
  test: /\.svg$/i,
  type: 'asset/resource',
}

    ]
  },
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 3000,
    open: true
  }
};
