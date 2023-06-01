<script setup lang="ts">

</script>

<template>
	<Subheader icon="badge">{{ t.profile }}</Subheader>
	<div class="chip radio-group">
		<ToggleSwitch v-ripple>{{ t.birthday }}</ToggleSwitch>
		<ToggleSwitch v-ripple>{{ t.gender }}</ToggleSwitch>
		<ToggleSwitch v-ripple>注册时间</ToggleSwitch>
	</div>
	<Subheader icon="placeholder">Placeholder</Subheader>
	<div class="chip radio-group">
		<ToggleSwitch v-ripple>关注</ToggleSwitch>
		<ToggleSwitch v-ripple>粉丝</ToggleSwitch>
		<ToggleSwitch v-ripple>收藏</ToggleSwitch>
	</div>
</template>
