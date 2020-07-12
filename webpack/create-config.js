const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const fs = require('fs');
const moduleRules = require('./module-rules');
const envConfig = require('./env-config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CaseSensitivePathPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const WebpackBar = require('webpackbar');
const StartServerPlugin = require('start-server-webpack-plugin');
const childProcess = require('child_process');

/**
 * 
 * @param {*} type client | server
 * @param {*} isDev 
 */
module.exports = (type, isDev) => {
    const isServer = type === 'server';
    isDev = !!isDev;
    const nodeEnv = isDev ? "development" : "production";
    const deployEnv = isDev ? "dev" : "prd";

    const plugins = [
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            'process.env.DEPLOY_ENV': JSON.stringify(deployEnv),
        }),
        new CleanWebpackPlugin(),
        new CaseSensitivePathPlugin(),
        new LoadablePlugin(),
        // new webpack.HotModuleReplacementPlugin(),
    ];
    if (isDev) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NamedModulesPlugin());
        plugins.push(
            new WebpackBar({
                color: !isServer ? '#f56be2' : '#c065f4',
                name: !isServer ? 'client' : 'server',
            })
        );
    }else{
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'chunks/[id].[contenthash].css',
        });
    }

    return {
        target: isServer ? "node" : "web",
        mode: isDev ? "development" : "production",
        // entry: isServer ? ['webpack/hot/poll', path.resolve(cwd, `src/${type}/app`)] : path.resolve(cwd, `src/${type}/app`),
        entry: isServer ? [path.resolve(cwd, `src/${type}/app`)] : path.resolve(cwd, `src/${type}/app`),
        output: {
            path: path.resolve(cwd, `dist/${type}`),
            filename: isServer ? "[name].js" : (isDev ? 'js/[name].[hash].js' : 'js/[name].[contentHash].js'),
            chunkFilename: isDev ? 'chunks/[name].[hash].js' : 'chunks/[name].[contentHash].js',
            publicPath: (!isServer && isDev) ? `http://${envConfig.host}:${envConfig.clientPort}/` : '/',
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.scss', '.js', '.jsx', '.sass'],
            alias: {
                // 'webpack/hot/poll': require.resolve('webpack/hot/poll'),
                "@client": path.resolve(cwd, 'src/client'),
                "@server": path.resolve(cwd, 'src/server'),
            }
        },
        externals: isServer ? [
            nodeExternals({
                whitelist: [
                //   isDev ? 'webpack/hot/poll' : null,
                  /\.(eot|woff|woff2|ttf|otf)$/,
                  /\.(svg|png|jpg|jpeg|gif|ico)$/,
                  /\.(mp4|mp3|ogg|swf|webp)$/,
                  /\.(css|scss|sass|sss|less)$/,
                ].filter(x => x),
              })
        ] : [],
        module: {
            rules: moduleRules(isServer, isDev),
        },
        plugins,
        watch: isDev,
        devServer: (isDev) ? {
            logLevel: 'warn', //不想看到那个complied successfully
            contentBase: path.resolve(cwd, 'src/client'),
            historyApiFallback: true,
            compress: true,
            host: envConfig.host,
            port: envConfig.clientPort,
            hot: true,
            open: false,
            headers: { 'Access-Control-Allow-Origin': '*' },
            watchOptions: {
                ignored: /node_modules/,    // 监听过多文件会占用cpu、内存，so，可以忽略掉部分文件
                aggregateTimeout: 200,  // 默认200，文件变更后延时多久rebuild
                poll: false,    // 默认false，如果不采用watch，那么可以采用poll（轮询）
            },
            before(app) {
                // This lets us open files from the runtime error overlay.
                app.use(errorOverlayMiddleware());
            },
            writeToDisk: true,
        } : undefined,
        devtool: isDev ? "inline-source-map" : undefined,
        optimization: isServer ? undefined : {
            splitChunks: {
                cacheGroups: {
                    libs: {
                        test: /node_modules/, // 指定是node_modules下的第三方包
                        chunks: 'initial',
                        name: 'vendor' // 打包后的文件名，任意命名
                    }
                }
            }
        }
    }
}