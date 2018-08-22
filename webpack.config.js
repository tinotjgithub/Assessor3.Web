'use strict';
var colors = require('colors');
var path = require('path');
var webpack = require('webpack');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var WebpackCleanupPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var packageJson = require('./package.json');

var vendorDependencies = Object.keys(packageJson['dependencies']);
var isDebugBuild = process.argv.indexOf('-d') !== -1;
var buildMode = isDebugBuild === true ? JSON.stringify('development') : JSON.stringify('production');

// Extract the style sheets into a dedicated file for production use.
const extractLess = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development",
    allChunks: true
});

var config = {

    stats: {
        colors: true,
        children: false,
        publicPath: true,
        chunks: false,
        modules: false,
    },
    output: {
        path: path.resolve(__dirname, 'build/generated'),
        publicPath: './build/generated/',
        filename: '[name].[chunkhash].js',
        chunkFilename: '[id].[name].[chunkhash].js'
    },
    target: 'web',
    entry: {
        main: './src/app/app.tsx',
        vendor: vendorDependencies, // ['react','react-dom' etc.....]
    },

    module: {
        // loaders -> rules in webpack 2
        rules: [


            // Transpiling the less files to css.
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            // Loader for fonts
            {
                test: /\.(ttf|eot|woff2?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=[hash].[ext]&publicPath=./'
            },

            {
                // Existing webpack version 1 confiuration will not work in webpack 2. For more details 
                // check this link.The old version show a lots of deprecated warnings without a clear way to fix them.
                // https://github.com/tcoopman/image-webpack-loader/issues/68#issuecomment-275848595
                // https://stackoverflow.com/questions/42206190/webpack-2-warning-in-png-svg-deprecated-configure-optipngs-optimizatio

                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: ['file-loader?hash=sha512&digest=hex&name=[hash].[ext]&publicPath=./', {
                    loader: 'image-webpack-loader',
                    query: {
                        mozjpeg: {
                            progressive: true,
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        optipng: {
                            optimizationLevel: 7,
                        },
                        pngquant: {
                            quality: '75-90',
                            speed: 3,
                        },
                    },
                }],
                exclude: /node_modules/,
                include: __dirname,
            },

            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                //loader: 'happypack/loader?id=ts'
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.json$/,
                exclude: ["resources"],
                loader: "json-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.less', '.css', '.json'],
        // to avoid the Can't resolve './locale' warning due to the moment plugin
        alias: {
            moment$: 'moment/moment.js',
         }
    },
    plugins: [
        // Exporting vendor bundle like react, react-dom into a seperate file. 
        new webpack.optimize.CommonsChunkPlugin({
            filename: 'vendor-bundle.[chunkhash].js',
            names: 'vendor',
            minimize: true,
            minChunks: Infinity
        }),

        extractLess, // Extracting CSS from less files. See the definition given above.

        // type checking and tslint plugin.
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
            watch: ['./src', './tests'], // optional but improves performance (less stat calls)
            colors: true
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /node_modules/,
            // add errors to webpack instead of warnings
            failOnError: true
        }),

        // Create HTML file that includes reference to bundled JS.
        new HtmlWebpackPlugin({
            template: 'template.html',
            favicon: 'favicon.ico',
            filename: path.resolve(__dirname, 'index.html'),
            minify: {
                removeComments: false,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true,

        })
    ]
};

console.log(colors.blue('Build Mode : ' + buildMode.toUpperCase()));
// Production Build
if (isDebugBuild === false) {
    // Generate a source map to allow debugging of original source files rather
    // than the compiled webpack output
    config.devtool = 'source-map';

    config.module.rules.push(
        {
            enforce: 'pre',
            test: /\.js$/,
            loader: 'source-map-loader',
            exclude: [
                '/node_modules/'
            ]
        }
    );

    config.plugins.push(

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        // Setting production build
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')      // Reduces 78 kb on React library
            }
        }),

        new webpack.optimize.OccurrenceOrderPlugin(),

        // Optimising the js files.
        new webpack.optimize.UglifyJsPlugin({
            // more info: http://lisperator.net/uglifyjs/compress
            compress: {
                sequences: true,  // join consecutive statemets with the “comma operator”
                properties: true,  // optimize property access: a["foo"] → a.foo
                dead_code: true,  // discard unreachable code
                drop_debugger: true,  // discard “debugger” statements
                unsafe: false, // some unsafe optimizations (see below)
                conditionals: true,  // optimize if-s and conditional expressions
                comparisons: true,  // optimize comparisons
                evaluate: true,  // evaluate constant expressions
                booleans: true,  // optimize boolean expressions
                loops: true,  // optimize loops
                unused: true,  // drop unused variables/functions
                hoist_funs: true,  // hoist function declarations
                hoist_vars: false, // hoist variable declarations
                if_return: true,  // optimize if-s followed by return/continue
                join_vars: true,  // join var declarations
                cascade: true,  // try to cascade `right` into `left` in sequences
                side_effects: true,  // drop side-effect-free statements
                warnings: false,  // warn about potentially dangerous optimizations/code            
            },
            sourceMap: true,
            minimize: true,
            mangle: {
                keep_fnames: true
            },
            minChunks: Infinity,
            output: {
                comments: false
            }
        })
    );
}
else // Development mode building.
{
    // Enabling the watch option for development.
    config.watch = true;
    // To enhance the debugging process. More info: https://webpack.js.org/configuration/devtool/
    config.devtool = 'eval-source-map';
    config.watchOptions =
        {
            aggregateTimeout: 1000, // in ms
            // aggregates multiple changes to a single rebuild

            poll: true,
            // enables polling mode for watching
            // must be used on filesystems that doesn't notify on change
            // i. e. nfs shares
        };
    config.module.rules.push(
        // Once TypeScript is configured to output source maps we need to tell webpack
        // to extract these source maps and pass them to the browser,
        // this way we will get the source file exactly as we see it in our code editor.
        {
            enforce: 'pre',
            test: /\.js$/,
            loader: 'source-map-loader',
            exclude: '/node_modules/'
        },
        {
            enforce: 'pre',
            test: /\.tsx?$/,
            use: "source-map-loader",
            exclude: '/node_modules/'
        }
    );

    config.plugins.unshift(
        // Enabling the development mode.

        new WebpackCleanupPlugin(['build/generated/*.*'], {
            exclude: ['synchronisers', 'tinymce'],
            watch: false //dont remove files on every watch
        }),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')      // Reduces 78 kb on React library
            },
            'DEBUG': true,
            '__DEVTOOLS__': true
        })
    );

}

// Exporting config module.
module.exports = config;