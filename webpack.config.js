const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = [
    {
        mode  : 'development',
        entry : ['@babel/polyfill', './src/electron.ts'],
        target: 'electron-main',
        node  : {
            __dirname : false,
            __filename: false
        },
        module: {
            rules: [{
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
        entry : ['@babel/polyfill', './src/main.js'],
        node  : {
            __dirname : false,
            __filename: false
        },
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
                    test   : /\.s?css$/,
                    use    : ["vue-style-loader", "style-loader", "css-loader", "sass-loader"],
                    include: [
                        path.join(__dirname, 'src'),
                        /node_modules/
                    ],
                },
                {
                    test  : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader?limit=10000&mimetype=application/font-woff"
                },
                {
                    test  : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader"
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use : "url-loader"
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
    },
    {
        target: "electron-renderer",
        entry : ['@babel/polyfill', './src/notificationWindow/main.js'],
        output: {
            path    : __dirname + '/dist',
            filename: "notification-bundle.js"
        },
        node  : {
            __dirname : false,
            __filename: false
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
                    test   : /\.s?css$/,
                    use    : ["vue-style-loader", "style-loader", "css-loader", "sass-loader"],
                    include: [
                        path.join(__dirname, 'src'),
                        /node_modules/
                    ],
                },
                {
                    test: /\.svg$/,
                    use : "file-loader"
                },
                {
                    test  : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader"
                },
                {
                    test  : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader"
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use : "url-loader"
                }
            ],
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
                                      filename: './notification-window.html',
                                      template: './src/notificationWindow/index.html',
                                      inject  : false
                                  })
        ]
    }
];