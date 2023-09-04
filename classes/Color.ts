/* eslint-disable @typescript-eslint/no-unused-vars */

const { min, max, round } = Math;
const { isArray } = Array;

/**
 * 颜色类。
 */
export class Color {
	private hsva: FourD;

	// eslint-disable-next-line valid-jsdoc
	/**
	 * @access private
	 */
	private constructor(h: number, s: number, v: number, a: number) {
		this.hsva = [h, s, v, a];
	}

	/**
	 * 从红绿蓝创建颜色类实例。
	 * @param r - 红色分量 ∈ [0 ~ 255]。
	 * @param g - 绿色分量 ∈ [0 ~ 255]。
	 * @param b - 蓝色分量 ∈ [0 ~ 255]。
	 * @param a - 不透明度 ∈ [0 ~ 1]。
	 * @returns 颜色类实例。
	 */
	static fromRgb(r: number, g: number, b: number, a: number = 1) {
		const [h, s, v] = rgbToHsv(r, g, b);
		return new Color(h, s, v, a);
	}

	/**
	 * 从色饱亮创建颜色类实例。
	 * @param h - 色相分量 ∈ [0 ~ 360)。
	 * @param s - 饱和度分量 ∈ [0 ~ 100]。
	 * @param l - 亮度分量 ∈ [0 ~ 100]。
	 * @param a - 不透明度 ∈ [0 ~ 1]。
	 * @returns 颜色类实例。
	 */
	static fromHsl(h: number, s: number, l: number, a: number = 1) {
		const [_h, _s, _v] = hslToHsv(h, s, l);
		return new Color(_h, _s, _v, a);
	}

	/**
	 * 从色饱明创建颜色类实例。
	 * @param h - 色相分量 ∈ [0 ~ 360)。
	 * @param s - 饱和度分量 ∈ [0 ~ 100]。
	 * @param v - 明度分量 ∈ [0 ~ 100]。
	 * @param a - 不透明度 ∈ [0 ~ 1]。
	 * @returns 颜色类实例。
	 */
	static fromHsv(h: number, s: number, v: number, a: number = 1) {
		return new Color(h, s, v, a);
	}

	/**
	 * 从色饱明创建颜色类实例。
	 * @param h - 色相分量 ∈ [0 ~ 360)。
	 * @param s - 饱和度分量 ∈ [0 ~ 100]。
	 * @param v - 明度分量 ∈ [0 ~ 100]。
	 * @param a - 不透明度 ∈ [0 ~ 1]。
	 * @returns 颜色类实例。
	 */
	static fromHsb(h: number, s: number, v: number, a: number = 1) {
		return this.fromHsv(h, s, v, a);
	}

	/**
	 * 从 16 进制颜色值创建颜色类实例。
	 * @param hex - 16 进制颜色值。
	 * @returns 颜色类实例。
	 */
	static fromHex(hex: string) {
		const rgba = hexToRgb(hex);
		if (!rgba) throw new RangeError("Invalid HEX");
		const [r, g, b, a] = rgba;
		return Color.fromRgb(r, g, b, a);
	}

	/** 色相分量。 */
	get h() { return this.hsva[0]; }
	set h(v) { this.hsva[0] = PNMod(v, 360); }

	/** 饱和度分量。 */
	get s() { return this.hsva[1]; }
	set s(v) { this.hsva[1] = clamp(v, 0, 100); }

	/** 明度分量。 */
	get v() { return this.hsva[2]; }
	set v(v) { this.hsva[2] = clamp(v, 0, 100); }

	/** 不透明度分量。 */
	get a() { return this.hsva[3]; }
	set a(v) { this.hsva[3] = clamp(v, 0, 1); }

	/**
	 * 获取并设置不带井号开头的 16 进制颜色值。
	 */
	get hex() {
		const padStart = (value: number) => Math.round(value).toString(16).padStart(2, "0");
		const { r, g, b, a } = this.rgb;
		let result = padStart(r) + padStart(g) + padStart(b);
		if (a !== 1) result += padStart(a * 255);
		return result.toUpperCase();
	}

	set hex(value: string) {
		const rgba = hexToRgb(value);
		if (!rgba) return;
		this.rgb = rgba;
	}

