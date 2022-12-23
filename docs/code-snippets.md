# 代码片段
本项目已增加部分常用代码片段以便快速调用。

目前仅支持 Visual Studio Code，对于其它编辑器 / IDE，请您手动补充。

## 使用方法
例如在 `*.vue` 文件中，仅需输入 `init`，然后按键盘上的 <kbd>TAB</kbd> 键，即可快速插入该代码片段。

## 范例

### Vue

#### `init`

快速初始化 Vue 组件模板。

```html
<script setup lang="ts">
	
</script>

<template>
	
</template>

<i18n lang="json5">
	
</i18n>

<style scoped lang="scss">
	
</style>
```

### TypeScript

#### `props`

快速定义 Vue 组件属性。

```typescript
const props = withDefaults(defineProps<{
	
}>(), {
	
});
```

#### `emits`

快速定义 Vue 组件事件。

```typescript
const emits = defineEmits<{
	(event: "update", arg: ): void;
}>();
```
