var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        vendor: [path.join(__dirname, "src", "vendors.js")]
    },
    output: {
        path: path.join(__dirname, "public", "dll"),
        filename: "dll.[name].js",
        library: "[name]"
    },
    // resolve:{
    //     alias:{moment: 'moment/src/moment'}
    // },
    externals:["lodash"],
    plugins: [

//    new webpack.DefinePlugin({ // <-- key to reducing React's size
//       'process.env': {
//         'NODE_ENV': JSON.stringify('production')
//       }
//     }),
        new webpack.DllPlugin({
            name: "[name]",  //mesmo nome que precisa estar no outro webpack em output.library
            path: path.join(__dirname, "dll", "[name]-manifest.json"),
            context: path.resolve(__dirname,"src" )
        }),
        // new webpack.optimize.OccurenceOrderPlugin(), //nao precisa mais no webpack 2
        
        //    new webpack.optimize.UglifyJsPlugin({comments:false}), //minify everything
        //    new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
    ],
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    }
};
