<!-- DELETE: 即将删除！ -->

<script setup lang="ts">
	const combobox = ref("default");
	const now = useNow();
	const intervalId = ref<Timeout>();
	const testValue = ref<string[]>([]);

	onMounted(() => {
		const foobar = ["foo", "bar", "baz", "qux"];
		let i = 0;
		intervalId.value = setInterval(() => {
			testValue.value = foobar.slice(0, i++ + 1);
			i %= 4;
		}, 1000);
	});

	onUnmounted(() => {
		clearInterval(intervalId.value);
	});
</script>

<template>
	<TopBar>
		<template #leading>
			<Icon name="dehaze" class="decorative-icon" />
			<UserAvatar />
			<LogoText />
		</template>
		<template #trailing>
			<SoftButton v-tooltip:bottom="t.messages" icon="email" />
			<SoftButton v-tooltip:bottom="t.search" icon="search" href="/search" />
		</template>
	</TopBar>

	<TopBar>
		<template #leading>
			<Icon name="dehaze" class="decorative-icon" />
			<UserAvatar />
			分区
		</template>
		<template #trailing>
			<SoftButton v-tooltip:bottom="t.messages" icon="email" />
			<SoftButton v-tooltip:bottom="t.search" icon="search" href="/search" />
		</template>
	</TopBar>

	<TopBar>
		<template #leading>
			<SoftButton v-tooltip:bottom="t.navigation.back" icon="arrow_left" />
			This is a Title
		</template>
	</TopBar>
	
	<!-- 测试下拉框的 bug -->
	<ComboBox v-model="combobox" :style="{ width: '400px', margin: '2rem' }">
		<ComboBoxItem id="default">default</ComboBoxItem>
		<ComboBoxItem id="time">{{ now }}</ComboBoxItem>
		<ComboBoxItem v-for="v in testValue" :id="v" :key="v">{{ v }}</ComboBoxItem>
	</ComboBox>
</template>

<style scoped lang="scss">
	.top-bar {
		top: 0;

		.decorative-icon {
			$size: 24px;
			margin-left: calc($size / -2) - 4px;
			color: white;
			font-size: $size;
		}

		.logo-text {
			--form: logo_half;

			:deep(> div) {
				color: white;
			}
		}

		.user-avatar {
			--size: 40px;
		}
	}
</style>
