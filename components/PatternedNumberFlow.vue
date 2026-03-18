<script setup lang="ts">
	import { Duration } from "classes/Duration";

	const props = defineProps<{
		/**
		 * 指定数字的样板格式。
		 * - `"unit"`: 标准带有前后缀的数字格式。
		 * - `"time"`: 带有时（可选）分秒的数字格式。
		 */
		value: Readable | Duration;
	}>();

	type NumberFlowValue = Writable<InstanceType<typeof NumberFlow>["$props"]>;

	const scopeId = useParentScopeId()!;

	const numberFlowValues = computed<NumberFlowValue[]>(() => {
		const value = props.value;

		if (typeof value === "number" || typeof value === "bigint")
			return [{ value: Number(value) }];

		if (typeof value === "string") {
			const { 1: prefix = "", 2: value_string = "", 3: suffix = "" } = value.toString().match(/^(.*?)(-?\d+(?:\.\d+)?)(.*)$/) ?? [];
			return [{ prefix, value: +value_string, suffix }];
		}

		if (value instanceof Duration) {
			const { colon, minus } = Duration as unknown as Record<string, string>;
			const { negative } = value;
			const result: NumberFlowValue[] = (value.h ? [value.h, value.m, value.s] : [value.m, value.s]).map(value => ({ value, prefix: colon, trend: negative ? -1 : 1, format: { minimumIntegerDigits: 2 } }));
			result[0].prefix = undefined;
			if (negative) result[0].prefix = minus;
			return result;
		}

		throw new TypeError("Unknown value pattern for PatternedNumberFlow");
	});
</script>

<template>
	<div v-if="value instanceof Duration && !value.valid" v-bind="{ ...$attrs, [scopeId]: '' }">{{ value.toString() }}</div>
	<NumberFlow v-else v-for="(value, i) in numberFlowValues" :key="i" v-bind="{ ...$attrs, [scopeId]: '', ...value }" />
</template>
