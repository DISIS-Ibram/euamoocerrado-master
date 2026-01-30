// http://webpack.github.io/docs/configuration.html
var app_root = 'src';
var CopyWebpackPlugin = require('copy-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var path = require('path');
var webpack = require("webpack");
const nib = require('nib');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    cache: true,
    devtool: "source-map",

    entry: [
        path.join(__dirname, app_root, 'index.js'),
    ],

    output: {
        path: path.join(__dirname, 'public/js'),
        publicPath: 'js/',
        filename: 'bundle.js',
        chunkFilename: 'bundle.js',
        library: '[name]'
    },

    externals: {
        lodash: {
            commonjs: "lodash",
            amd: "lodash",
            root: "_"
        }
    },

    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        alias: { moment: 'moment' },
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [path.join(__dirname, "src")],
                query: {
                    cacheDirectory: true,
                    presets: ['es2015'],
                    plugins: [
                        "transform-object-rest-spread",
                        "transform-class-properties",
                        "transform-decorators-legacy",
                        "lodash"
                    ]
                }
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'stylus-loader',
                        options: {
                            use: [nib()],
                            import: ['~nib/index.styl']
                        }
                    }
                ],
            }
        ],
    },

    plugins: [
        // 🔑 Define ambiente de produção (sem -p)
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        // 🔑 UGLIFY CONTROLADO (ECMA 5)
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                ecma: 5,
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                }
            }
        }),

        new webpack.ProvidePlugin({
            React: "react",
            JSONTree: 'react-json-tree'
        }),

        new LodashModuleReplacementPlugin(),

        new webpack.DllReferencePlugin({
            context: path.join(__dirname, "src"),
            manifest: require("./dll/vendor-manifest.json")
        }),

        new CopyWebpackPlugin([
            { from: 'src/images', to: 'public/images' },
            { from: 'src/themes/dist', to: 'public/themes' }
        ])
    ]
};
