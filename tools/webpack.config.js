require('babel-polyfill');
var path = require('path');
var webpack = require('webpack');

var srcPath = path.join(__dirname, '..', 'chrome', 'scripts');
var buildPath = path.join(__dirname, '..', 'build', 'scripts');
var mapRelativePath = path.join('.', 'maps', '[file].map');

module.exports = {
    entry : {
        content : path.join(srcPath, 'content')
    },
    output : {
        path : buildPath,
        filename: '[name].js',
        sourceMapFilename: mapRelativePath
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    devtool : 'source-map',
    module : {
        loaders : [
            {
                loader : 'babel-loader',
                include : [
                    srcPath,
                ],
                test : srcPath,
                query : {
                    presets : ['es2015']
                }
            }
        ]
    }
};
