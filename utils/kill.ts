/**
 * 手动销毁组件，和阴魂不散说拜拜。
 * @param item 销毁的组件ref
 */
export default function kill(item: Ref<HTMLElement|undefined>) {
	item.value?.remove();
	item!.value = null!;
}
