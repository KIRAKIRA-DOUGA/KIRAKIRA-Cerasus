<script setup lang="ts">
	import banner from "assets/images/banner-20220717.png";

	const avatar = "/static/images/avatars/aira.webp";
	const profile = reactive({
		name: "艾了个拉",
		bio: "",
		gender: "female",
		birthday: new Date(),
		tags: [] as string[],
	});

	/**
	 * Update the user profile.
	 */
	async function updateProfile() {
		const api = useApi();

		const encodedName = encodeUtf8(profile.name);
		const encodedGender = encodeUtf8(profile.gender);
		const encodedBio = encodeUtf8(profile.bio);
		const handleError = (error: unknown) => error && console.error(error);

		try {
			await api?.updateProfile(encodedName, encodedGender, profile.birthday.toString(), encodedBio);
		} catch (error) { handleError(error); }
	}
</script>

<template>
	<div v-ripple class="banner">
		<img :src="banner" alt="banner" draggable="false" />
		<span>{{ t.profile.edit_banner }}</span>
	</div>

	<div class="change-avatar">
		<UserAvatar :avatar="avatar" />
		<span>{{ t.profile.edit_avatar }}</span>
	</div>

	<div class="items">
		<SettingsUserProfile v-model="profile" />
	</div>

	<div class="submit">
		<Button icon="reset" class="secondary">{{ t.step.reset }}</Button>
		<Button icon="check" @click="updateProfile">{{ t.step.save }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.banner {
		@include round-large;
		position: relative;
		overflow: hidden;
		background-color: c(gray-5);

		> img {
			z-index: 1;
			width: 100%;
			height: 150px;
			object-fit: cover;
			cursor: pointer;

			&:any-hover {
				filter: brightness(0.75) blur(2px);
				scale: 105%;

				& + span {
					opacity: 1;
				}
			}

			&:not(:any-hover) {
				transition-duration: 1s;
			}
		}

		span {
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 5;
			margin: 1rem;
			color: white;
			opacity: 0;
			pointer-events: none;
		}
	}

	.change-avatar {
		z-index: 5;
		display: flex;
		gap: 0.75rem;
		align-items: flex-end;
		margin: -48px 0 12px 24px;
		color: c(icon-color);
		pointer-events: none;

		.user-avatar {
			--size: 64px;
			pointer-events: auto;

			&:any-hover + span {
				opacity: 1;
			}
		}

		span {
			margin-bottom: 0.5rem;
			opacity: 0;
			pointer-events: none;
		}
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
