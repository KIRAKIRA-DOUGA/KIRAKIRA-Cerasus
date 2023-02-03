import { ref, Ref, watch } from "vue";

interface Range {
	min?: number;
	max?: number;
}

interface Result {
	current: Ref<number>;
	inc: (delta?: number) => void;
	dec: (delta?: number) => void;
	set: (value: number) => void;
	reset: () => void;
}

export default function useCount(initialVal: number, range?: Range): Result {
	const current = ref(initialVal);
	const inc = (delta?: number): void => {
		if (typeof delta === "number")
			current.value += delta;
		else
			current.value += 1;
	};
	const dec = (delta?: number): void => {
		if (typeof delta === "number")
			current.value -= delta;
		else
			current.value -= 1;
	};
	const set = (value: number): void => {
		current.value = value;
	};
	const reset = () => {
		current.value = initialVal;
	};

	watch(current, (newVal: number, oldVal: number) => {
		if (newVal === oldVal) return;
		if (range && range.min && newVal < range.min)
			current.value = range.min;
		else if (range && range.max && newVal > range.max)
			current.value = range.max;
	});

	return {
		current,
		inc,
		dec,
		set,
		reset,
	};
}
