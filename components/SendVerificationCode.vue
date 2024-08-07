<docs>

</docs>

<script setup lang="ts">
	const value = defineModel<string | number>({ required: true });
	const timeout = ref(20);
</script>

<template>
	<TextBox v-model="value" :required="true" type="text" icon="verified" placeholder="验证码">
		<template #actions>
			<Button :style="{
				'--appearance': timeout === 0 ? 'secondary' : 'tertiary',
				'pointer-events': timeout === 0 ? 'auto' : 'none',
			}"
			>
				<template v-if="timeout === 0">{{ t.send }}</template>
				<template v-else>{{ `${t.send} (${timeout})` }}</template>
			</Button>
		</template>
	</TextBox>
</template>

<style scoped lang="scss">
</style>
