---
title: react+ts搭建前端工程
date: 2020-06-05
categories:
 - frontend
tags:
 - react
 - ssr
 - typescript
---

## 前言
此文为ssr三部曲的第一部，[前文在这]()

## 安装依赖

### typescript
安装typescript，并初始化一个tsconfig.json出来

``` bash
npm install -S -D typescript
node_modules/.bin/tsc --init    // 局部tsc需要这样使用
```

babel7开始，新增了@babel/preset-typescript，支持解析ts，所以不再需要ts-loader之类的webpack loader了

### webpack
安装webpack、webpack-cli以及webpack-dev-server，webpack4开始webpack-cli与webpack分离成2个包了，分开维护。
webpack-dev-server开发用，原理是用express起一个服务器，文件被build到内存中，通过socket跟client连接，达到热更新的目的。
``` bash
npm install -S -D webpack webpack-cli webpack-dev-server
```

### react
安装react以及react-dom
``` bash
npm i -S react react-dom
```
再安装一下声明文件
``` bash
npm i -D @types/react @types/react-dom
```

### css
css扩展是不可缺少的，我用sass最多，所以先安装sass相关依赖：

``` bash
npm install -S -D sass sass-loader css-loader style-loader mini-css-extract-plugin postcss-loader postcss-import postcss-preset-env postcss-pxtorem cssnano
```

- sass即为dart-sass，以前一般使用node-sass，安装中可能碰到各种问题，dart-sass能完美兼容并且避免这些问题
- sass-loader用来把sass翻译成css
- css-loader用来读取css文件（仅读取）
- style-loader会把css用style标签包起来，放到header中，适用devlopment环境
- mini-css-extract-plugin与style-loader作用类似，区别是使用link标签作为独立的文件引入，适用production环境
- postcss-loader用来添加浏览器css兼容性代码
> 后面4个都是postcss的插件，作用如下：
> - postcss-import用来处理css中的@import指令
> - postcss-preset-env跟babel类似，把新css语法转换为旧css语法
> - postcss-px2rem用来把px自动转换成rem
> - cssnano用来压缩代码


### babel

``` bash
npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread @babel/plugin-syntax-dynamic-import
```

- babel-loader和@babel/core就不用说了
- preset-xxx（preset-env、preset-react、preset-typescript）都是babel预设的一些转码规则集，这3个分别用来转码es、react、ts
    > preset的顺序为从后至前
- @babel/plugin-xxx 都是babel的插件，会在preset之前执行，preset不支持的一些特性，就需要导入plugin了，这3个分别用来支持转码class、扩展运算符、动态导入
    > plugin的顺序为从前至后

此处必须提一下@babel/plugin-transform-runtime，runtime是提供沙箱垫片的方式来转换代码，而preset-env会覆盖全局环境，更具体的区别可以自行google：

