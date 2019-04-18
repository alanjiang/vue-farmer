var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require("webpack");

var config = {
    entry: {
        main: './main'
    },
    output: {
        path: path.join(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'main.js' //开发用的JS
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader',
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            
            {
            	  test: /\.css$/,
            	  loader: 'style-loader!css-loader'
            },
             
            
            
            
            {
                test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        
        
        new webpack.ProvidePlugin({
          jQuery: "jquery",
          $: "jquery"
        })
    ]
};

module.exports = config;