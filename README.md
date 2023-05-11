## 噢天呐，看在上帝的份上，千万不要用 yarn（纱线）启动它，否则整个程序就会变得和珍妮婶婶做的苹果派一样烂了，真是该死。

![Cover](cover.svg)

# 项目代号 ｢<ruby>Cerasus<rp>（</rp><rt>[第13都市](https://zh.moegirl.org.cn/zh-hans/DARLING_in_the_FRANXX#cite_ref-10:~:text=%E7%AC%AC13%E9%83%BD%E5%B8%82%EF%BC%88Plantation%EF%BC%89%5B9%5D%E2%80%9C%E6%A8%B1%EF%BC%88Cerasus%EF%BC%89%E2%80%9D)</rt><rp>）</rp></ruby>｣
![State](https://img.shields.io/badge/STATE-ALPHA-red?style=flat-square)
![Tag](https://img.shields.io/badge/TAG-0.0.0-orange?style=flat-square)
![License](https://img.shields.io/badge/LICENSE-MIT-green?style=flat-square)
![Commit Activity](https://img.shields.io/github/commit-activity/y/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus?style=flat-square)

前端

[点击此处前往 Figma 设计文稿 >](https://www.figma.com/file/S5mM7zW5iMo560xnQ4cmbL/KIRAKIRA-Douga-PC?node-id=0%3A1)

## Nuxt 3

首先，Nuxt 读作 **/nʌkst/**（

查看 [Nuxt 3 文档](https://v3.nuxtjs.org)以了解更多信息。

### 安装

确保安装依赖项：

```bash
# npm
npm install
```

**只准用 <ruby>NPM<rp>（</rp><rt>你怕吗</rt><rp>）</rp></ruby>！！！**

### 开发服务器

#### HTTPS（默认）

按下键盘按键 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>，然后选择 `npm: dev`。

```bash
npm run dev
```

然后从此链接启动开发服务器：https://localhost:3000/

以上链接会自动开启 HTTPS 支持，以便提供部分浏览器针对 HTTPS 独有支持的功能。

首次进入网页时会弹出“不安全”的警告，此时只能选择“仍然访问”，暂时没有更好的解决方法。

#### 移动端网页测试

确保手机/平板与您的电脑位于同一个无线局域网下（如果条件不允许请开热点），然后使用移动端浏览器访问电脑所属 IP 地址。一般是：[https://192.168.\*.\*:3000/](https://192.168.*.*:3000/)

**查询电脑 IP 的方法：**<wbr />按 <kbd>Win</kbd> + <kbd>R</kbd>，输入 `cmd` 打开命令提示符，输入 `ipconfig` 即可查询当前电脑的 IP 地址。

#### HTTP

如果你非要使用 HTTP 开发服务器，请按下键盘按键 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>，然后选择 `npm: dev http`。

```bash
npm run dev-http
```

然后从此链接启动开发服务器：http://localhost:3000/

### 生产

#### 为生产生成应用程序（推荐）

按下键盘按键 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>，然后选择 `npm: generate`。

```bash
npm run generate
```

#### 为生产构建应用程序

按下键盘按键 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>，然后选择 `npm: build`。

```bash
npm run build
```

#### 本地预览生产版本

```bash
npm run preview
```

有关详细信息，请查看[部署文档](https://v3.nuxtjs.org/guide/deploy/presets)。

## 其它脚本功能

依次选择菜单 *终端(<ins>T</ins>) > 运行任务...*，然后即可访问其它脚本功能。

### 检查 StyleLint
```bash
npm: lint:css
```

### 更新缓动值样式 *(_eases.scss)* 声明文件
这将会自动更新 `_eases.scss`、`eases.module.scss`、`eases.module.scss.d.ts` 三个文件。
```bash
npm: update-eases
```

### 压缩 SVG
这将会压缩 SVG，删除 SVG 的多余部分，如裁切区域、填充颜色等。
```bash
Compact SVG
```

## IDE

建议使用以下任意平台进行开发：

[![VSCode](https://img.shields.io/badge/-Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://code.visualstudio.com/)  
[![WebStorm](https://img.shields.io/badge/-WebStorm-000000?style=for-the-badge&logo=webstorm&logoColor=white)](https://www.jetbrains.com/webstorm/)  
[![Sublime Text](https://img.shields.io/badge/-Sublime%20Text-FF9800?style=for-the-badge&logo=sublime-text&logoColor=white)](https://www.jetbrains.com/webstorm/)  
[![Fleet](https://img.shields.io/badge/-Fleet-000000?style=for-the-badge&logo=jetbrains&logoColor=white)](https://www.jetbrains.com/fleet/)

<details>
<summary>不要使用</summary>

<!-- * EditPlus -->
* Atom
* Dreamweaver
* SharePoint
* FrontPage
* Notepad++
* HBuilder
* HBuilderX
* Vim
* 记事本
* 写字板
* Word
</details>

## 使用技术
前端开发中所使用了的技术栈有：

[![Nuxt](https://img.shields.io/badge/-Nuxt%203-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/-Vue%203-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/-Vite%203-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
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
<!-- [![Vuex](https://img.shields.io/badge/-Vuex-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuex.vuejs.org/) -->
<!-- [![Pinia](https://img.shields.io/badge/-Pinia-FFDD5F?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/) -->

## 测试用浏览器
[![Microsoft Edge](https://img.shields.io/badge/-Microsoft%20Edge-0078D7?style=for-the-badge&logo=microsoft-edge&logoColor=white)](https://www.microsoft.com/edge/download)  
[![Google Chrome](https://img.shields.io/badge/-Google%20Chrome-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.google.cn/chrome/index.html)  
[![Firefox Browser](https://img.shields.io/badge/-Firefox%20Browser-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](https://www.mozilla.org/firefox/new)  
[![Opera](https://img.shields.io/badge/-Opera-FF1B2D?style=for-the-badge&logo=opera&logoColor=white)](https://www.opera.com/)  
[![Safari](https://img.shields.io/badge/-Safari-000000?style=for-the-badge&logo=safari&logoColor=white)](https://www.apple.com/safari/)

## 格式规范
* **缩进：**<wbr />TAB
* **行尾：**<wbr />LF
* **引号：**<wbr />双引号
* **文件末尾**加空行
* **语句末尾**加分号
* **Vue API 风格：**<wbr />组合式
