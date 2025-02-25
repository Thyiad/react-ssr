const miniCssExtract = require('mini-css-extract-plugin');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const pix2rem = require('postcss-pxtorem');
const sass = require('sass');
const threadLoader = require('thread-loader');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

/** options: isDev, useCssModule */
const getCssLoaders = (options) => {
    return [
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
                        postcssImport(),
                        // pix2rem({ propList: ['*'], rootValue: 100, exclude: /node_modules/i }),
                        postcssPresetEnv(),
                        tailwindcss(),
                        autoprefixer(),
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
            test: /\.(ts|tsx)$/,
            include: /node_modules(\/|\\)(\@thyiad(\/|\\)antd-ui).*/,
            use: {
                loader: 'ts-loader',
                options: {
                    allowTsInNodeModules: true,
                    // getCustomTransformers: () => ({
                    //     before: [isDev && !isServer && ReactRefreshTypeScript()].filter(Boolean),
                    // }),
                    // transpileOnly: isDev && !isServer,
                },
            },
        },
        {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: [
                // {
                //     loader: 'thread-loader',
                //     options: workerPool,
                // },
                {
                    loader: 'babel-loader',
                    options: {
                        // cacheDirectory: true,
                        plugins: [isDev && !isServer && require.resolve('react-refresh/babel')].filter(Boolean),
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
                              api: 'modern-compiler',
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
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            exclude: /node_modules/,
            type: 'asset',
            parser: {
                dataUrlCondition: {
                    maxSize: 5 * 1024,
                },
            },
            generator: {
                filename: 'media/[contenthash][ext][query]',
            },
        },
        {
            test: /\.(ttf|json|mp4)$/,
            exclude: /node_modules/,
            type: 'asset/resource',
            generator: {
                filename: 'media/[contenthash][ext][query]',
            },
        },
    ];
};
