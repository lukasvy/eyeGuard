const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = [
    {
        mode  : 'development',
        entry : './src/electron.ts',
        target: 'electron-main',
        module: {
            rules: [{
                test   : /\.ts$/,
                include: /src/,
                use    : [{loader: 'ts-loader'}]
            }, {
                test   : /\.js$/,
                exclude: /node_modules/,
                use    : "babel-loader"
            }, {
                test: /\.(png|jpg|gif)$/,
                use : "url-loader"
            }]
        },
        output: {
            path    : __dirname + '/dist',
            filename: 'electron.js'
        }
    },
    {
        target: "electron-renderer",
        entry : './src/main.js',
        output: {
            path    : __dirname + '/dist',
            filename: "bundle.js"
        },
        module: {
            rules: [
                {
                    test   : /\.js$/,
                    exclude: /node_modules/,
                    use    : "babel-loader"
                },
                {
                    test: /\.vue$/,
                    use : "vue-loader"
                },
                {
                    test: /\.s?css$/,
                    use : ["vue-style-loader", "style-loader", "css-loader", "sass-loader"]
                },
                {
                    test: /\.svg$/,
                    use : "file-loader"
                }
            ]
        },

        resolve: {
            extensions: [".vue", ".js", ".scss"],
            alias     : {
                "@": './src'
            }
        },

        plugins: [
            new VueLoaderPlugin(),

            new webpack.NamedModulesPlugin(),

            new HtmlWebpackPlugin({
                                      template: './src/index.html',
                                      inject  : false
                                  })
        ]
    }
];