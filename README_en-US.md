![Cover](cover.svg)

# Project Code Name ｢<ruby>Cerasus<rp>（</rp><rt>[Plantation](https://zh.moegirl.org.cn/zh-hans/DARLING_in_the_FRANXX#cite_ref-10:~:text=%E7%AC%AC13%E9%83%BD%E5%B8%82%EF%BC%88Plantation%EF%BC%89%5B9%5D%E2%80%9C%E6%A8%B1%EF%BC%88Cerasus%EF%BC%89%E2%80%9D)</rt><rp>）</rp></ruby>｣
![State](https://img.shields.io/badge/STATE-ALPHA-red?style=flat-square)
![Tag](https://img.shields.io/badge/TAG-0.0.0-orange?style=flat-square)
![License](https://img.shields.io/badge/LICENSE-BSD%203‐Clause-green?style=flat-square)
![Commit Activity](https://img.shields.io/github/commit-activity/y/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus?style=flat-square)

Front-end

[简体中文](README.md) | **English**

[Click here to go to the Figma design file >](https://www.figma.com/file/S5mM7zW5iMo560xnQ4cmbL/KIRAKIRA-Douga-PC?node-id=0%3A1)

## Nuxt 3

Firstly, Nuxt is pronounced as **/nʌkst/** \*lol\*

Look at the [Nuxt 3 documentation](https://nuxt.com/) to learn more.

### Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

**Only NPM allowed!!!**

### Development Server

#### HTTPS (Default)

Press <kbd>F5</kbd> in Visual Studio Code, and you can stop the server using <kbd>Shift</kbd> + <kbd>F5</kbd>.

Or press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>, and then select `npm: dev`.

```bash
npm run dev
```

Then start the development server on: https://localhost:3000/

The above link will automatically enable HTTPS support to provide some browser specific features for HTTPS support.

When visiting the webpage for the first time, a warning of "unsafe" will pop up. At this time, you can only choose "still access", and there is currently no better solution.

When launched in development mode, localhost will be the address of the backend APIs. In order to continue, you must also launch the [KIRAKIRA-Rosales Back-end Service](https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Rosales).

#### Mobile Webpage Testing

Ensure that the phone/tablet is located on the same WiFi as your computer (if conditions do not allow, turn on the mobile hotspot), and then use the mobile browser to access the IP address of the computer. Generally: [https://192.168.\*.\*:3000/](https://192.168.*.*:3000/)

**How to query the computer IP:** Press <kbd>Win</kbd> + <kbd>R</kbd>, enter `cmd` to open a command prompt, and enter `ipconfig` to query the current IP address of the computer.

#### HTTP

If you insist on using HTTP development server, please press the keyboard keys <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>, and then select `npm: dev http`.

```bash
npm run dev-http
```

Then start the development server on: http://localhost:3000/

**Note:** The HTTP development server may not include all expected features, or may even cause run-time exceptions!

### Production

#### Generate the Application for Production:

This will completely generate each static routing page.

Press the keyboard keys <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>, and then select `npm: generate`.

```bash
npm run generate
```

#### Build the Application for Production

This will only build the minimal root routing page.

Press the keyboard keys <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>, and then select `npm: build`.

```bash
npm run build
```

#### Locally Preview Production Build

```bash
npm run preview
```
When running in production mode, we connect to the back-end API at: https://rosales.kirakira.moe/

Checkout the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 其它脚本功能

依次选择菜单 *终端(<ins>T</ins>) > 运行任务...*，然后即可访问其它脚本功能。

### 检查 StyleLint

```bash
npm: lint:css
```

### 更新缓动值样式 *(_eases.scss)* 声明文件

这将会根据 `_eases.scss` 文件的更改自动更新 `eases.module.scss`、`eases.module.scss.d.ts` 额外两个文件。

```bash
npm: update-eases
```

### 压缩 SVG

这将会压缩 SVG，删除 SVG 的多余部分，如裁切区域、填充颜色等。

```bash
Compact SVG
```

## 自定义指令（语法糖）

项目利用各种特性、冷知识、甚至修改底层代码等，添加了许多语法糖以方便开发人员使用。

### 水波纹

使用 `v-ripple` 自定义指令快速创建 Material 水波纹效果。其接受一个布尔类型的值，用于表示是否开启水波纹。如果留空则自动表示开启。

```html
<!-- 直接开启 -->
<div v-ripple>
<!-- 显式开启 -->
<div v-ripple="true">
<!-- 根据 foo 变量的值而开启 -->
<div v-ripple="foo">
```

### 依次动画优先级

如果你希望实现各条目依次出现的动画（具体动画仍需自行手动实现），请使用 `v-i` 自定义指令。其接受一个数字类型的值，用于表示其优先级。其以 0 起始或以 1 起始具体表现根据你的动画实现而决定。

```html
<div v-i="1">
```

这将会转变成如下效果：

* Vue SFC 语法
  ```vue
  <div :style="{ '--i': 1 }">
  ```
* JSX 语法
  ```jsx
  <div style={{ '--i': 1 }}>
  ```
* HTML 语法
  ```html
  <div style="--i: 1;">
  ```

### 工具提示

使用 `v-tooltip` 创建自定义的工具提示，旨在取代原生丑陋的 `title` 属性。

```html
<!-- 自动决定工具提示的位置方向 -->
<div v-tooltip="'那只敏捷的棕毛狐狸跳过了一只懒惰的狗'">
<!-- 显式指定工具提示的位置方向 -->
<div v-tooltip:top="'那只敏捷的棕毛狐狸跳过了一只懒惰的狗'">
<!-- 高级设定工具提示 -->
<div v-tooltip="{
    title: '那只敏捷的棕毛狐狸跳过了一只懒惰的狗', // 工具提示文本
    placement: 'top', // 指定四个位置方向
    offset: 10, // 工具提示与元素之间的距离
}">
```

### 翻译

项目强化了 Vue-i18n 的原生翻译函数，使其使用起来更方便。

> **注意：**<wbr />翻译字典文件的每个标识符均应使用蛇形命名法（下划线命名法）；且多门语言若任意一门语言比其它语言多或少字符串声明，均会报错，这意味着必须为这些语言同时指定完整的字符串声明，以防遗漏。

<table>
<thead>
<th>功能</th>
<th>当前强化语法</th>
<th>原版语法</th>
</thead>
<tbody>
<tr>
<td>直接声明</td>
<td>

```typescript
t.welcome
```

</td>
<td>

```typescript
$t("welcome")
```

</td>
</tr>
<tr>
<td>变量声明</td>
<td>

```typescript
t[variable]
```

</td>
<td>

```typescript
$t(variable)
```

</td>
</tr>
<tr>
<td>位置参数</td>
<td>

```typescript
t.welcome("hello", "world")
```

</td>
<td>

```typescript
$t("welcome", ["hello", "world"])
```

</td>
</tr>
<tr>
<td>命名参数</td>
<td>

```typescript
t.welcome({ foo: "hello", bar: "world" })
```

</td>
<td>

```typescript
$t("welcome", { foo: "hello", bar: "world" })
```

</td>
</tr>
</tbody>
</table>

### 组件根节点

为使各组件的元素界限更清晰明显，且避免样式泄露等麻烦问题。请在项目中使用 `<Comp>` 作为组件的根节点。

假设组件名为 `TextBox.vue`：

```html
<Comp />
```

这将会自动编译为：

```html
<kira-component class="text-box"></kira-component>
```

同时，在样式表中，可以使用 `:comp` 来更方便地指代组件的根节点。

```css
:comp {

}
```

这将会自动编译为：

```css
kira-component.text-box {

}
```

此外，在其它地方调用该组件时，亦可根据组件的名称而为该组件设定样式，而不必再额外添加多余的类名。

### 触摸屏禁用 `:hover` 伪类

众所周知鼠标才有悬停功能，将鼠标指针悬浮在按钮上，按钮就会响应为 `:hover` 伪类所表示的样式。然而触摸屏通过手指操作，并不存在“悬停”功能，而浏览器为了实现所谓的“悬停”功能，当触摸按钮时，浏览器会将一个无形的指针放置在该按钮上，以呈现“悬停”样式状态。当手指离开屏幕时，指针并不会消失，按钮仍然呈现为悬停样式。这会使用户觉得奇怪，用户必须点击其它空白处才能使该按钮的悬停样式消失。这并不是我们所期望的。

请在项目中使用 `:any-hover` 伪类替换掉原本的 `:hover` 伪类，这将会使用户通过鼠标指针进行操作时才会出现悬停样式，而触摸屏则不会触发悬停样式。此外由于触摸屏没有 `:hover` 样式，请务必设定 `:active` 样式以为触摸屏用户带来更好的体验。

```css
button:any-hover {

}
```

这将会自动编译为：

```css
@media (any-hover: hover) {
    button:hover {

    }
}
```

> 除了 `@media (any-hover: hover)` 规则之外，还有一个 `@media (hover: hover)` 规则。它们的区别是：`hover` 只检测主要输入设备是否支持悬停功能，而 `any-hover` 检测是否至少一个输入设备支持悬停功能。

### 菜单、浮窗等的双向绑定模型参数

* 通过向菜单组件的 `v-model` 传递鼠标/指针事件 `MouseEvent` / `PointerEvent` 来在对应位置显示菜单，传递 `null` 则表示显示占位菜单而非上下文菜单，传递 `undefined` 表示隐藏菜单。

* 通过向浮窗组件的 `v-model` 传递一个元组（推荐）或对象均可表示显示浮窗，传递 `undefined` 表示隐藏浮窗。
  * 对象写法：
    ```typescript
    {
        target: MouseEvent | PointerEvent; // 鼠标/指针事件
        placement?: "top" | "bottom" | ...; // 指定四个位置方向
        offset?: number; // 工具提示与元素之间的距离
    }
    ```
  * 元组写法
    ```typescript
    [target, placement?, offset?]
    ```

### 与样式相关的组件 Prop

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

## IDE

It is recommended to use any of the following platforms for development:

[![VSCode](https://img.shields.io/badge/-Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://code.visualstudio.com/)  
[![WebStorm](https://img.shields.io/badge/-WebStorm-000000?style=for-the-badge&logo=webstorm&logoColor=white)](https://www.jetbrains.com/webstorm/)  
[![Sublime Text](https://img.shields.io/badge/-Sublime%20Text-FF9800?style=for-the-badge&logo=sublime-text&logoColor=white)](https://www.jetbrains.com/webstorm/)  
[![Fleet](https://img.shields.io/badge/-Fleet-000000?style=for-the-badge&logo=jetbrains&logoColor=white)](https://www.jetbrains.com/fleet/)

<details>
<summary>Never use</summary>

<!-- * EditPlus -->
* Atom
* Dreamweaver
* SharePoint
* FrontPage
* Notepad++
* HBuilder
* HBuilderX
* Vim
* Notepad
* Wordpad
* Word
</details>

## Technologies used
The technology stacks used in front-end development include:

[![Nuxt](https://img.shields.io/badge/-Nuxt%203-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/-Vue%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/-Vite%203-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/-Pinia-FFDD5F?style=for-the-badge&logo=vitest&logoColor=black)](https://pinia.vuejs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Sass](https://img.shields.io/badge/-Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![CSS Modules](https://img.shields.io/badge/-CSS%20Modules-000000?style=for-the-badge&logo=css-modules&logoColor=white)](https://github.com/css-modules/css-modules)
[![PostCSS](https://img.shields.io/badge/-PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)](https://postcss.org/)
[![Webpack](https://img.shields.io/badge/-Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)](https://webpack.js.org/)
[![PWA](https://img.shields.io/badge/-PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)
[![Lottie](https://img.shields.io/badge/-Lottie-00D6AD?style=for-the-badge&logo=airbnb&logoColor=white)](https://airbnb.design/lottie/)
[![Material Design](https://img.shields.io/badge/-Material%20Design-00629B?style=for-the-badge&logo=material-design&logoColor=white)](https://m3.material.io/)
[![Fluent UI](https://img.shields.io/badge/-Fluent%20UI-4FE5FF?style=for-the-badge&logo=microsoft&logoColor=black)](https://developer.microsoft.com/en-us/fluentui)
[![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Stylelint](https://img.shields.io/badge/-Stylelint-263238?style=for-the-badge&logo=stylelint&logoColor=white)](https://stylelint.io/)
[![EditorConfig](https://img.shields.io/badge/-EditorConfig-FEFEFE?style=for-the-badge&logo=editorconfig&logoColor=black)](https://editorconfig.org/)
[![Node](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![NPM](https://img.shields.io/badge/-npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Git](https://img.shields.io/badge/-Git-F05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)
[![Figma](https://img.shields.io/badge/-Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/)
[![KIRAKIRA](https://img.shields.io/badge/-KiRAKiRA☆DOUGA-F06E8E?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAxIiBoZWlnaHQ9IjIwMSIgZmlsbD0ibm9uZSIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMjAxIDIwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxwYXRoIGQ9Im02My45ODQgMTEuMTI3Yy04LjAzNzItMC4xMTU4Mi0xNC4wODggMy40NTUzLTE0LjY0MSAxMy4wNy0wLjAwNjcgMC4xMTYxIDAuMDA4NTA2IDAuMjMzMzEgMC4wMDM5MDYgMC4zNDk2MS0wLjExMzgtMC4wMzE5LTAuMjI1NTQtMC4wNzU1NjktMC4zMzk4NC0wLjEwNTQ3LTUuMDE1Ny0xLjMxNjktOC44NTQ4LTAuNTc3MDYtMTEuNzAzIDEuNTg1OS0xMC4xNjYgNy43MTk5LTcuNjc4MyAzMy41NTktMC43NSA0OC42NTYtMTguNTM3IDEwLjQxOS00MS41NDUgMzkuMzY4LTE5LjQ2NSA0Ny45NzMgMC4xMDg0IDAuMDQyIDAuMjI0NzggMC4wNjQ0NyAwLjMzMzk4IDAuMTA1NDctMC4wNjU1IDAuMDk4LTAuMTQxMzggMC4xOTAwNi0wLjIwNTA4IDAuMjg5MDYtMi44MDI0IDQuMzY0LTMuMjg0MyA4LjI0MzEtMi4xMDc0IDExLjYyMSA0LjE5OTEgMTIuMDQ5IDI5LjUyNCAxNy42NjggNDYuMDIzIDE1Ljc1IDQuMTk1MiAyMC44NDkgMjQuNjA1IDUxLjYzNCAzOS42MDQgMzMuMzAzIDAuMDczLTAuMDkgMC4xMzExMy0wLjE5NDE2IDAuMjAzMTMtMC4yODUxNiAwLjA3MyAwLjA5MiAwLjEzNzg5IDAuMTk0MTYgMC4yMTI4OSAwLjI4NTE2IDMuMjg0IDQuMDEzIDYuODI0NCA1LjY3MTcgMTAuNCA1LjU5NTcgMTIuNzUzLTAuMjY5NjMgMjUuOTE5LTIyLjYwMyAyOS4xOTktMzguODg3IDE2LjUwMiAxLjg3NzUgNDEuNzEyLTMuNzQyMiA0NS45LTE1Ljc2MiAxLjE3Ny0zLjM3OCAwLjY5NTU3LTcuMjU3MS0yLjEwNzQtMTEuNjIxLTAuMDYzLTAuMDk5LTAuMTQwMDgtMC4xOTEwNi0wLjIwNTA4LTAuMjg5MDYgMC4xMDktMC4wNDEgMC4yMjQ5OC0wLjA2MzQ3IDAuMzMzOTgtMC4xMDU0NyAyMi4wNzgtOC42MDM4LTAuOTIyNjMtMzcuNTQ3LTE5LjQ1OS00Ny45NjkgOC44NzEzLTE5LjMyNiAxMC40NjctNTYuMjYzLTEyLjQ1MS01MC4yNDYtMC4xMTI5OSAwLjAyOTUtMC4yMTkwMyAwLjA3OTkyOC0wLjMzMjAzIDAuMTExMzMtNWUtMyAtMC4xMTc5IDAuMDAyMS0wLjIzNzg3LTAuMDAzOS0wLjM1NTQ3LTAuMjk4LTUuMTc3My0yLjE4Ny04LjYwMDEtNS4xMjUtMTAuNjQxLTEwLjQ1OC03LjI2NTQtMzQuMTczIDMuMDE4Ni00Ni40MTYgMTQuMjQyLTkuMjk1Ny04LjUyMjEtMjUuMjA0LTE2LjUwMy0zNi45MDQtMTYuNjcyem0zNi45MDIgMTYuODY5YzkuMzY3OCA3LjA1OTcgMTQuMDExIDQxLjEyNyAxMy43MDkgNDguNjA3IDcuMDQ0Mi0yLjYwNzEgNDEuMTA1LTguNzQwMiA1MC41ODQtMS45MDQzLTMuNjQ5MyAxMS4xMDItMzQuODExIDI2LjE2Mi00Mi4wNDMgMjguMTkzIDQuNjUyNSA1Ljg4NzIgMjAuOTg1IDM2LjMwNiAxNy40NTcgNDcuNDYxLTExLjczNy0wLjI0MDkxLTM1LjQ4NS0yNS4wMzktMzkuNjM1LTMxLjI2NC00LjE2NDYgNi4yNDYyLTI4LjA5MSAzMS4yMDEtMzkuNzg1IDMxLjI3MS0zLjUzNzktMTEuMTQ4IDEyLjgwMi00MS41OCAxNy40NTUtNDcuNDY5LTcuMjMwNy0yLjAzMTEtMzguMzg2LTE3LjA4OC00Mi4wNDEtMjguMTg5IDkuNDcxMS02Ljg0MjMgNDMuNTI0LTAuNjkzOSA1MC41NyAxLjkxNDEtMC4zMDE1NS03LjQ4MDMgNC4zNjA1LTQxLjU2MSAxMy43MjktNDguNjIxeiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4K&logoColor=white)](https://www.kirakira.tv/)

## Test in Browser
[![Microsoft Edge](https://img.shields.io/badge/-Microsoft%20Edge-0078D7?style=for-the-badge&logo=microsoft-edge&logoColor=white)](https://www.microsoft.com/edge/download)  
[![Google Chrome](https://img.shields.io/badge/-Google%20Chrome-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.google.cn/chrome/index.html)  
[![Firefox Browser](https://img.shields.io/badge/-Firefox%20Browser-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://www.mozilla.org/firefox/new)  
[![Opera](https://img.shields.io/badge/-Opera-FF1B2D?style=for-the-badge&logo=opera&logoColor=white)](https://www.opera.com/)  
[![Safari](https://img.shields.io/badge/-Safari-000000?style=for-the-badge&logo=safari&logoColor=white)](https://www.apple.com/safari/)

## Formats Specifications (Lint)
* **Indent:** TAB
* **Line feed:** LF
* **Quotes:** Double quotation marks
* Add blank lines at **the end of the file**
* Add a semicolon at **the end of the statement**
* **Vue API Style:** Composition API