- transform-runtime不会在每个文件中重复导入工具函数，会改从@babel/runtime中导入（runtime需要安装在dependencies中，而不是devDependencies）
- preset-env可配置useBuiltIns方式：entry、usage
- 参考资料：[preset-env官方文档](https://babeljs.io/docs/en/babel-preset-env)、[transform-runtime官方文档](https://babeljs.io/docs/en/babel-plugin-transform-runtime#polyfill)、[简书博客](https://www.jianshu.com/p/ed24b0ba8792)

### eslint、prettier

安装eslint及prettier：

```bash
npm install -D eslint prettier eslint-plugin-prettier eslint-config-prettier eslint-plugin-react  
```

> 因为是react项目，所以除了eslint和prettier还装了eslint-plugin-react

新增.eslintrc，填入以下内容：

``` js
{
    "extends": [
        "plugin:prettier/recommended"
    ]
}
```

eslint和prettier此处不做具体展开，请自行google，仅稍微说明一下eslint：
eslint里有config和plugin两个概念，config配置规则（指定plugin对应的规则），plugin则定义具体的规则校验逻辑。
所以eslint-plugin-prettier默认的配置是要定义plugin以及rule，里面嵌套的recommended则直接定义了config，所以直接可以把plugin:prettier/recommended扔到extends中来使用

上面配置之后，你会发现写ts，会提示各种语法错误，显然不识别ts的语法，所以我们还需要添加ts的支持：

``` bash
npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

最终的.eslintrc如下：

``` json
{
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2020, // Allows for the parsing of modern ECMAScript features
        "sourceType": "module", // Allows for the use of imports
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "extends": [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    "env": {
        "browser": true,
        "node": true
    }
}
```

> 更完善的格式化流程，还要配置husky和lint-staged，此处不做展开，可参考以下两篇文章：[robertcooper](https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project)、[掘金](https://juejin.im/post/5d1d5fe96fb9a07eaf2bae29)
> 有没有感觉很头大，这么多东西要配置。。

### 其他loader、plugin

``` bash
npm install -S -D url-loader html-webpack-plugin case-sensitive-paths-webpack-plugin clean-webpack-plugin
```
- url-loader用来处理其他文件的import/require，例如图片（把这些文件转发到生成目录，并解析成对应的url）
    > url-loader内置了file-loader，可以设置指定大小以下文件转为DataURI
- html-webpack-plugin用来生成一个html文件
- case-sensitive-paths-webpack-plugin用来做路径大小写严格判断（mac上大小写不敏感，window和linux大小写敏感）
- clean-webpack-plugin用来在每次打包之前清空目标目录（webpack的默认行为是增量，不清空）

截止到目前为止，webpack的全部配置为两个文件：
- module-rules.js
    > loaders较多，所以单独写了一个文件
``` js
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
        }
    ]
}
```

- webpack.client.js
``` js
const webpack = require('webpack');
const path = require('path');
const cwd = process.cwd();
const fs = require('fs');
const moduleRules = require('./module-rules');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CaseSensitivePathPlugin = require('case-sensitive-paths-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
console.log('env is: '+process.env.NODE_ENV);

const plugins = [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.DEPLOY_ENV': JSON.stringify(process.env.DEPLOY_ENV),
    }),
    new CleanWebpackPlugin(),
    new CaseSensitivePathPlugin(),
    new HtmlWebpackPlugin({
        template: path.resolve(cwd, 'webpack/index.html'),
        filename: 'index.html',
    }),
];
if(isDev){
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NamedModulesPlugin());
}


module.exports = {
    entry: path.resolve(cwd, 'src/client/app'),
    output: {
        path: path.resolve(cwd, 'dist/client'),
        filename: isDev ? 'js/[name].[hash].js': 'js/[name].[contentHash].js',
        chunkFilename: isDev ? 'chunks/[name].[hash].js' : 'chunks/[name].[contentHash].js',
        publicPath: '/',
    },
    // mode: process.env.NODE_ENV,  // 由 --mode参数指定
    resolve: {
        extensions: ['.ts', '.tsx', '.scss', '.js', '.jsx', '.sass'],
        alias: {
            "@client": path.resolve(cwd, 'src/client'),
            "@server": path.resolve(cwd, 'src/server'),
        }
    },
    module: {
        rules: moduleRules(),
    },
    plugins,
    watch: isDev,
    devServer: isDev ? {
        contentBase: path.resolve(cwd, 'src/client'),
        compress: true,
        host: '0.0.0.0',
        port: 8080,
        hot: true,
        open: true,
        watchOptions: {
            ignored: /node_modules/,    // 监听过多文件会占用cpu、内存，so，可以忽略掉部分文件
            aggregateTimeout: 200,  // 默认200，文件变更后延时多久rebuild
            poll: false,    // 默认false，如果不采用watch，那么可以采用poll（轮询）
        },
    } : undefined,
    devtool: isDev ? "inline-source-map": undefined,
};
```
- package.json中添加了以下两个命令：
``` js
{
    "dev": "cross-env NODE_ENV=development DEPLOY_ENV=dev webpack-dev-server --mode=development --config webpack/webpack.client.js",
    "prd": "cross-env NODE_ENV=production DEPLOY_ENV=prd node_modules/.bin/webpack --mode=production --config webpack/webpack.client.js",
}
```
接下来跑跑命令就能看到打包出来的