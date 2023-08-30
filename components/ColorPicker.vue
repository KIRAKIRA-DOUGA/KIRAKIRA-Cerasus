<script setup lang="ts">
	const color = defineModel<Color | UnwrapRef<Color>>({ required: true });
	const specificModel = defineModel<ColorModel>("model", { default: "hsl" });

	const main = ref<TwoD>([1, 1]);
	const smoothMain = useSmoothValue(main, 0.5);
	const auxiliary = ref(0);
	const model = ref(specificModel.value!);
	const values = ref<ThreeD>([255, 0, 0]);
	const hex = ref("FF0000");
	const hashHex = computed(() => "#" + hex.value);
	const partialColor = computed(() => {
		const { hsl, hsv } = color.value;
		// wo (w/o) is an abbr of "without".
		return {
			boxShadow: Color.fromHsv(hsv.h, hsv.s, hsv.v, 0.8).hashHex,
			h: Color.fromHsv(hsv.h, 100, 100).hashHex,
			woL: Color.fromHsl(hsl.h, hsl.s, 50).hashHex,
			woV: Color.fromHsv(hsv.h, hsv.s, 100).hashHex,
			l: Color.fromHsv(0, 0, hsl.l >= 50 ? 100 : 0, Math.abs(hsl.l - 50) / 50).hashHex,
			v: Color.fromHsv(0, 0, 0, 1 - hsv.v / 100).hashHex,
			woH: Color.fromHsv(0, 0, hsv.v, 1 - (hsv.s / 100 * hsv.v / 100) ** 0.5).hashHex,
		};
	});
	const isUpdating = reactive({}) as Record<ChangedParam, boolean>;
	const maxValue = computed<ThreeD>(() => model.value === "rgb" ? [255, 255, 255] : [359, 100, 100]);
	const hexInvalidMessage = computed(() => [3, 6].includes(hex.value.length) ? "" : "HEX颜色值的长度必须为3位数或6位数。");
	const spectrums = computed({
		get: () => [...main.value, auxiliary.value] as ThreeD,
		set: value => {
			main.value = [value[0], value[1]];
			auxiliary.value = value[2];
		},
	});
	const darkThumb = computed(() => color.value.naturalLightness >= 0.7);

	const update = async () => {
		if (isUpdating.update) return;
		isUpdating.update = true;
		if (!isUpdating.hex)
			hex.value = color.value.hex.slice(0, 6);
		if (!isUpdating.values)
			if (model.value === "rgb") {
				const { r, g, b } = color.value.rgb;
				values.value = [r, g, b];
			} else if (model.value === "hsl") {
				const { h, s, l } = color.value.hsl;
				values.value = [h, s, l];
			} else if (model.value === "hsb") {
				const { h, s, b } = color.value.hsb;
				values.value = [h, s, b];
			}
		if (!isUpdating.spectrums)
			if (model.value === "rgb") {
				const { h, s, b } = color.value.hsb;
				spectrums.value = [s / 100, b / 100, h / 359];
			} else if (model.value === "hsl") {
				const { h, s, l } = color.value.hsl;
				spectrums.value = [h / 359, s / 100, l / 100];
			} else if (model.value === "hsb") {
				const { h, s, b } = color.value.hsb;
				spectrums.value = [h / 359, s / 100, b / 100];
			}
		await nextTick();
		isUpdating.update = false;
	};
	update();

	watch(hex, useChange("hex", hex => {
		color.value.hex = hex;
		update();
	}));

	watch(values, useChange("values", values => {
		color.value[model.value] = values as never;
		update();
	}), { deep: true });

	watch(model, useChange("hex", model => {
		update();
		specificModel.value = model;
	}));

	watch(spectrums, useChange("spectrums", spectrums => {
		if (model.value === "rgb") {
			const [s, b, h] = spectrums;
			color.value.hsb = [h * 359, s * 100, b * 100];
		} else if (model.value === "hsl") {
			const [h, s, l] = spectrums;
			color.value.hsl = [h * 359, s * 100, l * 100];
		} else if (model.value === "hsb") {
			const [h, s, b] = spectrums;
			color.value.hsb = [h * 359, s * 100, b * 100];
		}
		update();
	}), { deep: true });

	watch(specificModel, specificModel => specificModel && (model.value = specificModel));

	/**
	 * 按下主要调节平面逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onPlaneDown(e: PointerEvent) {
		const plane = e.currentTarget as HTMLDivElement;
		const { left: x, width: xMax, top: y, height: yMax } = plane.getBoundingClientRect();
		const pointerMove = useDebounce((e: PointerEvent) => {
			const positionX = clamp(e.clientX - x, 0, xMax);
			const positionY = clamp(e.clientY - y, 0, yMax);
			const valueX = map(positionX, 0, xMax, 0, 1);
			const valueY = map(positionY, 0, yMax, 1, 0);
			main.value = [valueX, valueY];
		});
		const pointerUp = () => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
		pointerMove(e);
	}

	type ChangedParam = "hex" | "values" | "spectrums" | "update";

	/**
	 * 监测要不改变的参数。
	 * @param param - 要改变的参数名称。
	 * @param callback - 回调函数。
	 * @returns 产生的 watch 回调函数。
	 */
	function useChange<T>(param: ChangedParam, callback: (current: T, previous: T) => void) {
		return async (current: T, previous: T) => {
			if (isUpdating.update) return;
			isUpdating[param] = true;
			callback(current, previous);
			await nextTick();
			isUpdating[param] = false;
		};
	}
