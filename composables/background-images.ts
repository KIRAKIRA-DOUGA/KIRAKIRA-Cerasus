import IndexedDBStore from "classes/IndexedDBStore";
import type { fitTypes } from "components/BackgroundImage/BackgroundImageImg.vue";
import { Vibrant, WorkerPipeline } from "node-vibrant/worker";
import PipelineWorker from "node-vibrant/worker.worker?worker";

const DATABASE_VERSION = 2;
Vibrant.use(new WorkerPipeline(PipelineWorker as never));

interface BackgroundImageRow {
	imageData: Blob;
	filename: string;
	displayIndex: number;
	color: string;
	fit: keyof typeof fitTypes;
	position: TwoD;
}

export interface BackgroundImageRowWithMore extends BackgroundImageRow {
	url: string;
	key: number;
}

export const DEFAULT_BACKGROUND_IMAGE_ROW: BackgroundImageRowWithMore = {
	imageData: null!,
	filename: "",
	url: "",
	key: -1,
	displayIndex: -1,
	color: "",
	fit: "cover",
	position: [50, 50],
};

const keyToUrl = reactive<Map<number, string>>(new Map());
const items = ref<BackgroundImageRowWithMore[]>([]);

export function useBackgroundImages() {
	type Store = IndexedDBStore<BackgroundImageRow>;
	const store = shallowRef<Store>();
	const backgroundImageSettingsStore = useAppSettingsStore().backgroundImage;
	const currentImageKey = computed({
		get: () => backgroundImageSettingsStore.imageIndex,
		set: current => {
			const previous = backgroundImageSettingsStore.imageIndex;
			if (current !== previous)
				startCircleViewTransition(current !== -1, () => backgroundImageSettingsStore.imageIndex = current);
		},
	});
	const currentItem = computed(() => items.value.find(item => item.key === currentImageKey.value));
	const currentImage = computed(() => currentItem.value?.url ?? "");
	const currentDominantColor = computed(() => currentItem.value?.color || undefined);
	const shown = computed(() => !!~currentImageKey.value);
	const position = computed(() => currentItem.value?.position ?? DEFAULT_BACKGROUND_IMAGE_ROW.position);

	onMounted(async () => {
		store.value = new IndexedDBStore<BackgroundImageRow>("ImagesDB", DATABASE_VERSION, "backgroundImages", {
			imageData: null,
			filename: null,
			displayIndex: null,
			color: null,
			fit: null,
			position: null,
		});
		await store.value.open();
		await updateItems();
	});

	async function updateItems() {
		if (!store.value?.isDatabaseOpen) return;
		const newItems = await store.value.sortedMap("displayIndex", async (value, key) => {
			key = +key;
			let url = keyToUrl.get(key);
			if (!url) {
				url = await fileToBlob(value.imageData);
				keyToUrl.set(key, url);
			}
			return { ...value, url, key };
		});
		items.value = [DEFAULT_BACKGROUND_IMAGE_ROW, ...newItems];
	}

	async function reorderItems(getIndex: (oldIndex: number) => number | undefined) {
		if (!store.value?.isDatabaseOpen) return;
		const requests = [];
		for await (const cursor of store.value.cursor()) {
			const oldIndex = cursor.value.displayIndex, newIndex = getIndex(oldIndex);
			if (newIndex === undefined || newIndex === oldIndex) continue;
			cursor.value.displayIndex = newIndex;
			const request = cursor.update(cursor.value);
			requests.push(IndexedDBStore.getResult(request));
		}
		return Promise.all(requests);
	}

	async function add(image: File) {
		if (!store.value) return;
		const length = await store.value.length;
		const palette = await Vibrant.from(await fileToData(image)).getPalette();
		const color = palette.Vibrant?.hex ?? "";
		await store.value.add({
			imageData: image,
			filename: image.name,
			displayIndex: length,
			color,
			fit: DEFAULT_BACKGROUND_IMAGE_ROW.fit,
			position: DEFAULT_BACKGROUND_IMAGE_ROW.position,
		});
		await updateItems();
	}

	async function delete_(key: number) {
		if (!store.value || +key < 0) return;
		const currentIndex = items.value.find(row => row.key === key)?.displayIndex ?? NaN;
		currentImageKey.value = currentImageKey.value === key ? -1 : currentImageKey.value;
		await nextAnimationTick();
		URL.revokeObjectURL(keyToUrl.get(key) ?? "");
		keyToUrl.delete(key);
		await store.value.delete(+key);
		if (Number.isFinite(currentIndex))
			await reorderItems(index => { if (index > currentIndex) return index - 1; });
		await updateItems();
	}

	async function reorder(key: number, newIndex: number) {
		if (!store.value || +key < 0) return;
		items.value = arrayMove(items.value, items.value.findIndex(item => item.key === key), clamp(newIndex + 1, 1, items.value.length));
		const length = await store.value.length;
		if (length === 0) return;
		newIndex = clamp(newIndex, 0, length - 1);
		const oldIndex = items.value.find(row => row.key === key)?.displayIndex ?? -1;
		if (oldIndex === newIndex || oldIndex === -1) return;
		const min = Math.min(oldIndex, newIndex), max = Math.max(oldIndex, newIndex);
		await reorderItems(index => {
			if (index < min || index > max) return;
			else if (index === oldIndex) return newIndex;
			else return index + (oldIndex <= newIndex ? -1 : 1);
		});
		await updateItems();
	}

	const fit = computed({
		get: () => currentItem.value?.fit ?? DEFAULT_BACKGROUND_IMAGE_ROW.fit,
		set: value => {
			if (!store.value || currentImageKey.value < 0) return;
			const item = items.value.find(item => item.key === currentImageKey.value);
			if (item) item.fit = value;
			store.value.set("fit", value, currentImageKey.value);
		},
	});

	async function setPosition(value: Unref<typeof position>, submit = false) {
		if (!store.value || currentImageKey.value < 0) return;
		const item = items.value.find(item => item.key === currentImageKey.value);
		if (item) item.position = value;
		if (!submit) return;
		await store.value.set("position", value, currentImageKey.value);
	}

	return reactive({
		items,
		update: updateItems,
		add,
		map: (...args: Parameters<Store["map"]>) => store.value?.map(...args),
		delete: delete_,
		reorder,
		currentImageKey,
		currentImage,
		currentDominantColor,
		shown,
		fit,
		position,
		setPosition,
	});
}

/**
 * 将数组项目移至其他位置。
 * @template T - 数组元素的类型。
 * @param array - 源数组。
 * @param from - 原元素索引。
 * @param to - 新元素索引。
 * @returns 带有移至新位置的项目的新数组。
 */
function arrayMove<T>(array: T[], from: number, to: number): T[] {
	const newArray = array.slice();
	newArray.splice(
		to < 0 ? newArray.length + to : to,
		0,
		newArray.splice(from, 1)[0],
	);

	return newArray;
}
