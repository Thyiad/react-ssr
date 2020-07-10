---
title: koa+ts搭建ssr后端
date: 2020-07-07
categories:
 - frontend
tags:
 - react
 - ssr
 - typescript
---

## 前言
此文为ssr四部曲的第三部，[前文在这]()

## 搭建步骤
之前写过一篇文章，koa+mongodb搭建后端，里面写的更详细一些，有兴趣的可以翻出来看看，只不过文末一部分一直搁置未完篇，因为一行行写起来比较繁琐，后面又比较忙。（说白了，是懒，哈哈）

此处我们简单一点，用koa+koa-router搞一个后端路由出来即可，话不多说，那就开始吧。。

### 安装依赖
``` bash
npm i koa @koa/router koa-bodyparser koa-static art-template koa-art-template log4js chalk
```
art: node端的模板引擎推荐art和nunjucks，art简洁、速度快，而nunjucks属于富功能模板引擎，功能更加强大，有layout、block、全局函数/变量、模板继承等等。
不过事情刚开始嘛，我们的需求是很简单的，杀鸡焉用牛刀，所以选择art

@koa/router，是koa团队接手了koa-router之后维护的类库，koa-router停留在了7.x，而@koa/router也是直接从8.x开始

log4js: 日志是少不了的，所以log4js来一个吧

chalk: 让控制台输出更漂亮

再安装一下types
``` bash
npm i -D @types/koa @types/koa__router @types/koa-bodyparser @types/chalk
```

如果是普通nodejs，我们可以用nodemon+ts-node来调试：
``` bash
npm i ts-node
// nodemon很多地方用的上，所以直接全局安装吧
```
``` js
"devServer": "nodemon --watch src -e ts,tsx,js,json --exec node --inspect=127.0.0.1:9229 -r ts-node/register ./src/server/app.ts",
```

最简单的一个例子就是koa路由里，使用renderToString，来渲染一个jsx，返回渲染后的string给前端。
这里有几个问题需要解决：
1. nodejs不支持import/export语法
2. nodejs不支持tsx语法
3. 组件内部导入scss之类的文件在node端会报错
4. 打包出来的js, css如何注入
5. 服务端数据如何注入到客户端
...

所以我们需要用webpack来进行打包，解决这些问题

webpack-node-externals、webpack-manifest-plugin、ignore-loader














server css如何打包处理
    server端不处理css，由client端处理css
server如何引入client打包出来的boudle
    client端生成manifest, server端引入manifest中的文件路径
splitChunks

koa和webpack如何一起启动
    client: webpack watch, output to dist/client
    server: recompile_complete, process.spawn, node dist/server/main.js
如何热更新, 自动刷新页面






ssr
docx
ppt