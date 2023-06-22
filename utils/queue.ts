// 队列 类
// 当data为空时返回undefined,使用了泛型约束
export default class Queue<T> {
	public data!: Array<T>;
	push = (item: T) => this.data.push(item);
	pop = (): T | undefined => this.data.shift();
	join = (item: T) => this.data.unshift(item);
}
