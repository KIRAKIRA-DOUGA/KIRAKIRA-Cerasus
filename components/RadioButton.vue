<script setup lang="ts">

</script>

<template>
	<div class="item">
		<input class="radio" type="radio" />
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.item {
		display: flex;
		align-items: center;
	}

	$size: 20px;
	$white-size: 16px;
	$dot-size: 10px;
	$border-size: 2px;

	.radio {
		appearance: none;
		margin: 0;
		margin-right: 0.5rem;
		width: $size;
		height: $size;
		background-color: white;
		box-shadow: inset 0 0 0 $border-size $brand-pink-50;
		border-radius: 100%;
		position: relative;
		animation: outer-border-change 500ms ease-in-out backwards;
		overflow: hidden;

		&::before {
			content: "";
			width: $dot-size;
			height: $dot-size;
			background-color: $brand-pink-50;
			display: block;
			border-radius: 100%;
			$margin: calc(($size - $dot-size) / 2);
			position: absolute;
			left: $margin;
			top: $margin;
			animation:
				inner-resize 500ms 500ms ease-in-out,
				cut-in 500ms step-start;
		}
	}

	@keyframes outer-border-change {
		from {
			box-shadow: inset 0 0 0 $border-size $brand-pink-50;
		}

		to {
			box-shadow: inset 0 0 0 calc($size / 2) $brand-pink-50;
		}
	}

	@keyframes inner-resize {
		from {
			transform: scale(2);
		}

		to {
			transform: scale(1);
		}
	}

	@keyframes cut-in {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}
</style>
