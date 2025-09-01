import IndexedDBStore from "classes/IndexedDBStore";
import { Vibrant, WorkerPipeline } from "node-vibrant/worker";
import PipelineWorker from "node-vibrant/worker.worker?worker";

const DATABASE_VERSION = 1;
Vibrant.use(new WorkerPipeline(PipelineWorker as never));

interface BackgroundImageRow {
	imageData: Blob;
	filename: string;
	displayIndex: number;
	color: string;
}

export interface BackgroundImageRowWithMore extends BackgroundImageRow {
	url: string;
	key: number;
}

export const DEFAULT_BACKGROUND_IMAGE_ROW: BackgroundImageRowWithMore = { imageData: null!, filename: "", url: "", key: -1, displayIndex: -1, color: "" };

const keyToUrl = reactive<Map<number, string>>(new Map());
const items = ref<BackgroundImageRowWithMore[]>([]);

export function useBackgroundImages() {
	type Store = IndexedDBStore<BackgroundImageRow>;
	const store = shallowRef<Store>();
	const backgroundImageSettingsStore = useAppSettingsStore().backgroundImage;
	const backgroundImage = computed({
		get: () => backgroundImageSettingsStore.imageIndex,
		set: current => {
			const previous = backgroundImageSettingsStore.imageIndex;
			if (current !== previous)
				startCircleViewTransition(current !== -1, () => backgroundImageSettingsStore.imageIndex = current);
		},
	});
	const currentItem = computed(() => items.value.find(item => item.key === backgroundImage.value));
	const currentImage = computed(() => currentItem.value?.url ?? "");
	const currentDominantColor = computed(() => currentItem.value?.color || undefined);
	const shown = computed(() => !!~backgroundImage.value);

	onMounted(async () => {
		store.value = new IndexedDBStore<BackgroundImageRow>("ImagesDB", DATABASE_VERSION, "backgroundImages", {
			imageData: null,
			filename: null,
			displayIndex: null,
			color: null,
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
		});
		await updateItems();
	}

	async function delete_(key: number) {
		if (!store.value || +key < 0) return;
		const currentIndex = items.value.find(row => row.key === key)?.displayIndex ?? NaN;
		backgroundImage.value = backgroundImage.value === key ? -1 : backgroundImage.value;
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

	return reactive({
		items,
		update: updateItems,
		add,
		map: (...args: Parameters<Store["map"]>) => store.value?.map(...args),
		delete: delete_,
		reorder,
		backgroundImage,
		currentImage,
		currentDominantColor,
		shown,
	});
}

/**
 * 将数组项目移至其他位置。
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
