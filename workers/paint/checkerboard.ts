const properties = ["--checkerboard-spacing", "--checkerboard-size", "--checkerboard-color-odd", "--checkerboard-color-even"] as const;
type P = typeof properties[number];

export class CheckerboardPainter implements PaintWorklet<P> {
	static get inputProperties() { return properties; }

	paint(context: PaintRenderingContext2D, geometry: PaintSize, properties: PaintStylePropertyMapReadOnly<P>): void {
		const size = parseFloat(properties.get("--checkerboard-size").toString()) || 32;
		const spacing = parseFloat(properties.get("--checkerboard-spacing").toString()) || 0;
		const colors = [
			properties.get("--checkerboard-color-odd").toString() || "black",
			properties.get("--checkerboard-color-even").toString() || "white",
		];
		for (let y = 0; y < geometry.height / size; y++)
			for (let x = 0; x < geometry.width / size; x++) {
				context.fillStyle = colors[(x + y) % colors.length];
				context.beginPath();
				context.rect(x * (size + spacing), y * (size + spacing), size, size);
				context.fill();
			}
	}
}

registerPaint("checkerboard", CheckerboardPainter);
