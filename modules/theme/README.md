[![@nuxtjs/color-mode](https://color-mode.nuxtjs.org/cover.jpg)](https://color-mode.nuxtjs.org)

# @KIRAKIRA-DOUGA/theme

> 原项目名称：**@nuxtjs/color-mode**
>
> 使用 Nuxt 轻松实现自动检测的🌑深色和🌕浅色模式。

KIRAKIRA 的主题配色模式模块基于官方 Nuxt Color Mode 模块修改而成。

除深浅色和系统自动外，增加了主题色改变的设置。

原版官网地址：[@nuxtjs/color-mode](https://color-mode.nuxtjs.org/)

[![nuxt-color-mode](https://user-images.githubusercontent.com/904724/79349768-f09cf080-7f36-11ea-93bb-20fae8c94811.gif)](https://color-mode.nuxtjs.app/)

---

### 注意：
20240209 @cfdxkk 重写了这一部分

现在，如果你想要添加一个新的，可同步的、持久化的、（尽可能）不闪烁的用户主题设置项，必须要按照以下步骤在正确位置上编写代码，以免造成状态管理混乱。

1. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 1 在此处添加` 的注释前创建空行，并添加全局变量，变量名和值需要和 `HACK 3 在此处添加` 位置添加的局部变量一致
2. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 2 在此处添加` 的注释前创建空行，并添加全局变量，变量名和值需要和 `HACK 4 在此处添加` 位置添加的局部变量一致
3. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 3 在此处添加` 的注释前创建空行，并添加局部变量，变量名和值需要和 `HACK 1 在此处添加` 位置添加的全局变量一致
4. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 4 在此处添加` 的注释前创建空行，并添加局部变量，变量名和值需要和 `HACK 2 在此处添加` 位置添加的全局变量一致
5. 在 `modules\theme\composables.ts` 中标有 `HACK 5 在此处添加` 的注释前创建空行，并编写一个获取 nuxt 响应式 cookie 对象的代码
6. 在 `modules\theme\composables.ts` 中标有 `HACK 6 在此处添加` 的注释前创建空行，并编写一个把后端请求结果赋值给 nuxt 响应式 cookie 对象的代码
7. 在 `modules\theme\composables.ts` 中标有 `HACK 7 在此处添加` 的注释前创建空行，并编写一个后端请求结果赋值的代码，别忘记设置默认值
8. 在 `modules\theme\composables.ts` 中标有 `HACK 8 在此处添加` 的注释前创建空行，并编写一个把后端请求结果存放到 cookie 中的代码
9. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 9 在此处添加` 的注释前创建空行，并定义一个正确的变量名
10. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 10 在此处添加` 的注释前创建空行，并编写一个从 localStorage 中获取用户设置的代码，并赋值给变量，不要忘记默认值
11. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 11 在此处添加` 的注释前创建空行，并编写一个将变量添加到 cookie 的代码，不要忘记非空验证
12. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 12 在此处添加` 的注释前创建空行，并编写一个从 cookie 中获取用户设置的代码，并赋值给变量，不要忘记默认值
13. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 13 在此处添加` 的注释前创建空行，并编写一个将变量添加到 localStorage 的代码，不要忘记非空验证
14. 在 `modules\theme\cookieBinding.ts` 中标有 `HACK 14 在此处添加` 的注释前创建空行，并编写一个根据变量值，将正确样式绑定到正确位置的代码
15. 参照 `modules\theme\composables.ts` 中标有 `HACK 15 请参照此部分 ↓ ↓ ↓` 和 `HACK 15 请参照此部分 ↑ ↑ ↑` 的注释中间的代码，在 `HACK 15 在此处添加` 的注释前创建空行，并编写一个像后端发送修改用户设置请求的方法
16. 参照 `pages\settings\appearance.vue` 中标有 `HACK 16 请参照此部分 ↓ ↓ ↓` 和 `HACK 16 请参照此部分 ↑ ↑ ↑` 的注释中间的代码，创建 nuxt cookie 对象，并绑定（v-model）到在你想要添加的设置项所对应的 vue 模板的开关或其他选择器上
