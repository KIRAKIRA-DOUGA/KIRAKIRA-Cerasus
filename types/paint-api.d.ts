export { };

declare global {
	interface PaintRenderingContext2D
		extends CanvasState,
		CanvasTransform,
		CanvasCompositing,
		CanvasImageSmoothing,
		CanvasFillStrokeStyles,
		CanvasShadowStyles,
		CanvasRect,
		CanvasDrawPath,
		CanvasDrawImage,
		CanvasPathDrawingStyles,
		CanvasPath { }

	interface PaintSize {
		readonly width: number;
		readonly height: number;
	}

	type PaintStylePropertyMapReadOnly<T> = Override<StylePropertyMapReadOnly, {
		get(property: T): CSSUnparsedValue;
	}>;

	interface PaintWorklet<T> {
		paint(
			context: PaintRenderingContext2D,
			geometry: PaintSize,
			properties: PaintStylePropertyMapReadOnly<T>,
		): void;
	}

	interface PaintWorkletConstructor<T> {
		inputProperties: T[];
		contextOptions?: { alpha: boolean };
		new(): PaintWorklet<T>;
	}

	declare function registerPaint(
		name: string,
		worklet: PaintWorkletConstructor | typeof PaintWorklet<string>,
	): void;

	declare namespace CSS {
		declare const paintWorklet: Worklet;
	}
}
