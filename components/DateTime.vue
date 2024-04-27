<script setup lang="ts">
	const props = defineProps<{
		/** 日期时间对象。 */
		dateTime: Date | null;
		/** 是否同时显示时间？ */
		showTime?: boolean;
	}>();
</script>

<template>
	<time :datetime="dateTime?.toISOString()"><slot>{{ formatDateWithLocale(dateTime, { time: showTime }) }}</slot></time>
</template>
