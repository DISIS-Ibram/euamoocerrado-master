var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = require('./webpack.config.js');    // inherit from the main config file
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
module.exports.entry =  __dirname + '/src/index.js';

 module.exports.devtool = "source-map"
module.exports.plugins = [
        new webpack.ProvidePlugin({
                    React: "react",
                    JSONTree:'react-json-tree'
        }),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, "src"),
            manifest: require("./dll/vendor-manifest.json")
        }),

      new CopyWebpackPlugin([
            { from: 'src/images', to: 'public/images' },
            { from: 'src/themes/dist', to: 'public/themes' }
      ]),
     new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new LodashModuleReplacementPlugin,
];
