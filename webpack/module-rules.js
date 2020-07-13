const isDev = process.env.NODE_ENV === 'development';
const miniCssExtract = require('mini-css-extract-plugin');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const pix2rem = require('postcss-pxtorem');
const sass = require('sass');

const cssLoaders = [
    isDev ? 'style-loader' : miniCssExtract.loader,
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: (loader) => {
                const targetPlugins = [
                    postcssImport({ root: loader.resourcePath }),
                    pix2rem({ propList: ['*'], rootValue: 100 }),
                    postcssPresetEnv(),
                ]

                if (!isDev) {
                    targetPlugins.push(cssnano());
                }

                return targetPlugins;
            }
        },
    },
]

module.exports = () => {
    return [
        {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /mode_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    }
                }
            ]
        },
        {
            test: /\.css$/,
            use: cssLoaders,
        },
        {
            test: /\.scss$/,
            use: [
                ...cssLoaders,
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: sass,
                    }
                }
            ],
        },
        {
            test: /\.(png|jpg|jpeg|gif|svg|ttf)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 5*1024,  // 5kb
                    },
                }
            ],
        },
        {
            test: /\.(json|mp4)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        emitFile: !isServer,
                    },
                }
            ],
        },
    ]
}