react+ts+srr 从 0 搭建：

https://www.thyiad.top/_posts/2020-06-05-%E4%BB%8E0%E6%90%AD%E5%BB%BAreact+ts+ssr.html

### 注意

使用修改点：

-   ssr 本地开发时，使用了 nodemon，需要自行全局安装
-   constant/index.ts
    > 采用 cookie 存储 token 到上级域名，在这个文件中修改 cookie key 及登录页面的 url
-   constant/systemInfo.ts
    > 页面常量在此处修改，比如系统名称、著作权等等
-   开启 rem 需要放开注释
    > webpack/module-rules.js 的 pix2rem
    > webpack/index.html 中 rem 的 script 节点
    > server/config.ts 中的 useRem

### 已完成

-   [x] 集成 antd
-   [x] husky、quick prettie、commitlint 验证提交
-   [x] utils 工具类封装
-   [x] 基础布局封装
    > 左侧菜单布局、顶部菜单布局、注册/登录布局
-   [x] 权限控制
-   [x] 集成 ant design pro table
-   [ ] thyReq 允许自定义 axios 回调
-   [ ] stylus、vue 支持
    > 等 vue3 release 再考虑，到时候再集成一个默认的 vue ui

### 提交规范

```
'build', // 构建
'ci', // ci
'chore', // Other changes that don't modify src or test files. 改变构建流程、或者增加依赖库、工具等
'docs', // Adds or alters documentation. 仅仅修改了文档，比如README, CHANGELOG, CONTRIBUTE等等
'feat', // Adds a new feature. 新增feature
'fix', // Solves a bug. 修复bug
'perf', // Improves performance. 优化相关，比如提升性能、体验
'refactor', // Rewrites code without feature, performance or bug changes. 代码重构，没有加新功能或者修复bug
'revert', // Reverts a previous commit. 回滚到上一个版本
'style', // Improves formatting, white-space. 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
'test' // Adds or modifies tests. 测试用例，包括单元测试、集成测试等
```

### ssr

-   [ ] server 端获取页面初始数据
-   [x] 注入初始 store 数据

### 预览

![login](./preview-login.jpg)
![home](./preview.jpg)