</script>

<template>
	<Subheader icon="palette">调色板</Subheader>
	<Comp
		:class="{
			'dark-thumb': darkThumb,
		}"
		:style="{
			'--color': hashHex,
			'--box-shadow': partialColor.boxShadow,
			'--h': partialColor.h,
			'--wo-l': partialColor.woL,
			'--wo-v': partialColor.woV,
			'--l': partialColor.l,
			'--v': partialColor.v,
			'--wo-h': partialColor.woH,
		}"
	>
		<div class="plane color" @pointerdown="onPlaneDown">
			<div v-if="model === 'rgb'" class="spectrum rgb">
				<div class="solid"></div>
				<div class="cover black"></div>
			</div>
			<div v-else-if="model === 'hsl'" class="spectrum hsl">
				<div class="hue"></div>
				<div class="cover gray"></div>
				<div class="mask"></div>
			</div>
			<div v-else-if="model === 'hsb'" class="spectrum hsb">
				<div class="hue"></div>
				<div class="cover white"></div>
				<div class="mask"></div>
			</div>
			<div class="thumb" :style="{ '--x': smoothMain[0], '--y': 1 - smoothMain[1] }"></div>
		</div>
		<Slider v-model="auxiliary" :min="0" :max="1" :class="[model]" />
		<div class="controls">
			<Segmented v-model="model">
				<SegmentedItem id="rgb">RGB</SegmentedItem>
				<SegmentedItem id="hsl">HSL</SegmentedItem>
				<SegmentedItem id="hsb">HSB</SegmentedItem>
			</Segmented>
			<TextBox
				v-model="values[0]"
				type="number"
				required
				preventIfInvalid
				hideClearAll
				:min="0"
				:max="maxValue[0]"
				:step="1"
			/>
			<TextBox
				v-model="values[1]"
				type="number"
				required
				preventIfInvalid
				hideClearAll
				:min="0"
				:max="maxValue[1]"
				:step="1"
			/>
			<TextBox
				v-model="values[2]"
				type="number"
				required
				preventIfInvalid
				hideClearAll
				:min="0"
				:max="maxValue[2]"
				:step="1"
			/>
			<div class="view-color color"></div>
			<TextBox
				v-model="hex"
				class="hex"
				prefix="#"
				preventIfInvalid
				required
				:pattern="/[0-9A-Fa-f]{0,6}/"
				:invalid="hexInvalidMessage"
				case="uppercase"
			/>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$thumb-size: 24px;
	$thumb-size-half: calc($thumb-size / 2);

	.subheader {
		margin: 0 $thumb-size-half 16px;
	}

	:comp > :not(:last-child) {
		margin-bottom: 16px;
	}

	%inner-border {
		@include color-palette-stroke;
		position: absolute;
		border-radius: inherit;
		inset: 0;
		content: "";
	}

	.plane {
		position: relative;
		margin: $thumb-size-half;
		aspect-ratio: 1 / 1;
		cursor: pointer;
		touch-action: pinch-zoom;

		&::after {
			@extend %inner-border;
		}

		> .spectrum {
			display: contents;
			pointer-events: none;

			> * {
				position: absolute;
				border-radius: 8px; // 与下方滑动条的圆角大小一致，因此使用特殊值。
				inset: 0;
			}
		}

		.rgb .solid {
			background: linear-gradient(to right, white, var(--h));
		}

		.hue {
			background: $hue-linear;
		}

		.cover {
			// stylelint-disable-next-line function-disallowed-list
			background: linear-gradient(to top, rgb(var(--rgb)), rgb(var(--rgb) / 0%));

			&.black {
				--rgb: 0 0 0;
			}

			&.gray {
				--rgb: 127 127 127;
			}

			&.white {
				--rgb: 255 255 255;
			}
		}

		.mask {
			transition: none;
		}

		.hsb .mask {
			background-color: var(--v);
		}

		.hsl .mask {
			background-color: var(--l);
		}
	}

	.slider:deep {
		--size: large;
		margin-top: 16px;

		.passed {
			display: none;
		}

		.track {
			position: relative;
			overflow: hidden;

			&::after {
				@extend %inner-border;
			}
		}
	}

	@function slider-model($model) {
		@return ".slider.#{$model}:deep .track";
	}

	#{slider-model(rgb)} {
		background: $hue-linear;

		&::before {
			position: absolute;
			background-color: var(--wo-h);
			inset: 0;
			transition: none;
			content: "";
		}
	}

	#{slider-model(hsl)} {
		background: linear-gradient(to right, black, var(--wo-l), white);
	}

	#{slider-model(hsb)} {
		background: linear-gradient(to right, black, var(--wo-v));
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px 6px;
		width: 100%;
		margin-bottom: 4px;
		padding: 0 $thumb-size-half;

		.segmented {
			--ease: ease-out;
			grid-column-end: span 3;
			width: 100%;
		}

		.text-box.hex {
			grid-column-end: span 2;
		}
	}

	.view-color {
		@include color-palette-stroke;
		background-color: var(--color);
		transition: $fallback-transitions, background-color 0s;
	}

	.color {
		@include round-large;
	}

	.slider:deep .thumb,
	.plane .thumb {
		z-index: 1;
		background-color: white;
		box-shadow: 0 1px 6px var(--box-shadow) !important;
		transition: $fallback-transitions, left 0s, top 0s, box-shadow 0s;
		
		:comp.dark-thumb & {
			background-color: black;
		}

		&::after {
			background-color: var(--color) !important;
			transition: $fallback-transitions, scale $ease-out-back 250ms, background-color 0s;
		}
	}

	.thumb {
		@include square($thumb-size);
		@include circle;
		@include flex-center;
		@include control-ball-shadow;
		position: absolute;
		top: calc(var(--y) * 100% - $thumb-size / 2);
		left: calc(var(--x) * 100% - $thumb-size / 2);;
		background-color: c(main-bg);
		cursor: pointer;

		&::after {
			@include square(100%);
			@include circle;
			display: block;
			content: "";
			scale: 0.625;
		}

		&:any-hover::after {
			scale: 0.765;
		}

		.plane:active &::after,
		&:active::after {
			scale: 0.4 !important;
		}
	}
</style>
