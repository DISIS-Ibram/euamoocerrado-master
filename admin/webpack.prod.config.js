var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = require('./webpack.config.js');    // inherit from the main config file
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// disable the hot reload
module.exports.entry =  __dirname + '/src/index.js';

 module.exports.devtool = ""
module.exports.plugins = [
        new webpack.ProvidePlugin({
                    React: "react",
                    JSONTree:'react-json-tree'
        }),
          //Typically you'd have plenty of other plugins here as well
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, "src"),
            manifest: require("./dll/vendor-manifest.json")
        }),

        //   new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks 
        
      new CopyWebpackPlugin([
            { from: 'src/images', to: 'public/images' },
            { from: 'src/themes/dist', to: 'public/themes' }
      ]),
    // https://webpack.github.io/docs/list-of-plugins.html
     new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new LodashModuleReplacementPlugin,
];
