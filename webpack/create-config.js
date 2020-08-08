const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const fs = require('fs');
const moduleRules = require('./module-rules');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CaseSensitivePathPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');

/**
 *
 * @param {*} type client | server
 * @param {*} isDev
 */
module.exports = (type, isDev, envConfig) => {
    const isServer = type === 'server';
    isDev = !!isDev;
    const nodeEnv = isDev ? 'development' : 'production';
    const deployEnv = isDev ? 'dev' : 'prd';

    const spaClientFolder = fs.existsSync(path.resolve(cwd, 'src/client')) ? '/client' : '';

    const plugins = [
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            'process.env.DEPLOY_ENV': JSON.stringify(deployEnv),
        }),
        new CleanWebpackPlugin(),
        new CaseSensitivePathPlugin(),
    ];
    if (envConfig.sysType === 'ssr') {
        plugins.push(new LoadablePlugin());
    } else if (envConfig.sysType === 'spa') {
        plugins.push(
            new HtmlWebpackPlugin({
                template: path.resolve(cwd, 'webpack/index.html'),
                filename: 'index.html',
            }),
        );
    }
    if (isDev) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NamedModulesPlugin());
        plugins.push(
            new WebpackBar({
                color: !isServer ? '#f56be2' : '#c065f4',
                name: !isServer ? 'client' : 'server',
            }),
        );
    } else {
        plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
                chunkFilename: 'chunks/[id].[contenthash].css',
            }),
        );
    }

    const curConfig = {
        'spa-client': {
            target: 'web',
            entry: path.resolve(cwd, `src${spaClientFolder}/app`),
            output: {
                path: path.resolve(cwd, `dist${spaClientFolder}`),
                filename: `js/[name].[${isDev ? 'hash' : 'contentHash'}].js`,
                chunkFilename: `chunks/[name].[${isDev ? 'hash' : 'contentHash'}].js`,
                publicPath: '/',
            },
        },
        'ssr-client': {
            target: 'web',
            entry: path.resolve(cwd, `src/client/app`),
            output: {
                path: path.resolve(cwd, `dist/client`),
                filename: `js/[name].[${isDev ? 'hash' : 'contentHash'}].js`,
                publicPath: isDev ? `http://${envConfig.host}:${envConfig.clientPort}/` : '/',
            },
        },
        'ssr-server': {
            target: 'node',
            entry: path.resolve(cwd, `src/server/app`),
            output: {
                path: path.resolve(cwd, `dist/server`),
                filename: '[name].js',
                publicPath: '/',
            },
        },
    }[`${envConfig.sysType}-${type}`];

    return {
        target: curConfig.target,
        mode: isDev ? 'development' : 'production',
        entry: curConfig.entry,
        output: curConfig.output,
        resolve: {
            extensions: ['.ts', '.tsx', '.scss', '.js', '.jsx', '.sass'],
            alias: {
                '@thyiad/util': '@thyiad/util',
                '@server': path.resolve(cwd, 'src/server'),
                '@client': path.resolve(cwd, 'src/client'),
                '@': path.resolve(cwd, 'src/client'),
            },
        },
        externals: isServer
            ? [
                  nodeExternals({
                      allowlist: [
                          /\.(eot|woff|woff2|ttf|otf)$/,
                          /\.(svg|png|jpg|jpeg|gif|ico)$/,
                          /\.(mp4|mp3|ogg|swf|webp)$/,
                          /\.(css|scss|sass|sss|less)$/,
                          /antd\/.*?\/style.*?/,
                      ].filter((x) => x),
                  }),
              ]
            : [],
        module: {
            rules: moduleRules(isServer, isDev),
        },
        plugins,
        watch: isDev,
        devServer: isDev
            ? {
                  stats: 'errors-only', //'errors-warnings',
                  clientLogLevel: 'silent',
                  contentBase: path.resolve(cwd, `src${spaClientFolder}`),
                  historyApiFallback: true,
                  compress: true,
                  host: envConfig.host,
                  port: envConfig.clientPort,
                  hot: true,
                  open: false,
                  quiet: true,
                  overlay: true,
                  watchOptions: {
                      ignored: /node_modules/, // 监听过多文件会占用cpu、内存，so，可以忽略掉部分文件
                      aggregateTimeout: 200, // 默认200，文件变更后延时多久rebuild
                      poll: false, // 默认false，如果不采用watch，那么可以采用poll（轮询）
                  },
                  writeToDisk: true,
                  headers: {
                      'Access-Control-Allow-Credentials': true,
                      'Access-Control-Allow-Headers': 'X-Requested-With,ownerId,Content-Type',
                      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
                      'Access-Control-Allow-Origin': '*',
                  },
              }
            : undefined,
        devtool: isDev ? 'inline-source-map' : undefined,
        optimization: isServer
            ? undefined
            : {
                  splitChunks: {
                      cacheGroups: {
                          libs: {
                              test: /node_modules/, // 指定是node_modules下的第三方包
                              chunks: 'initial',
                              name: 'vendor', // 打包后的文件名，任意命名
                          },
                      },
                  },
              },
    };
};
