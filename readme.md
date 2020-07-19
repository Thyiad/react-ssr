### 注意

使用修改点：

-   constant/index.ts
    > 采用 cookie 存储 token 到上级域名，在这个文件中修改 cookie key 及登录页面的 url
-   constant/systemInfo.ts
    > 页面常量在此处修改，比如系统名称、著作权等等

### 已完成

-   [x] 集成 antd
-   [x] husky、quick prettie、commitlint 验证提交
-   [x] utils 工具类封装
-   [x] 基础布局封装
    > 左侧菜单布局、顶部菜单布局、注册/登录布局
-   [x] 权限控制
-   [x] 集成 ant design pro table

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
