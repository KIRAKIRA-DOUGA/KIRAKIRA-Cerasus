# 目录说明

## .vscode
Visual Studio Code 项目设置

## api
与后端接口相关

## assets
资源文件

### aep
动态图形的 Adobe Effects 设计原型
* 排除在生产环境之外

### audios
音频文件

### fonts
字体文件

### icons
SVG 图标文件

### images
图片文件

### lotties
Lottie 动态图形文件

### sprite › gen
SVG 雪碧图生成文件
* 排除在版本控制之外

### styles
全局样式文件

#### css-doodles
CSS Doodle 图形文件

#### elements
与特定元素有关的样式文件

#### theme
与主题有关的样式文件

### videos
视频文件

## classes
类模块
* 会自动导入

## components
组合控件
* 会自动导入

## composables
组合式函数，可复用组合逻辑

与 `utils` 目录类似，但是是类似于 Vue 的 `use____` 函数。
* 会自动导入

## content
内容文件，如 Markdown 等

## dist<br />.output
为生产环境生成、构建的应用程序目录

## docs
说明文档

## helpers
为特定用途而使用的逻辑模块

不会自动导入，需要显式导入。

## layouts
布局组件

## locales
语言字典

## middleware
中间件模块

## modules
自定义 Nuxt 模块

## node_modules
NPM 模块，外部依赖库
* 排除在版本控制之外

## pages
页面组件

## patches
自定义依赖补丁

## plugins
自定义插件

### nuxt
Nuxt 插件

### postcss
PostCSS 插件

### vite
Vite 插件

### vue
Vue 插件

## public
页面根目录环境

### static
静态资源，可直接通过真实路径来引用

## scripts
Node.js 自定义脚本
* 排除在生产环境之外

## server
服务器模块

### api
服务器 API 模块

### routes
服务器路由模块

与 `server › api` 目录类似，但是去掉 `/api` 的前缀。

### middleware
服务器中间件模块

## stores
状态管理库、数据持久化存储模块

## types
TypeScript 类型补充声明

## utils
工具模块

与 `composables` 目录类似，但是只用做普通工具模块。
* 会自动导入
