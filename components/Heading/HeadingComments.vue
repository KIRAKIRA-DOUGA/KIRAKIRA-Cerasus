<docs>
	### 评论标题
</docs>

<script setup lang="ts">
	const props = defineProps<{
		count: number | string;
	}>();
</script>

<template>
	<HeadingGroup :name="t.comments" englishName="Comments" :count="count">
		<template #icon>
			<svg width="43" height="38" viewBox="0 0 43 38" xmlns="http://www.w3.org/2000/svg">
				<path d="M41.9594 3.77568C42.2709 1.69906 40.8076 0 38.7078 0H8.16447C6.06462 0 4.09172 1.69906 3.78026 3.77568L0.382453 26.4298C0.0709881 28.5064 1.53421 30.2054 3.63407 30.2054H30.3595L36.8627 37.7568L41.9594 3.77568Z" />
			</svg>
		</template>
	</HeadingGroup>
</template>
