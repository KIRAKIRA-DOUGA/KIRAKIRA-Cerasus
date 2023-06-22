/**
 * 队列类。
 * 当 data 为空时返回 undefined，使用了泛型约束。
 */
export class Queue<T> {
	data: T[];
	
	constructor(data: T[]) {
		this.data = data;
	}
	
	/**
	 * 将新元素追加到数组的末尾，并返回数组的新长度。
	 * @param item - 要添加到数组中的新元素。
	 */
	push(item: T) {
		this.data.push(item);
	}
	
	/**
	 * 从数组中删除第一个元素并返回它。如果数组为空，则返回 undefined，并且不修改数组。
	 * @returns 移除的元素。
	 */
	pop() {
		return this.data.shift();
	}
	
	/**
	 * 在数组的开头插入新元素，并返回数组的新长度。
	 * @param item - 要在数组开头插入的元素。
	 */
	join(item: T) {
		this.data.unshift(item);
	}
}
