const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const baseConfig = require("./webpack.config.js");

module.exports = {
  ...baseConfig,

  mode: "production",

  devtool: false,

  entry: path.resolve(__dirname, "src/index.js"),

  output: {
    path: path.resolve(__dirname, "public/js"),
    publicPath: "js/",
    filename: "bundle.[contenthash].js",
    chunkFilename: "bundle.[contenthash].js",
    clean: true, // limpa a pasta antes de gerar os arquivos
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true, // remove console.log
          },
        },
      }),
    ],
  },

  module: {
    rules: [
      ...baseConfig.module.rules.filter(rule => rule.test.toString() !== /\.scss$/.toString()),

      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      JSONTree: "react-json-tree",
    }),

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
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

    new MiniCssExtractPlugin({
      filename: "../css/main.[contenthash].css",
    }),
  ],
};
