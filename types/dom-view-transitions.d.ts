export { };

declare global {
	interface Document {
		startViewTransition(updateCallback: () => Promise<void | unknown> | void | unknown): ViewTransition;
	}

	interface ViewTransition {
		finished: Promise<void>;
		ready: Promise<void>;
		updateCallbackDone: Promise<void>;
		skipTransition(): void;
	}

	interface CSSStyleDeclaration {
		viewTransitionName: string;
	}
}
