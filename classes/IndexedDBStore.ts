/**
 * A generic utility class for managing data in an IndexedDB object store.
 *
 * @template T - The type of objects stored in the IndexedDB object store.
 *
 * @remarks
 * This class provides a high-level abstraction for working with IndexedDB, including methods for
 * adding, retrieving, updating, and deleting records, as well as iterating over records in various ways.
 * It supports both synchronous and asynchronous iteration, and includes utility methods for mapping
 * and sorting records.
 *
 * The class is designed to be flexible and reusable, allowing you to define the schema of the object
 * store and interact with it using strongly-typed methods.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const userStore = new IndexedDBStore<User>('MyDatabase', 1, 'users', {
 *   keyPath: 'id',
 *   name: null,
 *   email: null,
 * });
 *
 * await userStore.open();
 * await userStore.add({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
 * const user = await userStore.get(1);
 * console.log(user); // { id: 1, name: 'John Doe', email: 'john.doe@example.com' }
 * ```
 */
export default class IndexedDBStore<T extends object> {
	/**
	 * The IndexedDB database instance.
	 */
	#database: IDBDatabase | null = null;

	/**
	 * Gets the opened IndexedDB database instance.
	 *
	 * @throws {ReferenceError} If the IndexedDB database hasn't been opened yet.
	 * @returns The opened IndexedDB database instance.
	 */
	protected get database() {
		if (!this.#database) throw new ReferenceError("The IndexedDB database hasn't been opened");
		return this.#database;
	}

	/**
	 * Checks if the IndexedDB database is opened.
	 */
	get isDatabaseOpen() {
		return this.#database !== null;
	}

	/**
	 * Gets the readwrite IndexedDB object store associated with the current instance.
	 *
	 * @returns The readwrite IndexedDB object store associated with the current instance.
	 */
	protected get store() {
		return this.database
			.transaction(this.objectStoreName, "readwrite")
			.objectStore(this.objectStoreName);
	}

	/**
	 * Gets the readonly IndexedDB object store associated with the current instance.
	 *
	 * @returns The readonly IndexedDB object store associated with the current instance.
	 */
	protected get readonlyStore() {
		return this.database
			.transaction(this.objectStoreName, "readonly")
			.objectStore(this.objectStoreName);
	}

	/**
	 * Constructs a new IndexedDBStore instance.
	 *
	 * @param databaseName - The name of the IndexedDB database.
	 * @param databaseVersion - The version of the IndexedDB database.
	 * @param objectStoreName - The name of the object store within the database.
	 * @param objectStoreSchema - The schema of the object store within the database.
	 */
	constructor(
		public readonly databaseName: string,
		public readonly databaseVersion: number,
		public readonly objectStoreName: string,
		protected readonly objectStoreSchema: {
			keyPath?: (string & keyof T) | (string & keyof T)[];
		} & {
			[key in keyof T]: IDBIndexParameters | null;
		},
	) { }

	/**
	 * Opens the IndexedDB database.
	 *
	 * @remarks Require to be called before querying.
	 *
	 * @returns A Promise that resolves with the opened database instance or rejects with an error.
	 */
	open() {
		if (this.#database) return Promise.resolve(this.#database); // If it is already opened, resolve with the existing database instance.

		return new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(this.databaseName, this.databaseVersion);

			request.onsuccess = () => resolve(this.#database = request.result);
			request.onerror = () => reject(request.error);

			request.onupgradeneeded = () => {
				const database = request.result;
				if (!database.objectStoreNames.contains(this.objectStoreName)) {
					const { keyPath, ...keys } = this.objectStoreSchema;
					const objectStore = database.createObjectStore(this.objectStoreName, keyPath !== undefined ? { keyPath } : { autoIncrement: true });
					for (const [key, options] of Object.entries(keys))
						objectStore.createIndex(key, key, options ?? undefined);
				}
			};
		});
	}

	/**
	 * Resolves an IndexedDB request and returns a Promise.
	 * @internal
	 *
	 * @template T - The type of the result of the IndexedDB request.
	 * @param request - The IndexedDB request to be resolved.
	 * @returns A Promise that resolves with the result of the IndexedDB request or rejects with an error.
	 *
	 * @remarks
	 * This method is a utility function that wraps the IndexedDB request's event handlers into a Promise.
	 * It simplifies the handling of IndexedDB requests by providing a consistent interface for handling success and error cases.
	 */
	static getResult<T>(request: IDBRequest<T>): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Adds a new item to the IndexedDB object store.
	 *
	 * @remarks
	 * If `put()` is used, any existing record with the id will be replaced.
	 * If `add()` is used, and if a record with the id already exists the request will fail,
	 * with request's error set to a "ConstraintError" DOMException.
	 *
	 * @param item - The item to be added to the object store.
	 * @returns A Promise that resolves with the added item's id or rejects with an error.
	 *
	 * @example
	 * ```typescript
	 * const id = await store.add({ id: 1, name: "Bob", gender: "male" });
	 * ```
	 */
	add(item: T) {
		return IndexedDBStore.getResult(this.store.add(item));
	}

	/**
	 * Retrieves an item from the IndexedDB object store.
	 *
	 * @param id - The key or key range of the item to retrieve.
	 * @returns A Promise that resolves with the retrieved item or rejects with an error.
	 */
	get(id: IDBValidKey | IDBKeyRange): Promise<T>;
	/**
	 * Retrieves an item from the IndexedDB object store based on a specific key or key range.
	 *
	 * @template TKey - The type of the key to retrieve. It must be a key of the object stored in the IndexedDB store.
	 * @param key - The key or name of the index to use for retrieving the item.
	 * @param value - The value of the index to match. If not provided, the function will retrieve an item using the key.
	 * @returns A Promise that resolves with the retrieved item or rejects with an error.
	 *
	 * @remarks
	 * If the `value` parameter is provided, the function will use the specified index to retrieve the item.
	 * If the `value` parameter is not provided, the function will retrieve the item using the provided key.
	 */
	get<TKey extends keyof T>(key: TKey, value: T[TKey]): Promise<T>;
	get(...args: unknown[]): Promise<T> {
		const request = args.length === 1 ?
			this.readonlyStore.get(args[0] as IDBValidKey) :
			this.readonlyStore.index(args[0] as string).get(args[1] as IDBValidKey);
		return IndexedDBStore.getResult<T>(request);
	}

	/**
	 * Sets a new item or updates an existing item in the IndexedDB object store.
	 *
	 * @remarks
	 * If `put()` is used, any existing record with the ID will be replaced.
	 * If `add()` is used, and if a record with the ID already exists the request will fail,
	 * with request's error set to a "ConstraintError" DOMException.
	 *
	 * @param item - The item to be added or updated in the object store.
	 * @param id - (Optional) The key of the item to update. If not provided, a new item will be added.
	 * @returns A Promise that resolves when the operation is complete or rejects with an error.
	 *
	 * @example
	 * ```typescript
	 * await store.set({ name: "Bob", gender: "male" }, 1); // Explicit specified the ID.
	 * await store.set({ name: "Jim", gender: "male" }); // Auto generate next available ID.
	 * ```
	 */
	async set(item: T, id?: IDBValidKey): Promise<void>;
	/**
	 * Updating a specific property of an existing record identified by its ID in the IndexedDB object store.
	 *
	 * @param key - The property of the record to update.
	 * @param value - The new value to set for the specified property.
	 * @param id - The ID of the record to update.
	 *
	 * @throws Will log an error if attempting to update a record by ID and the ID is not found in the store.
	 * @returns A Promise that resolves when the operation is complete or rejects with an error.
	 *
	 * @example
	 * ```typescript
	 * await store.set("name", "Bob", 1); // Explicit specified the id.
	 * ```
	 */
	async set<TKey extends keyof T>(key: TKey, value: T[TKey], id: IDBValidKey): Promise<void>;
	/**
	 * Sets or updates data in the IndexedDB store.
	 *
	 * This method supports two modes of operation:
	 * 1. Updating a specific property of an existing record identified by its ID.
	 * 2. Adding or updating an entire record in the store.
	 *
	 * @param args -
	 * The arguments for the operation. The method determines the mode of operation
	 * based on the number and types of arguments provided:
	 * - If three arguments are provided: `[key, value, id]`
	 *   - `key` - The property of the record to update.
	 *   - `value` - The new value to set for the specified property.
	 *   - `id` - The ID of the record to update.
	 * - If one or two arguments are provided: `[item, id?]`
	 *   - `item` - The entire record to add or update in the store.
	 *   - `id` (optional) - The ID of the record. If not provided, the store will
	 *     generate an ID automatically.
	 *
	 * @throws Will log an error if attempting to update a record by ID and the ID is not found in the store.
	 * @returns A promise that resolves when the operation is complete.
	 */
	async set(...args: unknown[]) {
		if (args.length === 3) {
			const [key, value, id] = args as [key: keyof T, value: T[keyof T], id: IDBValidKey];
			for await (const cursor of this.cursor())
				if (cursor.key === id) {
					cursor.value[key] = value;
					const request = cursor.update(cursor.value);
					await IndexedDBStore.getResult(request);
					return;
				}
			console.error(`Cannot find ID with ${id} in the store`);
		} else {
			const [item, id] = args as [item: T, id?: IDBValidKey];
			await IndexedDBStore.getResult(this.store.put(item, id));
		}
	}

	/**
	 * Deletes an item from the IndexedDB object store.
	 *
	 * @param id - The key or key range of the item to delete.
	 * @returns A Promise that resolves when the item is deleted or rejects with an error.
	 *
	 * @example
	 * ```typescript
	 * await store.delete(1);
	 * ```
	 */
	delete(id: IDBValidKey | IDBKeyRange): Promise<void> {
		return IndexedDBStore.getResult(this.store.delete(id));
	}

	/**
	 * An asynchronous generator function that iterates over the records in the IndexedDB object store.
	 * It opens a cursor on the object store and yields each record as an `IDBCursor` object
	 * with an additional `value` property of type `T`.
	 * The cursor automatically advances to the next record after each iteration.
	 *
	 * @remarks It is suggested that you use `entries()` for queries only,
	 * and use `cursor()` only if you need to modify or delete items.
	 *
	 * @generator
	 * @async
	 * @yields {IDBCursor & { value: T }} The current cursor pointing to a record in the object store, with the record's value.
	 * @throws {DOMException} If an error occurs while accessing the IndexedDB.
	 *
	 * @example
	 * ```typescript
	 * for await (const cursor of store.cursor)
	 *     console.log(cursor.key, cursor.value);
	 * ```
	 */
	async *cursor() {
		const request = this.store.openCursor();
		while (true) {
			const cursor = await IndexedDBStore.getResult(request);
			if (!cursor) break;
			yield cursor as IDBCursor & { value: T };
			cursor.continue();
		}
	}

	/**
	 * Asynchronously iterates over all key-value pairs in the IndexedDB object store.
	 *
	 * @yields {Generator<[IDBValidKey, T]>} - Yields the key-value pair for each item in the object store.
	 *
	 * @example
	 * ```typescript
	 * for await (const [key, value] of store.cursor)
	 *     console.log(key, value);
	 * ```
	 */
	async *entries() {
		for await (const cursor of this.cursor())
			yield [cursor.key, cursor.value] as const;
	}

	/**
	 * Asynchronously iterates over all keys in the IndexedDB object store.
	 *
	 * @yields {Generator<IDBValidKey>} - Yields the key for each item in the object store.
	 *
	 * @example
	 * ```typescript
	 * for await (const key of store.cursor)
	 *     console.log(key);
	 * ```
	 */
	async *keys() {
		const request = this.store.openKeyCursor();
		while (true) {
			const cursor = await IndexedDBStore.getResult(request);
			if (!cursor) break;
			yield cursor.key;
			cursor.continue();
		}
	}

	/**
	 * Asynchronously iterates over all values in the IndexedDB object store.
	 *
	 * @yields {Generator<T>} - Yields the value for each item in the object store.
	 *
	 * @example
	 * ```typescript
	 * for await (const value of store.cursor)
	 *     console.log(value);
	 * ```
	 */
	async *values() {
		for await (const { value } of this.cursor())
			yield value;
	}

	/**
	 * Defines the async iterator for the IndexedDBStore class.
	 * Allows iterating over the values of the object store using the `for await...of` syntax.
	 *
	 * @example
	 * ```typescript
	 * for await (const [key, value] of store)
	 *     console.log(key, value);
	 * ```
	 */
	[Symbol.asyncIterator] = this.values;

	/** @deprecated */
	private [Symbol.iterator]() {
		throw new SyntaxError("Cannot use for-of statement, use for-await-of statement instead");
	}

	/**
	 * Retrieves all items from the IndexedDB object store.
	 *
	 * @note Use `for await...of` syntax for better performance.
	 * @returns A Promise that resolves with an array of all items in the object store or rejects with an error.
	 *
	 * @example
	 * ```typescript
	 * console.log(await store.all());
	 * ```
	 */
	all(): Promise<T[]> {
		return IndexedDBStore.getResult(this.store.getAll());
	}

	/**
	 * Applies a callback function to each item in the IndexedDB object store and returns a new array with the results.
	 *
	 * @template TOut - The type of the array elements returned by the callback function.
	 * @param callbackfn - A function to apply to each item in the object store.
	 * The callback function takes two arguments:
	 * - `value`: The current item being processed.
	 * - `key`: The key of the current item being processed.
	 *
	 * @returns A Promise that resolves with a new array containing the results of applying the callback function to
	 * each item in the object store.
	 *
	 * @remarks
	 * This method is asynchronous and uses the `for await...of` syntax to iterate over the object store's values.
	 * It is useful for transforming or filtering the items in the object store.
	 *
	 * @example
	 * ```typescript
	 * const names = await store.map(item => item.name);
	 * ```
	 */
	async map<TOut>(callbackfn: (value: T, key: IDBValidKey) => MaybePromise<TOut>) {
		const result: TOut[] = [];
		for await (const [key, value] of this.entries())
			result.push(await callbackfn(value, key));
		return Promise.all(result);
	}

	/**
	 * Asynchronously iterates over the records in the IndexedDB object store, sorted by the specified key.
	 *
	 * @template T - The type of the objects stored in the IndexedDB object store.
	 * @param key - The key of the index to sort by. Must be a valid key of type `T` and a string.
	 * @param direction -
	 * The direction in which to iterate over the records.
	 * Defaults to `"next"`. Possible values are:
	 * - `"next"`: Ascending order.
	 * - `"nextunique"`: Ascending order with unique values.
	 * - `"prev"`: Descending order.
	 * - `"prevunique"`: Descending order with unique values.
	 * @yields A tuple containing the primary key and the value of each record in the store.
	 * The tuple is of the form `[IDBValidKey, T]`.
	 * @throws Will throw an error if the IndexedDB operation fails.
	 *
	 * @example
	 * ```typescript
	 * for await (const [key, value] of store.sortedBy("name"))
	 *     console.log(key, value); // Logs sorted alphabetically by name in ascending order.
	 *
	 * for await (const [key, value] of store.sortedBy("name", "prev"))
	 *     console.log(key, value); // Logs sorted alphabetically by name in descending order.
	 * ```
	 */
	async *sortedBy(key: keyof T & string, direction: IDBCursorDirection = "next") {
		for await (const cursor of this.sortedCursor(key, direction))
			yield [cursor.primaryKey, cursor.value] as const;
	}

	/**
	 * Asynchronously iterates over the records in the IndexedDB object store or index in a sorted order.
	 *
	 * @remarks It is suggested that you use `sortedBy()` for queries only,
	 * and use `sortedCursor()` only if you need to modify or delete items.
	 *
	 * @template T - The type of the objects stored in the IndexedDB.
	 * @param key - The name of the index to use for sorting the records.
	 * @param direction - The direction in which to iterate over the records.
	 * Defaults to `"next"`. Possible values are:
	 * - `"next"`: Ascending order.
	 * - `"prev"`: Descending order.
	 * - `"nextunique"`: Ascending order with unique values.
	 * - `"prevunique"`: Descending order with unique values.
	 * @yields An `IDBCursor` object extended with a `value` property of type `T`
	 * representing the current record in the iteration.
	 * @throws Will throw an error if the IndexedDB operation fails.
	 *
	 * @example
	 * ```typescript
	 * for await (const cursor of store.sortedCursor("name"))
	 *     console.log(cursor.key, cursor.value); // Logs sorted alphabetically by name in ascending order.
	 *
	 * for await (const cursor of store.sortedCursor("name", "prev"))
	 *     console.log(cursor.key, cursor.value); // Logs sorted alphabetically by name in descending order.
	 * ```
	 */
	async *sortedCursor(key: keyof T & string, direction: IDBCursorDirection = "next") {
		const request = this.store.index(key).openCursor(null, direction);
		while (true) {
			const cursor = await IndexedDBStore.getResult(request);
			if (!cursor) break;
			yield cursor as IDBCursor & { value: T };
			cursor.continue();
		}
	}

	/**
	 * Iterates over the entries in the IndexedDB store sorted by the specified key and applies a callback function to each entry.
	 * Returns a promise that resolves to an array of transformed results.
	 *
	 * @template TOut - The type of the output elements after applying the callback function.
	 * @param key - The key of the object by which the entries should be sorted.
	 * @param callbackfn - A function that is called for each entry in the store. It receives the value and primary key as arguments
	 * and returns a transformed result.
	 * @param direction - The direction in which to iterate over the entries. Defaults to "next".
	 * Possible values are:
	 * - "next": Ascending order.
	 * - "prev": Descending order.
	 * - "nextunique": Ascending order with unique values.
	 * - "prevunique": Descending order with unique values.
	 * @returns A promise that resolves to an array of transformed results after applying the callback function to each entry.
	 *
	 * @example
	 * ```typescript
	 * const namesSortedByAge = await store.map("age", item => item.name);
	 * ```
	 */
	async sortedMap<TOut>(key: keyof T & string, callbackfn: (value: T, primaryKey: IDBValidKey) => MaybePromise<TOut>, direction: IDBCursorDirection = "next") {
		const result: TOut[] = [];
		for await (const [primaryKey, value] of this.sortedBy(key, direction))
			result.push(await callbackfn(value, primaryKey));
		return Promise.all(result);
	}

	/**
	 * Retrieves the total number of records in the IndexedDB object store.
	 *
	 * @returns A promise that resolves to the number of records in the store.
	 *
	 * @example
	 * ```typescript
	 * const length = await store.length;
	 * ```
	 */
	get length() {
		const request = this.store.count();
		return IndexedDBStore.getResult(request);
	}
}
