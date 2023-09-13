<script setup lang="ts">
	const passwordChangeDate = ref(new Date());
	const authenticatorAddDate = ref(new Date());
	const passwordChangeDateDisplay = computed(() => formatDateWithLocale(passwordChangeDate.value));
	const authenticatorAddDateDisplay = computed(() => formatDateWithLocale(authenticatorAddDate.value));
	const email = ref("aira@aira.cafe");

	const showChangePassword = ref(false);

	const oldPassword = ref("");
	const newPassword = ref("");
	const confirmNewPassword = ref("");
</script>

<template>
	<section>
		<SettingsChipItem
			icon="email"
			trailingIcon="edit"
			:details="t.current_email + t.colon + email"
		>{{ t.email_address }}</SettingsChipItem>
	</section>
	<section>
		<SettingsChipItem
			icon="password"
			trailingIcon="edit"
			:details="t.modification_date + t.colon + passwordChangeDateDisplay"
			@trailingIconClick="showChangePassword = true"
		>{{ t.password }}</SettingsChipItem>
	</section>
	<section>
		<SettingsChipItem
			icon="qr_code_scanner"
			trailingIcon="edit"
			:details="t.addition_date + t.colon + authenticatorAddDateDisplay"
		>{{ t.authenticator }}</SettingsChipItem>
	</section>

	<Modal v-model="showChangePassword" :title="t.password.change" icon="password">
		<div class="change-password-modal">
			<div>
				<TextBox v-model="oldPassword" type="password" icon="lock" :placeholder="t.password.current" />
				<TextBox v-model="confirmNewPassword" type="password" icon="lock" :placeholder="t.password.new" />
				<TextBox v-model="newPassword" type="password" icon="lock" :placeholder="t.password.new_retype" />
			</div>
		</div>
		<template #footer-right>
			<Button class="secondary" @click="showChangePassword = false">{{ t.step.cancel }}</Button>
			<Button>{{ t.step.apply }}</Button>
			<!-- TODO: Use a toast to show success or not, usage can be seen in page/components. -->
			<!-- if success, the modal should be closed automaticly -->
		</template>
	</Modal>
</template>

<style scoped lang="scss">
	.change-password-modal {
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 300px;

		> div {
			display: flex;
			flex-direction: column;
			gap: 16px;
		}
	}
</style>
