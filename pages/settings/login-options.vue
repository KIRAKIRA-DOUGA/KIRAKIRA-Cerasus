<script setup lang="ts">
	const passwordChangeDate = ref("");
	const authenticatorAddDate = ref("");
	const email = ref("");
</script>

<template>
	<span></span>
	<div class="chip">
		<SettingsChipItem
			icon="email"
			afterIcon="edit"
			:details="t.emailAddressCurrent + email"
		>{{ t.emailAddress }}</SettingsChipItem>
	</div>
	<div class="chip">
		<SettingsChipItem
			icon="password"
			afterIcon="edit"
			:details="t.changeDate + passwordChangeDate"
		>{{ t.password }}</SettingsChipItem>
	</div>
	<div class="chip">
		<SettingsChipItem
			icon="qr_code_scanner"
			afterIcon="edit"
			:details="t.addDate + authenticatorAddDate"
		>{{ t.authenticator }}</SettingsChipItem>
	</div>
</template>
