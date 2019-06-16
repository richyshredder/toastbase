const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxPlugin = require('workbox-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');
const howler = path.join(__dirname, '/node_modules/howler/dist/howler.min.js');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src/app.ts')
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve('./build'),
        publicPath: '/'
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: './assets',
                to: './assets'
            }
        ]),
        new JavaScriptObfuscator({
            rotateUnicodeArray: true
        }, ['vendor.bundle.js']),
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
        }),
        new WorkboxPlugin.GenerateSW(),
        new WebpackPwaManifest({
            name: 'Mystand First Hackathon',
            short_name: 'Mystand First Hackathon',
            description: 'Mystand First Hackathon',
            background_color: '#ffffff',
            theme_color: '#ffffff',
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            icons: [
              {
                src: path.resolve('assets/icon512.png'),
                sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
              },
              {
                src: path.resolve('assets/icon1024.png'),
                size: '1024x1024' // you can also use the specifications pattern
              }
            ]
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        },
        minimizer: [new UglifyJsPlugin()],
    },
    module: {
        rules: [
            { test: /\.ts?$/, loader: 'ts-loader', exclude: '/node_modules/' },
            { test: /pixi\.js/, loader: 'expose-loader?PIXI' },
            { test: /phaser-arcade-physics\.js/, loader: 'expose-loader?Phaser' },
            { test: /howler\.min\.js/, loader: 'expose-loader?Howler' },
            { test: /p2\.js$/, loader: 'expose-loader?p2' }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2,
            'howler': howler
        }
    }
};