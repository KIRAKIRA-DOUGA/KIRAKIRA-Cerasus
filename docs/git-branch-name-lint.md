## branch命名规范

<br/>

develop - 主开发分支/测试版本分支  
deployment - 部署/正式版本分支  

<br/>

错误修复-hotfix
```
hotfix-<日期>-<修复内容简称>-<创建者>
```

紧急错误修复-hotfix
```
hotfix-<日期>-<修复内容简称>-<创建者>
```

新功能-feature
```
feature-<日期>-<修改内容简称>-<创建者>
```

重构-refactoring
```
refactoring-<日期>-<修改内容简称>-<创建者>
```

从 `develop` 分支创建开发分支 `feature-xxxxxxxxxxx-xxxxxxx-xxxx`，开发完成后 ***Merge*** 回 `develop` 分支；  
在 `feature` 上执行单元测试， 在 `develop` 上进行结合测试 ——（如果可能的话）  
将 `develop` 分支的内容 ***Merge*** 到 `deployment` 分支，并创建 `tag`

