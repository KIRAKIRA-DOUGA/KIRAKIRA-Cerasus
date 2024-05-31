## Git 分支命名规范

> **develop** - 主开发分支/测试版本分支\
> **deployment** - 部署/正式版本分支

#### 普通错误修复 - `bugfix`
```
bugfix-<日期>-<修复内容简称>-<创建者>
```

#### 紧急错误修复 - `hotfix`
```
hotfix-<日期>-<修复内容简称>-<创建者>
```

#### 新功能 - `feature`
```
feature-<日期>-<修改内容简称>-<创建者>
```

#### 重构 - `refactoring`
```
refactoring-<日期>-<修改内容简称>-<创建者>
```

#### 语言 - `locale`
```
locale-<语言名>
```

---

#### 具体格式

##### 日期

格式为 `yyyyMMddrr`，共计 8 位数字。

其中\
`y` - 年；`M` - 月；`d` - 日；`r` - 当日第几次修订号，以 1 起始。

##### 修改/修复内容简称

以**大驼峰**形式命名。

---

从 `develop` 分支创建开发分支 `feature-yyyyMMddrr-xxxxxxxx-xxxx`，开发完成后 ***Merge*** 回 `develop` 分支；

在 `feature` 上执行单元测试，在 `develop` 上进行结合测试（如果可能的话）；

将 `develop` 分支的内容 ***Merge*** 到 `deployment` 分支，并创建 `tag`。

---

创建分支后，***Merge*** `develop` 分支到自己的分支，并解决冲突；

编写代码前，***Merge*** `develop` 分支到自己的分支，并解决冲突；

编写代码后，***Merge*** `develop` 分支到自己的分支，并解决冲突；

合并代码前，***Merge*** `develop` 分支到自己的分支，并解决冲突。
