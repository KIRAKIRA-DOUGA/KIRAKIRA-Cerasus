# KIRAKIRA☆DOUGA 前端项目规范

## 简要
1. **JavaScript 框架：**<wbr>Vue
1. **Vue API 风格：**<wbr>组合式 [(?)](https://cn.vuejs.org/guide/introduction.html#single-file-components)
1. **使用类型系统：**<wbr>TypeScript
1. **Vue 服务器渲染工具：**<wbr>Nuxt
1. **Vue 路由：**<wbr>Vue Router
1. **打包工具：**<wbr>Vite
1. **代码混淆工具：**<wbr>terser、esbuild
1. **代码规范工具：**<wbr>ESLint、Stylelint
1. **CSS 预处理器：**<wbr>SCSS\
注：如不会 SCSS，可照常写纯 CSS，但是声明为 SCSS 格式。即可以按需使用 SCSS 的功能。
1. **ECMAScript 标准：**<wbr>ESNext，即使用最新的标准。如果不会可使用旧标准。
1. **模块化规范：**<wbr>ES Module。即使用 import 而不是 require 或其它来导入模块。
1. **包管理器：**<wbr>NPM（**NEVER USE Yarn!**）
1. **协议：**<wbr>BSD 3‐Clause
1. **不需要 Babel！**
## Vue 文件模板
所有内容均缩进一个层级。
```html
<script lang="ts">
	// 本段 script 标签仅在需要时
</script>

<script setup lang="ts">
	//
</script>

<template>
	<!-- -->
</template>

<style scoped lang="scss">
	/* */
</style>

```

## 项目目录结构
```
kirakira-douga               # 项目名称
	node_modules             # NPM 模块，记得放进 .gitignore
	dist                     # 打包目录
	static                   # 静态目录
		favicon.ico          # 网站图标
		index.html           # 单页面的 HTML
		robots.txt           # 搜索引擎索引
		apple-touch-icon.png # 苹果图标（这真的需要吗？）
		CNAME                # GitHub 域名解析
		sitemap.xml          # 网站地图
	.nuxt                    # Nuxt 工作目录
	assets                   # 资源目录：如图片、音效、GIF
		img                  # 图片目录
		icon                 # 图标目录
		svg                  # SVG 目录
		fonts                # 字体目录
	components               # 用户控件组件：如滑块、输入框
	composables              # 可复用组合逻辑
	content                  # 内容目录
	layouts                  # 布局目录
	middleware               # 中间件目录
	modules                  # 自定义模块目录？
	pages                    # 路由页面组件：如首页、播放页
	plugins                  # 插件目录
	utils                    # 工具目录，杂项 ts 函数方法等
	styles                   # 全局样式目录
		global.scss          # 公共样式
		reset.scss           # 重置样式
	server                   # 服务器目录
	store                    # vuex 存储目录
	App.vue                  # 根组件
	main.ts                  # 项目入口
	test                     # 测试目录（可选）
	types                    # TypeScript 类型补充目录
		vue-shims.d.ts       # 让 TypeScript 识别 Vue 文件
	package.json             # 项目信息、依赖模块
	package-lock.json
	tsconfig.json            # TypeScript 配置文件
	.eslintrc.json           # ESLint 配置文件
	.eslintignore            # ESLint 忽略文件
	.gitignore               # Git 忽略文件
	.browserslistrc          # 浏览器兼容配置文件
	LICENSE                  # 协议，我们使用 GPL 协议
	README.MD                # 项目描述，展示在 GitHub 上
	nuxt.config.js           # Nuxt、Vue 和 Webpack 配置文件
```

## 插件
1. autoprefixer：自动加 CSS 前缀
1. 待填……
## 命名规范
### 文件名
1. **项目名：**<wbr>全部小写，短横线分隔。例如：*kirakira-douga*。
1. **目录名：**<wbr>全部小写，短横线分隔。如果是完整的单词且单词可数则采用复数形式，如果是缩略词则不用复数。例如：*docs、assets、components*。
1. **图像文件名：**<wbr>全部小写，下划线分隔。例如：*menu_aboutus.gif、menutitle_news.gif、pic_people.jpg、pic_TV.jpg*。
1. **HTML 文件名：**<wbr>全部小写，下划线分隔。例如：*error_report.html、success_report.html*。
1. **SCSS 文件名：**<wbr>全部小写，短横线分隔。例如：*normalize.scss、base.scss*。
1. **TypeScript 无默认导出模块文件名：**<wbr>全部小写，短横线分隔。例如：*index.ts、transition-variables.ts、export-plugin.ts*。
1. **TypeScript 有默认导出模块文件名：**<wbr>以默认导出模块的变量名称及其形式命名。
1. **TypeScript 类 / 枚举类 / 抽象类 / 接口模块名：**<wbr>大驼峰形式。以默认导出类模块名称命名。
1. **Vue 组件名：**<wbr>大驼峰形式。以组件名称命名。例如：*MyComponent.vue、CustomCard.vue*。
### 变量名
#### TypeScript
1. **类 (class) 名：**<wbr>大驼峰形式。例如：*Video、Json、Midi*。
1. **方法 (method) / 函数 (function) / 箭头函数 (lambda) 名：**<wbr>小驼峰形式。使用动词形式或动词加名词形式。例如：*play()、getValue()、setName()*。
1. **变量名：**<wbr>小驼峰形式。例如：*title、age、password*。
1. **布尔型变量名：**<wbr>小驼峰形式。使用 is 加名词 / 形容词 / 副词或动词的过去分词形式。例如：*isMale、isShown、isWatched、isVip、isPoorVip*。
1. **数组变量名：**<wbr>小驼峰形式。使用名词的复数形式。例如：*videos、songs、controls*。
1. **抽象类 (abstract) 名：**<wbr>大驼峰形式。以 Base 开头。例如：*BaseButton、BaseFile*。
1. **接口 (interface) 名：**<wbr>大驼峰形式。以 I 开头。例如：*IConfig、IController*。注意必须是用作类实现的接口，不是可与类型名互换的接口，对于后者，与类型名命名一致。
1. **类型 (type) 名：**<wbr>大驼峰形式。例如：*Prop、State、ControlType*。
1. **枚举类型 (enum) 名：**<wbr>大驼峰形式。以 Type 结尾。例如：*UserType、ImageType*。
1. **常量名：**<wbr>全部大写，下划线分隔。例如：*MAX_COUNT、GUEST_USER_NAME*。
1. **私有类成员、方法名：**<wbr>以 # 开头。例如：*#privateValue、#getSomethingPrivately()*。
1. **自定义命名空间：**<wbr>大驼峰形式。以 NS 结尾。例如：*MyVueNS、ConfigNS*。
#### SCSS
1. **class 名：**<wbr>全部小写，短横线分隔。（有待商议，因为在对象中需要额外加引号。）
1. **id 和 ref 名：**<wbr>小驼峰形式。例如：*videoSidebar*。
1. **key 名：**<wbr>全部小写，短横线分隔。例如：*list-item-1、menu-item-2*。
1. **CSS 自定义属性名：**<wbr>全部小写，短横线分隔。以 “--” 开头。例如：*-&#8288;-&#8288;accent-color、--title-font-size*。
1. **SCSS 自定义变量名：**<wbr>全部小写，短横线分隔。以 “$” 开头。例如：*\$&#8288;accent-color、$title-font-size*。
#### Vue
1. **name：**<wbr>大驼峰形式。例如：*TodoList、LoginWindow*。
1. **prop：**<wbr>在命名中使用小驼峰形式；在模板中使用全部小写，短横线分隔。
1. **router：**<wbr>全部小写，短横线分隔。例如：*/user-info*。
1. **自定义事件方法/子通信父回调函数：**<wbr>小驼峰形式。~~使用 on 加对应事件的名称。例如：*onClick、onHover、onKeydown、onMenuItemClick*。~~<wbr>不要加 on 了，要不然会变成 onOn*。

**注意：**<wbr>将缩略词视为一个单词，例如：*XmlHttpRequest、getElementById、getJson*。
## 代码规范（Lint）
### HTML
1. 所有空元素标签需要自闭合。
	```html
	<!-- bad -->
	<input type="text">

	<!-- good -->
	<input type="text" />
	```
1. `<html lang="zh-cmn-Hans-CN">`\
为了保证兼容性，应该写完整。其中 zh 表示中文，cmn 表示普通话，Hans 表示简体字，CN 表示大陆地区。

1. 自定义 Vue 组件应该以大驼峰形式命名，以和 HTML 内置标签区分开。HTML 内置标签应当全部小写。
1. 属性不得省略引号。
1. 当标签属性在 xxx(待填) 字符内时应该写成单行，否则写成多行，一个属性占一行。
	```html
	<!-- one line -->
	<MyComponent width="320" height="180" />

	<!-- multi lines -->
	<MyComponent
		width="320" 不要将第一个属性放在标签名之后
		height="180"
		title="Some Title"
		background-color="green"
		:style="myStyle"
	/> <!-- 关尖括号放在单独一行 -->
	```
1. 在 template 内，如果可以写成自闭合标签，不要分开写关标签。
	```html
	<!-- bad -->
	<MyComponent></MyComponent>
	<!-- good -->
	<MyComponent />
	```
1. 注释的箭头内侧各增加一个空格。
	```html
	<!--bad-->
	<!-- good -->
	```

### SCSS
1. 如果可以，请尽量使用 SCSS 变量而不是 CSS 属性。如与元素相关、TS 动态调整时才使用 CSS 属性。
	```scss
	// SCSS 变量仅在作用域内生效即可，不需要依赖元素。
	.my-component {
		$size: 100px;
		width: $size;
		height: $size;

		$color: red;
		color: red;
		&:hover {
			color: white;
			background-color: $color;
		}
	}

	// 此时 SCSS 变量无法生效，只能依靠对应元素的 CSS 属性生效。
	@keyframes my-animation {
		from {
			transform: rotate(var(--angle));
		}
		to {
			transform: rotate(0);
		}
	}
	```

1. 如果 `@keyframes` 动画仅有起止两个关键帧，应当依次命名为 from 和 to，否则命名为 0% 和 100%。
	```scss
	@keyframe two-keyframes {
		from { /* */ }
		to { /* */ }
	}

	@keyframe three-keyframes {
		0%, 100% { /* */ }
		50% { /* */ }
	}
	```

1. 不要使用 `@import` 导入外部 CSS 文件，但是可以导入 SCSS 文件。前者将会额外产生异步网络获取开销，而后者会在编译时自动打包在一起。
1. 对于数值 0，不要在其后写任何单位。反例：0px、0rem。例外：0s、0ms。
1. 不要使用空规则集，这会在 VSCode 中抛出一个警告。如果非要使用，请改用如下 good 形式。
	```scss
	// bad
	div {
		/* 一些被全部注释掉的规则声明 */
	}

	// good
	/* div {
		一些被全部注释掉的规则声明
	} */
	```

1. 在块注释符号内侧各增加一个空格，在行注释前后方（位于代码后）或后方（位于行首）增加一个空格。
1. 对于颜色值，请写成 16 进制格式。且如果可以，请尽量写成三位或四位颜色值。
	```scss
	* {
		// bad
		color: rgb(254, 254, 254);
		color: hsl(0, 0%, 100%);
		color: hwb(0 100% 0%);
		color: rgba(254, 254, 254, 0.96);
		color: rgb(254, 254, 254 / 96%);
		// good
		color: #fefefe;
		color: #fefefef5;

		// bad
		color: #4488cc;
		color: #4488ccff;
		// good
		color: #48c;
		color: #48cf;
	}
	```

1. 不需要添加各浏览器私有属性（`-webkit、-moz、-ms、-o`），有插件来做这一切。
### Vue
1. data（数据）。对于按引用传递（`typeof obj === "object"`，除 `null` 外）的数据用 reactive()，对于按值传递（原始类型）的数据用 ref()。
	```typescript
	// 对象，使用 reactive()
	const user = reactive({
		name: "Aira",
		age: new Date().getFullYear() - 2003,
	});

	// 原始类型，使用 ref()
	const year = ref<number | string>("2023");

	// 不指定初始值
	const value = ref<number>();
	// 此时 value 类型为 number | undefined。
	```

1. methods（方法）。直接定义函数即可。
	```typescript
	function increment() {
		state.count++;
	}
	```

1. computed（计算属性）。
	```typescript
	// 只读属性
	const now = computed(() => Date.now());

	// 可写属性
	const realQiaobiluoAge = ref(58);
	const qiaobiluoAge = computed({
		get(): number {
			return realQiaobiluoAge - 29;
		},
		set(value: number): void {
			realQiaobiluoAge.value = value + 29;
		},
	});
	```

1. mounted、unmounted、updated 等内置函数。从 vue 命名空间中**由插件自动**获取。
	```typescript
	import { onMounted } from "vue";

	onMounted(() => {
		// 对 DOM 的直接操作，或第三方不支持 Vue 的模块的调用。如 videojs。
	});
	```

1. components（组件）、composables（可复用组合逻辑）。不用 import 直接使用。

1. props（属性，类似于 HTML tag 的 attr）。使用 TypeScript 的类型注解，不要使用 Vue 自带的类型注解。
	```typescript
	interface Props {
		foo: string;
		bar?: number;
	}

	// 不带默认值
	const props = defineProps<Props>();

	// 带默认值
	const props = withDefaults(defineProps<Props>(), {
		foo: "hello",
	});
	```

1. ref（引用）。~~应初始化为 null。~~<wbr>是个 undefined 就行。
	```html
	<script setup lang="ts">
		import MyComponent from "./MyComponent.vue";

		const myDiv = ref<HTMLDivElement>();
		// 变量名与 ref 名称一致。
		const myComponent = ref<InstanceType<typeof MyModal>>();
		// 自定义组件引用写法。
	</script>
	<template>
		<div ref="myDiv"></div>
		<MyComponent ref="myComponent" />
	</template>
	```

1. nextTick（下一刻）正确写法。
	```typescript
	import { nextTick } from "vue";

	async function myFunction() { // 先将该函数标记为 async。
		// 更新前
		await nextTick();
		// 更新后
	}
	```

1. 不要在模板中写复杂语法（一个简单的 lambda 除外），请转换成计算属性。
1. 在文件末尾增加一个空行！
### TypeScript
1. **缩进形式：TAB（制表符）**。
	```typescript
	// 三元运算符嵌套写法
	const result =
		arg === 0 ? a :
		arg === 1 ? b :
		arg === 2 ? c : d;

	// switch case 写法
	switch (score) {
		case 100:
		case 90:
			break; // case 缩进一层，里面的内容再缩进一层。
		case 80: { // 如果需要在 case 顶层定义变量，用花括号将内容括起来。
			const foo = "bar";
			break; // 尽量不要 switch 穿透，如有必要，有一个 eslint 标记。
		}
		default: // 不要省略 default。
			break;
	}

	// 缩进使用 TAB 的好处是编者可以使用任何习惯的缩进值显示，
	// 永远不要对齐变量、属性、字段或注释等。

	// bad
	let width  =   160,                    // width  value
		height =    90,                    // height value
		size   = 14400;                    // size   value
	// good
	let width = 160, // width value
		height = 90, // height value
		size = 14400; // size value

	// 如果觉得如下形式不好看
	const a = 0,
		b = 0,
		c = 0;
	// 请修改为
	const
		a = 0,
		b = 0,
		c = 0;
	```

1. 行尾形式：LF（Linux）。\
~~理由就是正则表达式匹配行尾时得写成 \r\n，很烦。~~
1. **引号：优先双引号。**<wbr>仅在 HTML attr 的双引号中或字符串仅包含双引号时改为单引号。仅在需要在字符串中包含变量时使用模板字符串（反单引号）。如果需要包含多行字符串，不要使用模板字符串，一是字符串前的缩进需要去除以免包含在结果中且影响美观，二是会对代码压缩工具造成麻烦。
	```typescript
	// bad
	foo = 'bar';
	foo = `bar`;
	foo = `hello

	world`;

	// good
	foo = "bar";
	foo = '<input type="text" value="bar" />';
	foo = `<input type="text" value=${bar}>`;
	foo = "hello\n\nworld";
	```

1. 永远在行尾写分号。~~理由是除了 JS、Python 等外可能还写其它语言，容易混乱。~~<wbr>但是在定义 function、class、enum、interface、namespace 时一律不写分号，但是写匿名函数、箭头函数、类表达式时又要写分号。~~总之就是编译器提示哪少分号哪多分号直接改就行。~~
	```typescript
	// 要写分号
	const foo = "bar";
	const foo = () => "bar";
	const foo = () => { return "bar"; }; // 内外均要写分号。
	const foo = function () { return "bar"; };
	const Foo = class { };
	const foo = {
		bar: "bar",
		baz: false,
	};
	$("#foo").click(function () {
		$(this).text("bar");
	});

	// 不要写分号（注意看末尾，不是成员变量）
	function foo() {
		return "bar";
	}
	class Foo {
		bar: number;
	}
	enum FooType {
		BAR,
	}
	interface IFoo {
		bar: number;
	}
	```

1. 写成单行时，在花括号的内侧增加空格。其它括号不用。
	```typescript
	const foo = { };
	function foo() { }
	const foo = { bar: "bar" };
	function foo() { return "bar"; }
	const foo = ["bar"];
	```

1. 单行时一律不尾随逗号，多行时一律尾随逗号。
	```typescript
	foo = [1, 2, 3];
	foo = { bar: 1, baz: 2 };
	foo = bar(1, 2, 3);
	enum FooType { BAR, BAZ }

	foo = [
		1,
		2,
		3,
	];
	foo = {
		bar: 1,
		baz: 2,
	};
	foo = bar(
		1,
		2,
		3,
	);
	enum FooType {
		BAR, BAZ,
	}
	```

1. 在文件末尾增加一个空行！
1. 不要在 switch 中包含重复的 case。
1. 只能使用三等号 “===”，不能使用二等号 “==”。
1. 不允许数字以小数点开头或结尾。
	```typescript
	// bad
	[.25, 25.]
	// good
	[0.25, 25]
	```

1. 不允许使用以 0 开头的八进制数字表示。取而代之的是以 0o 开头。
	```typescript
	// bad
	017
	// good
	0o17

	// 另付
	0b11 // 二进制
	0xab // 十六进制
	```

1. 使用 parseInt 时，一律指定数字的进制。
	```typescript
	let value = "017";
	// bad
	parseInt(value); // 这将会错误转换为八进制。
	// good
	parseInt(value, 10); // 指定这是十进制。毕竟你永远无法想象客户会怎样使用你的产品。
	```

1. 缩进时不要混合制表符（TAB）和空格。
1. 块注释内侧各增加一个空格，前后方如果不是行首尾则增加一个空格。行注释后方增加一个空格，前方如果不是行首则增加一个空格。
	```typescript
	/* 块注释 */
	代码 /* 块注释 */ 代码

	// 行注释
	代码 // 行注释

	/**
	* JSDoc 注释，记得多写！
	*/

	// 下列所述注释一定都不要用，虽然都是合法的。
	<!-- 看着像块注释，
	--> 但实际上是行注释。
	#! 这个只在文件开头能用。
	```

1. 不要使用 var，使用 let 和 const 代替之。\
究竟是用 let 还是 const？**一律用 const**，仅在需要对变量重新赋值时（使用 const 发现会报错时）才用 let。
1. 不要使用 any 类型，不要写 AnyScript，就像不要做「音 MIDI」。\
永远使用 TypeScript 正确推断出类型，可以适当断言。
1. 不要创建空的块作用域（花括号）。
1. 禁止在判断条件中使用常量值，循环除外。
1. 下列行为有些迷惑，尽量少做，但也不是不可做。
	```typescript
	do {
		if (true)
			break;
	} while (false);

	for (const element of array) {
		switch (element) {
			case someValue:
				continue;
			default:
				break;
		}
	}

	loop: for (let i = 0; i < array.length; i++)
		for (let j = 0; j < array[i].length; j++)
			if (array[i][j])
				continue loop;
	```

1. if、for、while 等如果只包含一条语句，则一律不加花括号；如果包含多条语句，则一律加花括号。
1. 最好一切都模块化，能拆就拆。

## .eslintrc.js 范例
## .editorconfig 范例
## tsconfig.json 范例
## .gitignore 范例
以上四个部分直接去左边项目中去找。

## 参考
* [史上最全 Vue 前端代码风格指南](https://juejin.cn/post/6987349513836953607)
* [vue 项目开发规范](https://www.cnblogs.com/zxr1002/p/16846234.html)
