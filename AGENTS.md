# 仓库指南

## 项目结构

KIRAKIRA Cerasus 是一个基于 Nuxt 和 Vue 前端项目，源代码位于仓库根目录。

- `app.vue`：入口文件
- `pages/`：路由
- `components/`：组件
- `layouts/`：布局
- `middleware/`：API 中间件
- `composables/`：可复用的 Vue 组合逻辑
- `composables/api/`：API 客户端
- `stores/`：Pinia 状态
- `utils/`：通用辅助函数
- `classes/`：通用辅助类
- `helpers/`：不需要被自动全局导入的通用辅助函数和可复用的 Vue 组合逻辑
- `scripts/`：与构建相关的本地脚本
- `workers/`：Web Workers 和 Worklets
- `types/`：TypeScript 类型声明文件
- `modules/`：Nuxt 模块
- `plugins/`：构建插件（包括 Nuxt、Vite、PostCSS 等）
- `assets/`：打包后的图片、图标、字体等资源文件
- `assets/styles/`：样式
- `public/`：不打包直接按路由提供访问的资源文件
- `i18n/locales/English.ts`：在此更新源字符串，并使用 Crowdin 进行翻译

## 构建与开发

请使用 `.nvmrc` 指定的 Node.js LTS 版本，以及 `package.json` 中固定的 pnpm 版本，并在仓库根目录运行命令。

依赖操作请使用计算机现有的 pnpm store。任务创建的临时文件、日志和验证产物应保留在仓库的 `node_modules/.cache/` 中。不要创建临时 pnpm store，也不要将任务产物放入 `/tmp`、`/private/tmp` 或 `$TMPDIR`。

- `pnpm install` 安装依赖并准备 Nuxt 的生成文件。
- `pnpm dev:local` 启动 HTTPS 前端，通常运行于 `https://localhost:3000`，并要求在 `https://localhost:30000` 上单独运行 Rosales 后端。
- `pnpm dev:stg` 将请求代理到预发布后端。请参阅 [README_en-US.md](README_en-US.md#running-with-online-backend) 中的使用限制。
- `pnpm build` 构建生产应用，`pnpm generate` 生成静态输出，`pnpm preview` 在本地提供构建产物。

## 编码风格

代码使用制表符缩进，并使用 LF 换行符，Markdown 和 YAML 缩进使用两个空格。

Vue 组件优先采用 TypeScript、Vue 组合式 API（即 `<script setup lang="ts">`），组件样式采用 scoped SCSS（即 `<style scoped lang="scss">`）。
TypeScript 中使用双引号和语句分号。

变更代码后运行 `pnpm exec eslint <file>`，变更样式后运行 `pnpm exec stylelint <file>`。使用 `pnpm lint:css` 检查整个项目的样式。

### 命名规范

- 组件和类采用大驼峰形式命名（如 `SendVerificationCode.vue`）
- 页面和布局采用连字符形式命名（如 `block-and-hide.vue`）
- Composable 可复用的 Vue 组合逻辑函数以 `use` 前缀命名（如 `useBackgroundImages`）
- 本地化字符串键名采用下划线形式命名（如 `verify_new_email`）

### 文档注释（JSDoc / TSDoc / SassDoc）

所有文档注释（如 JSDoc）应采用中文编写，遵循 Markdown 语法格式，中西文之间需插入一个半角空格。正文部分正确使用标点符号，如句末不得省略句号；标题部分句末严禁添加句号。

由于使用中文编写文档注释，当注释中某一行**无论有多长，都不应在中间插入换行**以使行字数少于阈值，这是因为 Markdown 渲染器会在换行处插入一个空格，这在中文中是大忌。\
如果确实需要换行，则请在换行处的行末插入一个反斜杠（无行间距的小换行），或者连换两行（带有行间距的大换行）。\
严禁在行末插入两个空格来表示换行，因为 EditorConfig 会移除所有行末空白。

JSDoc 中所有的@标签必须使用统一的名称，例如应该使用 `@returns` 而不是 `@return`，应该使用 `@template` 而不是 `@typeParam`，等等。\
其中函数参数部分必须在参数名后加上连字符（换行时除外），例如：
- 正确：@param options - 其它选项。
- 错误：@param options 其它选项。
- 错误：@param options - 其它选项

针对布尔类型的参数或变量的文档注释，必须使用*一般疑问句*形式，以问号结尾。例如：
- 正确：是否要在新窗口打开链接？
- 错误：如果要在新窗口打开链接，则为 true；否则为 false。

位于 SCSS 文件中的文档注释（SassDoc），应使用三斜线注释（`///`），而不是（`/** */`）。

对于 Vue 组件本身的文档说明，请在 Vue 组件顶部添加一个 `<docs>` 块，并将文档写在里面，语法遵循 Markdown 格式。

## 测试

请在本地浏览器中测试变更后的流程，并使用 `/dev/components` 检查可复用 UI。独立的 `plugins/postcss/*.test.ts` 脚本会输出转换后的 CSS 以供检查。目前使用 `pnpm exec tsx <file>`运行这些脚本时，需要解决 TypeScript 别名解析错误，并提供未声明的 `postcss-selector-parser` 依赖。该项目没有包级测试脚本或覆盖率要求。

## 提交与拉取请求

请使用*约定式提交*格式，例如 `fix(search): disable auto focus`。Husky 会通过 Commitlint 检查提交信息。目标分支为 `develop`，描述变更内容及验证方式，并在适用时关联或关闭相关议题。对于可见的用户界面变更，请附上截图从而有助于审查。
