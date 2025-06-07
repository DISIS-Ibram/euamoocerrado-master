const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const baseConfig = require("./webpack.config.js");

/**
 * Clona a configuração base e adiciona/modifica as propriedades para dev.
 */
module.exports = {
  ...baseConfig,

  mode: "development",

  entry: path.resolve(__dirname, "src/index.js"),

  devtool: "source-map",

  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "public"),
    },
    host: "0.0.0.0",
    port: 8080,
    hot: true,
    liveReload: false,
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      JSONTree: "react-json-tree",
    }),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),

    new LodashModuleReplacementPlugin(),

    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, "src"),
      manifest: require("./dll/vendor-manifest.json"),
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: "src/images", to: "public/images" },
        { from: "src/themes/dist", to: "public/themes" },
      ],
    }),
  ],
};
