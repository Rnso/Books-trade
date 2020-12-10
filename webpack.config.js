const path = require('path')
const srcDir = path.resolve(__dirname, 'src')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProd = process.env.NODE_ENV === 'production'
var cssDev = ['style-loader', 'css-loader']
var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader'],
    publicPath: '/dist'
})
var cssConfig = isProd ? cssProd : cssDev

module.exports = {
    entry: {
        index: `${srcDir}/index.js`
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "src"),
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: cssConfig
            },
            {
                test: /\.(jpe?g|png|gif|svg|jpg)$/i,
                use: [
                    'file-loader?name=[hash:6].[ext]&outputPath=images/'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new ExtractTextPlugin({
            filename: 'app.css',
            disable: !isProd,
            allChunks: true
        })
    ]
}