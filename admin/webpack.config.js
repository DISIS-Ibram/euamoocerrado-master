const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js',
    publicPath: '/js/',
  },



  // resolve: {
  //   alias: {
  //     components: path.resolve(__dirname, 'src/components/'),
  //     util: path.resolve(__dirname, 'src/util/'),
  //     models: path.resolve(__dirname, 'src/models/'),
  //     actions: path.resolve(__dirname, 'src/actions/'),
  //   },
  //   extensions: ['.js', '.jsx'],
  // },


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
