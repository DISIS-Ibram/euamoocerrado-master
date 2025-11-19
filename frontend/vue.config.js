// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//     .BundleAnalyzerPlugin;
// module.exports = {
//     lintOnSave: false,
//     configureWebpack: {
//         // plugins: [new BundleAnalyzerPlugin()]
//     }
// };


// hotreload
module.exports = {
  lintOnSave: false,

  devServer: {
    host: "0.0.0.0",
    port: 8080,
    hot: true,
    liveReload: true,

    watchOptions: {
      poll: 1000,
      ignored: /node_modules/
    }
  }
};
