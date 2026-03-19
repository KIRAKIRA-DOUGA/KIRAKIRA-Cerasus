/**
 * A utility class for managing CSS anchor-name property values.
 *
 * Behaves like `classList`, supports multiple anchor names, CSS escaping, and array-like / set-like operations.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name
 */
export class AnchorNameList implements Iterable<string> {
	/** Internal storage for normalized, escaped anchor names */
	readonly #anchors: Set<string> = new Set();

	/**
	 * Create an AnchorNameList instance.
	 * @param initialValue - Raw `anchor-name` string from `element.style.anchorName` (e.g., "--name, --another").
	 */
	constructor(initialValue: string = "") {
		if (!initialValue) return;

		const parsed = initialValue
			.split(",")
			.map(item => item.trim())
			.filter(Boolean);

		parsed.forEach(this.#anchors.add);
	}

	/**
	 * Get the number of registered anchor names.
	 */
	get size(): number {
		return this.#anchors.size;
	}

	/**
	 * Add one or more anchor names (automatically escaped & deduplicated).
	 * @param names - Anchor names to add (will be escaped with `CSS.escape`).
	 */
	add(...names: string[]): void {
		for (const rawName of names) {
			const escaped = CSS.escape(rawName);
			this.#anchors.add(escaped);
		}
	}

	/**
	 * Remove one or more anchor names (supports strings or predicate callback)
	 * @param names - Anchor names to remove (strings) OR a predicate function to filter names
	 */
	remove(...names: (string | ((name: string) => boolean))[]): void {
		for (const name of names) {
			if (typeof name === "string") {
				const escaped = CSS.escape(name);
				this.#anchors.delete(escaped);
			}

			if (typeof name === "function")
				for (const anchor of this.#anchors)
					if (name(anchor))
						this.#anchors.delete(anchor);
		}
	}

	/**
	 * Check if an anchor name exists.
	 * @param name - Anchor name to check (auto-escaped).
	 * @returns True if the anchor name exists.
	 */
	has(name: string): boolean {
		return this.#anchors.has(CSS.escape(name));
	}

	/**
	 * Toggle an anchor name (add if missing, remove if present).
	 * @param name - Anchor name to toggle (auto-escaped).
	 * @param force - Optional: force add (true) or force remove (false).
	 * @returns True if the anchor exists after toggle.
	 */
	toggle(name: string, force?: boolean): boolean {
		const escaped = CSS.escape(name);
		const exists = this.#anchors.has(escaped);

		if (force || !exists) {
			this.add(name);
			return true;
		} else {
			this.remove(name);
			return false;
		}
	}

	/**
	 * Convert the anchor list back to a valid CSS anchor-name string.
	 * @returns Comma-separated string (e.g., "--name, --another").
	 */
	toString(): string {
		return [...this.#anchors].join(", ");
	}

	/**
	 * Support iteration (for...of loops).
	 * @returns Iterator for escaped anchor names.
	 */
	[Symbol.iterator](): Iterator<string> {
		return this.#anchors[Symbol.iterator]();
	}
}

// NOTE: 下面的类比上面的类使用起来更方便，但截止至2026/03/20 Safari并不支持using全新语法，故暂未启用。
/**
 * A DOM element-bound utility for managing CSS anchor-name property.
 *
 * Automatically applies all changes to the target HTMLElement's style.
 *
 * Internally delegates logic to {@link AnchorNameList} and updates `element.style.anchorName` on modification.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/anchor-name
 */
export class ElementAnchorName implements Iterable<string>, Disposable {
	/** Target DOM element to manage anchor-name for. */
	readonly #element: HTMLElement;
	/** Internal anchor name list handler (reused core logic). */
	#anchorList!: AnchorNameList;
	/**
	 * Where to retrieve `anchor-name` property value from.
	 * - `false`: `element.style.anchorName`.
	 * - `true`: `getComputedStyle(element).anchorName`.
	 * @default false
	 */
	readonly #computed: boolean;

	/**
	 * Create an ElementAnchorName instance bound to a DOM element.\
	 * Automatically parses the element's current anchor-name style value.
	 * @param element - Target HTMLElement to manage anchor-name for.
	 * @param computed - Where to retrieve `anchor-name` property value from. Defaults to `false`.
	 * - `false`: `element.style.anchorName`.
	 * - `true`: `getComputedStyle(element).anchorName`.
	 * @throws {TypeError} If the provided element is not a valid HTMLElement.
	 */
	constructor(element: HTMLElement, computed: boolean = false) {
		this.#element = element;
		this.#computed = computed;
		this.refresh();
	}

	/**
	 * Get the number of registered anchor names for the element.
	 * @returns Count of anchor names.
	 */
	get size(): number {
		return this.#anchorList.size;
	}

	/**
	 * Add one or more anchor names to the element (auto-escaped & deduplicated).
	 * @param names - Anchor names to add.
	 */
	add(...names: string[]): void {
		this.#anchorList.add(...names);
	}

	/**
	 * Remove one or more anchor names from the element.
	 *
	 * Supports string names or predicate callback for bulk removal.
	 * @param names - String names to remove or filter predicate function.
	 */
	remove(...names: (string | ((name: string) => boolean))[]): void {
		this.#anchorList.remove(...names);
	}

	/**
	 * Check if the element has a specific anchor name.
	 * @param name - Anchor name to check.
	 * @returns True if the anchor name exists.
	 */
	has(name: string): boolean {
		return this.#anchorList.has(name);
	}

	/**
	 * Toggle an anchor name on the element (add/remove).
	 *
	 * Supports force boolean to explicitly add/remove the name.
	 * @param name - Anchor name to toggle
	 * @param force - Optional: force add (true) or remove (false)
	 * @returns True if the anchor exists after toggle
	 */
	toggle(name: string, force?: boolean): boolean {
		return this.#anchorList.toggle(name, force);
	}

	/**
	 * Convert the anchor name list to a valid CSS comma-separated string.
	 * @returns Formatted anchor-name string
	 */
	toString(): string {
		return this.#anchorList.toString();
	}

	/**
	 * Support iteration over the element's anchor names (for...of loops).
	 * @returns Iterator for escaped anchor names.
	 */
	[Symbol.iterator](): Iterator<string> {
		return this.#anchorList[Symbol.iterator]();
	}

	/**
	 * Private sync method: apply the element's anchor-name style property.
	 */
	[Symbol.dispose](): void {
		this.#element.style.anchorName = this.toString();
	}

	/**
	 * Refresh the internal state from the element's current anchor-name value.
	 *
	 * Useful if the element's anchor-name was modified outside this utility.
	 */
	refresh(): void {
		const currentAnchorName = !this.#computed ? this.#element.style.anchorName : getComputedStyle(this.#element).anchorName;
		this.#anchorList = new AnchorNameList(currentAnchorName);
	}
}