	/**
	 * 获取并设置带井号开头的 16 进制颜色值。
	 */
	get hashHex() {
		return "#" + this.hex;
	}

	set hashHex(value: string) {
		this.hex = value;
	}

	/**
	 * RGB
	 */
	get rgb(): ColorGetter<"r" | "g" | "b"> {
		const { h, s, v, a } = this;
		const [r, g, b] = hsvToRgb(h, s, v);
		return { r: round(r), g: round(g), b: round(b), a };
	}

	set rgb(value: ColorSetter<"r" | "g" | "b">) {
		let r: number, g: number, b: number, a: number | undefined;

		if (isArray(value))
			[r, g, b, a] = value;
		else
			({ r, g, b, a } = value);

		r = clamp(r, 0, 255);
		g = clamp(g, 0, 255);
		b = clamp(b, 0, 255);

		[this.h, this.s, this.v] = rgbToHsv(r, g, b);
		if (a !== undefined) this.a = a;
	}

	/**
	 * HSL
	 */
	get hsl(): ColorGetter<"h" | "s" | "l"> {
		const { h, s, v, a } = this;
		const [_h, _s, _l] = hsvToHsl(h, s, v);
		return { h: round(_h), s: round(_s), l: round(_l), a };
	}

	set hsl(value: ColorSetter<"h" | "s" | "l">) {
		let h: number, s: number, l: number, a: number | undefined;

		if (isArray(value))
			[h, s, l, a] = value;
		else
			({ h, s, l, a } = value);

		h = clamp(h, 0, 360);
		s = clamp(s, 0, 100);
		l = clamp(l, 0, 100);

		[this.h, this.s, this.v] = hslToHsv(h, s, l);
		if (a !== undefined) this.a = a;
	}

	/**
	 * HSV
	 */
	get hsv(): ColorGetter<"h" | "s" | "v"> {
		const { h, s, v, a } = this;
		return { h: round(h), s: round(s), v: round(v), a };
	}

	set hsv(value: ColorSetter<"h" | "s" | "v">) {
		let h: number, s: number, v: number, a: number | undefined;

		if (isArray(value))
			[h, s, v, a] = value;
		else
			({ h, s, v, a } = value);

		h = clamp(h, 0, 360);
		s = clamp(s, 0, 100);
		v = clamp(v, 0, 100);

		[this.h, this.s, this.v] = [h, s, v];
		if (a !== undefined) this.a = a;
	}

	/**
	 * HSB
	 */
	get hsb(): ColorGetter<"h" | "s" | "b"> {
		const { h, s, v, a } = this.hsv;
		return { h, s, b: v, a };
	}

	set hsb(value: ColorSetter<"h" | "s" | "b">) {
		let h: number, s: number, b: number, a: number | undefined;

		if (isArray(value))
			[h, s, b, a] = value;
		else
			({ h, s, b, a } = value);

		this.hsv = { h, s, v: b, a };
	}

	/** 获取更自然亮度值。 */
	get naturalLightness() {
		const { r, g, b } = this.rgb;
		return 0.299 * r / 255 + 0.587 * g / 255 + 0.114 * b / 255;
	}
}

type ColorGetter<K extends string> = Record<K | "a", number>;
type ColorSetter<K extends string> = Record<K, number> & { a?: number } | ThreeD | FourD;

/**
 * Converts an HEX color value to RGB.
 * @param hex - The hex color.
 * @return The RGB representation.
 */
function hexToRgb(hex: string): FourD | undefined {
	hex = hex.toLowerCase();
	let matched = hex.match(/#[0-9a-f]{8}|#[0-9a-f]{6}|#[0-9a-f]{4}|#[0-9a-f]{3}/)?.[0];
	if (!matched) matched = hex.match(/[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3}/)?.[0];
	if (!matched) return;
	if (matched.startsWith("#")) matched = matched.slice(1);
	if (matched.length === 3 || matched.length === 4)
		matched = matched[0].repeat(2) + matched[1].repeat(2) + matched[2].repeat(2) + (matched[3] ?? "").repeat(2);
	const rs = matched.substr(0, 2), gs = matched.substr(2, 2), bs = matched.substr(4, 2), as = matched.substr(6, 2) || "ff";
	const r = parseInt(rs, 16), g = parseInt(gs, 16), b = parseInt(bs, 16), a = parseInt(as, 16);
	return [r, g, b, a / 255];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes ~~h, s, and l are contained in the set [0, 1]~~ and
 * returns r, g, and b in the set [0, 255].
 *
 * @param h - The hue.
 * @param s - The saturation.
 * @param l - The lightness.
 * @return The RGB representation.
 */
function hslToRgb(h: number, s: number, l: number): ThreeD {
	let r, g, b;

	h /= 360;
	s /= 100;
	l /= 100;

	if (s === 0)
		r = g = b = l; // achromatic
	else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hueToRgb(p, q, h + 1 / 3);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1 / 3);
	}

	return [r * 255, g * 255, b * 255];
}

