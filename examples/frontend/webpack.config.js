const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const isDev = process.env.NODE_ENV === 'dev';

const sourceMap = isDev;

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'src');
const dirAssets = `${dirApp}/assets`;
const appHtmlTitle = 'sockets lab';

module.exports = {
    mode: 'development',
    entry: {
        app: path.join(dirApp, 'index')
    },
    output: {
        path: __dirname + "/dist",
        filename: "bundle.name.js"
    },
    resolve: {
        modules: [
            dirNode,
            dirApp,
            dirAssets
        ],
        alias: {
            '~': dirApp
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            IS_DEV: isDev
        }),
        new HtmlWebpackPlugin({
            title: appHtmlTitle,
            filename: 'index.html',
            template: `./src/html/index.html`,
            hash: true,
            requires: ['app']
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-object-rest-spread']
                  }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap
                        }
                    },
                ]
            },
            // CSS / SASS
            {
                test: /\.scss/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap,
                            includePaths: [dirAssets]
                        }
                    }
                ]
            },
            // IMAGES
            {
                test: /\.(jpe?g|png|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    }
}