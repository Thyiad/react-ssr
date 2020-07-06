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
npm i -S react-router-dom react-helmet
```
react-router-dom是基于react-router的库，里面加入了一些在浏览器运行环境下的功能，例如：Link、BrowserRouter、HashRouter。而其他的一些组件则是直接从react-router中导出的，例如：Switch、Route等等。
react-helmet用来动态改变title

### 路由及布局
路由及布局，就跟我们平时写的react应用是一样的，先写个最简单的就行，就不详细展开了，具体看代码即可，主要新增了3个文件：
- routes.js 定义路由
- layout 定义布局
- RouteWithSubRoutes react-router的嵌套路由组件

### 插曲
写了几个基础页面后，发现报这种错：
``` bash
Module not found: Error: Can't resolve 'core-js/modules/es.array.slice' 
```
看了一下package.json，果然，遗漏安装core-js了，因为@babel/preset-env依赖core-js，会跑到当前项目下去寻找core-js
因为用到的是core-js3，所以我们安装core-js3：
```bash
npm i core-js@3
```

### redux
接下来就是全局状态管理，以往我们都是用redux及react-redux，不过在有了useReducer和useContext之后，已经可以替代了
> 在hooks之前createContext配合Context.Consumer也能读取全局状态，只不过很不方便，[这篇文章](https://medium.com/@Whien/%E9%80%8F%E9%81%8E-react-usecontext-%E8%88%87-usereducer-%E4%BE%86%E5%81%9A-global-state-manager-bed30fb1f08b)讲的不错

简单来说，使用useReducer和useContext来接管redux，主要有3步，示例代码如下：
1. createContext创建一个全局context
```js const Store = createContext(initState);```

2. 使用上一步的context，导出Provider组件，value中传入useReducer的state及dispatch
``` ts
const [state, dispatch] = useReducer(reducer, initState);
return <Store.Provider value={{state, dispatch}}>
</Store.Provider>
```
接下来就是传统的写法了，dispatch(action())，显然每个页面都这么写的话，还是挺繁琐的
如果能像vue那样mapAction，直接调用action，那就方便多了
>redux4中有一个bindActionCreators，跟mapAction作用类似传入action和dispatch，返回一个直接调用的action
而且代码多了之后，肯定是需要拆分reducer及action的，所以我们可以这样进行拆分：
- 建一个reducers文件夹
- 一个业务对应一个reducer文件，每个文件里定义actions、reducers
- 新增一个builder文件，遍历处理，将actions用dispatch包一层，reducers则简单合并，最后导出新的actions、一个新的root reducer

结构如下：
``` bash
- redux
    - reducers
        - global.ts
        - todo.ts
        - index.ts
    - builder.ts
    - store.tsx
```

3. 创建一个useRedux hooks，快捷使用state、dispatch
const {state, dispatch, actions} = useContext(Store);

更具体的代码就不一行行展示了，在tag-v2中可以详细查看

## 小结
可以看到，createContext+useContext+useReducer这3个react内置的api，已经足够应对小型项目的全局状态管理了
