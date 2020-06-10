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

### sass
css扩展是不可缺少的，我用sass最多，所以先安装sass相关依赖：

``` bash
npm install -S -D sass sass-loader css-loader style-loader
```

- sass即为dart-sass，以前一般使用node-sass，安装中可能碰到各种问题，dart-sass能完美兼容并且避免这些问题
- sass-loader用来把sass翻译成css
- css-loader用来读取css文件（仅读取）
- style-loader会把css用style标签包起来，放到header中

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
npm install -D eslint prettier eslint-plugin-prettier eslint-config-prettier
```

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

### html插件

``` bash
npm install -S -D html-webpack-plugin html-loader
```

