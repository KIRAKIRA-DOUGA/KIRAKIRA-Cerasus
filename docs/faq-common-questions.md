# FAQ / Common Questions

隔壁[前端规范](./frontend-project-lint.md)的很多东西都已经过时了，看这里吧。

---

## 关于 LINT

把

* ESLint
* StyleLint

都装上，然后慢慢逐个处理红色波浪线的地方吧。

如果觉得好像自己写得并没有错，但是它就是报个红。要么是自己的代码风格不对，要么是制定 LINT 规则的有问题。

## Vue 文件各块的 attr

除特殊情况下，你的 Vue 组件初始化 attr 应该是这样的：

```html
<script setup lang="ts"></script>
<template></template>
<i18n lang="json5"></i18n>
<style scoped lang="scss"></style>
```

## 合并组件

不要做过多冗余重复的组件，相似功能的组件应该被合并。

**反面例子：**<wbr />将“视频工具栏按钮”和“视频弹幕面板按钮”做成两个组件。

## 页面的文件名命名
`pages` 目录下的文件均以连字符式命名，我没见过**地址栏路由**是以驼峰式命名的。

## 组件的文件名命名

俗称“越南语命名”，即定语位于名词之后，看起来与中文、英语的阅读方式相反。

例如：

```
˅ Foo
├ ˅ FooBar
└─┴── FooBarBaz.vue
```

即组件文件名的开头应该逐个添加其祖辈目录之名。

## 组件的根节点

~~以 `<kira-component>` 节点作为组件的根节点~~，用于替代普通的 `<div>`。如根节点为 `<button>`、`<input>` 等有意义的节点则无需替换。

以 `<Comp>` 节点作为组件的根节点。（其具体内部实现与旧版相同。）

~~然后，使用 `:dom` 属性来 ref 真实 DOM 元素。~~

## 组件根节点的类名

<s>为了避免组件根节点样式泄漏，应该将组件根节点的类名命名为其组件的名称的连字符形式。例如：`<PlayerVideoPanelDanmakuList>` 组件的类名应为 `.player-video-panel-danmaku-list`。

有点长，不过别急，只有根节点需要这样写，其子系节点都可使用简化命名。</s>

根节点使用 `:comp`*（或 `:component`）*<wbr />伪类表示。注意原版 CSS/SCSS 没有这个伪类，这个伪类是我用 PostCSS 插件自行实现的。

## 关于类名（除组件根节点）

名字短一点！我们是 `scoped`，样式不会泄露，请名称越简练越好。

## 组件自定义样式属性要写在 Prop 里吗？

不要。

以 `<SoftButton>` 组件为例，你可能会很好奇，该组件在 Prop 里居然不能自定义按钮大小，难道按钮的大小只能是固定的吗？

并不是，`<LogoCover>` 组件也是一样的，不能在 Prop 中设定封面的大小。

正确方法是在样式表中，使用以下方式（自定义属性）进行设置：

```scss
.soft-button {
    --wrapper-size: 40px;
}
```

这样就能完美应用样式了。

除此之外，它也可以支持布尔或枚举类型。

```scss
.logo-text {
    --form: full;
}

.tab-bar {
    --clipped: true;
}
```

毕竟设定样式，在 CSS/SCSS 中批量设定不比在 HTML/template 中单独设定要更好么？
