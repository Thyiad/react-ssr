const miniCssExtract = require('mini-css-extract-plugin');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const pix2rem = require('postcss-pxtorem');
const sass = require('sass');
const threadLoader = require('thread-loader');

/** options: isDev, useCssModule */
const getCssLoaders = (options) => {
    return [
        // cache-loader 在大开销loaders才开启，否则几乎无性能提升
        // {
        //     loader: 'cache-loader',
        // },
        // thread-loader 无法和 less、sass一起使用：各种报错
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
                postcssOptions: (loaderContext) => {
                    const targetPlugins = [
                        postcssImport({ root: loaderContext.resourcePath }),
                        pix2rem({ propList: ['*'], rootValue: 100, exclude: /node_modules/i }),
                        postcssPresetEnv(),
                    ];
                    if (!options.isDev) {
                        targetPlugins.push(cssnano());
                    }

                    return {
                        plugins: targetPlugins,
                    };
                },
            },
        },
    ].filter((item) => item);
};

module.exports = (isServer, isDev) => {
    // threadLoader预热
    const workerPool = { poolTimeout: isDev ? Infinity : 2000 };
    threadLoader.warmup(workerPool, ['babel-loader']);

    return [
        {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: [
                // {
                //     loader: 'cache-loader',
                // },
                {
                    loader: 'thread-loader',
                    options: workerPool,
                },
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
            exclude: /node_modules/,
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
        // {
        //     test: /\.less$/,
        //     include: /node_modules/,
        //     use: isServer
        //         ? 'null-loader'
        //         : [
        //               ...getCssLoaders({ useCssModule: false, isDev: isDev }),
        //               {
        //                   loader: 'less-loader',
        //                   options: {
        //                       lessOptions: {
        //                           javascriptEnabled: true,
        //                       },
        //                   },
        //               },
        //           ],
        // },
        // {
        //     test: /\.less$/,
        //     exclude: /node_modules/,
        //     use: isServer
        //         ? 'null-loader'
        //         : [
        //               ...getCssLoaders({ useCssModule: true, isDev: isDev }), // 如果本地不需要css modules, 可以合并为同一个less配置项
        //               {
        //                   loader: 'less-loader',
        //                   options: {
        //                       lessOptions: {
        //                           javascriptEnabled: true,
        //                       },
        //                   },
        //               },
        //           ],
        // },
        {
            test: /\.(png|jpg|jpeg|gif|svg|ttf)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 5 * 1024, // 5kb
                        name: 'media/[name].[contenthash].[ext]',
                        emitFile: !isServer,
                    },
                },
            ],
        },
        {
            test: /\.(json|mp4)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: 'media/[name].[contenthash].[ext]',
                        emitFile: !isServer,
                    },
                },
            ],
        },
    ];
};
