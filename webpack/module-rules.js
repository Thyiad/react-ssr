const miniCssExtract = require('mini-css-extract-plugin');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const pix2rem = require('postcss-pxtorem');
const sass = require('sass');
const webpack = require('webpack');

/** options: isDev, useCssModule, miniCssExtractLoader */
const getCssLoaders = (options) => {
    return [
        {
            loader: options.isDev ? 'style-loader' : miniCssExtract.loader,
        },
        {
            loader: 'css-loader',
            options: {
                modules: !!options.useCssModule,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: (loader) => {
                    const targetPlugins = [
                        postcssImport({ root: loader.resourcePath }),
                        // pix2rem({ propList: ['*'], rootValue: 100 }),
                        postcssPresetEnv(),
                    ];

                    if (!options.isDev) {
                        targetPlugins.push(cssnano());
                    }

                    return targetPlugins;
                },
            },
        },
    ];
};
module.exports = (isServer, isDev) => {
    return [
        {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /mode_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            ],
        },
        {
            test: /\.css$/,
            use: isServer ? 'null-loader' : getCssLoaders({ useCssModule: false, isDev: isDev }),
        },
        {
            test: /\.scss$/,
            use: isServer
                ? 'null-loader'
                : [
                      ...getCssLoaders({ useCssModule: false, isDev: isDev }),
                      {
                          loader: 'sass-loader',
                          options: {
                              implementation: sass,
                          },
                      },
                  ],
        },
        {
            test: /\.less$/,
            include: /node_modules/,
            use: isServer
                ? 'null-loader'
                : [
                      ...getCssLoaders({ useCssModule: false, isDev: isDev }),
                      {
                          loader: 'less-loader',
                          options: {
                              lessOptions: {
                                  javascriptEnabled: true,
                              },
                          },
                      },
                  ],
        },
        {
            test: /\.less$/,
            exclude: /node_modules/,
            use: isServer
                ? 'null-loader'
                : [
                      ...getCssLoaders({ useCssModule: true, isDev: isDev }), // 如果本地不需要css modules, 可以合并为同一个less配置项
                      {
                          loader: 'less-loader',
                          options: {
                              lessOptions: {
                                  javascriptEnabled: true,
                              },
                          },
                      },
                  ],
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg|ttf)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024, // 5kb
                        name: 'media/[name].[contentHash].[ext]',
                        emitFile: !isServer,
                    },
                },
            ],
        },
        {
            test: /\.(json|mp4)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: 'media/[name].[contentHash].[ext]',
                        emitFile: !isServer,
                    },
                },
            ],
        },
    ];
};
