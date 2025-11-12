var app_root = "src"; // the app root folder: src, src_users, etc
var CopyWebpackPlugin = require("copy-webpack-plugin");
var LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
var path = require("path");
var publicPath = __dirname + "/public/";
var webpack = require("webpack");

const nib = require("nib");

module.exports = {
  cache: true,
  devtool: "source-map", //inline-source-map",
  entry: [__dirname + "/" + app_root + "/index.js"],

  output: {
    path: __dirname + "/public/js",
    publicPath: "js/",
    filename: "bundle.js",
    chunkFilename: "bundle.js",
    // pathinfo:true,
    library: "[name]",
  },
  externals: {
    lodash: {
      commonjs: "lodash",
      amd: "lodash",
      root: "_", // indicates global variable
    },
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: { moment: "moment" },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        include: [
          path.join(__dirname, "src"), //important for performance!
        ],
        query: {
          cacheDirectory: true, //important for performance
          presets: ["es2015"],
          plugins: [
            "transform-object-rest-spread",
            "transform-class-properties",
            "transform-decorators-legacy",
            "lodash",
          ],
        },
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        // https://github.com/jtangelder/sass-loader
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        // https://github.com/jtangelder/sass-loader
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"],
      },
      {
        test: /\.styl$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "stylus-loader",
            options: {
              use: [nib()],
              import: ["~nib/index.styl"], // imports into styl files
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: __dirname + "/public",
    host: "0.0.0.0",
    port: 8080,
    clientLogLevel: "info",
    hot: false,
    inline: false,
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      JSONTree: "react-json-tree",
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "src"),
      manifest: require("./dll/vendor-manifest.json"),
    }),

    new CopyWebpackPlugin([
      { from: "src/images", to: "public/images" },
      { from: "src/themes/dist", to: "public/themes" },
    ]),
  ],
};
