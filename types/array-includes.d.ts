declare interface Array<T> {
	/**
	 * If, on the other hand, you feel seriously enough that this use of includes() should be accepted with no type assertions,
	 * and you want it to happen in all of your code, you could merge in a custom declaration.
	 * @see https://stackoverflow.com/a/56745484/19553213
	 */
	includes(searchElement: any, fromIndex?: number): searchElement is T;
}

declare interface ReadonlyArray<T> {
	/**
	 * If, on the other hand, you feel seriously enough that this use of includes() should be accepted with no type assertions,
	 * and you want it to happen in all of your code, you could merge in a custom declaration.
	 * @see https://stackoverflow.com/a/56745484/19553213
	 */
	includes(searchElement: any, fromIndex?: number): searchElement is T;
}
