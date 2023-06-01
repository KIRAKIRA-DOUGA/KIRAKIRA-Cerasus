<script setup lang="ts">
	const passwordChangeDate = ref(new Date());
	const authenticatorAddDate = ref(new Date());
	const passwordChangeDateDisplay = computed(() => formatDate(passwordChangeDate.value, "yyyy-MM-dd"));
	const authenticatorAddDateDisplay = computed(() => formatDate(authenticatorAddDate.value, "yyyy-MM-dd"));
	const email = ref("aira@aira.cafe");
</script>

<template>
	<!-- TODO: [艾拉] 设计弹出内容 -->
	<div class="chip">
		<SettingsChipItem
			icon="email"
			afterIcon="edit"
			:details="t.current_email + t.colon + email"
		>{{ t.email_address }}</SettingsChipItem>
	</div>
	<div class="chip">
		<SettingsChipItem
			icon="password"
			afterIcon="edit"
			:details="t.modification_date + t.colon + passwordChangeDateDisplay"
		>{{ t.password }}</SettingsChipItem>
	</div>
	<div class="chip">
		<SettingsChipItem
			icon="qr_code_scanner"
			afterIcon="edit"
			:details="t.addition_date + t.colon + authenticatorAddDateDisplay"
		>{{ t.authenticator }}</SettingsChipItem>
	</div>
</template>
