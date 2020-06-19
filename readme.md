---
title: 使用react-router+hooks搭建基础框架
date: 2020-06-18
categories:
 - frontend
tags:
 - react
 - react-router
 - typescript
 - hooks
---

## 前言
最典型的一个react项目就是react-router+redux（可能再加上redux-thunk或saga），在hooks出来之后，redux也同步跟进加了很多hooks，但已经可以完全抛弃redux，仅仅使用useReducer等hooks来管理数据流了（大型、复杂项目的话，目前还是推荐redux）

## 步骤
[前文]()中已经配置好webpack了，接下来让我们配置react-router以及reducer

### react-router
先安装依赖：
``` bash
npm i -S react-router-dom
```
react-router-dom是基于react-router的库，里面加入了再浏览器运行环境下的一些功能，例如：Link、BrowserRouter、HashRouter。而其他的一些组件则是直接从react-router中导出的，例如：Switch、Route等等。

### 路由及布局


## 小结