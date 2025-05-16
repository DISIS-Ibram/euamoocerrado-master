var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = require('./webpack.config.js');    // inherit from the main config file
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// disable the hot reload
module.exports.entry =  __dirname + '/src/index.js';

//module.exports.devServer = {};  // doesn't seem to do anything
//module.exports.devtool = 'cheap-module-source-map'; // doesn't seem to do anything
 module.exports.devtool = ""
// compress the js file
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
    // new webpack.optimize.DedupePlugin(), //dedupe similar code 
    // new webpack.optimize.UglifyJsPlugin(), //minify everything
    // new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 

    // new webpack.optimize.UglifyJsPlugin({
    //     comments: false,
    //     minimize:true,
    // })
];

// module.exports.resolve = {
//     extensions: ['', '.js', '.jsx'],
//     "alias": {
//       "react": "preact-compat",
//       "react-dom": "preact-compat"
//     }
//   }
//   module.exports.devServer = {
//     historyApiFallback: true,
//     contentBase: './public'
//   }

// export css to a separate file
// module.exports.module.loaders[1] = {
//     test: /\.scss$/,
//     loader: ExtractTextPlugin.extract('css!sass'),
// };

// module.exports.plugins.push(new ExtractTextPlugin('../css/main.css'));