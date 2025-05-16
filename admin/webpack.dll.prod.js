var path = require("path");
var webpack = require("webpack");
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
module.exports = {
    entry: {
        vendor: [path.join(__dirname, "src", "vendors.js")]
    },
    output: {
        path: path.join(__dirname, "public-prod", "dll"),
        filename: "dll.[name].js",
        library: "[name]"
    },
   externals : {
  lodash : {
    commonjs: "lodash",
    amd: "lodash",
    root: "_" // indicates global variable
  }
},
    plugins: [

   new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
        new webpack.DllPlugin({
            name: "[name]",  //mesmo nome que precisa estar no outro webpack em output.library
            path: path.join(__dirname, "dll", "[name]-manifest.json"),
            context: path.resolve(__dirname,"src" )
        }),
        // new webpack.optimize.OccurenceOrderPlugin(), //nao precisa mais no webpack 2
        new LodashModuleReplacementPlugin,
           new webpack.optimize.UglifyJsPlugin({comments:false}), //minify everything
           new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
    ],
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    }
};
