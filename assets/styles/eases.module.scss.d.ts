export type Styles = {
	"ease": string;
	"easeIn": string;
	"easeInBack": string;
	"easeInCirc": string;
	"easeInCubic": string;
	"easeInExpo": string;
	"easeInMax": string;
	"easeInOut": string;
	"easeInOutBack": string;
	"easeInOutCirc": string;
	"easeInOutCubic": string;
	"easeInOutExpo": string;
	"easeInOutMax": string;
	"easeInOutQuad": string;
	"easeInOutQuart": string;
	"easeInOutQuint": string;
	"easeInOutSine": string;
	"easeInQuad": string;
	"easeInQuart": string;
	"easeInQuint": string;
	"easeInSine": string;
	"easeOut": string;
	"easeOutBack": string;
	"easeOutCirc": string;
	"easeOutCubic": string;
	"easeOutExpo": string;
	"easeOutMax": string;
	"easeOutQuad": string;
	"easeOutQuart": string;
	"easeOutQuint": string;
	"easeOutSine": string;
	"linear": string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
