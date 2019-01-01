const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {

    devtool: 'cheap-module-eval-source-map',
    // historyApiFallback: true,
    output: {
        pathinfo: true,
        filename: '[name].js',
        publicPath: '/',
    },

    devServer: {
        host: '0.0.0.0',
        historyApiFallback: true
    },

});