// eslint-disable-next-line require-jsdoc
function hueToRgb(p: number, q: number, t: number) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * ~~returns h, s, and l in the set [0, 1]~~.
 *
 * @param r - The red color value
 * @param g - The green color value
 * @param b - The blue color value
 * @return The HSL representation
 */
function rgbToHsl(r: number, g: number, b: number): ThreeD {
	r /= 255;
	g /= 255;
	b /= 255;

	const vmax = max(r, g, b), vmin = min(r, g, b);
	let h = 0;
	const l = (vmax + vmin) / 2;

	if (vmax === vmin)
		return [0, 0, l * 100]; // achromatic

	const d = vmax - vmin;
	const s = l > 0.5 ? d / (2 - vmax - vmin) : d / (vmax + vmin);
	if (vmax === r) h = (g - b) / d + (g < b ? 6 : 0);
	else if (vmax === g) h = (b - r) / d + 2;
	else if (vmax === b) h = (r - g) / d + 4;
	h /= 6;

	return [h * 360, s * 100, l * 100];
}

/**
 * Converts an HSB/HSV color value to RGB.
 * @param h - The hue.
 * @param s - The saturation.
 * @param v - The brightness value.
 * @returns The RGB representation.
 */
function hsvToRgb(h: number, s: number, v: number): ThreeD {
	let r, g, b;

	h /= 360;
	s /= 100;
	v /= 100;

	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		default:
		case 0: r = v; g = t; b = p; break;
		case 1: r = q; g = v; b = p; break;
		case 2: r = p; g = v; b = t; break;
		case 3: r = p; g = q; b = v; break;
		case 4: r = t; g = p; b = v; break;
		case 5: r = v; g = p; b = q; break;
	}

	return [r * 255, g * 255, b * 255];
}

/**
 * Converts an RGB color value to HSB/HSV.
 * @param r - The red color value
 * @param g - The green color value
 * @param b - The blue color value
 * @return The HSB/HSV representation
 */
function rgbToHsv(r: number, g: number, b: number): ThreeD {
	const
		max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		d = max - min,
		s = max === 0 ? 0 : d / max,
		v = max / 255;
	let h;

	switch (max) {
		default:
		case min: h = 0; break;
		case r: h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d; break;
		case g: h = (b - r) + d * 2; h /= 6 * d; break;
		case b: h = (r - g) + d * 4; h /= 6 * d; break;
	}

	return [h * 360, s * 100, v * 100];
}

/**
 * Converts an HSB/HSV color value to HSL.
 * @param h - The hue.
 * @param s - The saturation.
 * @param v - The brightness value.
 * @returns The HSL representation.
 */
function hsvToHsl(h: number, s: number, v: number) {
	s /= 100;
	v /= 100;

	let _s = s * v;
	let l = (2 - s) * v;
	_s /= (l <= 1 ? l : 2 - l) || 1;
	l /= 2;

	return [h, _s * 100, l * 100];
}

/**
 * Converts an HSL color value to HSB/HSV.
 * @param h - The hue.
 * @param s - The saturation.
 * @param l - The lightness.
 * @returns The HSB/HSV representation.
 */
function hslToHsv(h: number, s: number, l: number) {
	s /= 100;
	l /= 100;
	l ||= 1e-7;

	l *= 2;
	s *= l <= 1 ? l : 2 - l;
	const v = (l + s) / 2;
	const _s = 2 * s / (l + s);

	return [h, _s * 100, v * 100];
}
